import api from '@/lib/axios';
import { PriceListEntry, CollectionSchedule, WithdrawSchedule, BulkSaleItemSummary, ReportKelurahan, RWPublic } from '@/types/entities';
import { KelurahanRecentTransaction, RWRanking, WasteCompositionData, RWPerformance } from '@/types/dashboard';

export const kelurahanService = {
  getRwList: async (): Promise<RWPublic[]> => {
    const res = await api.get('/rw');
    return res.data;
  },
  getPriceList: async (): Promise<PriceListEntry[]> => {
    const res = await api.get('/price-list');
    return res.data;
  },
  getCollectionSchedules: async (): Promise<CollectionSchedule[]> => {
    const res = await api.get('/schedule/collection');
    return res.data;
  },
  getWithdrawSchedules: async (): Promise<WithdrawSchedule[]> => {
    const res = await api.get('/schedule/withdraw');
    return res.data;
  },
  getBulkSales: async (): Promise<BulkSaleItemSummary[]> => {
    const res = await api.get('/bulk-sales');
    return res.data;
  },
  getReport: async (): Promise<ReportKelurahan> => {
    const res = await api.get('/reports/kelurahan');
    return res.data;
  }
};
