"use client";
import React, { useState } from "react";
import { Modal } from "@/components/ui/modal";
import Input from "@/components/form/input/InputField";
import Button from "@/components/ui/button/Button";
import { scheduleService } from "@/services/schedule.service";

export type ScheduleType = "pengepulan" | "pencairan";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  type: ScheduleType;
  onSuccess?: () => void;
}

const toISODateAtMidnight = (dateStr: string) => {
  if (!dateStr) return "";
  // Expect YYYY-MM-DD, convert to YYYY-MM-DDT00:00:00.000Z
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
    return `${dateStr}T00:00:00.000Z`;
  }
  // If already ISO, return as is
  return dateStr;
};

export default function ScheduleModal({ isOpen, onClose, type, onSuccess }: Props) {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [description, setDescription] = useState<string | "">("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      // Build ISO datetime strings
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
      // Validate end > start on client
      if (!(new Date(payload.end_time) > new Date(payload.start_time))) {
        setError("End time harus lebih besar dari start time");
        setSubmitting(false);
        return;
      }
      if (type === "pengepulan") {
        await scheduleService.createCollection(payload);
      } else {
        await scheduleService.createWithdraw(payload);
      }
      // Dispatch global event so tables can listen and refetch
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('schedule-updated'));
      }
      onClose();
      onSuccess?.();
      // reset
      setTitle("");
      setDate("");
      setStartTime("");
      setEndTime("");
      setDescription("");
    } catch (e: any) {
      setError(e?.response?.data?.message || e?.message || "Gagal membuat jadwal");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-[600px] p-5 lg:p-10">
      <form onSubmit={handleSubmit} className="p-6 space-y-4">
        <div className="text-lg font-semibold">Tambah Jadwal {type === "pengepulan" ? "Pengepulan" : "Pencairan"}</div>
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
