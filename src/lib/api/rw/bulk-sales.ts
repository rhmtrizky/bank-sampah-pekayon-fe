import api from '../../axios';

export interface BulkSale {
  id: string;
  date: string;
  totalWeight: number;
  totalAmount: number;
  buyer: string;
}

export interface Pengepul {
  id: string;
  name: string;
  phone: string;
  address: string;
}

export const rwBulkSalesApi = {
  list: async () => {
    const response = await api.get<BulkSale[]>('/bulk-sales');
    return response.data;
  },
  create: async (data: any) => {
    const response = await api.post('/bulk-sales', data);
    return response.data;
  },
  listPengepul: async () => {
    // Assuming /bulk-sales/pengepul based on router structure
    const response = await api.get<Pengepul[]>('/bulk-sales/pengepul');
    return response.data;
  },
  createPengepul: async (data: any) => {
    const response = await api.post('/bulk-sales/pengepul', data);
    return response.data;
  },
};
