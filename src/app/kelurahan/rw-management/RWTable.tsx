"use client";
import React, { useEffect, useMemo, useState } from "react";
import BasicTableOne, { Column } from "@/components/tables/BasicTableOne";
import { kelurahanService } from "@/services/kelurahan.service";
import { RWPublic } from "@/types/entities";
import EmptyState from "@/components/common/EmptyState";

interface UIRow {
  id: number;
  name: string;
  phone: string;
  address: string;
  active: string;
}

const columns: Column<UIRow>[] = [
  { header: "RW", accessorKey: "name" },
  { header: "Phone", accessorKey: "phone" },
  { header: "Address", accessorKey: "address" },
  { header: "Active", accessorKey: "active" },
  {
    header: "Action",
    cell: () => (
      <div className="flex gap-2">
        <button className="text-brand-500 hover:text-brand-600">Edit</button>
        <button className="text-error-500 hover:text-error-600">Delete</button>
      </div>
    ),
  },
];

export default function RWTable({ kelurahanId }: { kelurahanId: number }) {
  const [rows, setRows] = useState<UIRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const list: RWPublic[] = await kelurahanService.getRwList();
        const filtered = list.filter((rw) => rw.kelurahan_id === kelurahanId);
        const mapped: UIRow[] = filtered.map((rw) => ({
          id: rw.rw_id,
          name: rw.name || `RW ${String(rw.nomor_rw).padStart(2, "0")}`,
          phone: rw.phone || "-",
          address: rw.address || "-",
          active: rw.active ? "Yes" : "No",
        }));
        setRows(mapped);
      } catch (e: any) {
        console.error(e);
        setError(e?.message || "Failed to load RW list");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [kelurahanId]);

  const filteredRows = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter((r) =>
      r.name.toLowerCase().includes(q) ||
      r.phone.toLowerCase().includes(q) ||
      r.address.toLowerCase().includes(q)
    );
  }, [rows, query]);

  if (loading) return <div className="p-4 text-center">Loading RW list...</div>;
  if (error) return <EmptyState title="Failed to load" description={error} action={<button className="btn btn-sm" onClick={() => window.location.reload()}>Retry</button>} />;
  if (!rows.length) return <EmptyState title="No RW found" description="Belum ada data RW untuk kelurahan ini." />;

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <input
          type="text"
          placeholder="Search RW, phone, address..."
          className="input input-bordered w-full max-w-sm px-3 py-2 rounded-md border border-gray-300 dark:border-white/10 bg-white/70 dark:bg-white/5"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>
      <BasicTableOne columns={columns} data={filteredRows} />
    </div>
  );
}
