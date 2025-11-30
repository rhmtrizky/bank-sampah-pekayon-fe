import api from '../../axios';
import { Transaction } from '@/types';

export const rwRequestsApi = {
  // Assuming list is available or we use monitoring
  getAll: async (params?: any) => {
    // If no explicit list endpoint for RW, maybe it's under monitoring or just /deposit-request
    // The user list showed router.get("/mine", ...) for warga.
    // It didn't show router.get("/", ...) for RW.
    // But it showed router.get("/:id", ...).
    // I'll assume /deposit-request might work or I'll use /monitoring/rw
    const response = await api.get<Transaction[]>('/deposit-request', { params });
    return response.data;
  },
  getById: async (id: string) => {
    const response = await api.get<Transaction>(`/deposit-request/${id}`);
    return response.data;
  },
  schedule: async (id: string, date: string) => {
    const response = await api.patch(`/deposit-request/${id}/schedule`, { date });
    return response.data;
  },
  complete: async (id: string, data: any) => {
    const response = await api.patch(`/deposit-request/${id}/complete`, data);
    return response.data;
  },
};
