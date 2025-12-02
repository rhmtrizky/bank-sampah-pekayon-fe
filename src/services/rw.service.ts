import api from '@/lib/axios';
import { PriceListEntry, CollectionSchedule, WithdrawSchedule, BulkSaleItemSummary, ReportRW } from '@/types/entities';
import { RecentTransaction, RecentRequest } from '@/types/dashboard';

export const rwService = {
  getPriceList: async (rwId: number): Promise<PriceListEntry[]> => {
    const res = await api.get(`/price-list/rw/${rwId}`);
    return res.data;
  },
  getCollectionSchedules: async (page?: number, limit?: number): Promise<any> => {
    const params = new URLSearchParams();
    if (page) params.append('page', String(page));
    if (limit) params.append('limit', String(limit));
    const query = params.toString();
    const res = await api.get(`/schedule/collection${query ? `?${query}` : ''}`);
    return res.data;
  },
  getWithdrawSchedules: async (page?: number, limit?: number): Promise<any> => {
    const params = new URLSearchParams();
    if (page) params.append('page', String(page));
    if (limit) params.append('limit', String(limit));
    const query = params.toString();
    const res = await api.get(`/schedule/withdraw${query ? `?${query}` : ''}`);
    return res.data;
  },
  getRecentTransactions: async (): Promise<RecentTransaction[]> => {
    const res = await api.get('/dashboard/rw/recent/transactions');
    return res.data;
  },
  getRecentRequests: async (): Promise<RecentRequest[]> => {
    const res = await api.get('/dashboard/rw/recent/requests?page=1&limit=2');
    // API returns envelope { status, message, data: { data: [...], pagination } }
    const envelope = res.data;
    const list = envelope?.data?.data ?? [];
    const mapped: RecentRequest[] = list.map((item: any) => ({
      request_id: item.request_id,
      user_id: item.user?.user_id ?? item.user_id,
      status: item.status,
      scheduled_date: item.scheduled_date,
      created_at: item.created_at,
      user_name: item.user?.name,
    }));
    return mapped;
  },
  getReport: async (): Promise<ReportRW> => {
    const res = await api.get('/reports/rw');
    return res.data;
  }
};
