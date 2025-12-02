"use client";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import ComponentCard from "@/components/common/ComponentCard";
import Button from "@/components/ui/button/Button";
import Pagination from "@/components/tables/Pagination";
import Input from "@/components/form/input/InputField";
import { Modal } from "@/components/ui/modal";
import CreatePengepulModal from "../pengepul-management/CreatePengepulModal";
import EditPengepulModal from "./EditPengepulModal";
import { pengepulService, Pengepul } from "@/services/pengepul.service";

interface envelopeType {
    data: Pengepul[];
    pagination?: {  page: number; limit: number; total: number; totalPages: number };
}

export default function PengepulPage() {
  const [items, setItems] = useState<Pengepul[]>([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const [filterName, setFilterName] = useState("");
  const [filterPhone, setFilterPhone] = useState("");

  const [showCreate, setShowCreate] = useState(false);
  const [editData, setEditData] = useState<Pengepul | null>(null);
  const [deleteItem, setDeleteItem] = useState<Pengepul | null>(null);

  

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const res = await pengepulService.list({ page, limit, name: filterName || undefined, phone: filterPhone || undefined });
      const envelope: any = res?.data;
      console.log("Fetched pengepul data:", envelope);
      const pagination = envelope?.pagination ?? envelope?.meta ?? envelope?.page ?? {};
      setItems(envelope || []);
      const tp = pagination?.totalPages || pagination?.total_pages || Math.max(1, Math.ceil((pagination?.total || envelope?.data?.length || 0) / limit));
      setTotalPages(tp);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [page, limit, filterName, filterPhone]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleDelete = async () => {
    if (!deleteItem) return;
    try {
      await pengepulService.remove(deleteItem.pengepul_id);
      setDeleteItem(null);
      fetchData();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Manajemen Pengepul</h2>
        <Button onClick={() => setShowCreate(true)}>Tambah Pengepul</Button>
      </div>

      <ComponentCard title="Filter">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <div>
            <label className="block text-xs mb-1">Nama</label>
            <Input value={filterName} onChange={(e) => setFilterName(e.target.value)} placeholder="Cari nama" />
          </div>
          <div>
            <label className="block text-xs mb-1">Telepon</label>
            <Input value={filterPhone} onChange={(e) => setFilterPhone(e.target.value)} placeholder="08xxx" />
          </div>
          <div className="flex items-end gap-2">
            <Button onClick={() => { setPage(1); fetchData(); }}>Terapkan</Button>
            <Button variant="outline" onClick={() => { setFilterName(""); setFilterPhone(""); setPage(1); }}>Reset</Button>
          </div>
        </div>
      </ComponentCard>

      <ComponentCard title="Daftar Pengepul">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-left">
                <th className="p-3">Nama</th>
                <th className="p-3">Telepon</th>
                <th className="p-3">Alamat</th>
                <th className="p-3 w-40">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td className="p-3" colSpan={4}>Memuat...</td></tr>
              ) : items.length === 0 ? (
                <tr><td className="p-3" colSpan={4}>Tidak ada data</td></tr>
              ) : (
                items.map((it) => (
                  <tr key={it.pengepul_id} className="border-b">
                    <td className="p-3">{it.name}</td>
                    <td className="p-3">{it.phone}</td>
                    <td className="p-3">{it.address || '-'}</td>
                    <td className="p-3 flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => setEditData(it)}>Edit</Button>
                      <Button size="sm" variant="primary" className="bg-red-600 hover:bg-red-700" onClick={() => setDeleteItem(it)}>Hapus</Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between mt-4">
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
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={(p) => setPage(p)}
          />
        </div>
      </ComponentCard>

      {showCreate && (
        <CreatePengepulModal
          isOpen={showCreate}
          onClose={() => setShowCreate(false)}
          onSuccess={() => { setShowCreate(false); fetchData(); }}
        />
      )}

      {editData && (
        <EditPengepulModal
          isOpen={!!editData}
          initial={editData}
          onClose={() => setEditData(null)}
          onSuccess={() => { setEditData(null); fetchData(); }}
        />
      )}

      <Modal isOpen={!!deleteItem} onClose={() => setDeleteItem(null)} className="max-w-[600px] p-5 lg:p-10">
          <div className="text-base font-semibold mb-2">Hapus Pengepul</div>
          <div className="text-sm text-gray-600 mb-4">Yakin ingin menghapus "{deleteItem?.name}"?</div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setDeleteItem(null)}>Batal</Button>
            <Button variant="primary" className="bg-red-600 hover:bg-red-700" onClick={handleDelete}>Hapus</Button>
          </div>
      </Modal>
    </div>
  );
}
