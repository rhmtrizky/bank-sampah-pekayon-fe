import api from '@/lib/axios';
import axios from 'axios';

export interface loginRequest {
  emailOrPhone: string; // backend expects either email or phone in a unified field
  password: string;
}

export interface AuthUserResponse {
  user_id: number;
  name: string;
  email: string | null;
  phone: string | null;
  alamat: string | null;
  role: string;
  rt: number | null;
  rw: number | null;
  kelurahan_id: number | null;
  created_at: string;
  updated_at: string;
}

export interface LoginResponse {
  token: string;
  user: AuthUserResponse;
}

// Transforms backend envelope { status, message, data: { user, token } } into flat { token, user }
export async function login(payload: loginRequest): Promise<LoginResponse> {
  const res = await api.post('/auth/login', payload);
  const envelope = res.data; // { status, message, data }
  const { data } = envelope;
  return { token: data.token, user: data.user };
}
