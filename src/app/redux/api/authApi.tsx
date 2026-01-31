import { baseApi } from './baseApi';
import { AuthUser } from '../authSlice';

interface LoginPayload {
  email: string;
  password: string;
}

export const authApi = baseApi.injectEndpoints({
  endpoints: builder => ({
    // 🔹 login
    login: builder.mutation<void, LoginPayload>({
      query: body => ({
        url: '/auth/login',
        method: 'POST',
        body,
      }),
    }),

    // 🔹 get logged-in user
    me: builder.query<AuthUser, void>({
      query: () => '/auth/me',
    }),

    // 🔹 logout
    logout: builder.mutation<void, void>({
      query: () => ({
        url: '/auth/logout',
        method: 'POST',
      }),
    }),
  }),
});

export const { useLoginMutation, useMeQuery, useLogoutMutation } = authApi;
