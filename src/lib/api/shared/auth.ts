import api from '../../axios';
import { User } from '@/types';

interface LoginResponse {
  token: string;
  user: User;
}

export const authApi = {
  login: async (credentials: { email: string; password: string }) => {
    const response = await api.post<LoginResponse>('/auth/login', credentials);
    return response.data;
  },
  register: async (data: any) => {
    const response = await api.post('/auth/register', data);
    return response.data;
  },
  getProfile: async () => {
    const response = await api.get<User>('/auth/profile');
    return response.data;
  },
  updateProfile: async (data: Partial<User>) => {
    const response = await api.put<User>('/auth/profile', data);
    return response.data;
  },
  logout: async () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
};
