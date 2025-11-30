// Shared entity types mapped to backend API responses

export interface PriceListEntry {
  price_id: number;
  waste_type_id: number;
  rw_id?: number;
  kelurahan_id?: number;
  buy_price: number;
  sell_price: number;
  effective_date: string; // ISO date
}

export interface CollectionSchedule {
  schedule_id: number;
  rw_id?: number;
  kelurahan_id?: number;
  date: string; // ISO date
  start_time: string; // ISO or HH:mm
  end_time: string;   // ISO or HH:mm
  description?: string;
}

export interface WithdrawSchedule {
  withdraw_schedule_id: number;
  rw_id?: number;
  kelurahan_id?: number;
  date: string;
  start_time: string;
  end_time: string;
}

export interface BulkSaleItemSummary {
  sale_id: number;
  rw_id?: number;
  kelurahan_id?: number;
  total_weight: number;
  total_amount: number;
  date: string; // ISO date
}

export interface RWPublic {
  rw_id: number;
  kelurahan_id: number;
  nomor_rw: number;
  name?: string;
  phone?: string;
  address?: string;
  active: boolean;
}

export interface ReportRW {
  total_transactions: number;
  total_weight: number;
  total_revenue: number;
  total_withdraw: number;
  month: number; // numeric month
  year: number;
}

export interface ReportKelurahan extends ReportRW {}
