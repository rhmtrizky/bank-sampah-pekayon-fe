import api from '../../axios';

export interface WasteType {
  id: string;
  name: string;
  unit: string;
  description?: string;
  category?: string;
}

export const wasteTypesApi = {
  list: async () => {
    const response = await api.get<WasteType[]>('/waste-types');
    return response.data;
  },
  create: async (data: Omit<WasteType, 'id'>) => {
    const response = await api.post<WasteType>('/waste-types', data);
    return response.data;
  },
  update: async (id: string, data: Partial<WasteType>) => {
    const response = await api.patch<WasteType>(`/waste-types/${id}`, data);
    return response.data;
  },
  delete: async (id: string) => {
    const response = await api.delete(`/waste-types/${id}`);
    return response.data;
  },
};
