"use client";
import React, { useEffect, useState } from "react";
import BasicTableOne, { Column } from "@/components/tables/BasicTableOne";
import EmptyState from "@/components/common/EmptyState";
import Button from "@/components/ui/button/Button";
import Pagination from "@/components/tables/Pagination";
import { transactionsService, Transaction } from "@/services/transactions.service";
import { wasteTypesService, WasteType } from "@/services/waste-types.service";
import EditTransactionModal from "./EditTransactionModal";
import CreateOfflineTransactionModal from "./CreateOfflineTransactionModal";
import { Modal } from "@/components/ui/modal";

interface UITransactionRow {
  id: number;
  date: string;
  userId: number;
  userName?: string;
  rt?: number | null;
  wasteTypeId: number;
  wasteTypeName?: string;
  weightRaw: string; // keep original string
  pricePerKg?: string;
  totalAmount?: string;
  method?: string | null;
  requestId?: number | null;
}

const formatRp = (val?: string) => {
  if (!val) return '-';
  const num = Number(val);
  if (isNaN(num)) return val;
  return 'Rp ' + num.toLocaleString('id-ID');
};

const buildColumns = (onEdit: (id: number) => void, onDelete: (id: number) => void): Column<UITransactionRow>[] => [
  { header: 'Tanggal', accessorKey: 'date' },
  { header: 'User', cell: (row) => (
    <div>
      <p className="font-medium text-gray-800 dark:text-white/90">{row.userName || `User ${row.userId}`}</p>
      <p className="text-xs text-gray-500">{row.rt ? ` • RT ${row.rt}` : ''}</p>
    </div>
  ) },
  { header: 'Tipe Sampah', cell: (row) => (
    <div>
      <p className="text-gray-800 dark:text-white/90">{row.wasteTypeName || `Type ${row.wasteTypeId}`}</p>
    </div>
  ) },
  { header: 'Berat (kg)', cell: (row) => `${row.weightRaw} kg` },
  { header: 'Harga/kg', cell: (row) => formatRp(row.pricePerKg) },
  { header: 'Total', cell: (row) => formatRp(row.totalAmount) },
  { header: 'Metode', cell: (row) => row.method || '-' },
 
  { header: 'Action', cell: (row) => (
    <div className="flex gap-2">
      <button onClick={() => onEdit(row.id)} className="text-brand-500 hover:text-brand-600 hover:underline">Edit</button>
      <button onClick={() => onDelete(row.id)} className="text-red-500 hover:text-red-600 hover:underline">Delete</button>
    </div>
  ) }
];

