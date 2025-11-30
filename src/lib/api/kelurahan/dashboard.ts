import api from '../../axios';
import { RW, Transaction } from '@/types';

interface KelurahanDashboardSummary {
  totalRW: number;
  totalDepositRW: number;
  totalPPSUDeposit: number;
  totalRevenue: number;
}

export const kelurahanDashboardApi = {
  getSummary: async () => {
    const response = await api.get<KelurahanDashboardSummary>('/kelurahan/dashboard/summary');
    return response.data;
  },
  getRWComparison: async () => {
    const response = await api.get<{ labels: string[]; data: number[] }>('/kelurahan/dashboard/rw-comparison');
    return response.data;
  },
  getRecentActivities: async () => {
    const response = await api.get<Transaction[]>('/kelurahan/dashboard/activities');
    return response.data;
  },
};
