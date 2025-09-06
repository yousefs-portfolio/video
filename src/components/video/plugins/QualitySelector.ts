import videojs from 'video.js';

// Minimal Quality Selector plugin for progressive sources with custom `quality` labels
// Displays a MenuButton in the control bar to switch between provided sources.

const PLUGIN_NAME = 'qualitySelector';

interface SourceWithQuality extends videojs.Tech.SourceObject {
  quality?: string;
}

interface PluginOptions {
  default?: string; // e.g., '720p'
}

type VjsPlayer = ReturnType<typeof videojs> &
  videojs.Player & {
    currentSources?: () => SourceWithQuality[];
  };

const MenuButton = videojs.getComponent('MenuButton');
const MenuItem = videojs.getComponent('MenuItem');

class QualityMenuItem extends (MenuItem as any) {
  private player: VjsPlayer;
  private source: SourceWithQuality;
  private label: string;

  constructor(player: VjsPlayer, options: any) {
    super(player, options);
    this.player = player;
    this.source = options.source;
    this.label = options.label;
    this.on('click', this.handleClick.bind(this));
  }

  handleClick() {
    const currentTime = this.player.currentTime();
    const wasPaused = this.player.paused();
    const playbackRate = this.player.playbackRate();

    // Reorder sources putting selected first, keep type and others
    const allSources: SourceWithQuality[] =
      (this.player.options() as any)?.sources || this.player.currentSources?.() || [];
    const selected = this.source;
    const others = allSources.filter(
      (s) => (s.quality || s.src) !== (selected.quality || selected.src),
    );
    const newList = [selected, ...others];

    this.player.src(newList as any);
    this.player.one('loadedmetadata', () => {
      this.player.currentTime(currentTime);
      this.player.playbackRate(playbackRate);
      if (!wasPaused) this.player.play();
    });

    // Update selected state in menu
    this.player.trigger('qualitychanged');
  }
}

class QualitySelectorButton extends (MenuButton as any) {
  private player: VjsPlayer;
  private sources: SourceWithQuality[] = [];
  private selectedLabel: string | undefined;

  constructor(player: VjsPlayer, options: PluginOptions = {}) {
    super(player, options);
    this.player = player;
    this.addClass('vjs-quality-selector');
    this.controlText('Quality');

    this.sources = ((player.options() as any)?.sources ||
      player.currentSources?.() ||
      []) as SourceWithQuality[];
    this.selectedLabel = options.default;

    // Update menu on source changes
    this.player.on('loadedmetadata', () => {
      this.sources = ((player.options() as any)?.sources ||
        player.currentSources?.() ||
        []) as SourceWithQuality[];
      this.update();
    });

    this.player.on('qualitychanged', () => this.update());
  }

  createEl() {
    const el = super.createEl();
    el.classList.add('vjs-menu-button', 'vjs-menu-button-popup');
    return el;
  }

  createItems() {
    const items: any[] = [];
    const sourceGroups: { label: string; source: SourceWithQuality }[] = [];

    // Build by unique quality labels, fallback to src
    for (const s of this.sources) {
      const label = s.quality || (s as any).label || s.src || '';
      if (!label) continue;
      if (!sourceGroups.find((g) => g.label === label)) {
        sourceGroups.push({ label, source: s });
      }
    }

    // Sort by common resolution order if possible (e.g., 1080p > 720p > 480p)
    sourceGroups.sort((a, b) => {
      const num = (t: string) => parseInt((t.match(/(\d{3,4})p/) || [, '0'])[1] as string, 10);
      return num(b.label) - num(a.label);
    });

    for (const g of sourceGroups) {
      const item = new (QualityMenuItem as any)(this.player, {
        label: g.label,
        selectable: true,
        multiSelectable: false,
        source: g.source,
      });
      items.push(item);
    }

    return items;
  }

  handleClick() {
    // open menu
    super.handleClick();
  }

  buildCSSClass() {
    return 'vjs-quality-selector ' + (MenuButton as any).prototype.buildCSSClass.call(this);
  }
}

function qualitySelector(this: VjsPlayer, options: PluginOptions = {}) {
  const player = this as VjsPlayer;
  player.ready(() => {
    if (!(videojs as any).getComponent('QualitySelectorButton')) {
      (videojs as any).registerComponent('QualitySelectorButton', QualitySelectorButton);
      (videojs as any).registerComponent('QualityMenuItem', QualityMenuItem);
    }

    // Add to control bar, before fullscreen if present
    const controlBar = (player as any).controlBar;
    if (controlBar && !(controlBar as any).qualitySelector) {
      (controlBar as any).qualitySelector = controlBar.addChild(
        'QualitySelectorButton',
        options,
        controlBar.children_.length - 1,
      );
    }
  });
}

(videojs as any).registerPlugin(PLUGIN_NAME, qualitySelector);

export default qualitySelector;
