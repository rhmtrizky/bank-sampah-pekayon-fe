import api from '../../axios';

export interface Schedule {
  id: string;
  date: string;
  type: 'collection' | 'withdraw';
  status: string;
}

export const rwSchedulesApi = {
  listCollection: async () => {
    const response = await api.get<Schedule[]>('/schedule/collection');
    return response.data;
  },
  listWithdraw: async () => {
    const response = await api.get<Schedule[]>('/schedule/withdraw');
    return response.data;
  },
  createCollection: async (data: { date: string; notes?: string }) => {
    const response = await api.post('/schedule/collection', data);
    return response.data;
  },
  createWithdraw: async (data: { date: string; amount: number }) => {
    const response = await api.post('/schedule/withdraw', data);
    return response.data;
  },
};
