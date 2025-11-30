"use client";
import React, { useEffect, useState } from "react";
import Input from "@/components/form/input/InputField";
import BasicTableOne, { Column } from "@/components/tables/BasicTableOne";
import EmptyState from "@/components/common/EmptyState";
import Badge from "@/components/ui/badge/Badge";
import Pagination from "@/components/tables/Pagination";
import api from "@/lib/axios";
import ScheduleModal from "./ScheduleModal";
import Button from "@/components/ui/button/Button";

interface UIRequestRow {
  id: number;
  createdAt: string;
  scheduledDate?: string;
  wargaName: string;
  wargaId: number;
  rt?: number | string | null;
  phone: string;
  notes?: string;
  status: "pending" | "scheduled" | "completed" | "cancelled";
}

const statusColor = (status: UIRequestRow["status"]) => {
  switch (status) {
    case "completed":
      return "success";
    case "pending":
      return "warning";
    case "scheduled":
      return "info";
    default:
      return "error";
  }
};

const toTitle = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

export default function RequestTable() {

  const [rows, setRows] = useState<UIRequestRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [selectedRequestId, setSelectedRequestId] = useState<number | null>(null);
  // Filter states
  const [filterName, setFilterName] = useState("");
  const [filterPhone, setFilterPhone] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      // Build query params for filters
      const params = new URLSearchParams();
      params.append("page", String(page));
      params.append("limit", String(limit));
      if (filterName) params.append("name", filterName);
      if (filterPhone) params.append("phone", filterPhone);
      if (filterDate) params.append("date", filterDate);
      if (filterStatus) params.append("status", filterStatus);
      const res = await api.get(`/dashboard/rw/recent/requests?${params.toString()}`);
      const envelope = res.data;
      const list = envelope?.data?.data ?? [];
      const pagination = envelope?.data?.pagination ?? { totalPages: 1 };
      if (!Array.isArray(list) || list.length === 0) {
        setRows([]);
        setTotalPages(pagination.totalPages ?? 1);
        return;
      }
      const mapped: UIRequestRow[] = list.map((item: any) => ({
        id: item.request_id,
        createdAt: item.created_at ? new Date(item.created_at).toLocaleDateString('id-ID') : '-',
        scheduledDate: item.scheduled_date ? new Date(item.scheduled_date).toLocaleString('id-ID', { dateStyle: 'short', timeStyle: 'short' }) : '-',
        wargaName: item.user?.name || `User ${item.user?.user_id ?? ''}`,
        wargaId: item.user?.user_id ?? 0,
        rt: item.user?.rt ? `0${item.user.rt}` : null,
        phone: item.user?.phone,
        notes: '-',
        status: item.status,
      }));
      setRows(mapped);
      setTotalPages(pagination.totalPages ?? 1);
    } catch (e: any) {
      console.error(e);
      setError(e?.message || 'Failed to load requests');
    } finally {
      setLoading(false);
    }
  };

  const handleScheduleClick = (requestId: number) => {
    setSelectedRequestId(requestId);
    setIsScheduleModalOpen(true);
  };

  const handleScheduleSuccess = () => {
    loadData();
  };

  const columns: Column<UIRequestRow>[] = [
    { 
      header: "Tanggal Setor", 
      accessorKey: "createdAt" 
    },
    { 
      header: "Tanggal Pengepulan", 
      cell: (row) => (
        <span className={row.scheduledDate !== '-' ? 'text-brand-600 dark:text-brand-400 font-medium' : 'text-gray-500'}>
          {row.scheduledDate}
        </span>
      )
    },
    {
      header: "Warga",
      cell: (row) => (
        <div>
          <p className="font-medium text-gray-800 dark:text-white/90">{row.wargaName}</p>
        </div>
      ),
    },
    {
      header: "Nomor Telepon",
      cell: (row) => (
        <div>
          <p className="font-medium text-gray-800 dark:text-white/90">{row.phone}</p>
        </div>
      ),
    },
    {
      header: "RT",
      cell: (row) => (
        <span className="text-gray-700 dark:text-gray-300">{row.rt ?? '-'}</span>
      ),
    },
    {
      header: "Status",
      cell: (row) => <Badge color={statusColor(row.status)}>{toTitle(row.status)}</Badge>,
    },
    {
      header: "Action",
      cell: (row) => (
        <div className="flex gap-2">
          {row.status === "pending" && (
            <button
              onClick={() => handleScheduleClick(row.id)}
              className="text-brand-500 hover:text-brand-600 hover:underline"
            >
              Schedule
            </button>
          )}
          <a
            href={`/rw/online-requests/${row.id}`}
            className="text-gray-500 hover:text-gray-600 hover:underline"
          >
            Detail
          </a>
        </div>
      ),
    },
  ];

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, limit, filterName, filterPhone, filterDate, filterStatus]);

  if (loading) return <div className="p-4 text-center">Loading requests...</div>;

  // Filter UI
  const statusOptions = [
    { value: '', label: 'Semua Status' },
    { value: 'pending', label: 'Pending' },
    { value: 'scheduled', label: 'Scheduled' },
    { value: 'completed', label: 'Completed' },
    { value: 'cancelled', label: 'Cancelled' },
  ];

  const handleFilterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1); // reset to first page on filter
    loadData();
  };

  return (
    <>
      <form className="mb-4 flex flex-wrap gap-2 items-end" onSubmit={handleFilterSubmit}>
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Nama Warga</label>
          <Input
            type="text"
            placeholder="Cari nama..."
            value={filterName}
            onChange={e => setFilterName(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">No. Telepon</label>
          <Input
            type="text"
            placeholder="Cari no. telepon..."
            value={filterPhone}
            onChange={e => setFilterPhone(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Tanggal Setor</label>
          <Input
            type="date"
            value={filterDate}
            className="w-full rounded border border-gray-300 bg-white px-3 py-3 text-sm outline-none focus:border-brand-500 dark:border-white/10 dark:bg-white/5 dark:focus:border-brand-500"
            onChange={e => setFilterDate(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Status</label>
          <select
          className="w-full rounded border border-gray-300 bg-white px-3 py-3 text-sm outline-none focus:border-brand-500 dark:border-white/10 dark:bg-white/5 dark:focus:border-brand-500"
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value)}
          >
            {statusOptions.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
       
          <div className="flex gap-2 ml-2">
                        <Button type="submit" size="sm" >Cari</Button>
                        <Button type="submit" size="sm"  variant="outline"   onClick={() => { setFilterName(""); setFilterPhone(""); setFilterDate(""); setFilterStatus(""); setPage(1); }}>Reset</Button>
                      </div>
      </form>

      <div className="space-y-4">
        <BasicTableOne columns={columns} data={rows} emptyMessage="Data kosong / empty" />
        <div className="flex justify-between items-center">
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
      </div>
      <ScheduleModal
        isOpen={isScheduleModalOpen}
        onClose={() => setIsScheduleModalOpen(false)}
        requestId={selectedRequestId ?? 0}
        onSuccess={handleScheduleSuccess}
      />
    </>
  );
}
