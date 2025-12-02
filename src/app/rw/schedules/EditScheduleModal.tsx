"use client";
import React, { useEffect, useState } from "react";
import { Modal } from "@/components/ui/modal";
import Input from "@/components/form/input/InputField";
import Button from "@/components/ui/button/Button";
import { scheduleService } from "@/services/schedule.service";

export type ScheduleType = "pengepulan" | "pencairan";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  type: ScheduleType;
  scheduleId: number;
  initial: {
    title: string;
    date: string; // ISO
    start_time: string; // ISO
    end_time: string; // ISO
    description?: string | null;
  };
  onSuccess?: () => void;
}

const toISODateAtMidnight = (dateStr: string) => {
  if (!dateStr) return "";
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return `${dateStr}T00:00:00.000Z`;
  return dateStr;
};

const pad = (n: number) => (n < 10 ? `0${n}` : `${n}`);
const formatForDateInput = (iso?: string) => {
  if (!iso) return "";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "";
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
};
const formatForDateTimeLocal = (iso?: string) => {
  if (!iso) return "";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "";
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

export default function EditScheduleModal({ isOpen, onClose, type, scheduleId, initial, onSuccess }: Props) {
  const [title, setTitle] = useState(initial.title || "");
  const [date, setDate] = useState(formatForDateInput(initial.date));
  const [startTime, setStartTime] = useState(formatForDateTimeLocal(initial.start_time));
  const [endTime, setEndTime] = useState(formatForDateTimeLocal(initial.end_time));
  const [description, setDescription] = useState<string | "">(initial.description || "");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // sync when initial changes
    setTitle(initial.title || "");
    setDate(formatForDateInput(initial.date));
    setStartTime(formatForDateTimeLocal(initial.start_time));
    setEndTime(formatForDateTimeLocal(initial.end_time));
    setDescription(initial.description || "");
  }, [initial]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const payload = {
        title,
        date: toISODateAtMidnight(date),
        start_time: startTime ? new Date(startTime).toISOString() : "",
        end_time: endTime ? new Date(endTime).toISOString() : "",
        description: description || null,
      };
      if (!payload.title || !payload.date || !payload.start_time || !payload.end_time) {
        throw new Error("Lengkapi semua field wajib");
      }
      if (!(new Date(payload.end_time) > new Date(payload.start_time))) {
        setError("End time harus lebih besar dari start time");
        setSubmitting(false);
        return;
      }
      if (type === "pengepulan") {
        await scheduleService.updateCollection(scheduleId, payload);
      } else {
        await scheduleService.updateWithdraw(scheduleId, payload);
      }
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('schedule-updated'));
      }
      onClose();
      onSuccess?.();
    } catch (e: any) {
      setError(e?.response?.data?.message || e?.message || "Gagal mengubah jadwal");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-[600px] p-5 lg:p-10">
      <form onSubmit={handleSubmit} className="p-6 space-y-4">
        <div className="text-lg font-semibold">Edit Jadwal {type === "pengepulan" ? "Pengepulan" : "Pencairan"}</div>
        {error && <div className="text-red-600 text-sm">{error}</div>}
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Judul</label>
          <Input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Judul" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Tanggal</label>
            <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Waktu Mulai</label>
            <Input type="datetime-local" value={startTime} onChange={(e) => setStartTime(e.target.value)} />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Waktu Selesai</label>
            <Input type="datetime-local" value={endTime} onChange={(e) => setEndTime(e.target.value)} />
          </div>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Deskripsi (opsional)</label>
          <Input type="text" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Deskripsi" />
        </div>
        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onClose}>Batal</Button>
          <Button type="submit" disabled={submitting}>{submitting ? "Menyimpan..." : "Simpan"}</Button>
        </div>
      </form>
    </Modal>
  );
}
