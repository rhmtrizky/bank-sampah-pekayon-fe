"use client";
import React, { useEffect, useState } from "react";
import BasicTableOne, { Column } from "@/components/tables/BasicTableOne";
import { PriceListEntry } from "@/types/entities";
import { kelurahanService } from "@/services/kelurahan.service";
import EmptyState from "@/components/common/EmptyState";

interface UIKelurahanPriceRow {
  id: number; // added for generic table key
  price_id: number;
  waste_type_id: number;
  buy_price: number;
  sell_price: number;
  effective_date: string;
  wasteType: { name: string; unit: string; category?: string };
}

const columns: Column<UIKelurahanPriceRow>[] = [
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

export default function KelurahanPriceListTable({ kelurahanId }: { kelurahanId?: number }) {
  const [rows, setRows] = useState<UIKelurahanPriceRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const data: PriceListEntry[] = await kelurahanService.getPriceList();
        const filtered = data.filter(d => kelurahanId ? d.kelurahan_id === kelurahanId : d.kelurahan_id);
        const mapped: UIKelurahanPriceRow[] = filtered.map(e => ({
          id: e.price_id,
          price_id: e.price_id,
          waste_type_id: e.waste_type_id,
          buy_price: e.buy_price,
          sell_price: e.sell_price,
          effective_date: e.effective_date,
          wasteType: { name: `Waste #${e.waste_type_id}`, unit: 'kg' }, // Placeholder until waste type lookup integrated
        }));
        setRows(mapped);
      } catch (err) {
        console.error(err);
        setError('Gagal memuat price list kelurahan');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [kelurahanId]);

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
  if (rows.length === 0) {
    return <EmptyState title="Price List Kosong" description="Belum ada harga kelurahan." action={<button className='text-brand-500 hover:underline'>Tambah Harga</button>} />;
  }
  return <BasicTableOne columns={columns} data={rows} loading={false} />;
}
