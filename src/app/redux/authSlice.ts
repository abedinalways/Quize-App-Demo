import { createSlice } from '@reduxjs/toolkit';

export type Role = 'admin' | 'user';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: Role;
}

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null as AuthUser | null,
  },
  reducers: {
    setUser(state, action) {
      state.user = action.payload;
    },
    clearUser(state) {
      state.user = null;
    },
  },
});

export const { setUser, clearUser } = authSlice.actions;
export default authSlice.reducer;
