"use client";
import React, { useCallback, useEffect, useState } from "react";
import ComponentCard from "@/components/common/ComponentCard";
import BasicTableOne, { Column } from "@/components/tables/BasicTableOne";
import Button from "@/components/ui/button/Button";
import Pagination from "@/components/tables/Pagination";
import Input from "@/components/form/input/InputField";
import { Modal } from "@/components/ui/modal";
import CreateWasteTypeModal from "./CreateWasteTypeModal";
import EditWasteTypeModal from "./EditWasteTypeModal";
import { wasteTypesService, WasteType } from "@/services/waste-types.service";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";

export default function WasteTypesPage() {
  const [items, setItems] = useState<WasteType[]>([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const [filterName, setFilterName] = useState("");

  const [showCreate, setShowCreate] = useState(false);
  const [editData, setEditData] = useState<WasteType | null>(null);
  const [deleteItem, setDeleteItem] = useState<WasteType | null>(null);

  const columns: Column<WasteType>[] = [
    { header: "Nama", accessorKey: "name" },
    { header: "Deskripsi", cell: (row) => row.description || "-" },
    {
      header: "Aksi",
      cell: (row) => (
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={() => setEditData(row)}>Edit</Button>
          <Button size="sm" className="bg-red-500 hover:bg-red-700" onClick={() => setDeleteItem(row)}>Hapus</Button>
        </div>
      ),
    },
  ];

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const res = await wasteTypesService.list({ page, limit, name: filterName || undefined });
      const envelope = res?.data;
      const data = envelope?.items ?? [];
      const pagination = envelope?.pagination ?? {};
      setItems(data || []);
      const tp = envelope?.totalPages;
      console.log('pagination:', pagination, 'totalPages:', tp, 'envelope:', envelope);
      setTotalPages(tp);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [page, limit, filterName]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleDelete = async () => {
    if (!deleteItem) return;
    try {
      await wasteTypesService.remove(deleteItem.waste_type_id);
      setDeleteItem(null);
      fetchData();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-4">
         <PageBreadcrumb pageTitle="Manajemen Jenis Sampah" />
      

        <div className="grid grid-cols-1 md:grid-cols-4 gap-2 mt-10 ">
          <div>
            <Input value={filterName} onChange={(e) => setFilterName(e.target.value)} placeholder="Cari nama" />
          </div>
          <div className="flex items-end gap-2">
            <Button onClick={() => { setPage(1); fetchData(); }}>Terapkan</Button>
            <Button variant="outline" onClick={() => { setFilterName(""); setPage(1); }}>Reset</Button>
          </div>
          
          <div className="flex justify-end md:col-span-2">
            <Button onClick={() => setShowCreate(true)}>+ Tambah Jenis Sampah</Button>
          </div>
        </div>



        <BasicTableOne
          columns={columns}
          data={items}
          loading={loading}
          emptyMessage="Belum ada jenis sampah."
        />
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

      {showCreate && (
        <CreateWasteTypeModal
          isOpen={showCreate}
          onClose={() => setShowCreate(false)}
          onSuccess={() => { setShowCreate(false); fetchData(); }}
        />
      )}

      {editData && (
        <EditWasteTypeModal
          isOpen={!!editData}
          initial={editData}
          onClose={() => setEditData(null)}
          onSuccess={() => { setEditData(null); fetchData(); }}
        />
      )}

      <Modal isOpen={!!deleteItem} onClose={() => setDeleteItem(null)} className="max-w-[600px] p-5 lg:p-10">
          <div className="text-base font-semibold mb-2">Hapus Waste Type</div>
          <div className="text-sm text-gray-600 mb-4">Yakin ingin menghapus "{deleteItem?.name}"?</div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setDeleteItem(null)}>Batal</Button>
            <Button className="bg-red-500 hover:bg-red-700" onClick={handleDelete}>Hapus</Button>
          </div>
      </Modal>
    </div>
  );
}
