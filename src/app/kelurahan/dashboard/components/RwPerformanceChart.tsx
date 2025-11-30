"use client";

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { ApexOptions } from "apexcharts";
import { RWPerformance } from "@/types/dashboard";
import { kelurahanDashboardService } from "@/services/dashboard.service";

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

export default function RwPerformanceChart() {
  const [data, setData] = useState<{ labels: string[]; values: number[] }>({ labels: [], values: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await kelurahanDashboardService.getRwPerformance();
        // Map backend data to chart format
        const labels = result.map((item) => `RW ${item.nomor_rw}`);
        const values = result.map((item) => item.total_weight_this_month);
        setData({ labels, values });
      } catch (error) {
        console.error("Failed to fetch RW performance data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const options: ApexOptions = {
    chart: {
      fontFamily: "Satoshi, sans-serif",
      type: "bar",
      height: 335,
      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "55%",
        borderRadius: 2,
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      show: true,
      width: 2,
      colors: ["transparent"],
    },
    xaxis: {
      categories: data.labels,
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
    },
    yaxis: {
      title: {
        text: "Berat (kg)",
      },
    },
    fill: {
      opacity: 1,
    },
    tooltip: {
      y: {
        formatter: function (val) {
          return val + " kg";
        },
      },
    },
    colors: ["#3C50E0"],
  };

  const series = [
    {
      name: "Total Berat Bulan Ini",
      data: data.values,
    },
  ];

  return (
    <div className="col-span-12 rounded-2xl border border-gray-200 bg-white px-5 pb-5 pt-7.5 shadow-default dark:border-gray-800 dark:bg-white/[0.03] xl:col-span-8">
      <div className="mb-4 justify-between gap-4 sm:flex">
        <div>
          <h4 className="text-xl font-semibold text-gray-800 dark:text-white">
            Performa RW (Berat Sampah Bulan Ini)
          </h4>
        </div>
      </div>

      <div>
        <div id="chartOne" className="-ml-5">
          <ReactApexChart
            options={options}
            series={series}
            type="bar"
            height={335}
          />
        </div>
      </div>
    </div>
  );
}
