import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Achievement, Badge, LearningStreak } from '@/types';

interface XPGain {
  id: string;
  amount: number;
  source: string;
  timestamp: Date;
  multiplier?: number;
}

interface GamificationState {
  xp: {
    current: number;
    total: number;
    level: number;
    xpForNextLevel: number;
    recentGains: XPGain[];
  };
  streak: LearningStreak;
  achievements: Achievement[];
  badges: Badge[];
  leaderboard: {
    position: number;
    total: number;
    nearbyUsers: {
      id: string;
      name: string;
      xp: number;
      position: number;
    }[];
  };
  challenges: {
    daily: Achievement[];
    weekly: Achievement[];
    monthly: Achievement[];
  };
  isLoading: boolean;
  error: string | null;
}

const initialState: GamificationState = {
  xp: {
    current: 0,
    total: 0,
    level: 1,
    xpForNextLevel: 100,
    recentGains: [],
  },
  streak: {
    currentStreak: 0,
    longestStreak: 0,
    lastActivityDate: new Date(),
    streakHistory: [],
    freezesAvailable: 2,
    freezesUsed: 0,
  },
  achievements: [],
  badges: [],
  leaderboard: {
    position: 0,
    total: 0,
    nearbyUsers: [],
  },
  challenges: {
    daily: [],
    weekly: [],
    monthly: [],
  },
  isLoading: false,
  error: null,
};

// Helper function to calculate XP for next level
const calculateXPForLevel = (level: number): number => {
  return Math.floor(100 * Math.pow(1.5, level - 1));
};

// Async thunks
export const fetchGamificationData = createAsyncThunk(
  'gamification/fetchAll',
  async () => {
    const response = await fetch('/api/gamification');
    const data = await response.json();
    if (!response.ok) throw new Error(data.message);
    return data;
  },
);

export const addXP = createAsyncThunk(
  'gamification/addXP',
  async ({ amount, source, multiplier = 1 }: {
    amount: number;
    source: string;
    multiplier?: number;
  }) => {
    const response = await fetch('/api/gamification/xp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount, source, multiplier }),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message);
    return data;
  },
);

export const updateStreak = createAsyncThunk(
  'gamification/updateStreak',
  async () => {
    const response = await fetch('/api/gamification/streak', {
      method: 'POST',
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message);
    return data;
  },
);

export const useStreakFreeze = createAsyncThunk(
  'gamification/useFreeze',
  async () => {
    const response = await fetch('/api/gamification/streak/freeze', {
      method: 'POST',
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message);
    return data;
  },
);

export const unlockAchievement = createAsyncThunk(
  'gamification/unlockAchievement',
  async (achievementId: string) => {
    const response = await fetch(`/api/gamification/achievements/${achievementId}/unlock`, {
      method: 'POST',
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message);
    return data;
  },
);

export const fetchLeaderboard = createAsyncThunk(
  'gamification/fetchLeaderboard',
  async (timeframe: 'daily' | 'weekly' | 'monthly' | 'all-time' = 'weekly') => {
    const response = await fetch(`/api/gamification/leaderboard?timeframe=${timeframe}`);
    const data = await response.json();
    if (!response.ok) throw new Error(data.message);
    return data;
  },
);

export const fetchChallenges = createAsyncThunk(
  'gamification/fetchChallenges',
  async () => {
    const response = await fetch('/api/gamification/challenges');
    const data = await response.json();
    if (!response.ok) throw new Error(data.message);
    return data;
  },
);

const gamificationSlice = createSlice({
  name: 'gamification',
  initialState,
  reducers: {
    levelUp: (state) => {
      state.xp.level += 1;
      state.xp.current = state.xp.current - state.xp.xpForNextLevel;
      state.xp.xpForNextLevel = calculateXPForLevel(state.xp.level + 1);
    },
    updateAchievementProgress: (state, action: PayloadAction<{
      achievementId: string;
      progress: number;
    }>) => {
      const achievement = state.achievements.find((a) => a.id === action.payload.achievementId);
      if (achievement) {
        achievement.progress = action.payload.progress;
      }
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch all gamification data
    builder
      .addCase(fetchGamificationData.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchGamificationData.fulfilled, (state, action) => {
        state.isLoading = false;
        state.xp = action.payload.xp;
        state.streak = action.payload.streak;
        state.achievements = action.payload.achievements;
        state.badges = action.payload.badges;
      })
      .addCase(fetchGamificationData.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch gamification data';
      });

    // Add XP
    builder
      .addCase(addXP.fulfilled, (state, action) => {
        const { amount, source, multiplier = 1, totalXP, level, xpForNextLevel } = action.payload;
        
        // Add to recent gains
        state.xp.recentGains.push({
          id: Date.now().toString(),
          amount: amount * multiplier,
          source,
          timestamp: new Date(),
          multiplier,
        });
        
        // Keep only last 10 gains
        if (state.xp.recentGains.length > 10) {
          state.xp.recentGains = state.xp.recentGains.slice(-10);
        }
        
        // Update XP values
        state.xp.current += amount * multiplier;
        state.xp.total = totalXP;
        
        // Check for level up
        if (state.xp.current >= state.xp.xpForNextLevel) {
          state.xp.level = level;
          state.xp.current = state.xp.current - state.xp.xpForNextLevel;
          state.xp.xpForNextLevel = xpForNextLevel;
        }
      });

    // Update streak
    builder
      .addCase(updateStreak.fulfilled, (state, action) => {
        state.streak = action.payload;
      });

    // Use streak freeze
    builder
      .addCase(useStreakFreeze.fulfilled, (state) => {
        state.streak.freezesAvailable -= 1;
        state.streak.freezesUsed += 1;
      });

    // Unlock achievement
    builder
      .addCase(unlockAchievement.fulfilled, (state, action) => {
        const achievement = state.achievements.find((a) => a.id === action.payload.id);
        if (achievement) {
          achievement.unlockedAt = new Date();
        }
      });

    // Fetch leaderboard
    builder
      .addCase(fetchLeaderboard.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchLeaderboard.fulfilled, (state, action) => {
        state.isLoading = false;
        state.leaderboard = action.payload;
      })
      .addCase(fetchLeaderboard.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch leaderboard';
      });

    // Fetch challenges
    builder
      .addCase(fetchChallenges.fulfilled, (state, action) => {
        state.challenges = action.payload;
      });
  },
});

export const {
  levelUp,
  updateAchievementProgress,
  clearError,
} = gamificationSlice.actions;

export default gamificationSlice.reducer;