
export interface WasteType {
  waste_type_id: number;
  name: string;
  description?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface RWList {
  rw_id: number;
  kelurahan_id: number;
  nomor_rw: number;
  name: string;
  phone: string;
  address: string;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Kelurahan {
  kelurahan_id: number;
  nama_kelurahan: string;
  kecamatan: string;
  kota: string;
  created_at: string;
  updated_at: string;
}

export interface PriceListEntryFull {
  price_id: number;
  waste_type_id: number;
  rw_id: number;
  kelurahan_id: number;
  buy_price: string;
  sell_price: string;
  effective_date: string;
  waste_type: WasteType;
  rw_list: RWList;
  kelurahan: Kelurahan;
}

export interface PaginatedPriceListResponse {
  data: PriceListEntryFull[];
  total: number;
  page: number;
  limit: number;
}

import api from "@/lib/axios";
import { PriceListEntry } from "@/types/entities";

export interface CreatePriceListDto {
  waste_type_id: number;
  buy_price: number;
  sell_price: number;
  effective_date?: string;
}

export interface UpdatePriceListDto {
  buy_price?: number;
  sell_price?: number;
  effective_date?: string;
}

export const priceListService = {

  async listByRwPaginated(rwId: number, page: number, limit: number): Promise<PaginatedPriceListResponse> {
    const res = await api.get(`/price-list/rw/${rwId}/paginated?page=${page}&limit=${limit}`);
    // If the API returns { data: { data: [...], ... } }, unwrap it
    if (res?.data?.data && typeof res.data.data === 'object' && Array.isArray(res.data.data.data)) {
      return res.data.data as PaginatedPriceListResponse;
    }
    // fallback: assume res.data is PaginatedPriceListResponse
    return res.data as PaginatedPriceListResponse;
  },
  async listByRw(rwId: number): Promise<PriceListEntry[]> {
    return api.get(`/price-list/rw/${rwId}`);
  },
  async create(data: CreatePriceListDto): Promise<PriceListEntry> {
    return api.post("/price-list/rw", data);
  },
  async update(priceId: number, data: UpdatePriceListDto): Promise<PriceListEntry> {
    return api.patch(`/price-list/rw/${priceId}`, data);
  },
  async delete(priceId: number): Promise<void> {
    return api.delete(`/price-list/rw/${priceId}`);
  },
};
