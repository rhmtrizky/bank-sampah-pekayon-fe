"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import BasicTableOne, { Column } from "@/components/tables/BasicTableOne";
import Button from "@/components/ui/button/Button";
import api from "@/lib/axios";

type WargaDetail = {
  user: {
    user_id: number;
    name: string;
    email?: string | null;
    phone: string;
    alamat?: string | null;
    role?: string;
    rt?: number | null;
    rw?: number | null;
    kelurahan_id?: number | null;
    created_at?: string;
    updated_at?: string;
  };
  wallet?: { balance?: string | number } | null;
  transactions: Array<{
    transaction_id: number;
    waste_type_name?: string;
    weight_kg?: string | number;
    price_per_kg?: string | number;
    total_amount?: string | number;
    transaction_method?: string;
    created_at?: string;
  }>;
};

export default function WargaDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = Number(params?.id);

  const [detail, setDetail] = useState<WargaDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDetail = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await api.get(`/rw/warga/${id}`);
        const env = res?.data?.data ?? res?.data ?? res;
        const payload: WargaDetail = {
          user: env?.user ?? {},
          wallet: env?.wallet ?? null,
          transactions: env?.transactions ?? [],
        } as WargaDetail;
        setDetail(payload);
      } catch (e: any) {
        setError(e?.response?.data?.message || e?.message || "Gagal memuat detail warga");
      } finally {
        setLoading(false);
      }
    };
    if (!Number.isNaN(id)) fetchDetail();
  }, [id]);

  const columns: Column<WargaDetail["transactions"][number]>[] = [
    {
      header: "Tanggal",
      cell: (row) => (row.created_at ? new Date(row.created_at).toLocaleString("id-ID") : "-"),
    },
    {
      header: "Jenis Sampah",
      accessorKey: "waste_type_name",
    },
    {
      header: "Berat (kg)",
      cell: (row) => Number(row.weight_kg || 0).toLocaleString(),
    },
    {
      header: "Harga/kg",
      cell: (row) => `Rp ${Number(row.price_per_kg || 0).toLocaleString()}`,
    },
    {
      header: "Total",
      cell: (row) => `Rp ${Number(row.total_amount || 0).toLocaleString()}`,
    },
    {
      header: "Metode",
      accessorKey: "transaction_method",
    },
  ];

  const balance = Number(detail?.wallet?.balance || 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <PageBreadcrumb pageTitle="Detail Warga" />
        <Button variant="outline" size="sm" onClick={() => router.back()}>
          ← Kembali
        </Button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center p-12">
          <div className="text-center">
            <div className="mb-3 h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-brand-500 mx-auto"></div>
            <div className="text-sm text-gray-500">Memuat detail warga...</div>
          </div>
        </div>
      ) : error ? (
        <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-red-700 dark:border-red-500/30 dark:bg-red-500/10">
          <div className="mb-3 text-lg font-semibold">⚠️ Gagal Memuat Data</div>
          <div className="mb-4 text-sm">{error}</div>
          <Button size="sm" onClick={() => router.refresh()}>Coba Lagi</Button>
        </div>
      ) : !detail ? (
        <div className="rounded-xl border border-gray-200 bg-white p-12 text-center dark:border-white/[0.05] dark:bg-white/[0.03]">
          <div className="text-gray-500">Data tidak ditemukan</div>
        </div>
      ) : (
        <>
          {/* Profile Card */}
          <div className="rounded-xl border border-gray-200 bg-gradient-to-br from-white to-gray-50 p-6 shadow-sm dark:border-white/[0.05] dark:from-white/[0.03] dark:to-white/[0.01]">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
              {/* User Info */}
              <div className="flex-1 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-500/10 text-xl font-bold text-brand-600 dark:bg-brand-500/20 dark:text-brand-400">
                    {detail.user.name?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{detail.user.name}</h2>
                    <div className="text-sm text-gray-500 dark:text-white/60">ID: {detail.user.user_id}</div>
                  </div>
                </div>
                
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-gray-500">📱</span>
                    <span className="font-medium text-gray-700 dark:text-white/80">{detail.user.phone}</span>
                  </div>
                  {detail.user.email && (
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-gray-500">📧</span>
                      <span className="font-medium text-gray-700 dark:text-white/80">{detail.user.email}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-gray-500">📍</span>
                    <span className="text-gray-700 dark:text-white/80">{detail.user.alamat || "-"}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-gray-500">🏘️</span>
                    <span className="text-gray-700 dark:text-white/80">
                      {detail.user.rt ? `RT ${detail.user.rt}` : ""} {detail.user.rw ? `/ RW ${detail.user.rw}` : ""}
                    </span>
                  </div>
                </div>

                {detail.user.created_at && (
                  <div className="text-xs text-gray-500">
                    Bergabung sejak {new Date(detail.user.created_at).toLocaleDateString("id-ID", { day: 'numeric', month: 'long', year: 'numeric' })}
                  </div>
                )}
              </div>

              {/* Balance Card */}
              <div className="rounded-xl border border-brand-200 bg-gradient-to-br from-brand-50 to-brand-100 p-5 shadow-sm dark:border-brand-500/20 dark:from-brand-500/10 dark:to-brand-500/5 lg:min-w-[240px]">
                <div className="mb-2 text-xs font-medium uppercase tracking-wide text-brand-700 dark:text-brand-300">
                  💰 Saldo Sekarang
                </div>
                <div className="text-3xl font-bold text-brand-900 dark:text-brand-200">
                  Rp {balance.toLocaleString('id-ID')}
                </div>
                <div className="mt-2 text-xs text-brand-600 dark:text-brand-400">
                  {detail.transactions.length} transaksi tercatat
                </div>
              </div>
            </div>
          </div>

          {/* Transaction Stats */}
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-white/[0.05] dark:bg-white/[0.03]">
              <div className="text-xs text-gray-500 mb-1">Total Transaksi</div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">{detail.transactions.length}</div>
            </div>
            <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-white/[0.05] dark:bg-white/[0.03]">
              <div className="text-xs text-gray-500 mb-1">Total Berat (kg)</div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {detail.transactions.reduce((sum, t) => sum + Number(t.weight_kg || 0), 0).toFixed(2)}
              </div>
            </div>
            <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-white/[0.05] dark:bg-white/[0.03]">
              <div className="text-xs text-gray-500 mb-1">Total Pendapatan</div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                Rp {detail.transactions.reduce((sum, t) => sum + Number(t.total_amount || 0), 0).toLocaleString('id-ID')}
              </div>
            </div>
          </div>

          {/* Transactions Table */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">📊 Riwayat Transaksi</h3>
            </div>
            <div className="rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
              <BasicTableOne
                columns={columns}
                data={detail.transactions || []}
                emptyMessage="Belum ada transaksi tercatat"
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
