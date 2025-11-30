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
import { RecentTransaction } from "@/types/dashboard";
import { rwDashboardService } from "@/services/dashboard.service";

export default function RecentTransactionsTable() {
  const [transactions, setTransactions] = useState<RecentTransaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await rwDashboardService.getRecentTransactions();
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
        Transaksi Terbaru
      </h4>

      <div className="max-w-full overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableCell isHeader>Tanggal</TableCell>
              <TableCell isHeader>User ID</TableCell>
              <TableCell isHeader>Jenis Sampah ID</TableCell>
              <TableCell isHeader>Berat (kg)</TableCell>
              <TableCell isHeader>Nilai (Rp)</TableCell>
              <TableCell isHeader>Metode</TableCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.map((transaction) => (
              <TableRow key={transaction.transaction_id}>
                <TableCell>{new Date(transaction.created_at).toLocaleDateString()}</TableCell>
                <TableCell>{transaction.user_id}</TableCell>
                <TableCell>{transaction.waste_type_id}</TableCell>
                <TableCell>{transaction.weight_kg}</TableCell>
                <TableCell>{transaction.total_amount.toLocaleString()}</TableCell>
                <TableCell>
                  <Badge color="success">
                    {transaction.transaction_method}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
