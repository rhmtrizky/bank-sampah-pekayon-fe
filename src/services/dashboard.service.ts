import api from '@/lib/axios';
import {
  RWDashboardSummary,
  DailyTransactionChartData,
  DailyWeightChartData,
  WasteCompositionData,
  RecentTransaction,
  RecentRequest,
  RtStatistic,
  SalesSummaryData,
  RecentSale,
  RWAlerts,
  RWSchedules,
  KelurahanDashboardSummary,
  RWPerformance,
  MonthlyWeightChartData,
  KelurahanRecentTransaction,
  RWRanking,
  KelurahanAlerts
} from '@/types/dashboard';

export const rwDashboardService = {
  getSummary: async (): Promise<RWDashboardSummary> => {
    const response = await api.get('/dashboard/rw/summary');
    return response.data;
  },
  getDailyTransactions: async (): Promise<DailyTransactionChartData[]> => {
    const response = await api.get('/dashboard/rw/charts/transactions-daily');
    return response.data;
  },
  getDailyWeight: async (): Promise<DailyWeightChartData[]> => {
    const response = await api.get('/dashboard/rw/charts/weight-daily');
    return response.data;
  },
  getWasteComposition: async (): Promise<WasteCompositionData[]> => {
    const response = await api.get('/dashboard/rw/charts/waste-composition');
    return response.data;
  },
  getRecentTransactions: async (): Promise<RecentTransaction[]> => {
    const response = await api.get('/dashboard/rw/recent/transactions');
    return response.data;
  },
  getRecentRequests: async (): Promise<RecentRequest[]> => {
    const response = await api.get('/dashboard/rw/recent/requests');
    return response.data;
  },
  getRtStatistics: async (): Promise<RtStatistic[]> => {
    const response = await api.get('/dashboard/rw/rt-statistics');
    return response.data;
  },
  getSalesSummary: async (): Promise<SalesSummaryData> => {
    const response = await api.get('/dashboard/rw/sales-summary');
    return response.data;
  },
  getRecentSales: async (): Promise<RecentSale[]> => {
    const response = await api.get('/dashboard/rw/recent-sales');
    return response.data;
  },
  getAlerts: async (): Promise<RWAlerts> => {
    const response = await api.get('/dashboard/rw/alerts');
    return response.data;
  },
  getSchedules: async (): Promise<RWSchedules> => {
    const response = await api.get('/dashboard/rw/schedules');
    return response.data;
  }
};

export const kelurahanDashboardService = {
  getSummary: async (): Promise<KelurahanDashboardSummary> => {
    const response = await api.get('/dashboard/kelurahan/summary');
    return response.data;
  },
  getRwPerformance: async (): Promise<RWPerformance[]> => {
    const response = await api.get('/dashboard/kelurahan/charts/rw-performance');
    return response.data;
  },
  getMonthlyWeight: async (): Promise<MonthlyWeightChartData[]> => {
    const response = await api.get('/dashboard/kelurahan/charts/weight-monthly');
    return response.data;
  },
  getRecentTransactions: async (): Promise<KelurahanRecentTransaction[]> => {
    const response = await api.get('/dashboard/kelurahan/recent/transactions');
    return response.data;
  },
  getRecentSales: async (): Promise<RecentSale[]> => {
    const response = await api.get('/dashboard/kelurahan/recent-sales');
    return response.data;
  },
  getRwRanking: async (): Promise<RWRanking[]> => {
    const response = await api.get('/dashboard/kelurahan/rw-ranking');
    return response.data;
  },
  getWasteComposition: async (): Promise<WasteCompositionData[]> => {
    const response = await api.get('/dashboard/kelurahan/waste-composition');
    return response.data;
  },
  getAlerts: async (): Promise<KelurahanAlerts> => {
    const response = await api.get('/dashboard/kelurahan/alerts');
    return response.data;
  }
};
