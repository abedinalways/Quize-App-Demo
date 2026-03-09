// notificationSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { notificationApi } from '../app/redux/api/notificationApi';

interface Notification {
  id: string;
  type: string;
  message: string;
  timestamp: string;
  user: {
    name: string;
    avatar: string;
  };
}

interface NotificationState {
  notifications: Notification[];
}

const initialState: NotificationState = {
  notifications: [],
};

const notificationSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    addNotification: (state, action: PayloadAction<Notification>) => {
      state.notifications.push(action.payload);
    },
    setNotifications: (state, action: PayloadAction<Notification[]>) => {
      state.notifications = action.payload;
    },
  },
  extraReducers: builder => {
    builder.addMatcher(
      notificationApi.endpoints.getUserNotifications.matchFulfilled,
      (state, { payload }) => {
        if (payload?.data) {
          state.notifications = payload.data;
        }
      },
    );
  },
});

export const { addNotification, setNotifications } = notificationSlice.actions;
export default notificationSlice.reducer;
