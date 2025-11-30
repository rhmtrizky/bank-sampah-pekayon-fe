import api from '../../axios';

export interface Wallet {
  balance: number;
  lastUpdated: string;
}

export interface WalletTransaction {
  id: string;
  amount: number;
  type: 'credit' | 'debit';
  description: string;
  date: string;
}

export const walletApi = {
  getWallet: async () => {
    const response = await api.get<Wallet>('/wallet');
    return response.data;
  },
  getHistory: async () => {
    const response = await api.get<WalletTransaction[]>('/wallet/history');
    return response.data;
  },
};
