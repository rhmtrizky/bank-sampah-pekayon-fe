"use client";
import React, { useEffect, useState } from "react";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { SummaryCard } from "@/components/dashboard/SummaryCard";
import { BoxIconLine, CalenderIcon, PieChartIcon } from "@/icons";
import Button from "@/components/ui/button/Button";
import { rwService } from "@/services/rw.service";
import { ReportRW } from "@/types/entities";

export default function RWReportsPage() {
  const [period, setPeriod] = useState("This Month");
  const [report, setReport] = useState<ReportRW | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        setLoading(true);
        const data = await rwService.getReport();
        setReport(data);
      } catch (e: any) {
        setError("Gagal memuat laporan");
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchReport();
  }, []);

  return (
    <div>
      <div className="flex flex-col gap-4 mb-6 sm:flex-row sm:items-center sm:justify-between">
        <PageBreadcrumb pageTitle="Reports" />
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

      {/* Loading / Error / Empty States */}
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
            title="Total Transactions"
            value={report.total_transactions}
            icon={<BoxIconLine className="text-gray-800 size-6 dark:text-white/90" />}
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
            icon={<CalenderIcon className="text-gray-800 size-6 dark:text-white/90" />}
          />
        </div>
      )}

      <div className="mt-6 grid grid-cols-1 gap-6">
        <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
          <h3 className="mb-4 text-lg font-semibold text-gray-800 dark:text-white/90">
            Monthly Performance
          </h3>
          <div className="h-80 flex items-center justify-center text-gray-400 bg-gray-50 dark:bg-gray-900/50 rounded-xl">
            {/* TODO: Replace with real chart (trend over months) */}
            Chart Placeholder (Revenue vs Withdraw)
          </div>
        </div>
      </div>
    </div>
  );
}
