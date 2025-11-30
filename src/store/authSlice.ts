import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { loginRequest, login, AuthUserResponse } from '@/services/auth.service';

export interface AuthUser extends AuthUserResponse {}

interface AuthState {
  user: AuthUser | null;
  token: string | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  token: null,
  status: 'idle',
  error: null,
};

export const loginThunk = createAsyncThunk(
  'auth/login',
  async (payload: loginRequest, { rejectWithValue }) => {
    try {
      const res = await login(payload); // transforms envelope
      return res; // { token, user }
    } catch (e: any) {
      return rejectWithValue(e?.response?.data?.message || e?.message || 'Login failed');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      state.user = null;
      state.token = null;
      state.status = 'idle';
      state.error = null;
      if (typeof window !== 'undefined') {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('auth_user');
        // Clear cookies used by middleware
        document.cookie = 'token=; path=/; max-age=0; SameSite=Strict';
        document.cookie = 'role=; path=/; max-age=0; SameSite=Strict';
      }
    },
    hydrate(state) {
      if (typeof window !== 'undefined') {
        const token = localStorage.getItem('auth_token');
        const userStr = localStorage.getItem('auth_user');
        if (token && userStr) {
          state.token = token;
          try { state.user = JSON.parse(userStr); } catch { /* ignore */ }
        }
      }
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginThunk.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(loginThunk.fulfilled, (state, action: PayloadAction<{ token: string; user: AuthUser }>) => {
        state.status = 'succeeded';
        state.token = action.payload.token;
        state.user = action.payload.user;
        if (typeof window !== 'undefined') {
          localStorage.setItem('auth_token', action.payload.token);
          localStorage.setItem('auth_user', JSON.stringify(action.payload.user));
          // Set cookies for middleware to read
          const oneDay = 60 * 60 * 24;
          document.cookie = `token=${action.payload.token}; path=/; max-age=${oneDay}; SameSite=Strict`;
          document.cookie = `role=${action.payload.user.role}; path=/; max-age=${oneDay}; SameSite=Strict`;
        }
      })
      .addCase(loginThunk.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || 'Login error';
      });
  }
});

export const { logout, hydrate } = authSlice.actions;
export default authSlice.reducer;
