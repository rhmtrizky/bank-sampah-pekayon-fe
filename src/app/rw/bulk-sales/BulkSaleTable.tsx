"use client";
import React, { useEffect, useState } from "react";
import BasicTableOne, { Column } from "@/components/tables/BasicTableOne";
import { BulkSale } from "@/types";
import Badge from "@/components/ui/badge/Badge";
import Button from "@/components/ui/button/Button";
import { useRouter } from "next/navigation";
import { bulkSalesService } from "@/services/bulk-sales.service";
import Pagination from "@/components/tables/Pagination";
import Input from "@/components/form/input/InputField";
import Select from "@/components/form/Select";
import { useSelector } from "react-redux";
import { Modal } from "@/components/ui/modal";
import { pengepulService } from "@/services/pengepul.service";
import { priceListService } from "@/services/price-list.service";

const columns: Column<BulkSale>[] = [
  {
    header: "Date",
    accessorKey: "date",
  },
  {
    header: "Pengepul",
    cell: (row) => (
      <div>
        <p className="font-medium text-gray-800 dark:text-white/90">{row.pengepul.name}</p>
        <p className="text-xs text-gray-500">{row.pengepul.phone}</p>
      </div>
    ),
  },
  {
    header: "Total Weight",
    cell: (row) => `${row.totalWeight} kg`,
  },
  {
    header: "Total Amount",
    cell: (row) => `Rp ${row.totalAmount.toLocaleString()}`,
  },
  {
    header: "Status",
    cell: (row) => {
      const color = row.status === "COMPLETED" ? "success" : row.status === "DRAFT" ? "warning" : "error";
      return <Badge color={color}>{row.status}</Badge>;
    },
  },
  {
    header: "Action",
    cell: (row) => (
      <div className="flex gap-2">
        <Button size="sm" variant="outline" onClick={() => row.onDetail?.(row.id)}>Detail</Button>
      </div>
    ),
  },
];

