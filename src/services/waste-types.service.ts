import api from "@/lib/axios";

export interface WasteType {
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
  async list(): Promise<WasteType[]> {
    const res = await api.get('/waste-types');
    return extract<WasteType[]>(res);
  }
};
