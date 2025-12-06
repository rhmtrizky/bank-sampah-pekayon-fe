"use client";
import React, { useEffect, useState } from "react";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import BasicTableOne, { Column } from "@/components/tables/BasicTableOne";
import Button from "@/components/ui/button/Button";
import { useParams, useSearchParams } from "next/navigation";
import { bulkSalesService } from "@/services/bulk-sales.service";
import Input from "@/components/form/input/InputField";
import { Modal } from "@/components/ui/modal";

interface SaleItemRow {
  id: number;
  waste_type_id: number;
  weight_kg: number;
  price_per_kg?: number;
  subtotal?: number;
}

export default function BulkSaleDetailPage() {
  const params = useParams();
  const id = Number(params?.id);
  const [sale, setSale] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [isUpdateOpen, setIsUpdateOpen] = useState(false);
  const [pengepulId, setPengepulId] = useState<string>("");
  const [date, setDate] = useState<string>("");
  const [items, setItems] = useState<SaleItemRow[]>([]);

  const columns: Column<SaleItemRow>[] = [
    { header: "Waste Type", accessorKey: "waste_type_id" },
    { header: "Weight (kg)", accessorKey: "weight_kg" },
    { header: "Price/kg", cell: (row) => row.price_per_kg ? `Rp ${row.price_per_kg.toLocaleString()}` : "-" },
    { header: "Subtotal", cell: (row) => row.subtotal ? `Rp ${row.subtotal.toLocaleString()}` : "-" },
  ];

  const searchParams = useSearchParams();
  useEffect(() => {
    try {
      const raw = searchParams.get("data");
      if (raw) {
        const parsed = JSON.parse(decodeURIComponent(raw));
        const env = parsed;
        setSale(env);
        setPengepulId(String(env?.pengepul_id ?? env?.pengepul?.pengepul_id ?? ""));
        setDate((env?.date || "").slice(0, 10));
        const mapped = (env?.items || []).map((it: any) => ({
          id: it.sale_item_id,
          waste_type_id: it.waste_type_id,
          weight_kg: Number(it.weight_kg || 0),
          price_per_kg: it.price_per_kg ? Number(it.price_per_kg) : undefined,
          subtotal: it.subtotal ? Number(it.subtotal) : undefined,
        }));
        setItems(mapped);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [searchParams]);

  const openUpdate = () => setIsUpdateOpen(true);
  const closeUpdate = () => setIsUpdateOpen(false);
  const onUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload: any = {
        pengepul_id: pengepulId ? Number(pengepulId) : undefined,
        date: date ? new Date(date).toISOString() : undefined,
        items: items.map(it => ({ waste_type_id: it.waste_type_id, weight_kg: it.weight_kg })),
      };
      const res = await bulkSalesService.update(id, payload);
      const env = res?.data ?? res;
      setSale(env);
      closeUpdate();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      <PageBreadcrumb pageTitle={`Detail Penjualan ke ${sale?.pengepul?.name}`} />
      {loading ? (
        <div className="p-6 text-center">Memuat...</div>
      ) : !sale ? (
        <div className="p-6 text-center">Data tidak ditemukan</div>
      ) : (
        <>
          <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-white/[0.05] dark:bg-white/[0.03]">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-500">Tanggal</div>
                <div className="text-lg font-semibold">{(sale?.date || '').slice(0,10)}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Pengepul</div>
                <div className="text-lg font-semibold">{sale?.pengepul?.name}</div>
                <div className="text-xs text-gray-500">{sale?.pengepul?.phone}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Total</div>
                <div className="text-lg font-semibold">Rp {Number(sale?.total_amount || 0).toLocaleString()}</div>
              </div>
              <Button onClick={openUpdate}>Update</Button>
            </div>
          </div>

          <div className="space-y-4">
            <BasicTableOne columns={columns} data={items} emptyMessage="Tidak ada item" />
          </div>

          <Modal isOpen={isUpdateOpen} onClose={closeUpdate} className="max-w-[700px] p-5 lg:p-10">
            <form onSubmit={onUpdate} className="space-y-4">
              <div className="text-lg font-semibold">Update Bulk Sale</div>
              
              <div>
                <label className="block text-xs mb-1">Tanggal</label>
                <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
              </div>
              <div className="text-sm text-gray-600">Items</div>
              {items.map((it, idx) => (
                <div key={it.id} className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs mb-1">Waste Type ID</label>
                    <Input
                      type="number"
                      value={it.waste_type_id}
                      onChange={(e) => {
                        const v = Number(e.target.value);
                        setItems(prev => prev.map((p, i) => i === idx ? { ...p, waste_type_id: v } : p));
                      }}
                    />
                  </div>
                  <div>
                    <label className="block text-xs mb-1">Weight (kg)</label>
                    <Input
                      type="number"
                      value={it.weight_kg}
                      onChange={(e) => {
                        const v = Number(e.target.value);
                        setItems(prev => prev.map((p, i) => i === idx ? { ...p, weight_kg: v } : p));
                      }}
                    />
                  </div>
                </div>
              ))}
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={closeUpdate}>Batal</Button>
                <Button type="submit">Simpan</Button>
              </div>
            </form>
          </Modal>
        </>
      )}
    </div>
  );
}
