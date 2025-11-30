import api from '../../axios';
import { PriceListItem } from '../rw/price-list';

export const kelurahanPriceListApi = {
  create: async (data: { wasteTypeId: string; price: number }[]) => {
    const response = await api.post('/price-list/kelurahan', data);
    return response.data;
  },
  list: async () => {
    const response = await api.get<PriceListItem[]>('/price-list');
    return response.data;
  },
};
