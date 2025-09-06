import videojs from 'video.js';

// Simple plugin to remember and restore playback speed per video source
// Storage key is derived from the video's current source URL

const PLUGIN_NAME = 'speedMemory';

type VjsPlayer = ReturnType<typeof videojs> & videojs.Player;

function getStorageKey(player: VjsPlayer): string {
  try {
    const src =
      (player.currentSource && player.currentSource()) ||
      (player.currentSrc && player.currentSrc()) ||
      '';
    const srcStr = typeof src === 'string' ? src : (src?.src ?? '');
    const id = srcStr || player.id?.() || 'default';
    return `vjs:speed:${id}`;
  } catch {
    return 'vjs:speed:default';
  }
}

function speedMemory(this: VjsPlayer) {
  const player = this as VjsPlayer;

  player.ready(() => {
    // Restore speed
    const key = getStorageKey(player);
    try {
      const saved = window.localStorage.getItem(key);
      if (saved) {
        const rate = parseFloat(saved);
        if (!Number.isNaN(rate) && rate > 0) {
          player.playbackRate(rate);
        }
      }
    } catch {}

    // Persist on change
    player.on('ratechange', () => {
      const k = getStorageKey(player);
      try {
        window.localStorage.setItem(k, String(player.playbackRate()));
      } catch {}
    });

    // Also update storage key if source changes
    player.on('loadedmetadata', () => {
      const k = getStorageKey(player);
      try {
        window.localStorage.setItem(k, String(player.playbackRate()));
      } catch {}
    });
  });
}

(videojs as any).registerPlugin(PLUGIN_NAME, speedMemory);

export default speedMemory;
