"use client";

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { ApexOptions } from "apexcharts";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { RtStatistic } from "@/types/dashboard";
import { rwDashboardService } from "@/services/dashboard.service";

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

export default function RtStatistics() {
  const [stats, setStats] = useState<RtStatistic[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await rwDashboardService.getRtStatistics();
        setStats(data);
      } catch (error) {
        console.error("Failed to fetch RT statistics", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const chartOptions: ApexOptions = {
    chart: {
      type: "bar",
      height: 350,
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
      categories: stats.map((s) => `RT ${s.rt}`),
    },
    yaxis: {
      title: {
        text: "Total Transaksi",
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
    colors: ["#3C50E0"],
  };

  const chartSeries = [
    {
      name: "Transaksi",
      data: stats.map((s) => s.total_transactions),
    },
  ];

  return (
    <div className="col-span-12 rounded-2xl border border-gray-200 bg-white p-5 shadow-default dark:border-gray-800 dark:bg-white/[0.03] xl:col-span-6">
      <h4 className="mb-6 text-xl font-semibold text-gray-800 dark:text-white">
        Statistik RT
      </h4>

      <div className="mb-6">
        <ReactApexChart
          options={chartOptions}
          series={chartSeries}
          type="bar"
          height={350}
        />
      </div>

      <div className="max-w-full overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableCell isHeader>RT</TableCell>
              <TableCell isHeader>Total Transaksi</TableCell>
              <TableCell isHeader>Total Berat (kg)</TableCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {stats.map((stat) => (
              <TableRow key={stat.rt}>
                <TableCell>RT {stat.rt}</TableCell>
                <TableCell>{stat.total_transactions}</TableCell>
                <TableCell>{stat.total_weight.toLocaleString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
