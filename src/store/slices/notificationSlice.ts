import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Notification } from '@/types';

interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;
  error: string | null;
}

const initialState: NotificationState = {
  notifications: [],
  unreadCount: 0,
  isLoading: false,
  error: null,
};

// Async thunks
export const fetchNotifications = createAsyncThunk(
  'notification/fetchAll',
  async () => {
    const response = await fetch('/api/notifications');
    const data = await response.json();
    if (!response.ok) throw new Error(data.message);
    return data;
  },
);

export const markAsRead = createAsyncThunk(
  'notification/markAsRead',
  async (notificationId: string) => {
    const response = await fetch(`/api/notifications/${notificationId}/read`, {
      method: 'POST',
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message);
    return notificationId;
  },
);

export const markAllAsRead = createAsyncThunk(
  'notification/markAllAsRead',
  async () => {
    const response = await fetch('/api/notifications/read-all', {
      method: 'POST',
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message);
    return data;
  },
);

export const deleteNotification = createAsyncThunk(
  'notification/delete',
  async (notificationId: string) => {
    const response = await fetch(`/api/notifications/${notificationId}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.message);
    }
    return notificationId;
  },
);

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    addNotification: (state, action: PayloadAction<Notification>) => {
      state.notifications.unshift(action.payload);
      if (!action.payload.read) {
        state.unreadCount += 1;
      }
    },
    clearNotifications: (state) => {
      state.notifications = [];
      state.unreadCount = 0;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch notifications
    builder
      .addCase(fetchNotifications.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.isLoading = false;
        state.notifications = action.payload.notifications;
        state.unreadCount = action.payload.notifications.filter(
          (n: Notification) => !n.read
        ).length;
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch notifications';
      });

    // Mark as read
    builder
      .addCase(markAsRead.fulfilled, (state, action) => {
        const notification = state.notifications.find((n) => n.id === action.payload);
        if (notification && !notification.read) {
          notification.read = true;
          state.unreadCount = Math.max(0, state.unreadCount - 1);
        }
      });

    // Mark all as read
    builder
      .addCase(markAllAsRead.fulfilled, (state) => {
        state.notifications.forEach((n) => {
          n.read = true;
        });
        state.unreadCount = 0;
      });

    // Delete notification
    builder
      .addCase(deleteNotification.fulfilled, (state, action) => {
        const index = state.notifications.findIndex((n) => n.id === action.payload);
        if (index !== -1) {
          const notification = state.notifications[index];
          if (!notification.read) {
            state.unreadCount = Math.max(0, state.unreadCount - 1);
          }
          state.notifications.splice(index, 1);
        }
      });
  },
});

export const {
  addNotification,
  clearNotifications,
  clearError,
} = notificationSlice.actions;

export default notificationSlice.reducer;