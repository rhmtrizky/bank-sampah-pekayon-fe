"use client";
import React, { useState, useEffect } from "react";
import Button from "@/components/ui/button/Button";
import Label from "@/components/form/Label";
import { transactionsService } from "@/services/transactions.service";
import { wargaService, Warga } from "@/services/warga.service";
import { WasteType } from "@/services/waste-types.service";
import { Modal } from "@/components/ui/modal";
import Input from "@/components/form/input/InputField";
import { useAppSelector } from "@/store/hooks";
import api from "@/lib/axios";
import { TrashBinIcon } from "@/icons";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function CreateOfflineTransactionModal({ isOpen, onClose, onSuccess }: Props) {
  const { user } = useAppSelector((s) => s.auth);
  const [userId, setUserId] = useState("");
  // Multiple items: each has waste_type_id and weight_kg
  const [items, setItems] = useState<Array<{ waste_type_id: string; weight_kg: string }>>([
    { waste_type_id: "", weight_kg: "" },
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Data for dropdowns/search
  const [wasteTypes, setWasteTypes] = useState<WasteType[]>([]);
  const [wargaList, setWargaList] = useState<Warga[]>([]);
  const [searchWarga, setSearchWarga] = useState("");
  const [isSearchingWarga, setIsSearchingWarga] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadWasteTypes();
    }
  }, [isOpen]);

  // Debounce search warga
  useEffect(() => {
    const timer = setTimeout(() => {
      if (isOpen) loadWarga(searchWarga);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchWarga, isOpen]);

  interface PriceList {
    price_id: number;
    waste_type_id: number;
    rw_id: number;
    kelurahan_id: number;
    buy_price: string;
    sell_price: string;
    effective_date: string;
    waste_type: {
      waste_type_id: number;
      name: string;
      description: string | null;
      created_at: string;
      updated_at: string;
    };
  }

  const loadWasteTypes = async () => {
    try {
      if (!user?.rw) {
        setWasteTypes([]);
        return;
      }
      const res = await api.get(`/price-list/rw/${user.rw}`);
      const data: PriceList[] = res?.data?.data ?? res?.data ?? [];
      const types: WasteType[] = (data || []).map((pl) => ({
        waste_type_id: pl.waste_type.waste_type_id,
        name: pl.waste_type.name,
        buy_price: parseFloat(pl.buy_price),
        description: pl.waste_type.description ?? null,
        created_at: pl.waste_type.created_at,
        updated_at: pl.waste_type.updated_at,
      }));
      setWasteTypes(types);
    } catch (e) {
      console.error("Failed to load waste types", e);
    }
  };

  const loadWarga = async (query: string) => {
    setIsSearchingWarga(true);
    try {
      // If query is empty, maybe load first 10? or just empty?
      // Let's load first 10 to show something
      const res = await wargaService.list({ name: query, limit: 10 });
      setWargaList(res.data || []);
    } catch (e) {
      console.error("Failed to search warga", e);
    } finally {
      setIsSearchingWarga(false);
    }
  };

  const reset = () => {
    setUserId("");
    setItems([{ waste_type_id: "", weight_kg: "" }]);
    setSearchWarga("");
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const uid = parseInt(userId, 10);
    const parsedItems = items
      .map((it) => ({
        waste_type_id: parseInt(it.waste_type_id, 10),
        weight_kg: parseFloat(it.weight_kg),
      }))
      .filter((it) => !!it.waste_type_id && !!it.weight_kg && it.weight_kg > 0);

    if (!uid || parsedItems.length === 0) {
      setError("User wajib dipilih dan minimal 1 item dengan berat > 0");
      return;
    }
    try {
      setLoading(true);
      // Backend expects: { user_id, items: [{ waste_type_id, weight_kg }, ...] }
      await api.post('/transactions/offline', { user_id: uid, items: parsedItems });
      onSuccess();
      reset();
      onClose();
    } catch (e: any) {
      setError(e?.response?.data?.message || e?.message || "Gagal membuat transaksi");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={() => { reset(); onClose(); }} className="max-w-[600px] p-5 lg:p-10">
      <h4 className="mb-6 text-xl font-semibold text-gray-800 dark:text-white">Tambah Transaksi Offline</h4>
      {error && (
        <div className="mb-4 rounded border border-red-300 bg-red-50 p-3 text-sm text-red-600 dark:border-red-600/40 dark:bg-red-900/30">
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label>Cari Warga</Label>
          <Input
            type="text"
            value={searchWarga}
            onChange={(e) => setSearchWarga(e.target.value)}
            placeholder="Ketik nama warga..."
            className="mb-2"
          />
          {/* Simple dropdown simulation for Warga selection */}
          <div className="max-h-40 overflow-y-auto rounded border border-gray-200 bg-white p-2 dark:border-gray-700 dark:bg-gray-800">
            {isSearchingWarga ? (
              <p className="text-xs text-gray-500">Mencari...</p>
            ) : wargaList.length === 0 ? (
              <p className="text-xs text-gray-500">Tidak ditemukan.</p>
            ) : (
              wargaList.map((w) => (
                <div
                  key={w.user_id}
                  onClick={() => {
                    setUserId(String(w.user_id));
                    setSearchWarga(w.name); // Set input to selected name
                  }}
                  className={`cursor-pointer rounded p-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 ${
                    userId === String(w.user_id) ? "bg-brand-50 text-brand-600 dark:bg-brand-900/20 dark:text-brand-400" : "text-gray-700 dark:text-gray-300"
                  }`}
                >
                  {w.name} <span className="text-xs text-gray-400">({w.phone})</span>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="space-y-4">
          <Label>Item Tipe Sampah & Berat</Label>
          {items.map((item, idx) => (
            <div key={idx} className="grid grid-cols-1 gap-3 sm:grid-cols-12">
              <div className="sm:col-span-6">
                <select
                  value={item.waste_type_id}
                  onChange={(e) => {
                    const next = [...items];
                    next[idx].waste_type_id = e.target.value;
                    setItems(next);
                  }}
                  className="w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 outline-none focus:border-brand-300 focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:focus:border-brand-800"
                >
                  <option value="">Pilih Tipe Sampah</option>
                  {wasteTypes.map((wt) => (
                    <option key={wt.waste_type_id} value={wt.waste_type_id}>
                      {wt.name} ({wt.buy_price}/kg)
                    </option>
                  ))}
                </select>
              </div>
              <div className="sm:col-span-4 ">
                <Input
                  type="number"
                  step={0.01}
                  min='0.01'
                  value={item.weight_kg}
                  onChange={(e) => {
                    const next = [...items];
                    next[idx].weight_kg = e.target.value;
                    setItems(next);
                  }}
                  placeholder="Berat (kg)"
                />
              </div>
              <div className="sm:col-span-2 flex items-center justify-end">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const next = items.filter((_, i) => i !== idx);
                    setItems(next.length ? next : [{ waste_type_id: "", weight_kg: "" }]);
                  }}
                >
                  <TrashBinIcon />
                </Button>
              </div>
            </div>
          ))}
          <div className="flex justify-end">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setItems([...items, { waste_type_id: "", weight_kg: "" }])}
            >
              + Tambah Item
            </Button>
          </div>
        </div>
        <div className="flex justify-end gap-3 pt-2">
          <Button type="button" variant="outline" onClick={() => { reset(); onClose(); }}>Batal</Button>
          <Button type="submit" disabled={loading}>{loading ? "Menyimpan..." : "Simpan"}</Button>
        </div>
      </form>
    </Modal>
  );
}
