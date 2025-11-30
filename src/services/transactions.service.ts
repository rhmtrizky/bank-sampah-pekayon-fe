import api from "@/lib/axios";

export interface Transaction {
  transaction_id: number;
  user_id: number;
  rw_id?: number;
  kelurahan_id?: number;
  waste_type_id: number;
  weight_kg: string; // backend returns as string
  price_per_kg?: string; // e.g. "7000"
  total_amount?: string; // e.g. "41986"
  transaction_method?: string | null; // online | offline
  request_id?: number | null;
  rt?: number | null;
  created_at: string;
  updated_at?: string;
  waste_type_name?: string;
  user_name?: string;
}

export interface ListTransactionsParams {
  month?: number;
  year?: number;
  page?: number;
  limit?: number;
  name?: string; // user name filter
  method?: string; // online | offline
  from_date?: string; // ISO date string
  to_date?: string;   // ISO date string
  waste_type_id?: number;
}

export interface PaginatedTransactions {
  data: Transaction[];
  pagination: {
    page: number;
    limit: number;
    totalPages: number;
    totalItems?: number;
  };
}

function extract<T>(res: any): T {
  // envelope style { status, message, data }
  return res?.data?.data ?? res?.data;
}

export const transactionsService = {
  async list(params: ListTransactionsParams = {}): Promise<PaginatedTransactions> {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== "") query.append(k, String(v));
    });
    const res = await api.get(`/transactions?${query.toString()}`);
    return extract<PaginatedTransactions>(res);
  },
  async createOffline(payload: { user_id: number; waste_type_id: number; weight_kg: number }): Promise<Transaction> {
    const res = await api.post(`/transactions/offline`, payload);
    return extract<Transaction>(res);
  },
  async get(id: number): Promise<Transaction> {
    const res = await api.get(`/transactions/${id}`);
    return extract<Transaction>(res);
  },
  async update(id: number, payload: Partial<{ waste_type_id: number; weight_kg: number }>): Promise<Transaction> {
    const res = await api.patch(`/transactions/${id}`, payload);
    return extract<Transaction>(res);
  },
  async remove(id: number): Promise<{ success: boolean }> {
    const res = await api.delete(`/transactions/${id}`);
    return extract<{ success: boolean }>(res);
  },
};
