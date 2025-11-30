import api from '../axios';

export interface User {
  user_id: number;
  name: string;
  email: string;
  phone: string;
  alamat: string;
  role: string;
  rt: number;
  rw: number;
  kelurahan_id: number;
  created_at: string;
  updated_at: string;
}

export interface LoginResponse {
  status: string;
  message: string;
  data: {
    user: User;
    token: string;
  };
}

export interface RegisterResponse {
  status: string;
  message: string;
  data: {
    user: User;
    token: string;
  };
}

export const authApi = {
  login: async (data: any) => {
    const response = await api.post<LoginResponse>('/auth/login', data);
    return response.data;
  },

  register: async (data: any) => {
    const response = await api.post<RegisterResponse>('/auth/register', data);
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
  }
};
