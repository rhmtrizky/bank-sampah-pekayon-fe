"use client";
import React, { useState } from "react";
import Button from "@/components/ui/button/Button";
import Label from "@/components/form/Label";
import { wargaService } from "@/services/warga.service";
import { Modal } from "@/components/ui/modal";
import Input from "@/components/form/input/InputField";
import { useAppSelector } from "@/store/hooks";
import { EyeCloseIcon, EyeIcon } from "@/icons";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function CreateWargaModal({ isOpen, onClose, onSuccess }: Props) {
  const { user } = useAppSelector((state) => state.auth);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [alamat, setAlamat] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rt, setRt] = useState("");
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const reset = () => {
    setName("");
    setEmail("");
    setPhone("");
    setAlamat("");
    setPassword("");
    setRt("");
    setError(null);
  };

  const generatePassword = async () => {
    if (!user?.rw) {
      setError("Data RW user tidak ditemukan.");
      return;
    }
    setGenerating(true);
    try {
      // Fetch 1 item just to get totalItems from pagination
      const res = await wargaService.list({ limit: 1 });
      const count = (res.pagination?.totalItems || 0) + 1;
      // Format: wargarw{nomorrw}#{idkeberapa}
      // Pad RW number with 0 if needed? The request said "wargarw{nomorrw}"
      // Assuming nomorrw is just the number.
      const rwNum = String(user.rw).padStart(2, '0');
      const newPass = `wargarw${rwNum}#${count}`;
      setPassword(newPass);
    } catch (e) {
      console.error("Failed to generate password", e);
      setError("Gagal generate password");
    } finally {
      setGenerating(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name || !phone || !password) {
      setError("Nama, No. HP, dan Password wajib diisi.");
      return;
    }

    if (name.length < 3) {
      setError("Nama minimal 3 karakter.");
      return;
    }

    if (phone.length < 6) {
      setError("No. HP minimal 6 karakter.");
      return;
    }

    if (password.length < 6) {
      setError("Password minimal 6 karakter.");
      return;
    }

    try {
      setLoading(true);
      await wargaService.create({
        name,
        email: email || null,
        phone,
        alamat: alamat || null,
        password,
        rt: rt ? parseInt(rt, 10) : null,
      });
      onSuccess();
      reset();
      onClose();
    } catch (e: any) {
      setError(e?.response?.data?.message || e?.message || "Gagal membuat warga");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-lg">
      <div className="p-6">
        <h3 className="mb-4 text-lg font-semibold text-gray-800 dark:text-white">
          Tambah Warga Baru
        </h3>
        {error && (
          <div className="mb-4 rounded bg-red-50 p-3 text-sm text-red-500 dark:bg-red-900/20 dark:text-red-400">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>Nama Lengkap *</Label>
            <Input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nama warga"
              className="w-full"
            />
          </div>

          <div>
            <Label>Email (Opsional)</Label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="email@example.com"
              className="w-full"
            />
          </div>

          <div>
            <Label>No. HP *</Label>
            <Input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="0812..."
              className="w-full"
            />
          </div>

          <div>
            <Label>Alamat (Opsional)</Label>
            <Input
              type="text"
              value={alamat}
              onChange={(e) => setAlamat(e.target.value)}
              placeholder="Alamat lengkap"
              className="w-full"
            />
          </div>

          <div>
            <Label>RT (Opsional)</Label>
            <Input
              type="number"
              value={rt}
              onChange={(e) => setRt(e.target.value)}
              placeholder="Nomor RT"
              className="w-full"
            />
          </div>

          <div>
            <div className="flex items-center justify-between">
              <Label>Password *</Label>
              <button
                type="button"
                onClick={generatePassword}
                disabled={generating}
                className="text-xs text-brand-500 hover:underline disabled:opacity-50"
              >
                {generating ? "Generating..." : "Generate Password"}
              </button>
            </div>
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimal 6 karakter"
                className="w-full pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                {showPassword ? <EyeIcon className="size-5" /> : <EyeCloseIcon className="size-5" />}
              </button>
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <Button variant="outline" onClick={onClose} type="button">
              Batal
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Menyimpan..." : "Simpan"}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
