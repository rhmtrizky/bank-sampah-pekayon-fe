import api from "@/lib/axios";

export type ScheduleItem = {
  schedule_id: number;
  rw_id: number;
  kelurahan_id: number;
  title: string;
  date: string; // ISO datetime
  start_time: string; // ISO datetime
  end_time: string; // ISO datetime
  description?: string | null;
};

export type Pagination = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export type ListResponse = {
  data: ScheduleItem[];
  pagination: Pagination;
};

export type CreatePayload = {
  title: string;
  date: string; // ISO datetime
  start_time: string; // ISO datetime
  end_time: string; // ISO datetime
  description?: string | null;
};

const buildQuery = (params: Record<string, string | number | undefined>) => {
  const q = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== "") q.append(k, String(v));
  });
  return q.toString();
};

export const scheduleService = {
  async listCollection(options: { page?: number; limit?: number; startDate?: string; endDate?: string }) {
    const query = buildQuery({
      page: options.page ?? 1,
      limit: options.limit ?? 10,
      startDate: options.startDate,
      endDate: options.endDate,
    });
    const res = await api.get(`/schedule/collection?${query}`);
    const envelope = res.data;
    return (envelope?.data ?? envelope) as ListResponse;
  },
  async listWithdraw(options: { page?: number; limit?: number; startDate?: string; endDate?: string }) {
    const query = buildQuery({
      page: options.page ?? 1,
      limit: options.limit ?? 10,
      startDate: options.startDate,
      endDate: options.endDate,
    });
    const res = await api.get(`/schedule/withdraw?${query}`);
    const envelope = res.data;
    return (envelope?.data ?? envelope) as ListResponse;
  },
  async createCollection(payload: CreatePayload) {
    const res = await api.post(`/schedule/collection`, payload);
    const envelope = res.data;
    return envelope?.data ?? envelope;
  },
  async createWithdraw(payload: CreatePayload) {
    const res = await api.post(`/schedule/withdraw`, payload);
    const envelope = res.data;
    return envelope?.data ?? envelope;
  },
  async updateCollection(id: number, payload: CreatePayload) {
    const res = await api.put(`/schedule/collection/${id}`, payload);
    const envelope = res.data;
    return envelope?.data ?? envelope;
  },
  async updateWithdraw(id: number, payload: CreatePayload) {
    const res = await api.put(`/schedule/withdraw/${id}`, payload);
    const envelope = res.data;
    return envelope?.data ?? envelope;
  },
  async deleteCollection(id: number) {
    const res = await api.delete(`/schedule/collection/${id}`);
    const envelope = res.data;
    return envelope?.data ?? envelope;
  },
  async deleteWithdraw(id: number) {
    const res = await api.delete(`/schedule/withdraw/${id}`);
    const envelope = res.data;
    return envelope?.data ?? envelope;
  },
};
