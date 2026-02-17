import { baseApi } from './baseApi';
import { AuthorizationResponse, AuthUser, setAuth } from '../authSlice';

interface LoginPayload {
  email: string;
  password: string;
}

export const authApi = baseApi.injectEndpoints({
  endpoints: builder => ({
    // 🔹 login
    login: builder.mutation<AuthorizationResponse, LoginPayload>({
      query: body => ({
        url: '/auth/login',
        method: 'POST',
        body,
        credentials: 'include',
      }),
      invalidatesTags: ['Auth'],
      onQueryStarted: async (arg, { dispatch, queryFulfilled }) => {
        try {
          const { data } = await queryFulfilled;
          console.log(data);

          const {
            authorization: { access_token },
            type: role,
          } = data;

          dispatch(setAuth({ token: access_token, role }));
        } catch (error) {
          console.error('Login mutation error:', error);
        }
      },
    }),

    // 🔹 get logged-in user
    me: builder.query<AuthUser, void>({
      query: () => ({
        url: '/profile',
        method: 'GET',
        // credentials: 'include',
      }),
      transformResponse: (res: { data: AuthUser }) => res.data,
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
