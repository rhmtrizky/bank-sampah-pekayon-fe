"use client";
import React, { useEffect, useState } from "react";
import Button from "@/components/ui/button/Button";
import Label from "@/components/form/Label";
import { transactionsService, Transaction } from "@/services/transactions.service";
import Input from "@/components/form/input/InputField";
import { Modal } from "@/components/ui/modal";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  transactionId: number | null;
  onSuccess: () => void;
}

export default function EditTransactionModal({ isOpen, onClose, transactionId, onSuccess }: Props) {
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [wasteTypeId, setWasteTypeId] = useState("");
  const [weightKg, setWeightKg] = useState("");

  useEffect(() => {
    const load = async () => {
      if (!transactionId || !isOpen) return;
      setFetching(true);
      setError(null);
      try {
        const trx: Transaction = await transactionsService.get(transactionId);
        setWasteTypeId(String(trx.waste_type_id));
        setWeightKg(String(trx.weight_kg));
      } catch (e: any) {
        setError(e?.response?.data?.message || e?.message || "Gagal memuat transaksi");
      } finally {
        setFetching(false);
      }
    };
    load();
  }, [transactionId, isOpen]);

  const reset = () => {
    setWasteTypeId("");
    setWeightKg("");
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!transactionId) return;
    setError(null);
    const wid = parseInt(wasteTypeId, 10);
    const w = parseFloat(weightKg);
    if (!wid || !w || w <= 0) {
      setError("Waste type dan berat harus valid");
      return;
    }
    try {
      setLoading(true);
      await transactionsService.update(transactionId, { waste_type_id: wid, weight_kg: w });
      onSuccess();
      reset();
      onClose();
    } catch (e: any) {
      setError(e?.response?.data?.message || e?.message || "Gagal mengubah transaksi");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={() => { reset(); onClose(); }} className="max-w-[600px] p-5 lg:p-10">
      <h4 className="mb-6 text-xl font-semibold text-gray-800 dark:text-white">Edit Transaksi</h4>
      {error && (
        <div className="mb-4 rounded border border-red-300 bg-red-50 p-3 text-sm text-red-600 dark:border-red-600/40 dark:bg-red-900/30">
          {error}
        </div>
      )}
      {fetching ? (
        <div className="p-4 text-center text-sm">Memuat data...</div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>Waste Type ID</Label>
            <Input type="number" value={wasteTypeId} onChange={(e) => setWasteTypeId(e.target.value)} />
          </div>
          <div>
            <Label>Berat (kg)</Label>
            <Input type="number" step={0.01} min="0.01" value={weightKg} onChange={(e) => setWeightKg(e.target.value)} />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="outline" onClick={() => { reset(); onClose(); }}>Batal</Button>
            <Button type="submit" disabled={loading}>{loading ? "Menyimpan..." : "Simpan Perubahan"}</Button>
          </div>
        </form>
      )}
    </Modal>
  );
}
