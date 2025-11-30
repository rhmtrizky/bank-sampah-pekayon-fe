"use client";

import React, { useEffect, useState } from "react";
import { SummaryCard } from "@/components/dashboard/SummaryCard";
import { GroupIcon, BoxIconLine, PieChartIcon, CalenderIcon } from "@/icons";
import { kelurahanDashboardService } from "@/services/dashboard.service";
import { KelurahanDashboardSummary } from "@/types/dashboard";

export default function SummaryCards() {
  const [summary, setSummary] = useState<KelurahanDashboardSummary>({
    total_rw: 0,
    total_transactions_today_all_rw: 0,
    total_weight_today_all_rw: 0,
    total_penjualan_all_rw: 0,
    total_warga_aktif_kelurahan: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await kelurahanDashboardService.getSummary();
        setSummary(data);
      } catch (error) {
        console.error("Failed to fetch dashboard summary", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6 xl:grid-cols-4">
      <SummaryCard
        title="Total RW"
        value={loading ? "..." : summary.total_rw}
        icon={<GroupIcon className="text-gray-800 size-6 dark:text-white/90" />}
      />
      <SummaryCard
        title="Total Transaksi Hari Ini"
        value={loading ? "..." : summary.total_transactions_today_all_rw}
        icon={<BoxIconLine className="text-gray-800 size-6 dark:text-white/90" />}
      />
      <SummaryCard
        title="Total Berat Hari Ini (kg)"
        value={loading ? "..." : summary.total_weight_today_all_rw}
        icon={<PieChartIcon className="text-gray-800 size-6 dark:text-white/90" />}
      />
      <SummaryCard
        title="Total Penjualan"
        value={loading ? "..." : `Rp ${summary.total_penjualan_all_rw.toLocaleString()}`}
        icon={<CalenderIcon className="text-gray-800 size-6 dark:text-white/90" />}
      />
    </div>
  );
}
