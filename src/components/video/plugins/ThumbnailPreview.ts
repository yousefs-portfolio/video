import videojs from 'video.js';

// Thumbnail preview plugin: shows a small preview above the progress bar while hovering.
// It uses a sprite image with fixed tile width/height and a given interval between thumbs.

const PLUGIN_NAME = 'thumbnailPreview';

type VjsPlayer = ReturnType<typeof videojs> & videojs.Player;

export interface ThumbnailPreviewConfig {
  src: string; // sprite sheet URL
  width: number; // each tile width in px
  height: number; // each tile height in px
  columns: number; // number of columns in sprite
  interval: number; // seconds per thumbnail
}

function formatTime(seconds: number) {
  if (!isFinite(seconds)) return '0:00';
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60)
    .toString()
    .padStart(2, '0');
  return `${m}:${s}`;
}

function thumbnailPreview(this: VjsPlayer, cfg: ThumbnailPreviewConfig) {
  const player = this as VjsPlayer;

  player.ready(() => {
    const controlBar = (player as any).controlBar;
    const progressControl = controlBar && (controlBar as any).progressControl;
    if (!progressControl) return;

    // Create preview container
    const preview = document.createElement('div');
    preview.className = 'vjs-thumbnail-preview';
    Object.assign(preview.style, {
      position: 'absolute',
      bottom: '24px',
      width: `${cfg.width}px`,
      height: `${cfg.height + 18}px`,
      pointerEvents: 'none',
      display: 'none',
      transform: 'translateX(-50%)',
      zIndex: '1000',
    } as CSSStyleDeclaration);

    // Thumbnail image area
    const img = document.createElement('div');
    Object.assign(img.style, {
      width: `${cfg.width}px`,
      height: `${cfg.height}px`,
      backgroundImage: `url(${cfg.src})`,
      backgroundRepeat: 'no-repeat',
      backgroundSize: 'auto',
      borderRadius: '6px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
    } as CSSStyleDeclaration);

    // Time label
    const label = document.createElement('div');
    label.textContent = '0:00';
    Object.assign(label.style, {
      marginTop: '4px',
      fontFamily: 'Inter, system-ui, sans-serif',
      fontSize: '12px',
      textAlign: 'center',
      color: '#fff',
      background: 'rgba(0,0,0,0.6)',
      padding: '2px 6px',
      borderRadius: '999px',
      width: 'fit-content',
      marginLeft: 'auto',
      marginRight: 'auto',
    } as CSSStyleDeclaration);

    preview.appendChild(img);
    preview.appendChild(label);

    const el = (progressControl as any).el() as HTMLElement;
    el.style.position = el.style.position || 'relative';
    el.appendChild(preview);

    function updateFromPageX(pageX: number) {
      const rect = el.getBoundingClientRect();
      const x = Math.min(Math.max(pageX - rect.left, 0), rect.width);
      const pct = rect.width > 0 ? x / rect.width : 0;
      const time = pct * player.duration();
      label.textContent = formatTime(time);

      // Calculate sprite offset
      const index = Math.floor(time / cfg.interval);
      const col = index % cfg.columns;
      const row = Math.floor(index / cfg.columns);
      const bgX = -(col * cfg.width);
      const bgY = -(row * cfg.height);
      img.style.backgroundPosition = `${bgX}px ${bgY}px`;

      // Position preview horizontally
      (preview.style as any).left = `${x}px`;
    }

    function show() {
      preview.style.display = 'block';
    }
    function hide() {
      preview.style.display = 'none';
    }

    const seekBar = (progressControl as any).seekBar;
    const seekEl: HTMLElement = seekBar ? seekBar.el() : el;

    const mouseMove = (e: MouseEvent) => updateFromPageX(e.pageX);
    const touchMove = (e: TouchEvent) => {
      if (e.touches && e.touches[0]) updateFromPageX(e.touches[0].pageX);
    };

    seekEl.addEventListener('mouseenter', show);
    seekEl.addEventListener('mouseleave', hide);
    seekEl.addEventListener('mousemove', mouseMove);
    seekEl.addEventListener('touchstart', show, { passive: true });
    seekEl.addEventListener('touchmove', touchMove, { passive: true });
    seekEl.addEventListener('touchend', hide, { passive: true });

    player.on('dispose', () => {
      seekEl.removeEventListener('mouseenter', show);
      seekEl.removeEventListener('mouseleave', hide);
      seekEl.removeEventListener('mousemove', mouseMove);
      seekEl.removeEventListener('touchstart', show as any);
      seekEl.removeEventListener('touchmove', touchMove as any);
      seekEl.removeEventListener('touchend', hide as any);
      preview.remove();
    });
  });
}

(videojs as any).registerPlugin(PLUGIN_NAME, thumbnailPreview);

export default thumbnailPreview;
