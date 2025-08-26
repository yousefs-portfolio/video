import videojs from 'video.js';
import { Player } from 'video.js/dist/types';

const Plugin = videojs.getPlugin('plugin');

interface KeyboardShortcutsOptions {
  shortcuts?: Record<string, () => void>;
}

class KeyboardShortcutsPlugin extends Plugin {
  private shortcuts: Record<string, () => void>;
  private handleKeyPress: (e: KeyboardEvent) => void;

  constructor(player: Player, options: KeyboardShortcutsOptions) {
    super(player);
    this.shortcuts = options.shortcuts || {};
    
    this.handleKeyPress = (e: KeyboardEvent) => {
      const key = this.getKeyString(e);
      if (this.shortcuts[key]) {
        e.preventDefault();
        this.shortcuts[key]();
      }
    };

    this.player.el().addEventListener('keydown', this.handleKeyPress);
  }

  private getKeyString(e: KeyboardEvent): string {
    const modifiers = [];
    if (e.shiftKey) modifiers.push('shift');
    if (e.ctrlKey) modifiers.push('ctrl');
    if (e.altKey) modifiers.push('alt');
    if (e.metaKey) modifiers.push('meta');
    
    const key = e.key.toLowerCase();
    return modifiers.length > 0 ? `${modifiers.join('+')}+${key}` : key;
  }

  dispose(): void {
    this.player.el().removeEventListener('keydown', this.handleKeyPress);
    super.dispose();
  }
}

videojs.registerPlugin('keyboardShortcuts', KeyboardShortcutsPlugin);
export default KeyboardShortcutsPlugin;