import api from "@/lib/axios";

export interface WasteType {
  id?: number;
  waste_type_id: number;
  name: string;
  description?: string | null;
  created_at?: string;
  updated_at?: string;
  buy_price?: number;
}

function extract<T>(res: any): T {
  return res?.data?.data ?? res?.data;
}

export const wasteTypesService = {
  async list(params?: { page?: number; limit?: number; name?: string }): Promise<any> {
    const search = new URLSearchParams();
    if (params?.page) search.set('page', String(params.page));
    if (params?.limit) search.set('limit', String(params.limit));
    if (params?.name) search.set('name', params.name);
    const qs = search.toString();
    const url = qs ? `/waste-types?${qs}` : '/waste-types';
    const res = await api.get(url);
    return res.data; // return envelope to allow pagination meta consumption
  },

  async create(payload: { name: string; description?: string | null }): Promise<WasteType> {
    const res = await api.post('/waste-types', payload);
    return extract<WasteType>(res);
  },

  async update(id: number, payload: { name: string; description?: string | null }): Promise<WasteType> {
    const res = await api.patch(`/waste-types/${id}`, payload);
    return extract<WasteType>(res);
  },

  async remove(id: number): Promise<void> {
    await api.delete(`/waste-types/${id}`);
  }
};
