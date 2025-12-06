"use client";
import React, { useEffect, useState } from "react";
import { Modal } from "@/components/ui/modal";
import Input from "@/components/form/input/InputField";
import Button from "@/components/ui/button/Button";
import { wasteTypesService } from "@/services/waste-types.service";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  initial: { waste_type_id: number; name: string; description?: string | null } | null;
}

export default function EditWasteTypeModal({ isOpen, onClose, onSuccess, initial }: Readonly<Props>) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setName(initial?.name || "");
    setDescription(initial?.description || "");
  }, [initial]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!initial) return;
    setSubmitting(true);
    setError(null);
    try {
      if (!name.trim()) throw new Error("Nama wajib diisi");
      await wasteTypesService.update(initial.waste_type_id, { name: name.trim(), description: description || null });
      onClose();
      onSuccess?.();
    } catch (e: any) {
      setError(e?.response?.data?.message || e?.message || "Gagal mengubah waste type");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-[600px] p-5 lg:p-10">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="text-lg font-semibold">Edit Waste Type</div>
        {error && <div className="text-red-600 text-sm">{error}</div>}
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Nama</label>
          <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Nama waste type" />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Deskripsi</label>
          <Input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Deskripsi (opsional)" />
        </div>
        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onClose}>Batal</Button>
          <Button type="submit" disabled={submitting}>{submitting ? "Menyimpan..." : "Simpan"}</Button>
        </div>
      </form>
    </Modal>
  );
}
