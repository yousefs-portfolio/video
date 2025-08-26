import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface TypographySettings {
  fontFamily: string;
  fontSize: number;
  lineHeight: number;
  letterSpacing: number;
  wordSpacing: number;
  contrast: number;
  dyslexiaMode: boolean;
  speedReadingMode: boolean;
  highlightCenter: boolean;
  reduceSubvocalization: boolean;
  wordsPerMinute: number;
}

interface UIState {
  theme: 'light' | 'dark' | 'system';
  sidebarOpen: boolean;
  focusMode: boolean;
  videoLayout: 'default' | 'theater' | 'fullscreen' | 'pip';
  transcriptPanelOpen: boolean;
  notesPanelOpen: boolean;
  playlistPanelOpen: boolean;
  searchOpen: boolean;
  typographySettings: TypographySettings;
  modals: {
    auth: boolean;
    profile: boolean;
    settings: boolean;
    achievements: boolean;
    leaderboard: boolean;
    shareContent: boolean;
  };
  toasts: {
    id: string;
    message: string;
    type: 'success' | 'error' | 'warning' | 'info';
    duration?: number;
  }[];
  loading: {
    global: boolean;
    courses: boolean;
    video: boolean;
  };
  errors: {
    global: string | null;
    courses: string | null;
    video: string | null;
  };
}

const initialState: UIState = {
  theme: 'system',
  sidebarOpen: true,
  focusMode: false,
  videoLayout: 'default',
  transcriptPanelOpen: false,
  notesPanelOpen: false,
  playlistPanelOpen: true,
  searchOpen: false,
  typographySettings: {
    fontFamily: 'Inter',
    fontSize: 16,
    lineHeight: 1.5,
    letterSpacing: 0,
    wordSpacing: 0,
    contrast: 100,
    dyslexiaMode: false,
    speedReadingMode: false,
    highlightCenter: false,
    reduceSubvocalization: false,
    wordsPerMinute: 250,
  },
  modals: {
    auth: false,
    profile: false,
    settings: false,
    achievements: false,
    leaderboard: false,
    shareContent: false,
  },
  toasts: [],
  loading: {
    global: false,
    courses: false,
    video: false,
  },
  errors: {
    global: null,
    courses: null,
    video: null,
  },
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setTheme: (state, action: PayloadAction<UIState['theme']>) => {
      state.theme = action.payload;
      // Apply theme to document
      if (typeof window !== 'undefined') {
        const root = document.documentElement;
        if (action.payload === 'dark') {
          root.classList.add('dark');
        } else if (action.payload === 'light') {
          root.classList.remove('dark');
        } else {
          // System theme
          const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
          if (prefersDark) {
            root.classList.add('dark');
          } else {
            root.classList.remove('dark');
          }
        }
      }
    },
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setSidebarOpen: (state, action: PayloadAction<boolean>) => {
      state.sidebarOpen = action.payload;
    },
    toggleFocusMode: (state) => {
      state.focusMode = !state.focusMode;
      if (state.focusMode) {
        state.sidebarOpen = false;
        state.transcriptPanelOpen = false;
        state.notesPanelOpen = false;
        state.playlistPanelOpen = false;
      } else {
        state.sidebarOpen = true;
      }
    },
    setVideoLayout: (state, action: PayloadAction<UIState['videoLayout']>) => {
      state.videoLayout = action.payload;
    },
    toggleTranscriptPanel: (state) => {
      state.transcriptPanelOpen = !state.transcriptPanelOpen;
    },
    toggleNotesPanel: (state) => {
      state.notesPanelOpen = !state.notesPanelOpen;
    },
    togglePlaylistPanel: (state) => {
      state.playlistPanelOpen = !state.playlistPanelOpen;
    },
    toggleSearch: (state) => {
      state.searchOpen = !state.searchOpen;
    },
    openModal: (state, action: PayloadAction<keyof UIState['modals']>) => {
      state.modals[action.payload] = true;
    },
    closeModal: (state, action: PayloadAction<keyof UIState['modals']>) => {
      state.modals[action.payload] = false;
    },
    closeAllModals: (state) => {
      Object.keys(state.modals).forEach((key) => {
        state.modals[key as keyof UIState['modals']] = false;
      });
    },
    showToast: (state, action: PayloadAction<{
      message: string;
      type?: 'success' | 'error' | 'warning' | 'info';
      duration?: number;
    }>) => {
      state.toasts.push({
        id: Date.now().toString(),
        message: action.payload.message,
        type: action.payload.type || 'info',
        duration: action.payload.duration || 5000,
      });
    },
    removeToast: (state, action: PayloadAction<string>) => {
      state.toasts = state.toasts.filter((toast) => toast.id !== action.payload);
    },
    clearToasts: (state) => {
      state.toasts = [];
    },
    setLoading: (state, action: PayloadAction<{
      key: keyof UIState['loading'];
      value: boolean;
    }>) => {
      state.loading[action.payload.key] = action.payload.value;
    },
    setError: (state, action: PayloadAction<{
      key: keyof UIState['errors'];
      value: string | null;
    }>) => {
      state.errors[action.payload.key] = action.payload.value;
    },
    clearErrors: (state) => {
      state.errors = {
        global: null,
        courses: null,
        video: null,
      };
    },
    updateTypographySettings: (state, action: PayloadAction<Partial<TypographySettings>>) => {
      state.typographySettings = {
        ...state.typographySettings,
        ...action.payload,
      };
    },
    resetUI: () => initialState,
  },
});

export const {
  setTheme,
  toggleSidebar,
  setSidebarOpen,
  toggleFocusMode,
  setVideoLayout,
  toggleTranscriptPanel,
  toggleNotesPanel,
  togglePlaylistPanel,
  toggleSearch,
  openModal,
  closeModal,
  closeAllModals,
  showToast,
  removeToast,
  clearToasts,
  setLoading,
  setError,
  clearErrors,
  updateTypographySettings,
  resetUI,
} = uiSlice.actions;

export default uiSlice.reducer;