"use client";
import React, { useEffect, useState } from "react";
import BasicTableOne, { Column } from "@/components/tables/BasicTableOne";
import Pagination from "@/components/tables/Pagination";
import { rwService } from "@/services/rw.service";
import { CollectionSchedule, WithdrawSchedule } from "@/types/entities";
import { scheduleService } from "@/services/schedule.service";
import { Modal } from "@/components/ui/modal";
import Button from "@/components/ui/button/Button";
import EditScheduleModal from "./EditScheduleModal";
import EmptyState from "@/components/common/EmptyState";

interface UIScheduleRow {
  id: number; 
  title: string;
  date: string;
  dayName: string;
  startTime: string;
  endTime: string;
  description?: string;
  type: "pengepulan" | "pencairan";
  // raw ISO values for editing
  rawDate?: string;
  rawStart?: string;
  rawEnd?: string;
}

const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const buildColumns = (onEdit: (row: UIScheduleRow) => void, onDelete: (row: UIScheduleRow) => void): Column<UIScheduleRow>[] => [
  { header: "Title", accessorKey: "title" },
  { header: "Day", accessorKey: "dayName" },
  { header: "Date", accessorKey: "date" },
  { header: "Time", cell: (row) => `${row.startTime} - ${row.endTime}` },
  { header: "Type", cell: (row) => (row.type === "pengepulan" ? "Pengepulan" : "Pencairan") },
  { header: "Description", accessorKey: "description" },
  {
    header: "Action",
    cell: (row) => (
      <div className="flex gap-2">
        <button className="text-brand-500 hover:text-brand-600" onClick={() => onEdit(row)}>Edit</button>
        <button className="text-error-500 hover:text-error-600" onClick={() => onDelete(row)}>Delete</button>
      </div>
    ),
  },
];

