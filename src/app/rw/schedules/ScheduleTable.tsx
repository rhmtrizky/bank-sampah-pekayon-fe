"use client";
import React, { useEffect, useState } from "react";
import BasicTableOne, { Column } from "@/components/tables/BasicTableOne";
import { rwService } from "@/services/rw.service";
import { CollectionSchedule, WithdrawSchedule } from "@/types/entities";
import EmptyState from "@/components/common/EmptyState";

interface UIScheduleRow {
  id: number; // unified id for DataTable
  date: string;
  dayName: string;
  startTime: string;
  endTime: string;
  description?: string;
  type: "collection" | "withdraw";
}

const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const columns: Column<UIScheduleRow>[] = [
  { header: "Day", accessorKey: "dayName" },
  { header: "Date", accessorKey: "date" },
  { header: "Time", cell: (row) => `${row.startTime} - ${row.endTime}` },
  { header: "Type", cell: (row) => (row.type === "collection" ? "Collection" : "Withdraw") },
  { header: "Description", accessorKey: "description" },
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

export default function ScheduleTable({ rwId }: { rwId: number }) {
  const [rows, setRows] = useState<UIScheduleRow[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        // Use explicit assertion instead of generic to avoid TSX generic parsing issues (<[ ... ]>)
        const [collections, withdraws] = await Promise.all([
          rwService.getCollectionSchedules(),
          rwService.getWithdrawSchedules(),
        ]) as [CollectionSchedule[], WithdrawSchedule[]];

        const collectionRows: UIScheduleRow[] = collections
          .filter((c) => (c.rw_id ?? rwId) === rwId) // safety: if rw_id missing assume current
          .map((c) => {
            const d = new Date(c.date);
            return {
              id: c.schedule_id,
              date: c.date,
              dayName: dayNames[d.getDay()],
              startTime: c.start_time,
              endTime: c.end_time,
              description: c.description,
              type: "collection",
            };
          });

        const withdrawRows: UIScheduleRow[] = withdraws
          .filter((w) => (w.rw_id ?? rwId) === rwId)
          .map((w) => {
            const d = new Date(w.date);
            return {
              id: w.withdraw_schedule_id,
              date: w.date,
              dayName: dayNames[d.getDay()],
              startTime: w.start_time,
              endTime: w.end_time,
              description: undefined,
              type: "withdraw",
            };
          });

        const merged = [...collectionRows, ...withdrawRows].sort(
          (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
        );
        setRows(merged);
      } catch (e: any) {
        console.error(e);
        setError(e?.message || "Unable to load schedules");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [rwId]);

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
      <EmptyState
        title="No schedules"
        description="Belum ada jadwal pengambilan atau penarikan."
        action={<button className="btn btn-sm">Add Schedule</button>}
      />
    );
  return <BasicTableOne columns={columns} data={rows} loading={false} />;
}
