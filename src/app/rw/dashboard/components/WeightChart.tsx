"use client";

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { ApexOptions } from "apexcharts";
import { DailyWeightChartData } from "@/types/dashboard";
import { rwDashboardService } from "@/services/dashboard.service";

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

export default function WeightChart() {
  const [data, setData] = useState<{ labels: string[]; values: number[] }>({ labels: [], values: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result: any = await rwDashboardService.getDailyWeight();
        console.log('Weight chart data:', result.data);
        // Map backend data to chart format
        const labels = result?.map((item: any) => item.date);
        const values = result?.map((item: any) => item.total_weight);
        setData({ labels, values });
      } catch (error) {
        console.error("Failed to fetch weight chart data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const options: ApexOptions = {
    chart: {
      fontFamily: "Satoshi, sans-serif",
      type: "area",
      height: 335,
      toolbar: {
        show: false,
      },
    },
    colors: ["#3C50E0"],
    stroke: {
      curve: "smooth",
      width: 2,
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
    grid: {
      strokeDashArray: 5,
      yaxis: {
        lines: {
          show: true,
        },
      },
    },
    dataLabels: {
      enabled: false,
    },
    tooltip: {
      fixed: {
        enabled: false,
      },
    },
  };

  const series = [
    {
      name: "Berat Sampah",
      data: data.values,
    },
  ];

  return (
    <div className="col-span-12 rounded-2xl border border-gray-200 bg-white px-5 pt-7.5 pb-5 shadow-default dark:border-gray-800 dark:bg-white/[0.03] sm:px-7.5 xl:col-span-8">
      <div className="mb-3 justify-between gap-4 sm:flex">
        <div>
          <h5 className="text-xl font-semibold text-gray-800 dark:text-white">
            Grafik Berat Sampah Harian
          </h5>
        </div>
      </div>

      <div className="mb-2">
        <div id="weightChart" className="-ml-5">
          <ReactApexChart
            options={options}
            series={series}
            type="area"
            height={350}
          />
        </div>
      </div>
    </div>
  );
}
