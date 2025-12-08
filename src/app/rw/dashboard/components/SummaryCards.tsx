"use client";

import React, { useEffect, useState } from "react";
import { SummaryCard } from "@/components/dashboard/SummaryCard";
import {
  BoxIconLine,
  DollarLineIcon,
  GroupIcon,
  TaskIcon,
  PieChartIcon,
  BoxCubeIcon,
} from "@/icons";
import { RWDashboardSummary } from "@/types/dashboard";
import { rwDashboardService } from "@/services/dashboard.service";

export default function SummaryCards() {
  const [summary, setSummary] = useState<RWDashboardSummary>({
    total_transactions_today: 0,
    total_weight_today: 0,
    total_amount_today: 0,
    total_active_warga_in_rw: 0,
    total_deposit_requests_pending: 0,
    total_rt_active: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data: any = await rwDashboardService.getSummary();
        console.log('Dashboard summary data:', data);
        setSummary(data);
      } catch (error) {
        console.error("Failed to fetch summary", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6 xl:grid-cols-3 2xl:grid-cols-6">
      <SummaryCard
        title="Setoran Hari Ini"
        value={loading ? "..." : summary?.total_transactions_today?.toString()}
        icon={<TaskIcon className="text-brand-500 size-6" />}
      />
      <SummaryCard
        title="Berat Sampah (kg)"
        value={loading ? "..." : summary.total_weight_today.toLocaleString()}
        icon={<BoxIconLine className="text-brand-500 size-6" />}
      />
      <SummaryCard
        title="Nilai Transaksi"
        value={loading ? "..." : `Rp ${summary.total_amount_today.toLocaleString()}`}
        icon={<DollarLineIcon className="text-brand-500 size-6" />}
      />
      <SummaryCard
        title="Warga Aktif"
        value={loading ? "..." : summary.total_active_warga_in_rw.toString()}
        icon={<GroupIcon className="text-brand-500 size-6" />}
      />
      <SummaryCard
        title="Request Pending"
        value={loading ? "..." : summary.total_deposit_requests_pending.toString()}
        icon={<BoxCubeIcon className="text-brand-500 size-6" />}
      />
      <SummaryCard
        title="Total RT Aktif"
        value={loading ? "..." : summary.total_rt_active.toString()}
        icon={<PieChartIcon className="text-brand-500 size-6" />}
      />
    </div>
  );
}
