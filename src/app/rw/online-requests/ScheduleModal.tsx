"use client";
import React, { useState } from "react";
import { Modal } from "@/components/ui/modal";
import Button from "@/components/ui/button/Button";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
import api from "@/lib/axios";

interface ScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  requestId: number;
  onSuccess: () => void;
}

export default function ScheduleModal({
  isOpen,
  onClose,
  requestId,
  onSuccess,
}: ScheduleModalProps) {
  const [scheduledDate, setScheduledDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!scheduledDate) {
      setError("Scheduled date is required");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Convert datetime-local to ISO 8601 string
      const isoDate = new Date(scheduledDate).toISOString();
      
      await api.patch(`/deposit-request/${requestId}/schedule`, {
        scheduled_date: isoDate,
      });
      onSuccess();
      onClose();
      setScheduledDate("");
    } catch (err: any) {
      console.error(err);
      setError(
        err?.response?.data?.message || err?.message || "Failed to schedule request"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setScheduledDate("");
      setError(null);
      onClose();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} className="max-w-[600px] p-5 lg:p-10">
      <h4 className="font-semibold text-gray-800 mb-7 text-title-sm dark:text-white/90">
        Jadwal Pengepulan
      </h4>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="rounded-lg bg-red-50 p-4 text-sm text-red-800 dark:bg-red-900/20 dark:text-red-400">
            {error}
          </div>
        )}

        <div>
          <Label>
            Jadwal Tanggal & Waktu <span className="text-error-500">*</span>
          </Label>
          <Input
            type="datetime-local"
            value={scheduledDate}
            onChange={(e) => setScheduledDate(e.target.value)}
            required
            disabled={loading}
            min={new Date().toISOString().slice(0, 16)}
          />
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            Pilih tanggal dan waktu pengepulan sampah.
          </p>
        </div>

        <div className="flex items-center justify-end w-full gap-3 mt-8">
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={handleClose}
            disabled={loading}
          >
            Batal
          </Button>
          <Button type="submit" size="sm" disabled={loading}>
            {loading ? "Menjadwalkan..." : "Jadwalkan"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
