import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axios';

export const login = createAsyncThunk('auth/login', async (creds, { rejectWithValue }) => {
  try {
    const { data } = await api.post('/auth/login', creds);
    localStorage.setItem('accessToken', data.accessToken);
    localStorage.setItem('refreshToken', data.refreshToken);
    return data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Login failed');
  }
});

export const register = createAsyncThunk('auth/register', async (payload, { rejectWithValue }) => {
  try {
    const { data } = await api.post('/auth/register', payload);
    return data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Registration failed');
  }
});

export const verifyOtp = createAsyncThunk('auth/verifyOtp', async (payload, { rejectWithValue }) => {
  try {
    const { data } = await api.post('/auth/verify-otp', payload);
    localStorage.setItem('accessToken', data.accessToken);
    localStorage.setItem('refreshToken', data.refreshToken);
    return data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'OTP verification failed');
  }
});

export const fetchMe = createAsyncThunk('auth/fetchMe', async (_, { rejectWithValue }) => {
  try {
    const { data } = await api.get('/users/me');
    return data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch user');
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    isAuthenticated: !!localStorage.getItem('accessToken'),
    loading: false,
    error: null,
    pendingEmail: null, // for OTP flow
    otpHint: null,
  },
  reducers: {
    logout(state) {
      state.user = null;
      state.isAuthenticated = false;
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    },
    clearError(state) { state.error = null; },
    setPendingEmail(state, action) { state.pendingEmail = action.payload; },
  },
  extraReducers: (builder) => {
    // Login
    builder.addCase(login.pending, (s) => { s.loading = true; s.error = null; });
    builder.addCase(login.fulfilled, (s, a) => { s.loading = false; s.user = a.payload.user; s.isAuthenticated = true; });
    builder.addCase(login.rejected, (s, a) => { s.loading = false; s.error = a.payload; });
    // Register
    builder.addCase(register.pending, (s) => { s.loading = true; s.error = null; });
    builder.addCase(register.fulfilled, (s, a) => { s.loading = false; s.otpHint = a.payload.otpHint; });
    builder.addCase(register.rejected, (s, a) => { s.loading = false; s.error = a.payload; });
    // Verify OTP
    builder.addCase(verifyOtp.pending, (s) => { s.loading = true; s.error = null; });
    builder.addCase(verifyOtp.fulfilled, (s, a) => { s.loading = false; s.user = a.payload.user; s.isAuthenticated = true; s.pendingEmail = null; s.otpHint = null; });
    builder.addCase(verifyOtp.rejected, (s, a) => { s.loading = false; s.error = a.payload; });
    // Fetch Me
    builder.addCase(fetchMe.fulfilled, (s, a) => { s.user = a.payload.user; s.isAuthenticated = true; });
    builder.addCase(fetchMe.rejected, (s) => { s.isAuthenticated = false; s.user = null; });
  },
});

export const { logout, clearError, setPendingEmail } = authSlice.actions;
export default authSlice.reducer;
