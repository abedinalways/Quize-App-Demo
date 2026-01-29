import { baseApi } from './baseApi';
import { AuthUser } from '../authSlice';

export const authApi = baseApi.injectEndpoints({
  endpoints: builder => ({
    me: builder.query<AuthUser, void>({
      query: () => '/auth/me',
    }),
    logout: builder.mutation<void, void>({
      query: () => ({
        url: '/auth/logout',
        method: 'POST',
      }),
    }),
  }),
});

export const { useMeQuery, useLogoutMutation } = authApi;
