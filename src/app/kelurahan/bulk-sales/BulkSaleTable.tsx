"use client";
import React, { useEffect, useState } from "react";
import BasicTableOne, { Column } from "@/components/tables/BasicTableOne";
import { kelurahanService } from "@/services/kelurahan.service";
import { BulkSaleItemSummary } from "@/types/entities";
import EmptyState from "@/components/common/EmptyState";

interface UIBulkSaleRow {
  id: number;
  date: string;
  totalWeight: number;
  totalAmount: number;
}

const columns: Column<UIBulkSaleRow>[] = [
  { header: "Date", accessorKey: "date" },
  { header: "Total Weight", cell: (row) => `${row.totalWeight.toLocaleString()} kg` },
  { header: "Total Amount", cell: (row) => `Rp ${row.totalAmount.toLocaleString()}` },
  { header: "Action", cell: () => <button className="text-gray-500 hover:text-gray-600">Detail</button> },
];

export default function KelurahanBulkSaleTable({ kelurahanId }: { kelurahanId: number }) {
  const [rows, setRows] = useState<UIBulkSaleRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const data: BulkSaleItemSummary[] = await kelurahanService.getBulkSales();
        const mapped = data
          .filter((s) => (s.kelurahan_id ?? kelurahanId) === kelurahanId)
          .map((s) => ({
            id: s.sale_id,
            date: s.date,
            totalWeight: s.total_weight,
            totalAmount: s.total_amount,
          }));
        setRows(mapped);
      } catch (e: any) {
        console.error(e);
        setError(e?.message || 'Failed to load bulk sales');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [kelurahanId]);

  if (loading) return <div className="p-4 text-center">Loading bulk sales...</div>;
  if (error) return <EmptyState title="Failed to load" description={error} action={<button className="btn btn-sm" onClick={() => window.location.reload()}>Retry</button>} />;
  if (!rows.length) return <EmptyState title="No bulk sales" description="Belum ada penjualan besar untuk kelurahan ini." />;
  return <BasicTableOne columns={columns} data={rows} />;
}
