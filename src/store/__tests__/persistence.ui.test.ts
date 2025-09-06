import { beforeEach, describe, expect, it, vi } from 'vitest';
// We will import actions from the slice directly
import { setEyeStrainMode } from '../slices/uiSlice';

const PERSIST_KEY = 'app:persist:v1';

describe('UI persistence: eyeStrainMode', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.useFakeTimers();
  });

  it('persists eyeStrainMode to localStorage snapshot after throttle', async () => {
    // Import store fresh
    vi.resetModules();
    const { store } = await import('..');

    // Toggle on
    store.dispatch(setEyeStrainMode(true));

    // Advance throttle (500ms)
    vi.advanceTimersByTime(600);

    const raw = localStorage.getItem(PERSIST_KEY);
    expect(raw).toBeTruthy();
    const saved = JSON.parse(raw as string);
    expect(saved.ui).toBeTruthy();
    expect(saved.ui.eyeStrainMode).toBe(true);
  });

  it('rehydrates store state from persisted snapshot (eyeStrainMode)', async () => {
    // Seed localStorage with persisted state having eyeStrainMode true
    localStorage.setItem(
      PERSIST_KEY,
      JSON.stringify({
        auth: { user: null, token: null, isAuthenticated: false },
        ui: {
          theme: 'system',
          sidebarOpen: true,
          focusMode: false,
          eyeStrainMode: true,
          videoLayout: 'default',
        },
      }),
    );

    // Re-import store to pick up preloadedState
    vi.resetModules();
    const { store } = await import('..');
    const state = store.getState();
    expect(state.ui.eyeStrainMode).toBe(true);
  });
});