export default function TransactionTable() {
  const [rows, setRows] = useState<UITransactionRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  // Filters
  const [month, setMonth] = useState<string>("");
  const [year, setYear] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [method, setMethod] = useState<string>("");
  const [fromDate, setFromDate] = useState<string>("");
  const [toDate, setToDate] = useState<string>("");
  const [wasteTypeFilter, setWasteTypeFilter] = useState<string>("");
  
  const [wasteTypes, setWasteTypes] = useState<WasteType[]>([]);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const fetchTransactions = async (params: any) => {
    setLoading(true);
    setError(null);
    try {
      const result = await transactionsService.list(params);
      const data = result.data || [];
      const mapped: UITransactionRow[] = data.map((t: Transaction) => ({
        id: t.transaction_id,
        date: t.created_at?.split('T')[0] || '-',
        userId: t.user_id,
        userName: t.user_name,
        rt: t.rt ?? null,
        wasteTypeId: t.waste_type_id,
        wasteTypeName: t.waste_type_name,
        weightRaw: t.weight_kg,
        pricePerKg: t.price_per_kg,
        totalAmount: t.total_amount,
        method: t.transaction_method,
        requestId: t.request_id ?? null,
      }));
      setRows(mapped);
      setTotalPages(result.pagination?.totalPages || 1);
    } catch (e: any) {
      setError(e?.response?.data?.message || e?.message || 'Failed to load transactions');
    } finally {
      setLoading(false);
    }
  };

  const load = () => {
    const params: any = { page, limit: limit };
    if (month) params.month = Number(month);
    if (year) params.year = Number(year);
    if (name) params.name = name;
    if (method) params.method = method;
    if (fromDate) params.from_date = new Date(fromDate).toISOString();
    if (toDate) params.to_date = new Date(toDate).toISOString();
    if (wasteTypeFilter) params.waste_type_id = Number(wasteTypeFilter);
    fetchTransactions(params);
  };

  useEffect(() => { load(); }, [page]);

  useEffect(() => {
    const loadWasteTypes = async () => {
      try {
        const types = await wasteTypesService.list();
        setWasteTypes(types);
      } catch (e) {
        console.error('Failed to load waste types', e);
      }
    };
    loadWasteTypes();
  }, []);

  const handleApplyFilter = () => {
    setPage(1);
    load();
  };

  const handleResetFilter = () => {
    setName("");
    setMethod("");
    setMonth("");
    setYear("");
    setFromDate("");
    setToDate("");
    setWasteTypeFilter("");
    setPage(1);
    fetchTransactions({ page: 1, limit: 10 });
  };

  const handleEdit = (id: number) => {
    setEditId(id);
    setIsEditOpen(true);
  };

  const handleDelete = (id: number) => {
    setDeleteId(id);
    setIsDeleteOpen(true);
  };

  const confirmDelete = async () => {
    if (deleteId == null) return;
    try {
      await transactionsService.remove(deleteId);
      setIsDeleteOpen(false);
      setDeleteId(null);
      load();
    } catch (e: any) {
      alert(e?.response?.data?.message || e?.message || 'Gagal menghapus');
    }
  };

  const columns = buildColumns(handleEdit, handleDelete);
  const [limit, setLimit] = useState(10);

  return (
    <div className="space-y-4">
      {/* Filter Section */}
      <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-base font-semibold text-gray-800 dark:text-white">Filter Transaksi</h3>
          <Button size="sm" onClick={() => setIsCreateOpen(true)}>+ Transaksi Offline</Button>
        </div>
        
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {/* Name */}
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400">Nama Warga</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-brand-500 dark:border-white/10 dark:bg-white/5 dark:focus:border-brand-500"
              placeholder="Cari nama..."
            />
          </div>

          {/* Waste Type */}
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400">Tipe Sampah</label>
            <select
              value={wasteTypeFilter}
              onChange={(e) => setWasteTypeFilter(e.target.value)}
              className="w-full rounded border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-brand-500 dark:border-white/10 dark:bg-white/5 dark:focus:border-brand-500"
            >
              <option value="">Semua Tipe</option>
              {wasteTypes.map((wt) => (
                <option key={wt.waste_type_id} value={wt.waste_type_id}>{wt.name}</option>
              ))}
            </select>
          </div>

          {/* Method */}
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400">Metode</label>
            <select
              value={method}
              onChange={(e) => setMethod(e.target.value)}
              className="w-full rounded border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-brand-500 dark:border-white/10 dark:bg-white/5 dark:focus:border-brand-500"
            >
              <option value="">Semua Metode</option>
              <option value="online">Online</option>
              <option value="offline">Offline</option>
            </select>
          </div>

          {/* Month/Year */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400">Bulan</label>
              <input
                type="number"
                min={1}
                max={12}
                value={month}
                onChange={(e) => setMonth(e.target.value)}
                className="w-full rounded border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-brand-500 dark:border-white/10 dark:bg-white/5 dark:focus:border-brand-500"
                placeholder="1-12"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400">Tahun</label>
              <input
                type="number"
                min={2000}
                max={2100}
                value={year}
                onChange={(e) => setYear(e.target.value)}
                className="w-full rounded border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-brand-500 dark:border-white/10 dark:bg-white/5 dark:focus:border-brand-500"
                placeholder="2025"
              />
            </div>
          </div>

          {/* From Date */}
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400">Dari Tanggal</label>
            <input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="w-full rounded border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-brand-500 dark:border-white/10 dark:bg-white/5 dark:focus:border-brand-500"
            />
          </div>

          {/* To Date */}
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400">Sampai Tanggal</label>
            <input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className="w-full rounded border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-brand-500 dark:border-white/10 dark:bg-white/5 dark:focus:border-brand-500"
            />
          </div>
        </div>

        <div className="mt-4 flex justify-end gap-2 border-t border-gray-100 pt-3 dark:border-white/5">
          <Button variant="outline" onClick={handleResetFilter} className="w-full sm:w-auto">Reset</Button>
          <Button onClick={handleApplyFilter} className="w-full sm:w-auto">Terapkan Filter</Button>
        </div>
      </div>

      {loading ? (
        <div className="p-4 text-center">Memuat transaksi...</div>
      ) : error ? (
        <EmptyState title="Gagal memuat" description={error} action={<button className="btn btn-sm" onClick={() => load()}>Retry</button>} />
      ) : rows.length === 0 ? (
        <EmptyState title="Tidak ada transaksi" description="Belum ada data untuk filter saat ini." />
      ) : (
        <BasicTableOne columns={columns} data={rows} />
      )}
      <div className="flex justify-between items-center mt-3">
          <div className="flex items-center gap-2">
            <span className="text-xs">Tampil</span>
            <select
              className="border rounded px-1 py-0.5 text-xs"
              value={limit}
              onChange={e => { setLimit(Number(e.target.value)); setPage(1); }}
            >
              {[10, 20, 50].map(opt => <option key={opt} value={opt}>{opt}/page</option>)}
            </select>
          </div>
          <Pagination currentPage={page} totalPages={totalPages} onPageChange={(p) => setPage(p)} />
        </div>

      <CreateOfflineTransactionModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onSuccess={() => load()}
      />
      <EditTransactionModal
        isOpen={isEditOpen}
        onClose={() => { setIsEditOpen(false); setEditId(null); }}
        transactionId={editId}
        onSuccess={() => load()}
      />

      {/* Delete Confirm Modal */}
      <Modal isOpen={isDeleteOpen} onClose={() => { setIsDeleteOpen(false); setDeleteId(null); }} className="max-w-md">
        <div className="p-6">
          <h3 className="mb-3 text-lg font-semibold text-gray-800 dark:text-white">Hapus Transaksi</h3>
          <p className="text-sm text-gray-600 dark:text-gray-300">Anda yakin ingin menghapus transaksi ini? Tindakan ini tidak dapat dibatalkan.</p>
          <div className="mt-6 flex justify-end gap-3">
            <Button variant="outline" onClick={() => { setIsDeleteOpen(false); setDeleteId(null); }}>Batal</Button>
            <Button onClick={confirmDelete}>Hapus</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
