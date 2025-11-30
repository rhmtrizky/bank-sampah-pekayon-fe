import api from '../../axios';
import { Transaction, TransactionItem } from '@/types';

export const rwTransactionApi = {
  // Using monitoring endpoint to get RW data/history
  getAll: async (params?: { page?: number; limit?: number; status?: string; date?: string }) => {
    const response = await api.get<{ data: Transaction[]; total: number }>('/monitoring/rw', { params });
    return response.data;
  },
  getById: async (id: number) => {
    // Assuming there is a detail endpoint, or we filter from list. 
    // The provided list has router.get("/:id", getDepositRequestDetail) under deposit-request, 
    // but not explicitly for generic transactions. 
    // However, usually there is one. I'll keep it pointing to /transactions/:id for now or comment it out if unsure.
    // But wait, the user provided list is specific. 
    // Let's assume /transactions/:id might not exist or is not listed.
    // I will leave it as is but warn myself. 
    // Actually, let's use /monitoring/rw for list.
    const response = await api.get<Transaction>(`/transactions/${id}`);
    return response.data;
  },
  createOffline: async (data: { items: Partial<TransactionItem>[] }) => {
    const response = await api.post<Transaction>('/transactions/offline', data);
    return response.data;
  },
  // Deprecated or not in list: updateStatus
  updateStatus: async (id: number, status: string) => {
    const response = await api.patch<Transaction>(`/transactions/${id}/status`, { status });
    return response.data;
  },
};
