"use client";

import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { RWRanking } from "@/types/dashboard";
import { kelurahanDashboardService } from "@/services/dashboard.service";

export default function RwRankingTable() {
  const [rankings, setRankings] = useState<RWRanking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await kelurahanDashboardService.getRwRanking();
        setRankings(data);
      } catch (error) {
        console.error("Failed to fetch RW rankings", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="rounded-2xl border border-gray-200 bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-gray-800 dark:bg-white/[0.03] sm:px-7.5 xl:pb-1">
      <h4 className="mb-6 text-xl font-semibold text-gray-800 dark:text-white">
        Peringkat RW
      </h4>

      <div className="max-w-full overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableCell isHeader>Peringkat</TableCell>
              <TableCell isHeader>RW ID</TableCell>
              <TableCell isHeader>Total Transaksi</TableCell>
              <TableCell isHeader>Total Berat (kg)</TableCell>
              <TableCell isHeader>Total Penjualan (Rp)</TableCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rankings.map((ranking, index) => (
              <TableRow key={index}>
                <TableCell>#{index + 1}</TableCell>
                <TableCell>RW {ranking.rw_id}</TableCell>
                <TableCell>{ranking.total_transactions}</TableCell>
                <TableCell>{ranking.total_weight}</TableCell>
                <TableCell>Rp {ranking.total_sales_amount.toLocaleString()}</TableCell>
              </TableRow>
            ))}
            {rankings.length === 0 && !loading && (
                <TableRow>
                    <TableCell className="text-center">Tidak ada data peringkat.</TableCell>
                </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
