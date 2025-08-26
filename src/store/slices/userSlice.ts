import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { User, UserPreferences, UserStats } from '@/types';

interface UserState {
  profile: User | null;
  preferences: UserPreferences | null;
  stats: UserStats | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: UserState = {
  profile: null,
  preferences: {
    theme: 'light',
    language: 'en',
    emailNotifications: true,
    pushNotifications: true,
    playbackSpeed: 1,
    captionsEnabled: true,
    autoplay: true,
    quality: 'auto',
  },
  stats: null,
  isLoading: false,
  error: null,
};

// Async thunks
export const fetchUserProfile = createAsyncThunk(
  'user/fetchProfile',
  async (userId: string) => {
    const response = await fetch(`/api/users/${userId}`);
    const data = await response.json();
    if (!response.ok) throw new Error(data.message);
    return data;
  },
);

export const updateUserProfile = createAsyncThunk(
  'user/updateProfile',
  async (updates: Partial<User>) => {
    const response = await fetch('/api/users/me', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message);
    return data;
  },
);

export const updateUserPreferences = createAsyncThunk(
  'user/updatePreferences',
  async (preferences: Partial<UserPreferences>) => {
    const response = await fetch('/api/users/preferences', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(preferences),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message);
    return data;
  },
);

export const fetchUserStats = createAsyncThunk('user/fetchStats', async () => {
  const response = await fetch('/api/users/stats');
  const data = await response.json();
  if (!response.ok) throw new Error(data.message);
  return data;
});

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setTheme: (state, action: PayloadAction<'light' | 'dark' | 'system'>) => {
      if (state.preferences) {
        state.preferences.theme = action.payload;
      }
    },
    setPlaybackSpeed: (state, action: PayloadAction<number>) => {
      if (state.preferences) {
        state.preferences.playbackSpeed = action.payload;
      }
    },
    setCaptionsEnabled: (state, action: PayloadAction<boolean>) => {
      if (state.preferences) {
        state.preferences.captionsEnabled = action.payload;
      }
    },
    setQuality: (state, action: PayloadAction<string>) => {
      if (state.preferences) {
        state.preferences.quality = action.payload as any;
      }
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch profile
    builder
      .addCase(fetchUserProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.profile = action.payload;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch profile';
      });

    // Update profile
    builder
      .addCase(updateUserProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.profile = action.payload;
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to update profile';
      });

    // Update preferences
    builder
      .addCase(updateUserPreferences.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateUserPreferences.fulfilled, (state, action) => {
        state.isLoading = false;
        state.preferences = action.payload;
      })
      .addCase(updateUserPreferences.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to update preferences';
      });

    // Fetch stats
    builder
      .addCase(fetchUserStats.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUserStats.fulfilled, (state, action) => {
        state.isLoading = false;
        state.stats = action.payload;
      })
      .addCase(fetchUserStats.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch stats';
      });
  },
});

export const {
  setTheme,
  setPlaybackSpeed,
  setCaptionsEnabled,
  setQuality,
  clearError,
} = userSlice.actions;

export default userSlice.reducer;