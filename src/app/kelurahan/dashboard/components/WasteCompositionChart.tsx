"use client";

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { ApexOptions } from "apexcharts";
import { WasteCompositionData } from "@/types/dashboard";
import { kelurahanDashboardService } from "@/services/dashboard.service";

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

export default function WasteCompositionChart() {
  const [data, setData] = useState<{ labels: string[]; values: number[] }>({ labels: [], values: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await kelurahanDashboardService.getWasteComposition();
        const labels = result.map((item) => item.waste_type_name);
        const values = result.map((item) => item.total_weight);
        setData({ labels, values });
      } catch (error) {
        console.error("Failed to fetch waste composition data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const options: ApexOptions = {
    chart: {
      fontFamily: "Satoshi, sans-serif",
      type: "donut",
    },
    colors: ["#3C50E0", "#6577F3", "#8FD0EF", "#0FADCF"],
    labels: data.labels,
    legend: {
      show: false,
      position: "bottom",
    },
    plotOptions: {
      pie: {
        donut: {
          size: "65%",
          background: "transparent",
        },
      },
    },
    dataLabels: {
      enabled: false,
    },
    responsive: [
      {
        breakpoint: 2600,
        options: {
          chart: {
            width: 380,
          },
        },
      },
      {
        breakpoint: 640,
        options: {
          chart: {
            width: 200,
          },
        },
      },
    ],
  };

  return (
    <div className="col-span-12 rounded-2xl border border-gray-200 bg-white px-5 pb-5 pt-7.5 shadow-default dark:border-gray-800 dark:bg-white/[0.03] sm:px-7.5 xl:col-span-4">
      <div className="mb-3 justify-between gap-4 sm:flex">
        <div>
          <h5 className="text-xl font-semibold text-gray-800 dark:text-white">
            Komposisi Sampah
          </h5>
        </div>
      </div>

      <div className="mb-2">
        <div id="chartThree" className="mx-auto flex justify-center">
          <ReactApexChart
            options={options}
            series={data.values}
            type="donut"
          />
        </div>
      </div>

      <div className="-mx-8 flex flex-wrap items-center justify-center gap-y-3">
        {data.labels.map((label, index) => (
          <div key={index} className="w-full px-8 sm:w-1/2">
            <div className="flex w-full items-center">
              <span className={`mr-2 block h-3 w-full max-w-3 rounded-full bg-[${options.colors?.[index % 4]}]`}></span>
              <p className="flex w-full justify-between text-sm font-medium text-gray-800 dark:text-white">
                <span> {label} </span>
                <span> {Math.round((data.values[index] / data.values.reduce((a, b) => a + b, 0)) * 100)}% </span>
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
