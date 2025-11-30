"use client";

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { ApexOptions } from "apexcharts";
import { WasteCompositionData } from "@/types/dashboard";
import { rwDashboardService } from "@/services/dashboard.service";

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

export default function WasteCompositionChart() {
  const [data, setData] = useState<WasteCompositionData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await rwDashboardService.getWasteComposition();
        setData(result);
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
      type: "donut",
    },
    colors: ["#3C50E0", "#80CAEE", "#10B981", "#FFBA00", "#FF5733", "#C70039"],
    labels: data.map((item) => item.waste_type_name),
    legend: {
      show: true,
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

  const series = data.map((item) => item.total_weight);

  return (
    <div className="col-span-12 rounded-2xl border border-gray-200 bg-white px-5 pt-7.5 pb-5 shadow-default dark:border-gray-800 dark:bg-white/[0.03] sm:px-7.5 xl:col-span-4">
      <div className="mb-3 justify-between gap-4 sm:flex">
        <div>
          <h5 className="text-xl font-semibold text-gray-800 dark:text-white">
            Komposisi Sampah
          </h5>
        </div>
      </div>

      <div className="mb-2 flex justify-center">
        <ReactApexChart
          options={options}
          series={series}
          type="donut"
        />
      </div>
    </div>
  );
}
