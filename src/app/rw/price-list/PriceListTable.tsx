"use client";
import React, { useEffect, useState } from "react";
import BasicTableOne, { Column } from "@/components/tables/BasicTableOne";
import { PriceListEntry } from "@/types/entities";
import { rwService } from "@/services/rw.service";
import EmptyState from "@/components/common/EmptyState";

// Adapt backend PriceListEntry into UI row shape expected by DataTable columns
interface UIPriceRow {
  id: number; // added for generic table key
  price_id: number;
  waste_type_id: number;
  buy_price: number;
  sell_price: number;
  effective_date: string;
  wasteType: { name: string; unit: string; category?: string };
}

const columns: Column<UIPriceRow>[] = [
  {
    header: "Waste Type",
    cell: (row) => (
      <div>
        <p className="font-medium text-gray-800 dark:text-white/90">{row.wasteType.name}</p>
        <p className="text-xs text-gray-500">{row.wasteType.category}</p>
      </div>
    ),
  },
  {
    header: "Unit",
    cell: (row) => row.wasteType.unit,
  },
  {
    header: "Buy Price",
    cell: (row) => `Rp ${row.buy_price.toLocaleString()}`,
  },
  {
    header: "Sell Price",
    cell: (row) => `Rp ${row.sell_price.toLocaleString()}`,
  },
  {
    header: "Effective Date",
    accessorKey: "effective_date",
  },
  {
    header: "Action",
    cell: (row) => (
      <button className="text-brand-500 hover:text-brand-600">Edit Price</button>
    ),
  },
];

export default function PriceListTable({ rwId }: { rwId?: number }) {
  const [rows, setRows] = useState<UIPriceRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      if (!rwId) {
        setLoading(false);
        setRows([]);
        return;
      }
      try {
        setLoading(true);
        const data: PriceListEntry[] = await rwService.getPriceList(rwId);
        // Map entries (some fields like waste type details may require separate lookup if not provided)
        const mapped: UIPriceRow[] = data.map(e => ({
          id: e.price_id,
          price_id: e.price_id,
          waste_type_id: e.waste_type_id,
          buy_price: e.buy_price,
          sell_price: e.sell_price,
          effective_date: e.effective_date,
          wasteType: { name: `Waste #${e.waste_type_id}`, unit: 'kg' }, // Placeholder; replace with real waste type name via join when available
        }));
        setRows(mapped);
      } catch (err) {
        console.error(err);
        setError('Gagal memuat price list');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [rwId]);

  if (loading) {
    return (
      <div className="flex h-40 items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-brand-500 border-t-transparent" />
      </div>
    );
  }
  if (error) {
    return <EmptyState title="Error" description={error} />;
  }
  if (!rwId) {
    return <EmptyState title="RW belum dipilih" description="Silakan pilih RW terlebih dahulu." />;
  }
  if (rows.length === 0) {
    return <EmptyState title="Price List Kosong" description="Belum ada harga yang ditetapkan." action={<button className='text-brand-500 hover:underline'>Tambah Harga</button>} />;
  }
  return <BasicTableOne columns={columns} data={rows} loading={false} />;
}
