"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import Button from "@/components/ui/button/Button";
import Badge from "@/components/ui/badge/Badge";
import EmptyState from "@/components/common/EmptyState";
import api from "@/lib/axios";
import CompleteModal from "../CompleteModal";

interface RequestDetail {
  request_id: number;
  user_id: number;
  rw_id: number;
  photo: string | null;
  status: "pending" | "scheduled" | "completed" | "cancelled";
  scheduled_date: string | null;
  created_at: string;
  user: {
    user_id: number;
    name: string;
    email: string | null;
    phone: string | null;
    alamat: string | null;
    rt: number | null;
    rw: number | null;
  };
  rw_list: {
    rw_id: number;
    nomor_rw: number;
    name: string;
    phone: string | null;
    address: string | null;
  };
  items: Array<{
    item_id: number;
    request_id: number;
    waste_type_id: number;
    weight_kg: string;
    waste_type: {
      waste_type_id: number;
      name: string;
      description: string | null;
    };
  }>;
}

const statusColor = (status: string) => {
  switch (status) {
    case "completed":
      return "success";
    case "pending":
      return "warning";
    case "scheduled":
      return "info";
    default:
      return "error";
  }
};

const toTitle = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

export default function RequestDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [data, setData] = useState<RequestDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCompleteModalOpen, setIsCompleteModalOpen] = useState(false);

  const handleCompleteSuccess = () => {
    // Reload data after completion
    const load = async () => {
      if (!id) return;
      setLoading(true);
      setError(null);
      try {
        const res = await api.get(`/deposit-request/${id}`);
        const envelope = res.data;
        setData(envelope?.data ?? null);
      } catch (e: any) {
        console.error(e);
        setError(e?.response?.data?.message || e?.message || "Failed to load request detail");
      } finally {
        setLoading(false);
      }
    };
    load();
  };

  useEffect(() => {
    const load = async () => {
      if (!id) return;
      setLoading(true);
      setError(null);
      try {
        const res = await api.get(`/deposit-request/${id}`);
        const envelope = res.data;
        setData(envelope?.data ?? null);
      } catch (e: any) {
        console.error(e);
        setError(e?.response?.data?.message || e?.message || "Failed to load request detail");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  if (loading) {
    return (
      <div>
        <PageBreadcrumb pageTitle="Request Detail" />
        <div className="p-8 text-center">Loading...</div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div>
        <PageBreadcrumb pageTitle="Request Detail" />
        <EmptyState
          title="Failed to load"
          description={error || "Request not found"}
          action={
            <Button size="sm" onClick={() => router.back()}>
              Back
            </Button>
          }
        />
      </div>
    );
  }

  return (
    <div>
      <PageBreadcrumb pageTitle="Request Detail" />
      <div className="space-y-6">
        {/* Header Card */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-white/[0.05] dark:bg-white/[0.03]">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
              Request #{data.request_id}
            </h2>
            <Badge color={statusColor(data.status)}>{toTitle(data.status)}</Badge>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Created At
              </label>
              <p className="text-gray-800 dark:text-white">
                {new Date(data.created_at).toLocaleString("id-ID")}
              </p>
            </div>
            {data.scheduled_date && (
              <div>
                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Scheduled Date
                </label>
                <p className="text-gray-800 dark:text-white">
                  {new Date(data.scheduled_date).toLocaleString("id-ID")}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* User Info Card */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-white/[0.05] dark:bg-white/[0.03]">
          <h3 className="mb-4 text-lg font-semibold text-gray-800 dark:text-white">
            Informasi Warga
          </h3>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Nama
              </label>
              <p className="text-gray-800 dark:text-white">{data.user.name}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                User ID
              </label>
              <p className="text-gray-800 dark:text-white">{data.user.user_id}</p>
            </div>
            {data.user.email && (
              <div>
                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Email
                </label>
                <p className="text-gray-800 dark:text-white">{data.user.email}</p>
              </div>
            )}
            {data.user.phone && (
              <div>
                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Phone
                </label>
                <p className="text-gray-800 dark:text-white">{data.user.phone}</p>
              </div>
            )}
            {data.user.rt && (
              <div>
                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  RT / RW
                </label>
                <p className="text-gray-800 dark:text-white">
                  {data.user.rt} / {data.user.rw}
                </p>
              </div>
            )}
            {data.user.alamat && (
              <div className="md:col-span-2">
                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Alamat
                </label>
                <p className="text-gray-800 dark:text-white">{data.user.alamat}</p>
              </div>
            )}
          </div>
        </div>

        {/* Photo Card */}
        {data.photo && (
          <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-white/[0.05] dark:bg-white/[0.03]">
            <h3 className="mb-4 text-lg font-semibold text-gray-800 dark:text-white">
              Foto Sampah
            </h3>
            <img
              src={data.photo}
              alt="Waste photo"
              className="max-h-96 w-full rounded-lg object-contain"
            />
          </div>
        )}

        {/* Items Card */}
        {data.items && data.items.length > 0 && (
          <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-white/[0.05] dark:bg-white/[0.03]">
            <h3 className="mb-4 text-lg font-semibold text-gray-800 dark:text-white">
              Detail Sampah
            </h3>
            <div className="space-y-3">
              {data.items.map((item) => (
                <div
                  key={item.item_id}
                  className="flex items-center justify-between rounded-lg border border-gray-100 p-4 dark:border-white/[0.05]"
                >
                  <div>
                    <p className="font-medium text-gray-800 dark:text-white">
                      {item.waste_type.name}
                    </p>
                    {item.waste_type.description && (
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {item.waste_type.description}
                      </p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-semibold text-gray-800 dark:text-white">
                      {parseFloat(item.weight_kg)} kg
                    </p>
                  </div>
                </div>
              ))}
              <div className="mt-4 border-t border-gray-200 pt-4 dark:border-white/[0.05]">
                <div className="flex justify-between">
                  <span className="font-semibold text-gray-800 dark:text-white">
                    Total Berat
                  </span>
                  <span className="text-lg font-bold text-gray-800 dark:text-white">
                    {data.items
                      .reduce((sum, item) => sum + parseFloat(item.weight_kg), 0)
                      }{" "}
                    kg
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* RW Info Card */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-white/[0.05] dark:bg-white/[0.03]">
          <h3 className="mb-4 text-lg font-semibold text-gray-800 dark:text-white">
            Informasi RW
          </h3>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Nama RW
              </label>
              <p className="text-gray-800 dark:text-white">{data.rw_list.name}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Nomor RW
              </label>
              <p className="text-gray-800 dark:text-white">{data.rw_list.nomor_rw}</p>
            </div>
            {data.rw_list.phone && (
              <div>
                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Phone
                </label>
                <p className="text-gray-800 dark:text-white">{data.rw_list.phone}</p>
              </div>
            )}
            {data.rw_list.address && (
              <div className="md:col-span-2">
                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Alamat
                </label>
                <p className="text-gray-800 dark:text-white">{data.rw_list.address}</p>
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => router.back()}>
            Back
          </Button>
          {data.status === "pending" && (
            <Button>Schedule Pickup</Button>
          )}
          {data.status === "scheduled" && (
            <Button variant="primary" onClick={() => setIsCompleteModalOpen(true)}>
              Mark as Completed
            </Button>
          )}
        </div>
      </div>

      <CompleteModal
        isOpen={isCompleteModalOpen}
        onClose={() => setIsCompleteModalOpen(false)}
        requestId={data.request_id}
        onSuccess={handleCompleteSuccess}
        weight={data.items.reduce((sum, item) => sum + parseFloat(item.weight_kg), 0)}
      />
    </div>
  );
}
