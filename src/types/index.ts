export interface User {
  id: number;
  name: string;
  email: string;
  role: 'ADMIN' | 'RW' | 'KELURAHAN' | 'WARGA' | 'PPSU';
  phone?: string;
  address?: string;
  createdAt: string;
  updatedAt: string;
}

export interface RW {
  id: number;
  name: string; // e.g. "RW 01"
  kelurahanId: number;
  picName: string;
  picPhone: string;
  address: string;
  latitude?: number;
  longitude?: number;
  createdAt: string;
  updatedAt: string;
}

export interface Kelurahan {
  id: number;
  name: string;
  district: string; // Kecamatan
  city: string;
  picName: string;
  picPhone: string;
  address: string;
  createdAt: string;
  updatedAt: string;
}

export interface WasteType {
  id: number;
  name: string;
  unit: string; // kg, pcs, etc.
  category: string; // Plastik, Kertas, Logam, etc.
  description?: string;
  imageUrl?: string;
}

export interface PriceList {
  id: number;
  rwId: number;
  wasteTypeId: number;
  wasteType: WasteType;
  buyingPrice: number; // Price RW buys from Warga
  sellingPrice: number; // Price RW sells to Pengepul/Kelurahan
  effectiveDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface PriceListKelurahan {
  id: number;
  kelurahanId: number;
  wasteTypeId: number;
  wasteType: WasteType;
  buyingPrice: number; // Price Kelurahan buys from RW/PPSU
  sellingPrice: number; // Price Kelurahan sells to Big Pengepul
  effectiveDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface DepositRequest {
  id: number;
  userId: number; // Warga
  user: User;
  rwId: number;
  status: 'PENDING' | 'SCHEDULED' | 'COMPLETED' | 'CANCELLED';
  requestDate: string;
  pickupDate?: string;
  notes?: string;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Transaction {
  id: number;
  code: string;
  date: string;
  userId: number; // Warga
  user: User;
  rwId: number;
  totalWeight: number;
  totalAmount: number;
  status: 'PENDING' | 'COMPLETED' | 'CANCELLED';
  items: TransactionItem[];
  createdAt: string;
  updatedAt: string;
}

export interface TransactionItem {
  id: number;
  transactionId: number;
  wasteTypeId: number;
  wasteType: WasteType;
  weight: number;
  pricePerUnit: number;
  subtotal: number;
}

export interface Wallet {
  id: number;
  userId: number;
  balance: number;
  updatedAt: string;
}

export interface WalletHistory {
  id: number;
  walletId: number;
  transactionType: 'DEPOSIT' | 'WITHDRAWAL' | 'ADJUSTMENT';
  amount: number;
  description?: string;
  referenceId?: string; // Transaction ID or Withdraw ID
  createdAt: string;
}

export interface CollectionSchedule {
  id: number;
  rwId: number;
  dayOfWeek: number; // 0-6
  startTime: string;
  endTime: string;
  description?: string;
  isActive: boolean;
}

export interface WithdrawSchedule {
  id: number;
  rwId: number;
  date: string;
  location: string;
  status: 'OPEN' | 'CLOSED';
}

export interface Notification {
  id: number;
  userId: number;
  title: string;
  message: string;
  isRead: boolean;
  type: 'INFO' | 'ALERT' | 'TRANSACTION';
  createdAt: string;
}

export interface BulkSale {
  id: number;
  rwId?: number; // If sold by RW
  kelurahanId?: number; // If sold by Kelurahan
  pengepulId: number;
  pengepul: Pengepul;
  date: string;
  totalWeight: number;
  totalAmount: number;
  status: 'DRAFT' | 'COMPLETED' | 'CANCELLED';
  items: BulkSaleItem[];
  createdAt: string;
  updatedAt: string;
}

export interface BulkSaleItem {
  id: number;
  bulkSaleId: number;
  wasteTypeId: number;
  wasteType: WasteType;
  weight: number;
  pricePerUnit: number;
  subtotal: number;
}

export interface Pengepul {
  id: number;
  name: string;
  phone: string;
  address: string;
  type: 'SMALL' | 'BIG'; // Small buys from RW, Big buys from Kelurahan
  createdAt: string;
  updatedAt: string;
}

export interface ReportSummary {
  totalTransactions: number;
  totalWeight: number;
  totalRevenue: number;
  totalWithdraw: number;
  period: string;
}
