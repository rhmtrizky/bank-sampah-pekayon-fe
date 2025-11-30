import api from '../../axios';
import { Transaction, DepositRequest } from '@/types';

interface DashboardSummary {
  totalWarga: number;
  totalTransactionsToday: number;
  totalWeight: number;
  totalRevenue: number;
}

export const rwDashboardApi = {
  getSummary: async () => {
    const response = await api.get<DashboardSummary>('/rw/dashboard/summary');
    return response.data;
  },
  getRecentActivities: async () => {
    const response = await api.get<Transaction[]>('/rw/dashboard/activities');
    return response.data;
  },
  getPendingRequests: async () => {
    const response = await api.get<DepositRequest[]>('/rw/dashboard/pending-requests');
    return response.data;
  },
  getChartData: async (period: 'week' | 'month' | 'year') => {
    const response = await api.get<{ labels: string[]; data: number[] }>(`/rw/dashboard/chart?period=${period}`);
    return response.data;
  },
};
