"use client";
import React, { useEffect, useState } from "react";
import BasicTableOne, { Column } from "@/components/tables/BasicTableOne";
import { rwService } from "@/services/rw.service";
import { RecentTransaction } from "@/types/dashboard";
import EmptyState from "@/components/common/EmptyState";

interface UITransactionRow {
  id: number;
  code: string; // synthesized if backend doesn't provide
  date: string;
  wargaName: string;
  wargaId: number;
  wasteTypeName: string;
  weightKg: number;
  amount: number;
  method: string;
}

const columns: Column<UITransactionRow>[] = [
  { header: "Code", accessorKey: "code" },
  { header: "Date", accessorKey: "date" },
  { header: "Warga", cell: (row) => (
    <div>
      <p className="font-medium text-gray-800 dark:text-white/90">{row.wargaName}</p>
      <p className="text-xs text-gray-500">ID: {row.wargaId}</p>
    </div>
  ) },
  { header: "Waste Type", accessorKey: "wasteTypeName" },
  { header: "Weight", cell: (row) => `${row.weightKg.toFixed(2)} kg` },
  { header: "Amount", cell: (row) => `Rp ${row.amount.toLocaleString()}` },
  { header: "Method", accessorKey: "method" },
  { header: "Action", cell: () => <button className="text-brand-500 hover:text-brand-600">Detail</button> }
];

export default function TransactionTable() {
  const [rows, setRows] = useState<UITransactionRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const data: RecentTransaction[] = await rwService.getRecentTransactions();
        const mapped: UITransactionRow[] = data.map((t, idx) => ({
          id: t.transaction_id,
          code: `TRX-${t.transaction_id}`,
          date: t.created_at.split('T')[0],
          wargaName: t.user_name || `User ${t.user_id}`,
          wargaId: t.user_id,
          wasteTypeName: t.waste_type_name || `Waste #${t.waste_type_id}`,
          weightKg: t.weight_kg,
          amount: t.total_amount,
          method: t.transaction_method,
        }));
        setRows(mapped);
      } catch (e: any) {
        console.error(e);
        setError(e?.message || 'Failed to load transactions');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return <div className="p-4 text-center">Loading transactions...</div>;
  if (error) return <EmptyState title="Failed to load" description={error} action={<button className="btn btn-sm" onClick={() => window.location.reload()}>Retry</button>} />;
  if (!rows.length) return <EmptyState title="No transactions" description="Belum ada transaksi terbaru." />;
  return <BasicTableOne columns={columns} data={rows} />;
}
