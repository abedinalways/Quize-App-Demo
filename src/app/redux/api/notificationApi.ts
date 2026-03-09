import { baseApi } from './baseApi';

export const notificationApi = baseApi.injectEndpoints({
  endpoints: builder => ({
    getUserNotifications: builder.query({
      query: () => '/user/notification',
      providesTags: ['notification'],
    }),
    deleteNotification: builder.mutation({
      query: id => ({
        url: `/user/notification/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['notification'],
    }),
    addNotification: builder.mutation({
      query: newNotification => ({
        url: '/user/notification',
        method: 'POST',
        body: newNotification,
      }),
      invalidatesTags: ['notification'],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetUserNotificationsQuery,
  useDeleteNotificationMutation,
  useAddNotificationMutation,
} = notificationApi;
