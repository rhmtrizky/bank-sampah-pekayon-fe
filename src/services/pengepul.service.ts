import api from "@/lib/axios";

export type Pengepul = {
  pengepul_id: number;
  name: string;
  phone: string;
  address?: string | null;
  created_at?: string;
};

export type PengepulListResponse = {
  data: Pengepul[];
  pagination: { page: number; limit: number; total: number; totalPages: number };
};

export type PengepulPayload = {
  name: string;
  phone: string;
  address?: string | null;
};

const buildQuery = (params: Record<string, string | number | undefined>) => {
  const q = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== "") q.append(k, String(v));
  });
  return q.toString();
};

export const pengepulService = {
  async list(options: { page?: number; limit?: number; name?: string; phone?: string }) {
    const query = buildQuery({
      page: options.page ?? 1,
      limit: options.limit ?? 10,
      name: options.name,
      phone: options.phone,
    });
    const res = await api.get(`/bulk-sales/pengepul?${query}`);
    const envelope = res.data;
    // API shape: { data: [...], pagination: {...} }
    if (envelope?.data && envelope?.pagination) {
      return envelope as PengepulListResponse;
    }
    // Fallback: some servers wrap one more level
    return (envelope?.data ?? envelope) as PengepulListResponse;
  },
  async create(payload: PengepulPayload) {
    const res = await api.post(`/bulk-sales/pengepul`, payload);
    return res.data;
  },
  async update(id: number, payload: PengepulPayload) {
    const res = await api.put(`/bulk-sales/pengepul/${id}`, payload);
    return res.data;
  },
  async remove(id: number) {
    const res = await api.delete(`/bulk-sales/pengepul/${id}`);
    return res.data;
  },
};
