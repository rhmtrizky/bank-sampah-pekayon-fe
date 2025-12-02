"use client";
import React, { useEffect, useState } from "react";
import { Modal } from "@/components/ui/modal";
import Input from "@/components/form/input/InputField";
import Button from "@/components/ui/button/Button";
import { pengepulService, PengepulPayload } from "@/services/pengepul.service";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  initial: { pengepul_id: number; name: string; phone: string; address?: string | null } | null;
}

export default function EditPengepulModal({ isOpen, onClose, onSuccess, initial }: Props) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  console.log("EditPengepulModal initial:", initial);

  useEffect(() => {
    setName(initial?.name || "");
    setPhone(initial?.phone || "");
    setAddress(initial?.address || "");
  }, [initial]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!initial) return;
    setSubmitting(true);
    setError(null);
    try {
      const payload: PengepulPayload = { name, phone, address: address || null };
      if (!payload.name || !payload.phone) {
        throw new Error("Nama dan nomor telepon wajib diisi");
      }
      await pengepulService.update(initial.pengepul_id, payload);
      onClose();
      onSuccess?.();
    } catch (e: any) {
      setError(e?.response?.data?.message || e?.message || "Gagal mengubah pengepul");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-[600px] p-5 lg:p-10">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="text-lg font-semibold">Edit Pengepul</div>
        {error && <div className="text-red-600 text-sm">{error}</div>}
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Nama</label>
          <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Nama perusahaan/pengepul" />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">No. Telepon</label>
          <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="08xxxx" />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Alamat</label>
          <Input value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Alamat (opsional)" />
        </div>
        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onClose}>Batal</Button>
          <Button type="submit" disabled={submitting}>{submitting ? "Menyimpan..." : "Simpan"}</Button>
        </div>
      </form>
    </Modal>
  );
}
