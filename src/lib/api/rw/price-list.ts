import api from '../../axios';

export interface PriceListItem {
  id: string;
  wasteType: string;
  price: number;
}

export const rwPriceListApi = {
  list: async () => {
    const response = await api.get<PriceListItem[]>('/price-list');
    return response.data;
  },
  create: async (data: { wasteTypeId: string; price: number }[]) => {
    const response = await api.post('/price-list', data);
    return response.data;
  },
  listByRw: async (rwId: string) => {
    const response = await api.get<PriceListItem[]>(`/price-list/rw/${rwId}`);
    return response.data;
  },
};
