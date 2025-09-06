import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import authReducer from './slices/authSlice';
import userReducer from './slices/userSlice';
import courseReducer from './slices/courseSlice';
import videoReducer from './slices/videoSlice';
import gamificationReducer from './slices/gamificationSlice';
import notificationReducer from './slices/notificationSlice';
import uiReducer from './slices/uiSlice';

const PERSIST_KEY = 'app:persist:v1';

function loadState(): any | undefined {
  try {
    const raw = localStorage.getItem(PERSIST_KEY);
    if (!raw) return undefined;
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === 'object' ? parsed : undefined;
  } catch {
    return undefined;
  }
}

function saveState(state: any) {
  try {
    const data = JSON.stringify(state);
    localStorage.setItem(PERSIST_KEY, data);
  } catch {}
}

// Simple throttle to avoid writing too often
function throttle<T extends (...args: any[]) => void>(fn: T, wait: number): T {
  let last = 0;
  let queued: any = null;
  return function (this: any, ...args: any[]) {
    const now = Date.now();
    if (now - last >= wait) {
      last = now;
      fn.apply(this, args);
    } else {
      clearTimeout(queued);
      queued = setTimeout(
        () => {
          last = Date.now();
          fn.apply(this, args);
        },
        wait - (now - last),
      );
    }
  } as T;
}

const preloadedState = loadState();

export const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
    course: courseReducer,
    video: videoReducer,
    gamification: gamificationReducer,
    notification: notificationReducer,
    ui: uiReducer,
  },
  preloadedState,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
        ignoredActionPaths: ['meta.arg', 'payload.timestamp'],
        ignoredPaths: ['items.dates'],
      },
    }),
});

// Persist selected slices
const persistSelected = throttle(() => {
  const state: any = store.getState();
  const snapshot = {
    auth: {
      user: state.auth?.user ?? null,
      token: state.auth?.token ?? null,
      isAuthenticated: state.auth?.isAuthenticated ?? false,
      // don't persist isLoading/error
    },
    ui: {
      theme: state.ui?.theme ?? 'system',
      sidebarOpen: state.ui?.sidebarOpen ?? true,
      focusMode: state.ui?.focusMode ?? false,
      videoLayout: state.ui?.videoLayout ?? 'default',
    },
  };
  saveState(snapshot);
}, 500);

store.subscribe(persistSelected);

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;