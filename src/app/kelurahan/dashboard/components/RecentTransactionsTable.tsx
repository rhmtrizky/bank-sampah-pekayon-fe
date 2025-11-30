"use client";

import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Badge from "@/components/ui/badge/Badge";
import { KelurahanRecentTransaction } from "@/types/dashboard";
import { kelurahanDashboardService } from "@/services/dashboard.service";

export default function RecentTransactionsTable() {
  const [transactions, setTransactions] = useState<KelurahanRecentTransaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await kelurahanDashboardService.getRecentTransactions();
        setTransactions(data);
      } catch (error) {
        console.error("Failed to fetch recent transactions", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="rounded-2xl border border-gray-200 bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-gray-800 dark:bg-white/[0.03] sm:px-7.5 xl:pb-1">
      <h4 className="mb-6 text-xl font-semibold text-gray-800 dark:text-white">
        Transaksi Terbaru (Semua RW)
      </h4>

      <div className="max-w-full overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableCell isHeader>Tanggal</TableCell>
              <TableCell isHeader>RW</TableCell>
              <TableCell isHeader>User ID</TableCell>
              <TableCell isHeader>Jenis Sampah ID</TableCell>
              <TableCell isHeader>Berat (kg)</TableCell>
              <TableCell isHeader>Nilai (Rp)</TableCell>
              <TableCell isHeader>Metode</TableCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.map((transaction, index) => (
              <TableRow key={index}>
                <TableCell>{new Date(transaction.created_at).toLocaleDateString()}</TableCell>
                <TableCell>{transaction.rw_name || `RW ${transaction.rw_id}`}</TableCell>
                <TableCell>{transaction.user_name || transaction.user_id}</TableCell>
                <TableCell>{transaction.waste_type_name || transaction.waste_type_id}</TableCell>
                <TableCell>{transaction.weight_kg}</TableCell>
                <TableCell>Rp {transaction.total_amount.toLocaleString()}</TableCell>
                <TableCell>
                  <Badge
                    color={transaction.transaction_method === "cash" ? "success" : "warning"}
                  >
                    {transaction.transaction_method}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
            {transactions.length === 0 && !loading && (
                <TableRow>
                    <TableCell  className="text-center">Tidak ada transaksi terbaru.</TableCell>
                </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
