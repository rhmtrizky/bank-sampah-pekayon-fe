import api from "@/lib/axios";

export interface BulkSaleItemPayload {
  waste_type_id: number;
  weight_kg: number;
}

export interface CreateBulkSalePayload {
  pengepul_id: number;
  items: BulkSaleItemPayload[];
  date: string; // ISO string
}

export interface UpdateBulkSalePayload {
  pengepul_id?: number;
  items?: BulkSaleItemPayload[];
  date?: string; // ISO string
}

export const bulkSalesService = {
  async list(params?: { page?: number; limit?: number; from_date?: string; to_date?: string; pengepul_id?: number }) {
    const search = new URLSearchParams();
    if (params?.page) search.set("page", String(params.page));
    if (params?.limit) search.set("limit", String(params.limit));
    if (params?.from_date) search.set("from_date", params.from_date);
    if (params?.to_date) search.set("to_date", params.to_date);
    if (params?.pengepul_id) search.set("pengepul_id", String(params.pengepul_id));
    const qs = search.toString();
    const url = qs ? `/bulk-sales?${qs}` : "/bulk-sales";
    const res = await api.get(url);
    return res.data; // return envelope
  },

  async getById(id: number) {
    const res = await api.get(`/bulk-sales/${id}`);
    return res.data; // envelope with data
  },

  async create(payload: CreateBulkSalePayload) {
    const res = await api.post("/bulk-sales", payload);
    return res.data; // envelope with data
  },

  async update(id: number, payload: UpdateBulkSalePayload) {
    const res = await api.patch(`/bulk-sales/${id}`, payload);
    return res.data; // envelope with data
  },
};
