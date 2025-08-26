import videojs from 'video.js';
import { Component, Player } from 'video.js/dist/types';

const Plugin = videojs.getPlugin('plugin');

interface Chapter {
  id: string;
  title: string;
  startTime: number;
  endTime: number;
  thumbnail?: string;
  description?: string;
}

interface ChapterPluginOptions {
  chapters: Chapter[];
  onChapterClick?: (chapter: Chapter) => void;
}

class ChapterPlugin extends Plugin {
  private chapters: Chapter[];
  private currentChapterIndex: number = -1;
  private chapterDisplay: Component | null = null;
  private chapterMenu: Component | null = null;
  private onChapterClick?: (chapter: Chapter) => void;

  constructor(player: Player, options: ChapterPluginOptions) {
    super(player);

    this.chapters = options.chapters || [];
    this.onChapterClick = options.onChapterClick;

    // Sort chapters by start time
    this.chapters.sort((a, b) => a.startTime - b.startTime);

    // Initialize UI components
    this.createChapterDisplay();
    this.createChapterMenu();
    this.createChapterMarkers();

    // Listen to time updates
    this.player.on('timeupdate', this.updateCurrentChapter.bind(this));
  }

  private createChapterDisplay(): void {
    const Component = videojs.getComponent('Component');
    
    // Create chapter display component
    class ChapterDisplay extends Component {
      createEl() {
        return videojs.dom.createEl('div', {
          className: 'vjs-chapter-display',
          innerHTML: `
            <div class="vjs-chapter-display-title"></div>
            <div class="vjs-chapter-display-time"></div>
          `,
        });
      }

      updateChapter(chapter: Chapter | null) {
        const titleEl = this.el().querySelector('.vjs-chapter-display-title');
        const timeEl = this.el().querySelector('.vjs-chapter-display-time');
        
        if (chapter && titleEl && timeEl) {
          titleEl.textContent = chapter.title;
          timeEl.textContent = `${this.formatTime(chapter.startTime)} - ${this.formatTime(chapter.endTime)}`;
        }
      }

      formatTime(seconds: number): string {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = Math.floor(seconds % 60);
        
        if (hours > 0) {
          return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        }
        return `${minutes}:${secs.toString().padStart(2, '0')}`;
      }
    }

    videojs.registerComponent('ChapterDisplay', ChapterDisplay);
    
    this.chapterDisplay = this.player.addChild('ChapterDisplay');
    this.chapterDisplay.el().style.position = 'absolute';
    this.chapterDisplay.el().style.top = '10px';
    this.chapterDisplay.el().style.left = '10px';
    this.chapterDisplay.el().style.zIndex = '10';
    this.chapterDisplay.el().style.padding = '8px 12px';
    this.chapterDisplay.el().style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
    this.chapterDisplay.el().style.color = 'white';
    this.chapterDisplay.el().style.borderRadius = '4px';
    this.chapterDisplay.el().style.fontSize = '14px';
    this.chapterDisplay.hide();
  }

  private createChapterMenu(): void {
    const Component = videojs.getComponent('Component');
    const Menu = videojs.getComponent('Menu');
    const MenuItem = videojs.getComponent('MenuItem');
    
    // Create chapter menu button
    class ChapterMenuButton extends Component {
      createEl() {
        const el = videojs.dom.createEl('button', {
          className: 'vjs-chapters-button vjs-menu-button vjs-menu-button-popup vjs-control vjs-button',
          innerHTML: `
            <span class="vjs-icon-chapters" aria-hidden="true"></span>
            <span class="vjs-control-text" aria-live="polite">Chapters</span>
          `,
        });

        el.setAttribute('aria-disabled', 'false');
        el.setAttribute('aria-haspopup', 'true');
        el.setAttribute('title', 'Chapters');

        return el;
      }

      handleClick() {
        // Toggle menu visibility
        const menu = this.getChild('ChapterMenu');
        if (menu) {
          menu.el().style.display = menu.el().style.display === 'none' ? 'block' : 'none';
        }
      }
    }

    videojs.registerComponent('ChapterMenuButton', ChapterMenuButton);

    // Add chapter menu button to control bar
    const controlBar = this.player.controlBar;
    const chapterButton = controlBar.addChild('ChapterMenuButton', {}, controlBar.children().length - 2);

    // Create menu items for each chapter
    const menu = new Menu(this.player);
    
    this.chapters.forEach((chapter) => {
      const menuItem = new MenuItem(this.player, {
        label: chapter.title,
        selectable: false,
      });

      menuItem.on('click', () => {
        this.player.currentTime(chapter.startTime);
        if (this.onChapterClick) {
          this.onChapterClick(chapter);
        }
        menu.el().style.display = 'none';
      });

      menu.addChild(menuItem);
    });

    chapterButton.addChild(menu);
    menu.el().style.display = 'none';
    this.chapterMenu = menu;
  }

