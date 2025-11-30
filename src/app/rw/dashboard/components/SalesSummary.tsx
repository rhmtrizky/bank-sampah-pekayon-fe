"use client";

import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { SalesSummaryData, RecentSale } from "@/types/dashboard";
import { rwDashboardService } from "@/services/dashboard.service";

export default function SalesSummary() {
  const [summary, setSummary] = useState<SalesSummaryData>({
    total_weight: 0,
    total_amount: 0,
  });
  const [recentSales, setRecentSales] = useState<RecentSale[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [summaryData, salesData] = await Promise.all([
          rwDashboardService.getSalesSummary(),
          rwDashboardService.getRecentSales(),
        ]);
        setSummary(summaryData);
        setRecentSales(salesData);
      } catch (error) {
        console.error("Failed to fetch sales data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="col-span-12 rounded-2xl border border-gray-200 bg-white p-5 shadow-default dark:border-gray-800 dark:bg-white/[0.03] xl:col-span-6">
      <h4 className="mb-6 text-xl font-semibold text-gray-800 dark:text-white">
        Ringkasan Penjualan ke Pengepul
      </h4>

      <div className="mb-6 grid grid-cols-2 gap-4">
        <div className="rounded-lg border border-gray-100 p-4 dark:border-gray-700">
          <p className="text-sm text-gray-500">Total Berat Terjual</p>
          <h5 className="text-lg font-bold text-gray-800 dark:text-white">
            {loading ? "..." : `${summary.total_weight.toLocaleString()} kg`}
          </h5>
        </div>
        <div className="rounded-lg border border-gray-100 p-4 dark:border-gray-700">
          <p className="text-sm text-gray-500">Total Omzet</p>
          <h5 className="text-lg font-bold text-gray-800 dark:text-white">
            {loading ? "..." : `Rp ${summary.total_amount.toLocaleString()}`}
          </h5>
        </div>
      </div>

      <div className="max-w-full overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableCell isHeader>Tanggal</TableCell>
              <TableCell isHeader>Pengepul ID</TableCell>
              <TableCell isHeader>Berat (kg)</TableCell>
              <TableCell isHeader>Nilai (Rp)</TableCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {recentSales.map((sale) => (
              <TableRow key={sale.sale_id}>
                <TableCell>{new Date(sale.date).toLocaleDateString()}</TableCell>
                <TableCell>{sale.pengepul_id}</TableCell>
                <TableCell>{sale.total_weight.toLocaleString()}</TableCell>
                <TableCell>{sale.total_amount.toLocaleString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
