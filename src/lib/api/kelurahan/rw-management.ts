import api from '../../axios';
import { RW } from '@/types';

export const rwManagementApi = {
  getAll: async () => {
    // Using public list endpoint
    const response = await api.get<RW[]>('/rw');
    return response.data;
  },
  getMonitoring: async () => {
    const response = await api.get<RW[]>('/monitoring/rw');
    return response.data;
  },
  getRtMonitoring: async () => {
    const response = await api.get<any[]>('/monitoring/rt');
    return response.data;
  },
  getById: async (id: number) => {
    const response = await api.get<RW>(`/rw/${id}`);
    return response.data;
  },
  // Create and Update are restricted to Super Admin
  /*
  create: async (data: Partial<RW>) => {
    const response = await api.post<RW>('/rw', data);
    return response.data;
  },
  update: async (id: number, data: Partial<RW>) => {
    const response = await api.patch<RW>(`/rw/${id}`, data);
    return response.data;
  },
  */
};
