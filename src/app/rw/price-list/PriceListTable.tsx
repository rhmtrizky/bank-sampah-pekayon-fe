"use client";
import React, { useEffect, useState } from "react";
import BasicTableOne, { Column } from "@/components/tables/BasicTableOne";

import { priceListService } from "@/services/price-list.service";
import { wasteTypesService } from "@/services/waste-types.service";
import EmptyState from "@/components/common/EmptyState";
import PriceListModal from "./PriceListModal";
import Button from "@/components/ui/button/Button";
import { Modal } from "@/components/ui/modal";

// Adapt backend PriceListEntry into UI row shape expected by DataTable columns
interface UIPriceRow {
  id: number; // added for generic table key
  price_id: number;
  waste_type_id: number;
  buy_price: number;
  sell_price: number;
  effective_date: string;
  wasteType: { name: string; category?: string };
}

function getColumns(onEdit: (row: UIPriceRow) => void, onDelete: (row: UIPriceRow) => void): Column<UIPriceRow>[] {
  return [
    {
      header: "Tipe Sampah",
      cell: (row) => (
        <div>
          <p className="font-medium text-gray-800 dark:text-white/90">{row.wasteType.name}</p>
          <p className="text-xs text-gray-500">{row.wasteType.category}</p>
        </div>
      ),
    },
   
    {
      header: "Harga Beli",
      cell: (row) => `Rp ${row.buy_price.toLocaleString()}`,
    },
    {
      header: "Harga Jual",
      cell: (row) => `Rp ${row.sell_price.toLocaleString()}`,
    },
    {
      header: "Tanggal Efektif",
      cell: (row) => {
        const d = new Date(row.effective_date);
        return isNaN(d.getTime()) ? '-' : d.toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' });
      },
    },
    {
      header: "Action",
      cell: (row) => (
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={() => onEdit(row)}>Edit</Button>
          <Button size="sm" variant="outline" onClick={() => onDelete(row)} className="text-red-600 border-red-600">Delete</Button>
        </div>
      ),
    },
  ];
}

export default function PriceListTable({ rwId }: Readonly<{ rwId?: number }>) {
  const [rows, setRows] = useState<UIPriceRow[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [editRow, setEditRow] = useState<UIPriceRow | null>(null);
  const [deleteRow, setDeleteRow] = useState<UIPriceRow | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchRows = async (pageNum = page, pageLimit = limit) => {
    if (!rwId) {
      setRows([]);
      setTotal(0);
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      // Fetch waste types and paginated price list in parallel
      const [wasteTypesData, paged] = await Promise.all([
        wasteTypesService.list(),
        priceListService.listByRwPaginated(rwId, pageNum, pageLimit),
      ]);
      const mapped: UIPriceRow[] = paged.data.map(e => {
        const wt = wasteTypesData.find(w => w.waste_type_id === e.waste_type_id);
        return {
          id: e.price_id,
          price_id: e.price_id,
          waste_type_id: e.waste_type_id,
          buy_price: Number(e.buy_price),
          sell_price: Number(e.sell_price),
          effective_date: e.effective_date,
          wasteType: {
            name: wt?.name || `Waste #${e.waste_type_id}`,
            category: wt?.description || undefined,
          },
        };
      });
      setRows(mapped);
      setTotal(paged.total);
    } catch (err) {
      setError('Gagal memuat price list');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRows(1, limit);
    setPage(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rwId]);

  useEffect(() => {
    fetchRows(page, limit);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, limit]);

  const handleCreate = () => {
    setModalMode("create");
    setEditRow(null);
    setModalOpen(true);
  };
  const handleEdit = (row: UIPriceRow) => {
    setModalMode("edit");
    setEditRow(row);
    setModalOpen(true);
  };
  const handleDelete = (row: UIPriceRow) => {
    setDeleteRow(row);
  };
  const confirmDelete = async () => {
    if (!deleteRow) return;
    setDeleting(true);
    try {
      await priceListService.delete(deleteRow.price_id);
      setDeleteRow(null);
      fetchRows();
    } catch {
      setError("Gagal menghapus harga");
    } finally {
      setDeleting(false);
    }
  };
  const handleModalSuccess = () => {
    setModalOpen(false);
    fetchRows(page, limit);
  };

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
    return <EmptyState title="Price List Kosong" description="Belum ada harga yang ditetapkan." action={<Button onClick={handleCreate}>Tambah Harga</Button>} />;
  }
  // Pagination controls
  const totalPages = Math.ceil(total / limit);
  return (
    <>
      <div className="mb-2 flex justify-between items-center">
        <div className="flex justify-end w-full">
        <Button size="sm" onClick={handleCreate}>Tambah Harga</Button>
        </div>
        {totalPages > 1 && (
          <div className="flex items-center gap-2">
            <Button size="sm" variant="outline" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>&lt;</Button>
            <span>Page {page} / {totalPages}</span>
            <Button size="sm" variant="outline" onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}>&gt;</Button>
            <select
              className="ml-2 border rounded px-1 py-0.5 text-xs"
              value={limit}
              onChange={e => { setLimit(Number(e.target.value)); setPage(1); }}
            >
              {[10, 20, 50].map(opt => <option key={opt} value={opt}>{opt}/page</option>)}
            </select>
          </div>
        )}
      </div>
      <BasicTableOne columns={getColumns(handleEdit, handleDelete)} data={rows} loading={false} />
      <PriceListModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSuccess={handleModalSuccess}
        rwId={rwId}
        mode={modalMode}
        initialData={modalMode === "edit" && editRow ? {
          price_id: editRow.price_id,
          waste_type_id: editRow.waste_type_id,
          buy_price: editRow.buy_price,
          sell_price: editRow.sell_price,
          effective_date: editRow.effective_date,
        } : undefined}
      />
      {/* Delete confirmation modal */}
      {deleteRow && (
        <Modal isOpen={true} onClose={() => setDeleteRow(null)} className="max-w-[600px] p-5 lg:p-10">
            <div className="mb-4 font-semibold text-lg">Hapus Harga?</div>
            <div className="mb-4">Yakin ingin menghapus harga untuk tipe sampah <b>{deleteRow.wasteType.name}</b>?</div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setDeleteRow(null)}>Batal</Button>
              <Button  onClick={confirmDelete} disabled={deleting} className="bg-red-600 hover:bg-red-700">{deleting ? 'Menghapus...' : 'Hapus'}</Button>
            </div>
          </Modal>
      )}
    </>
  );
}