export default function BulkSaleTable() {
  const router = useRouter();
  const [data, setData] = useState<(BulkSale & { onDetail?: (id: number | string) => void })[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [pengepulId, setPengepulId] = useState<number | "">("");
  const [date, setDate] = useState<string>("");
  const [wasteTypeOptions, setWasteTypeOptions] = useState<Array<{ label: string; value: number }>>([]);
  const [pengepulOptions, setPengepulOptions] = useState<Array<{ label: string; value: number }>>([]);
  const [itemRows, setItemRows] = useState<Array<{ waste_type_id: number | ""; weight_kg: number | "" }>>([
    { waste_type_id: "", weight_kg: "" },
  ]);
  const authUser = useSelector((state: any) => state?.auth?.user);
  const rwId = authUser?.rw;
  console.log("Authenticated user RW ID:", rwId);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await bulkSalesService.list({ page, limit });
        const env = res?.data ?? res;
        const items = env?.items ?? env?.data?.items ?? [];
        const meta = env?.data ?? env;
        const mapped = (items as any[]).map((s: any) => ({
          id: s.sale_id,
          rwId: s.rw_id,
          pengepulId: s.pengepul_id,
          pengepul: {
            id: s.pengepul?.pengepul_id,
            name: s.pengepul?.name,
            phone: s.pengepul?.phone,
            address: s.pengepul?.address,
            type: "",
            createdAt: "",
            updatedAt: "",
          },
          date: (s.date || '').slice(0,10),
          totalWeight: Number(s.total_weight || 0),
          totalAmount: Number(s.total_amount || 0),
          status: s.status || "COMPLETED",
          items: s.items || [],
          createdAt: s.created_at || "",
          updatedAt: s.updated_at || "",
          onDetail: (id: number | string) => {
            const q = encodeURIComponent(JSON.stringify(s));
            router.push(`/rw/bulk-sales/${id}?data=${q}`);
          },
        }));
        setData(mapped);
        const tp = Number(meta?.totalPages ?? 1);
        setTotalPages(Number.isFinite(tp) && tp > 0 ? tp : 1);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [page, limit]);

  useEffect(() => {
    const loadRefs = async () => {
      try {
        // Load waste types via priceListService (derive from price list entries)
        if (rwId) {
          try {
            const resp = await priceListService.listByRwPaginated(Number(rwId), 1, 100);
            console.log("Price list entries for waste types:", resp);
            const entries = resp?.data ?? [];
            const byId: Record<number, string> = {};
            entries.forEach((pl: any) => {
              const wtId = Number(pl?.waste_type_id ?? pl?.waste_type?.waste_type_id);
              const wtName = pl?.waste_type?.name ?? `ID ${wtId}`;
              if (Number.isFinite(wtId) && !(wtId in byId)) byId[wtId] = wtName;
            });
            const opts = Object.entries(byId).map(([id, name]) => ({ label: name as string, value: Number(id) }));
            setWasteTypeOptions(opts);
          } catch (e) {
            console.error("Failed to load waste types from price list", e);
          }
        }
        // Load pengepul list via pengepulService
        try {
          const pRes = await pengepulService.list({ page: 1, limit: 100 });
          const pg = (pRes as any)?.data ?? pRes?.data ?? pRes;
          const list = Array.isArray(pg) ? pg : (pRes?.data ?? []);
          const popts = (list as any[]).map((p: any) => ({ label: `${p.name} (${p.phone ?? '-'})`, value: p.pengepul_id ?? p.id }));
          setPengepulOptions(popts);
        } catch (e) {
          console.error("Failed to load pengepul list", e);
        }
      } catch (e) {
        console.error(e);
      }
    };
    loadRefs();
  }, [rwId]);

  const openAdd = () => setIsAddOpen(true);
  const closeAdd = () => setIsAddOpen(false);
  const addRow = () => setItemRows((prev) => [...prev, { waste_type_id: "", weight_kg: "" }]);
  const removeRow = (idx: number) => setItemRows((prev) => prev.filter((_, i) => i !== idx));
  const onSubmitAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Build ISO date expected by API, e.g. 2025-12-05T00:00:00Z
      const isoDate = date ? `${date}T00:00:00Z` : undefined;
      const payload = {
        pengepul_id: typeof pengepulId === "number" ? pengepulId : undefined,
        items: itemRows
          .filter((r) => typeof r.waste_type_id === "number" && typeof r.weight_kg === "number")
          .map((r) => ({ waste_type_id: r.waste_type_id as number, weight_kg: r.weight_kg as number })),
        date: isoDate,
      };
      const created = await bulkSalesService.create(payload);
      const env = (created as any)?.data ?? created;
      // Refresh list
      setLoading(true);
      const res = await bulkSalesService.list({ page, limit });
      const envList = (res as any)?.data ?? res;
      const items = envList?.items ?? envList?.data?.items ?? [];
      const meta = envList?.data ?? envList;
      const mapped = (items as any[]).map((s: any) => ({
        id: s.sale_id,
        rwId: s.rw_id,
        pengepulId: s.pengepul_id,
        pengepul: {
          id: s.pengepul?.pengepul_id,
          name: s.pengepul?.name,
          phone: s.pengepul?.phone,
          address: s.pengepul?.address,
          type: "",
          createdAt: "",
          updatedAt: "",
        },
        date: (s.date || '').slice(0,10),
        totalWeight: Number(s.total_weight || 0),
        totalAmount: Number(s.total_amount || 0),
        status: s.status || "COMPLETED",
        items: s.items || [],
        createdAt: s.created_at || "",
        updatedAt: s.updated_at || "",
        onDetail: (id: number | string) => {
          const q = encodeURIComponent(JSON.stringify(s));
          router.push(`/rw/bulk-sales/${id}?data=${q}`);
        },
      }));
      setData(mapped);
      const tp = Number(meta?.totalPages ?? 1);
      setTotalPages(Number.isFinite(tp) && tp > 0 ? tp : 1);
      setLoading(false);
      closeAdd();
      // Navigate to detail of created
      if (env?.sale_id) {
        const q = encodeURIComponent(JSON.stringify(env));
        router.push(`/rw/bulk-sales/${env.sale_id}?data=${q}`);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button onClick={openAdd}>Add Bulk Sale</Button>
      </div>
      <BasicTableOne columns={columns} data={data} loading={loading} emptyMessage="Tidak ada data" />
      {data.length > 0 && (
        <div className="flex justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500">Rows per page</span>
            <select
              className="border rounded px-2 py-1 text-sm"
              value={limit}
              onChange={(e) => { setLimit(Number(e.target.value)); setPage(1); }}
            >
              {[5,10,20,50].map(n => <option key={n} value={n}>{n}</option>)}
            </select>
          </div>
        <Pagination currentPage={page} totalPages={totalPages} onPageChange={(p) => setPage(p)} />
          </div>
      )}

      <Modal isOpen={isAddOpen} onClose={closeAdd} className="max-w-[800px] p-5 lg:p-10">
        <form onSubmit={onSubmitAdd} className="space-y-4">
          <div className="text-lg font-semibold">Add Bulk Sale</div>
          <div>
            <label className="block text-xs mb-1">Pengepul</label>
            <Select
              options={pengepulOptions}
              value={typeof pengepulId === 'number' ? pengepulId : undefined}
              onChange={(v: any) => setPengepulId(Number(v))}
              placeholder="Pilih pengepul"
            />
          </div>
          <div>
            <label className="block text-xs mb-1">Tanggal</label>
            <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          </div>
          <div className="text-sm font-medium">Items</div>
          {itemRows.map((r, idx) => (
            <div key={idx} className="grid grid-cols-1 gap-3 sm:grid-cols-6">
              <div className="sm:col-span-3">
                <label className="block text-xs mb-1">Tipe Sampah</label>
                <Select
                  options={wasteTypeOptions}
                  value={typeof r.waste_type_id === 'number' ? r.waste_type_id : undefined}
                  onChange={(v: any) => setItemRows(prev => prev.map((p, i) => i === idx ? { ...p, waste_type_id: Number(v) } : p))}
                  placeholder="Pilih tipe sampah"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs mb-1">Total Berat (kg)</label>
                <Input
                  type="number"
                  step={0.01}
                  value={typeof r.weight_kg === 'number' ? r.weight_kg : ''}
                  onChange={(e) => setItemRows(prev => prev.map((p, i) => i === idx ? { ...p, weight_kg: Number(e.target.value) } : p))}
                />
              </div>
              <div className="flex items-end">
                <Button type="button" className="bg-red-500 hover:bg-red-700" size="sm" onClick={() => removeRow(idx)}>Hapus</Button>
              </div>
            </div>
          ))}
          <div>
            <Button type="button" variant="outline" onClick={addRow}>Tambah Item</Button>
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={closeAdd}>Batal</Button>
            <Button type="submit">Simpan</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
