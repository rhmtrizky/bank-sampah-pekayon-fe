"use client";
import React, { useEffect, useState } from "react";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import BasicTableOne, { Column } from "@/components/tables/BasicTableOne";
import Button from "@/components/ui/button/Button";
import Pagination from "@/components/tables/Pagination";
import EmptyState from "@/components/common/EmptyState";
import { wargaService, Warga } from "@/services/warga.service";
import CreateWargaModal from "./CreateWargaModal";
import { useRouter } from "next/navigation";

interface UIWarga extends Warga {
  id: number;
}

export default function WargaManagementPage() {
  const router = useRouter();
  const [warga, setWarga] = useState<UIWarga[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [limit, setLimit] = useState(10);

  const fetchWarga = async (overrideParams?: { name?: string; phone?: string; page?: number }) => {
    setLoading(true);
    setError(null);
    try {
      const p = overrideParams?.page ?? page;
      const n = overrideParams?.name ?? name;
      const ph = overrideParams?.phone ?? phone;
      
      const result = await wargaService.list({
        page: p,
        limit: limit,
        name: n,
        phone: ph,
      });
      const mapped = (result.data || []).map((w) => ({ ...w, id: w.user_id }));
      setWarga(mapped);
      setTotalPages(result.pagination?.totalPages || 1);
    } catch (e: any) {
      setError(e?.response?.data?.message || e?.message || "Gagal memuat data warga");
    } finally {
      setLoading(false);
    }
  };

  // Initial load and page change
  useEffect(() => {
    fetchWarga();
  }, [page]);

  const onSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchWarga({ page: 1 });
  };

  const onReset = () => {
    setName("");
    setPhone("");
    setPage(1);
    fetchWarga({ name: "", phone: "", page: 1 });
  };


  const columns: Column<UIWarga>[] = [
    {
      header: "Nama",
      accessorKey: "name",
      cell: (row) => (
        <div>
          <p className="font-medium text-gray-800 dark:text-white/90">{row.name}</p>
        </div>
      ),
    },
    {
      header: "Kontak",
      cell: (row) => (
        <div>
          <p className="text-sm text-gray-800 dark:text-white/90">{row.phone}</p>
          {row.email && <p className="text-xs text-gray-500">{row.email}</p>}
        </div>
      ),
    },
    {
      header: "Alamat",
      cell: (row) => (
        <div>
          <p className="text-sm text-gray-800 dark:text-white/90">{row.alamat || "-"}</p>
          <p className="text-xs text-gray-500">
            {row.rt ? `RT ${row.rt}` : ""} {row.rw ? `RW ${row.rw}` : ""}
          </p>
        </div>
      ),
    },
    {
      header: "Bergabung",
      cell: (row) => (
        <span className="text-sm text-gray-500">
          {row.created_at ? new Date(row.created_at).toLocaleDateString("id-ID") : "-"}
        </span>
      ),
    },
    {
      header: "Action",
      cell: (row) => (
        <Button size="sm" variant="outline" onClick={() => router.push(`/rw/warga-management/${row.user_id}`)}>
          Detail
        </Button>
      ),
    },
  ];

  return (
    <div>
      <PageBreadcrumb pageTitle="Manajemen Warga" />
      
      <div className="space-y-6">
        <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-white/[0.05] dark:bg-white/[0.03]">
          <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
            <form onSubmit={onSearch} className="flex flex-1 flex-col gap-3 sm:flex-row">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Cari nama..."
                className="w-full rounded border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-brand-500 dark:border-white/10 dark:bg-white/5 dark:focus:border-brand-500 sm:max-w-xs"
              />
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Cari no. hp..."
                className="w-full rounded border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-brand-500 dark:border-white/10 dark:bg-white/5 dark:focus:border-brand-500 sm:max-w-xs"
              />
              <div className="flex gap-2">
                <Button type="submit" size="sm">Cari</Button>
                <Button type="button" variant="outline" size="sm" onClick={onReset}>Reset</Button>
              </div>
            </form>
            <Button onClick={() => setIsCreateOpen(true)}>+ Tambah Warga</Button>
          </div>
        </div>

        {loading ? (
          <div className="p-8 text-center">Memuat data warga...</div>
        ) : error ? (
          <EmptyState
            title="Gagal memuat"
            description={error}
            action={<Button size="sm" onClick={() => fetchWarga()}>Coba Lagi</Button>}
          />
        ) : warga.length === 0 ? (
           <BasicTableOne columns={columns} data={warga}  emptyMessage="Data kosong / empty"/>
        ) : (
          <>
            <BasicTableOne columns={columns} data={warga}  emptyMessage="Data kosong / empty"/>
            <div className="flex justify-between items-center mt-3">
          <div className="flex items-center gap-2">
            <span className="text-xs">Tampil</span>
            <select
              className="border rounded px-1 py-0.5 text-xs"
              value={limit}
              onChange={e => { setLimit(Number(e.target.value)); setPage(1); }}
            >
              {[10, 20, 50].map(opt => <option key={opt} value={opt}>{opt}/page</option>)}
            </select>
          </div>
          <Pagination currentPage={page} totalPages={totalPages} onPageChange={(p) => setPage(p)} />
        </div>
          </>
        )}
      </div>

      <CreateWargaModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onSuccess={() => {
          setPage(1);
          fetchWarga({ page: 1 });
        }}
      />
    </div>
  );
}
