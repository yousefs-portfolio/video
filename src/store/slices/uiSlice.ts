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
  eyeStrainMode: boolean;
  videoLayout: 'default' | 'theater' | 'fullscreen' | 'pip';
  transcriptPanelOpen: boolean;
  notesPanelOpen: boolean;
  playlistPanelOpen: boolean;
  searchOpen: boolean;
  accessibilityMode: 'default' | 'highContrast' | 'protanopia' | 'deuteranopia' | 'tritanopia';
  courseTheme: 'default' | 'math' | 'cs' | 'design';
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
  eyeStrainMode: false,
  videoLayout: 'default',
  transcriptPanelOpen: false,
  notesPanelOpen: false,
  playlistPanelOpen: true,
  searchOpen: false,
  accessibilityMode: 'default',
  courseTheme: 'default',
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
      if (typeof document !== 'undefined') {
        const root = document.documentElement;
        if (state.focusMode) {
          root.classList.add('focus-mode');
        } else {
          root.classList.remove('focus-mode');
        }
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
    setAccessibilityMode: (state, action: PayloadAction<UIState['accessibilityMode']>) => {
      state.accessibilityMode = action.payload;
      if (typeof document !== 'undefined') {
        const root = document.documentElement;
        const classes = [
          'a11y-high-contrast',
          'a11y-protanopia',
          'a11y-deuteranopia',
          'a11y-tritanopia',
        ];
        classes.forEach((c) => root.classList.remove(c));
        switch (action.payload) {
          case 'highContrast':
            root.classList.add('a11y-high-contrast');
            break;
          case 'protanopia':
            root.classList.add('a11y-protanopia');
            break;
          case 'deuteranopia':
            root.classList.add('a11y-deuteranopia');
            break;
          case 'tritanopia':
            root.classList.add('a11y-tritanopia');
            break;
          default:
            break;
        }
      }
    },
    setCourseTheme: (state, action: PayloadAction<UIState['courseTheme']>) => {
      state.courseTheme = action.payload;
      if (typeof document !== 'undefined') {
        const root = document.documentElement;
        const classes = ['course-theme-math', 'course-theme-cs', 'course-theme-design'];
        classes.forEach((c) => root.classList.remove(c));
        switch (action.payload) {
          case 'math':
            root.classList.add('course-theme-math');
            break;
          case 'cs':
            root.classList.add('course-theme-cs');
            break;
          case 'design':
            root.classList.add('course-theme-design');
            break;
          default:
            break;
        }
      }
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
    showToast: (
      state,
      action: PayloadAction<{
        message: string;
        type?: 'success' | 'error' | 'warning' | 'info';
        duration?: number;
      }>,
    ) => {
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
    setLoading: (
      state,
      action: PayloadAction<{
        key: keyof UIState['loading'];
        value: boolean;
      }>,
    ) => {
      state.loading[action.payload.key] = action.payload.value;
    },
    setError: (
      state,
      action: PayloadAction<{
        key: keyof UIState['errors'];
        value: string | null;
      }>,
    ) => {
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
      if (typeof document !== 'undefined') {
        const root = document.documentElement;
        const t = state.typographySettings;
        root.style.setProperty('--font-size', `${t.fontSize}px`);
        root.style.setProperty('--line-height', `${t.lineHeight}`);
        root.style.setProperty('--letter-spacing', `${t.letterSpacing}px`);
        root.style.setProperty('--word-spacing', `${t.wordSpacing}px`);
        root.style.setProperty(
          '--paragraph-spacing',
          `${Math.max(0, (t.lineHeight - 1) * 1.2)}rem`,
        );
        if (t.dyslexiaMode) {
          root.classList.add('dyslexia-font');
        } else {
          root.classList.remove('dyslexia-font');
        }
        if (t.speedReadingMode) {
          root.classList.add('speed-reading');
        } else {
          root.classList.remove('speed-reading');
        }
        if (t.highlightCenter) {
          root.classList.add('speed-reading-center');
        } else {
          root.classList.remove('speed-reading-center');
        }
      }
    },
    resetUI: () => initialState,
    setEyeStrainMode: (state, action: PayloadAction<boolean>) => {
      state.eyeStrainMode = action.payload;
      if (typeof document !== 'undefined') {
        const root = document.documentElement;
        if (action.payload) {
          root.classList.add('eye-strain');
        } else {
          root.classList.remove('eye-strain');
        }
      }
    },
    toggleEyeStrainMode: (state) => {
      state.eyeStrainMode = !state.eyeStrainMode;
      if (typeof document !== 'undefined') {
        const root = document.documentElement;
        if (state.eyeStrainMode) {
          root.classList.add('eye-strain');
        } else {
          root.classList.remove('eye-strain');
        }
      }
    },
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
  setEyeStrainMode,
  toggleEyeStrainMode,
  setAccessibilityMode,
  setCourseTheme,
} = uiSlice.actions;

export default uiSlice.reducer;