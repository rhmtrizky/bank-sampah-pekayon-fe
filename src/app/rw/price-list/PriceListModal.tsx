import React, { useEffect, useState } from "react";
import { Modal } from "@/components/ui/modal";
import Button from "@/components/ui/button/Button";
import Input from "@/components/form/input/InputField";
import { priceListService, CreatePriceListDto, UpdatePriceListDto } from "@/services/price-list.service";
import { wasteTypesService } from "@/services/waste-types.service";
import { PriceListEntry } from "@/types/entities";


interface PriceListModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: (entry: PriceListEntry) => void;
  rwId: number;
  mode: "create" | "edit";
  initialData?: PriceListEntry;
}

const PriceListModal = ({ open, onClose, onSuccess, rwId, mode, initialData }: PriceListModalProps) => {

  const [wasteTypes, setWasteTypes] = useState<{ id: number; name: string; }[]>([]);
  const [form, setForm] = useState<CreatePriceListDto | UpdatePriceListDto>({
    waste_type_id: initialData?.waste_type_id || 0,
    buy_price: initialData?.buy_price || 0,
    sell_price: initialData?.sell_price || 0,
    effective_date: initialData?.effective_date || "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    wasteTypesService.list().then((data) => {
      setWasteTypes(data.map(wt => ({
        id: wt.waste_type_id,
        name: wt.name,
      })));
    });
  }, []);

  useEffect(() => {
    if (mode === "edit" && initialData) {
      setForm({
        buy_price: initialData.buy_price,
        sell_price: initialData.sell_price,
        effective_date: initialData.effective_date,
      });
    } else {
      setForm({ waste_type_id: 0, buy_price: 0, sell_price: 0, effective_date: "" });
    }
  }, [mode, initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: name === "waste_type_id" || name.includes("price") ? Number(value) : value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      let entry: PriceListEntry;
      let effective_date = form.effective_date;
      // If only a date (YYYY-MM-DD), append time for ISO string
      if (effective_date && /^\d{4}-\d{2}-\d{2}$/.test(effective_date)) {
        effective_date = effective_date + 'T00:00:00.000Z';
      }
      if (mode === "create") {
        const { waste_type_id, buy_price, sell_price } = form as CreatePriceListDto;
        entry = await priceListService.create({ waste_type_id, buy_price, sell_price, effective_date });
      } else {
        entry = await priceListService.update(initialData!.price_id, { ...form, effective_date });
      }
      onSuccess(entry);
      onClose();
    } catch (err: any) {
      setError(err?.message || "Gagal menyimpan data");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={open} onClose={onClose} className="max-w-[600px] p-5 lg:p-10">
        <div className="mb-4 font-semibold text-lg">{mode === "create" ? "Tambah Harga" : "Edit Harga"}</div>
      <form onSubmit={handleSubmit} className="space-y-4">
        {mode === "create" && (
          <div className="sm:col-span-6">
            <label className="block mb-1">Tipe Sampah</label>
            <select
              name="waste_type_id"
              value={(form as CreatePriceListDto).waste_type_id}
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 outline-none focus:border-brand-300 focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:focus:border-brand-800"
            >
              <option value="">Pilih Tipe Sampah</option>
              {wasteTypes.map((wt) => (
                <option key={wt.id} value={wt.id}>
                  {wt.name}
                </option>
              ))}
            </select>
          </div>
        )}
        <div>
          <label className="block mb-1">Harga Jual</label>
          <Input type="number" name="buy_price" value={form.buy_price} onChange={handleChange} required min={"0"} />
        </div>
        <div>
          <label className="block mb-1">Harga Beli</label>
          <Input type="number" name="sell_price" value={form.sell_price} onChange={handleChange} required min={"0"} />
        </div>
        <div>
          <label className="block mb-1">Tanggal Efektif</label>
          <Input type="date" name="effective_date" value={form.effective_date?.slice(0, 10) || ""} onChange={handleChange} />
        </div>
        {error && <div className="text-red-500 text-sm">{error}</div>}
        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onClose}>Batal</Button>
          <Button type="submit" variant="primary" disabled={loading}>{loading ? 'Menyimpan...' : (mode === "create" ? "Tambah" : "Simpan")}</Button>
        </div>
      </form>
    </Modal>
  );
}

export default PriceListModal;
