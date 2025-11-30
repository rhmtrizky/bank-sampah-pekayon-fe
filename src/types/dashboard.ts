export interface RWDashboardSummary {
  total_transactions_today: number;
  total_weight_today: number;
  total_amount_today: number;
  total_deposit_requests_pending: number;
  total_active_warga_in_rw: number;
  total_rt_active: number;
}

export interface DailyTransactionChartData {
  date: string;
  count: number;
}

export interface DailyWeightChartData {
  date: string;
  total_weight: number;
}

export interface WasteCompositionData {
  waste_type_id: number;
  waste_type_name: string;
  total_weight: number;
}

export interface RecentTransaction {
  transaction_id: number;
  user_id: number;
  waste_type_id: number;
  weight_kg: number;
  total_amount: number;
  transaction_method: string;
  created_at: string;
  // Optional fields for UI convenience if joined
  user_name?: string;
  waste_type_name?: string;
}

export interface RecentRequest {
  request_id: number;
  user_id: number;
  status: 'pending' | 'scheduled' | 'completed' | 'cancelled';
  scheduled_date: string | null;
  created_at: string;
  // Optional fields for UI convenience
  user_name?: string;
}

export interface RtStatistic {
  rt: number;
  total_transactions: number;
  total_weight: number;
}

export interface SalesSummaryData {
  total_weight: number;
  total_amount: number;
}

export interface RecentSale {
  sale_id: number;
  total_weight: number;
  total_amount: number;
  date: string;
  pengepul_id: number;
  // Optional
  pengepul_name?: string;
}

export interface ScheduleItem {
  schedule_id?: number; // for collection
  withdraw_schedule_id?: number; // for withdraw
  rw_id: number;
  kelurahan_id: number;
  date: string;
  start_time: string;
  end_time: string;
  description?: string;
}

export interface RWAlerts {
  pending_requests: number;
  today_collection_schedules: ScheduleItem[];
  upcoming_withdraw_schedules: ScheduleItem[];
  unread_notifications: number;
}

export interface RWSchedules {
  next_collection_schedules: ScheduleItem[];
  next_withdraw_schedules: ScheduleItem[];
}

// Kelurahan Dashboard Types

export interface KelurahanDashboardSummary {
  total_rw: number;
  total_transactions_today_all_rw: number;
  total_weight_today_all_rw: number;
  total_penjualan_all_rw: number;
  total_warga_aktif_kelurahan: number;
}

export interface RWPerformance {
  rw_id: number;
  nomor_rw: number;
  name: string;
  total_transactions: number;
  total_weight_this_month: number;
}

export interface MonthlyWeightChartData {
  month: string;
  total_weight: number;
}

export interface KelurahanRecentTransaction extends RecentTransaction {
  rw_id: number;
  rw_name?: string;
}

export interface RWRanking {
  rw_id: number;
  total_transactions: number;
  total_weight: number;
  total_sales_amount: number;
}

export interface KelurahanAlerts {
  rw_no_activity_this_month: { rw_id: number; nomor_rw: number; name: string }[];
  rt_anomalies: { rw_id: number; rt: number }[];
  unread_notifications: number;
}
