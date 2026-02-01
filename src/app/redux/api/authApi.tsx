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
        credentials: 'include', 
      }),
      invalidatesTags: ['Auth'],
    }),

    // 🔹 get logged-in user
    me: builder.query<AuthUser, void>({
      query: () => ({
        url: '/profile',
        method: 'GET',
        credentials: 'include', 
      }),
      providesTags: ['Auth'],
    }),

    // 🔹 logout
    logout: builder.mutation<void, void>({
      query: () => ({
        url: '/auth/logout',
        method: 'POST',
        credentials: 'include', 
      }),
      invalidatesTags: ['Auth'],
    }),
  }),
});

export const { useLoginMutation, useMeQuery, useLogoutMutation } = authApi;
