import { baseApi } from './baseApi';

export interface FollowResponse {
  success: boolean;
  message: string;
}

export const followApi = baseApi.injectEndpoints({
  endpoints: builder => ({
    toggleFollow: builder.mutation<FollowResponse, string>({
      query: userId => ({
        url: `/profile/follow-toggle/${userId}`,
        method: 'PUT',
        credentials: 'include',
      }),

      invalidatesTags: ['DiscoverProfiles'],
    }),
  }),

  overrideExisting: false,
});

export const { useToggleFollowMutation } = followApi;