  private createChapterMarkers(): void {
    const progressControl = this.player.controlBar.progressControl;
    const seekBar = progressControl.seekBar;
    const duration = this.player.duration();

    if (!duration || duration === 0) {
      // Wait for metadata to load
      this.player.one('loadedmetadata', () => this.createChapterMarkers());
      return;
    }

    // Create markers on the progress bar
    this.chapters.forEach((chapter) => {
      const marker = videojs.dom.createEl('div', {
        className: 'vjs-chapter-marker',
        title: chapter.title,
      });

      // Calculate position percentage
      const position = (chapter.startTime / duration) * 100;
      marker.style.position = 'absolute';
      marker.style.left = `${position}%`;
      marker.style.width = '3px';
      marker.style.height = '100%';
      marker.style.backgroundColor = '#FFD700';
      marker.style.zIndex = '5';
      marker.style.cursor = 'pointer';

      // Add click handler
      marker.addEventListener('click', (e) => {
        e.stopPropagation();
        this.player.currentTime(chapter.startTime);
        if (this.onChapterClick) {
          this.onChapterClick(chapter);
        }
      });

      // Add hover tooltip
      marker.addEventListener('mouseenter', () => {
        const tooltip = videojs.dom.createEl('div', {
          className: 'vjs-chapter-tooltip',
          innerHTML: `
            <div class="vjs-chapter-tooltip-title">${chapter.title}</div>
            ${chapter.thumbnail ? `<img src="${chapter.thumbnail}" class="vjs-chapter-tooltip-thumbnail" />` : ''}
          `,
        });

        tooltip.style.position = 'absolute';
        tooltip.style.bottom = '120%';
        tooltip.style.left = '50%';
        tooltip.style.transform = 'translateX(-50%)';
        tooltip.style.padding = '8px';
        tooltip.style.backgroundColor = 'rgba(0, 0, 0, 0.9)';
        tooltip.style.color = 'white';
        tooltip.style.borderRadius = '4px';
        tooltip.style.fontSize = '12px';
        tooltip.style.whiteSpace = 'nowrap';
        tooltip.style.zIndex = '10';

        marker.appendChild(tooltip);
      });

      marker.addEventListener('mouseleave', () => {
        const tooltip = marker.querySelector('.vjs-chapter-tooltip');
        if (tooltip) {
          marker.removeChild(tooltip);
        }
      });

      seekBar.el().appendChild(marker);
    });
  }

  private updateCurrentChapter(): void {
    const currentTime = this.player.currentTime();
    let newChapterIndex = -1;

    // Find current chapter
    for (let i = 0; i < this.chapters.length; i++) {
      const chapter = this.chapters[i];
      if (currentTime >= chapter.startTime && currentTime < chapter.endTime) {
        newChapterIndex = i;
        break;
      }
    }

    // Update display if chapter changed
    if (newChapterIndex !== this.currentChapterIndex) {
      this.currentChapterIndex = newChapterIndex;
      
      if (this.chapterDisplay) {
        if (newChapterIndex >= 0) {
          (this.chapterDisplay as any).updateChapter(this.chapters[newChapterIndex]);
          this.chapterDisplay.show();
          
          // Hide after 3 seconds
          setTimeout(() => {
            if (this.chapterDisplay) {
              this.chapterDisplay.hide();
            }
          }, 3000);
        } else {
          this.chapterDisplay.hide();
        }
      }
    }
  }

  dispose(): void {
    if (this.chapterDisplay) {
      this.player.removeChild(this.chapterDisplay);
    }

    // Remove chapter markers
    const markers = this.player.el().querySelectorAll('.vjs-chapter-marker');
    markers.forEach(marker => marker.remove());

    super.dispose();
  }
}

// Register the plugin
videojs.registerPlugin('chapters', ChapterPlugin);

export default ChapterPlugin;