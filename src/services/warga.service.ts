import api from "@/lib/axios";

export interface Warga {
  user_id: number;
  name: string;
  email: string | null;
  phone: string;
  alamat: string | null;
  rt: number | null;
  rw: string | null;
  kelurahan_id: number | null;
  created_at: string;
}

export interface CreateWargaParams {
  name: string;
  email?: string | null;
  phone: string;
  alamat?: string | null;
  password: string;
  rt?: number | null;
}

export interface ListWargaParams {
  page?: number;
  limit?: number;
  name?: string;
  phone?: string;
}

export interface PaginatedWarga {
  data: Warga[];
  pagination: {
    page: number;
    limit: number;
    totalPages: number;
    totalItems?: number;
  };
}

function extract<T>(res: any): T {
  return res?.data?.data ?? res?.data;
}

export const wargaService = {
  async list(params: ListWargaParams = {}): Promise<PaginatedWarga> {
    const query = new URLSearchParams();
    if (params.page) query.append("page", String(params.page));
    if (params.limit) query.append("limit", String(params.limit));
    if (params.name) query.append("name", params.name);
    if (params.phone) query.append("phone", params.phone);

    const res = await api.get(`/rw/warga?${query.toString()}`);
    return extract<PaginatedWarga>(res);
  },

  async create(data: CreateWargaParams): Promise<Warga> {
    const res = await api.post("/rw/warga", data);
    return extract<Warga>(res);
  },
};
