"use client";
import React, { useEffect, useState } from "react";
import BasicTableOne, { Column } from "@/components/tables/BasicTableOne";
import EmptyState from "@/components/common/EmptyState";
import Badge from "@/components/ui/badge/Badge";
import Pagination from "@/components/tables/Pagination";
import api from "@/lib/axios";
import ScheduleModal from "./ScheduleModal";

interface UIRequestRow {
  id: number;
  createdAt: string;
  scheduledDate?: string;
  wargaName: string;
  wargaId: number;
  rt?: number | null;
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
  const [limit] = useState<number>(10);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [selectedRequestId, setSelectedRequestId] = useState<number | null>(null);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get(`/dashboard/rw/recent/requests?page=${page}&limit=${limit}`);
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
  }, [page, limit]);

  if (loading) return <div className="p-4 text-center">Loading requests...</div>;
  
  if (!rows.length)
  return (
    <>
      <div className="space-y-4">
        <BasicTableOne
          columns={columns}
          data={[]}
          emptyMessage="Data kosong / empty"
        />
         <div className="flex justify-end">
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


  return (
    <>
      <div className="space-y-4">
        <BasicTableOne columns={columns} data={rows} />
        <div className="flex justify-end">
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
