"use client";
import React, { useEffect, useState } from "react";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { SummaryCard } from "@/components/dashboard/SummaryCard";
import { BoxIconLine, CalenderIcon, GroupIcon, PieChartIcon } from "@/icons";
import Button from "@/components/ui/button/Button";
import { kelurahanService } from "@/services/kelurahan.service";
import { ReportKelurahan, RWPublic } from "@/types/entities";

export default function KelurahanReportsPage() {
  const [period, setPeriod] = useState("This Month");
  const [report, setReport] = useState<ReportKelurahan | null>(null);
  const [rwList, setRwList] = useState<RWPublic[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [reportData, rwData] = await Promise.all([
          kelurahanService.getReport(),
          kelurahanService.getRwList(),
        ]);
        setReport(reportData);
        setRwList(rwData.filter(r => r.active));
      } catch (e: any) {
        setError("Gagal memuat laporan kelurahan");
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [period]);

  return (
    <div>
      <div className="flex flex-col gap-4 mb-6 sm:flex-row sm:items-center sm:justify-between">
        <PageBreadcrumb pageTitle="Reports (Kelurahan)" />
        <div className="flex gap-2">
          <select 
            className="px-4 py-2 bg-white border border-gray-200 rounded-lg dark:bg-gray-800 dark:border-gray-700"
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
          >
            <option>This Month</option>
            <option>Last Month</option>
            <option>This Year</option>
          </select>
          <Button size="sm" variant="outline">Download PDF</Button>
        </div>
      </div>

      {loading && (
        <div className="flex h-40 items-center justify-center">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-brand-500 border-t-transparent" />
        </div>
      )}
      {!loading && error && (
        <div className="mb-6 rounded-lg border border-error-300 bg-error-50 px-4 py-3 text-error-700 dark:border-error-700 dark:bg-error-500/10 dark:text-error-400">
          {error}
        </div>
      )}
      {!loading && !error && report && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6 xl:grid-cols-4">
          <SummaryCard
            title="Active RW"
            value={rwList.length}
            icon={<GroupIcon className="text-gray-800 size-6 dark:text-white/90" />}
          />
          <SummaryCard
            title="Total Weight (kg)"
            value={report.total_weight}
            icon={<PieChartIcon className="text-gray-800 size-6 dark:text-white/90" />}
          />
          <SummaryCard
            title="Total Revenue"
            value={`Rp ${report.total_revenue.toLocaleString()}`}
            icon={<CalenderIcon className="text-gray-800 size-6 dark:text-white/90" />}
          />
            <SummaryCard
            title="Total Withdraw"
            value={`Rp ${report.total_withdraw.toLocaleString()}`}
            icon={<BoxIconLine className="text-gray-800 size-6 dark:text-white/90" />}
          />
        </div>
      )}

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
          <h3 className="mb-4 text-lg font-semibold text-gray-800 dark:text-white/90">
            RW Performance Comparison
          </h3>
          <div className="h-80 flex flex-col items-center justify-center text-gray-400 bg-gray-50 dark:bg-gray-900/50 rounded-xl">
            {/* TODO: integrate RWPerformance / weight-monthly */}
            Bar Chart Placeholder (Weight per RW)
          </div>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
          <h3 className="mb-4 text-lg font-semibold text-gray-800 dark:text-white/90">
            Waste Type Distribution
          </h3>
          <div className="h-80 flex flex-col items-center justify-center text-gray-400 bg-gray-50 dark:bg-gray-900/50 rounded-xl">
            {/* TODO: reuse WasteCompositionChart component */}
            Pie Chart Placeholder (Plastic vs Paper vs Metal)
          </div>
        </div>
      </div>
    </div>
  );
}