export default function ScheduleTable({type }: {  type: "pengepulan" | "pencairan" }) {
  const [rows, setRows] = useState<UIScheduleRow[]>([]); 
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editRow, setEditRow] = useState<UIScheduleRow | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleteRow, setDeleteRow] = useState<UIScheduleRow | null>(null);

  const fetchData = async (activeType: "pengepulan" | "pencairan", activePage: number, activeLimit: number) => {
    setLoading(true);
    setError(null);
    try {
      const [collectionsRes, withdrawsRes] = await Promise.all([
        rwService.getCollectionSchedules(activePage, activeLimit),
        rwService.getWithdrawSchedules(activePage, activeLimit),
      ]);

      const collectionsEnvelope: any = (collectionsRes as any);
      const collections: any[] = Array.isArray(collectionsEnvelope?.data?.data)
        ? collectionsEnvelope.data.data
        : Array.isArray(collectionsEnvelope?.data)
          ? collectionsEnvelope.data
          : Array.isArray(collectionsRes)
            ? (collectionsRes as any)
            : [];
      const withdrawsEnvelope: any = (withdrawsRes as any);
      const withdraws: any[] = Array.isArray(withdrawsEnvelope?.data?.data)
        ? withdrawsEnvelope.data.data
        : Array.isArray(withdrawsEnvelope?.data)
          ? withdrawsEnvelope.data
          : Array.isArray(withdrawsRes)
            ? (withdrawsRes as any)
            : [];

      const toHumanDate = (iso?: string) => {
        if (!iso) return "-";
        const d = new Date(iso);
        return isNaN(d.getTime()) ? "-" : d.toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' });
      };
      const toHumanTime = (iso?: string) => {
        if (!iso) return "-";
        const d = new Date(iso);
        return isNaN(d.getTime()) ? "-" : d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
      };

      const collectionRows: UIScheduleRow[] = collections.map((c: any) => {
        const d = new Date(c.date);
        return {
          id: c.schedule_id ?? c.id,
          title: c.title ?? '-',
          date: toHumanDate(c.date),
          dayName: isNaN(d.getTime()) ? '-' : dayNames[d.getDay()],
          startTime: toHumanTime(c.start_time),
          endTime: toHumanTime(c.end_time),
          description: c.description,
          type: "pengepulan",
          rawDate: c.date,
          rawStart: c.start_time,
          rawEnd: c.end_time,
        };
      });

      const withdrawRows: UIScheduleRow[] = withdraws.map((w: any) => {
        const d = new Date(w.date);
        return {
          id: w.withdraw_schedule_id ?? w.schedule_id ?? w.id,
          title: w.title ?? '-',
          date: toHumanDate(w.date),
          dayName: isNaN(d.getTime()) ? '-' : dayNames[d.getDay()],
          startTime: toHumanTime(w.start_time),
          endTime: toHumanTime(w.end_time),
          description: w.description ?? undefined,
          type: "pencairan",
          rawDate: w.date,
          rawStart: w.start_time,
          rawEnd: w.end_time,
        };
      });

      const finalRows = (activeType === "pengepulan" ? collectionRows : withdrawRows).sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
      );
      setRows(finalRows);
      const pagination = activeType === "pengepulan"
        ? (collectionsEnvelope?.data?.pagination ?? collectionsEnvelope?.pagination)
        : (withdrawsEnvelope?.data?.pagination ?? withdrawsEnvelope?.pagination);
      setTotalPages(pagination?.totalPages ?? 1);
    } catch (e: any) {
      console.error(e);
      setError(e?.message || "Unable to load schedules");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(type, page, limit);
  }, [type, page, limit]);

  // Listen for global refresh event dispatched by modal after create
  useEffect(() => {
    const handler = () => fetchData(type, page, limit);
    window.addEventListener('schedule-updated', handler);
    return () => window.removeEventListener('schedule-updated', handler);
  }, [type, page, limit]);

  const onEdit = (row: UIScheduleRow) => {
    setEditRow(row);
    setIsEditOpen(true);
  };
  const onDelete = (row: UIScheduleRow) => {
    setDeleteRow(row);
    setIsDeleteOpen(true);
  };
  const confirmDelete = async () => {
    if (!deleteRow) return;
    try {
      if (deleteRow.type === 'pengepulan') {
        await scheduleService.deleteCollection(deleteRow.id);
      } else {
        await scheduleService.deleteWithdraw(deleteRow.id);
      }
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('schedule-updated'));
      }
      setIsDeleteOpen(false);
      setDeleteRow(null);
    } catch (e: any) {
      alert(e?.response?.data?.message || e?.message || 'Gagal menghapus jadwal');
    }
  };


  if (loading) return <div className="p-4 text-center">Loading schedules...</div>;
  if (error)
    return (
      <EmptyState
        title="Failed to load schedules"
        description={error}
        action={<button className="btn btn-sm" onClick={() => window.location.reload()}>Retry</button>}
      />
    );
  if (!rows.length)
    return (
      <>
        <BasicTableOne columns={buildColumns(onEdit, onDelete)} data={[]} loading={false} emptyMessage="Data kosong / empty" />
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
        <EditScheduleModal
          isOpen={isEditOpen}
          onClose={() => setIsEditOpen(false)}
          type={editRow?.type ?? 'pengepulan'}
          scheduleId={editRow?.id ?? 0}
          initial={{
            title: editRow?.title ?? '',
            date: editRow?.rawDate ?? '',
            start_time: editRow?.rawStart ?? '',
            end_time: editRow?.rawEnd ?? '',
            description: editRow?.description ?? ''
          }}
          onSuccess={() => fetchData(type, page, limit)}
        />
        <Modal isOpen={isDeleteOpen} onClose={() => { setIsDeleteOpen(false); setDeleteRow(null); }} className="max-w-md">
          <div className="p-6">
            <h3 className="mb-3 text-lg font-semibold text-gray-800 dark:text-white">Hapus Jadwal</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">Anda yakin ingin menghapus jadwal <b>{deleteRow?.title}</b>? Tindakan ini tidak dapat dibatalkan.</p>
            <div className="mt-6 flex justify-end gap-3">
              <Button variant="outline" onClick={() => { setIsDeleteOpen(false); setDeleteRow(null); }}>Batal</Button>
              <Button onClick={confirmDelete}>Hapus</Button>
            </div>
          </div>
        </Modal>
      </>
    );
  return (
    <>
      <BasicTableOne columns={buildColumns(onEdit, onDelete)} data={rows} loading={false} />
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
      <EditScheduleModal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        type={editRow?.type ?? 'pengepulan'}
        scheduleId={editRow?.id ?? 0}
        initial={{
          title: editRow?.title ?? '',
          date: editRow?.rawDate ?? '',
          start_time: editRow?.rawStart ?? '',
          end_time: editRow?.rawEnd ?? '',
          description: editRow?.description ?? ''
        }}
        onSuccess={() => fetchData(type, page, limit)}
      />
      <Modal isOpen={isDeleteOpen} onClose={() => { setIsDeleteOpen(false); setDeleteRow(null); }} className="max-w-md">
        <div className="p-6">
          <h3 className="mb-3 text-lg font-semibold text-gray-800 dark:text-white">Hapus Jadwal</h3>
          <p className="text-sm text-gray-600 dark:text-gray-300">Anda yakin ingin menghapus jadwal <b>{deleteRow?.title}</b>? Tindakan ini tidak dapat dibatalkan.</p>
          <div className="mt-6 flex justify-end gap-3">
            <Button variant="outline" onClick={() => { setIsDeleteOpen(false); setDeleteRow(null); }}>Batal</Button>
            <Button onClick={confirmDelete}>Hapus</Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
