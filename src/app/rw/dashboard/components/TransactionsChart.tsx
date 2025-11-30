"use client";

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { ApexOptions } from "apexcharts";
import { DailyTransactionChartData } from "@/types/dashboard";
import { rwDashboardService } from "@/services/dashboard.service";

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

export default function TransactionsChart() {
  const [data, setData] = useState<{ labels: string[]; values: number[] }>({ labels: [], values: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await rwDashboardService.getDailyTransactions();
        // Map backend data to chart format
        const labels = result.map((item) => item.date);
        const values = result.map((item) => item.count);
        setData({ labels, values });
      } catch (error) {
        console.error("Failed to fetch transactions chart data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const options: ApexOptions = {
    chart: {
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
    },
    yaxis: {
      title: {
        text: "Jumlah Transaksi",
      },
    },
    fill: {
      opacity: 1,
    },
    tooltip: {
      y: {
        formatter: function (val) {
          return val + " Transaksi";
        },
      },
    },
    colors: ["#10B981"],
  };

  const series = [
    {
      name: "Transaksi",
      data: data.values,
    },
  ];

  return (
    <div className="col-span-12 rounded-2xl border border-gray-200 bg-white px-5 pt-7.5 pb-5 shadow-default dark:border-gray-800 dark:bg-white/[0.03] sm:px-7.5 xl:col-span-4">
      <div className="mb-4 justify-between gap-4 sm:flex">
        <div>
          <h4 className="text-xl font-semibold text-gray-800 dark:text-white">
            Jumlah Transaksi Harian
          </h4>
        </div>
      </div>

      <div className="mb-2">
        <div id="transactionsChart" className="-ml-5">
          <ReactApexChart
            options={options}
            series={series}
            type="bar"
            height={350}
          />
        </div>
      </div>
    </div>
  );
}
