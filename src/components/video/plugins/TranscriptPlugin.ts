import videojs from 'video.js';
import { Player } from 'video.js/dist/types';

const Plugin = videojs.getPlugin('plugin');

interface TranscriptLine {
  id: string;
  startTime: number;
  endTime: number;
  text: string;
  speaker?: string;
}

interface TranscriptPluginOptions {
  transcript: TranscriptLine[];
  onTranscriptClick?: (line: TranscriptLine) => void;
}

class TranscriptPlugin extends Plugin {
  private transcript: TranscriptLine[];
  private currentLineIndex: number = -1;
  private transcriptPanel: HTMLElement | null = null;
  private onTranscriptClick?: (line: TranscriptLine) => void;

  constructor(player: Player, options: TranscriptPluginOptions) {
    super(player);

    this.transcript = options.transcript || [];
    this.onTranscriptClick = options.onTranscriptClick;

    // Sort transcript by start time
    this.transcript.sort((a, b) => a.startTime - b.startTime);

    // Create transcript panel
    this.createTranscriptPanel();

    // Listen to time updates
    this.player.on('timeupdate', this.updateCurrentLine.bind(this));
  }

  private createTranscriptPanel(): void {
    // Create transcript container
    this.transcriptPanel = document.createElement('div');
    this.transcriptPanel.className = 'vjs-transcript-panel';
    this.transcriptPanel.style.cssText = `
      position: absolute;
      top: 0;
      right: -350px;
      width: 350px;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.9);
      color: white;
      overflow-y: auto;
      padding: 20px;
      transition: right 0.3s ease;
      z-index: 1000;
    `;

    // Add header
    const header = document.createElement('div');
    header.className = 'vjs-transcript-header';
    header.style.cssText = `
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
      padding-bottom: 10px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.2);
    `;
    header.innerHTML = `
      <h3 style="margin: 0; font-size: 18px;">Transcript</h3>
      <button class="vjs-transcript-close" style="
        background: none;
        border: none;
        color: white;
        font-size: 20px;
        cursor: pointer;
      ">×</button>
    `;

    // Add search bar
    const searchBar = document.createElement('div');
    searchBar.className = 'vjs-transcript-search';
    searchBar.style.cssText = `
      margin-bottom: 20px;
    `;
    searchBar.innerHTML = `
      <input type="text" placeholder="Search transcript..." style="
        width: 100%;
        padding: 8px;
        background-color: rgba(255, 255, 255, 0.1);
        border: 1px solid rgba(255, 255, 255, 0.2);
        color: white;
        border-radius: 4px;
      ">
    `;

    // Add transcript content
    const content = document.createElement('div');
    content.className = 'vjs-transcript-content';
    content.style.cssText = `
      height: calc(100% - 120px);
      overflow-y: auto;
    `;

    // Add transcript lines
    this.transcript.forEach((line, index) => {
      const lineElement = document.createElement('div');
      lineElement.className = 'vjs-transcript-line';
      lineElement.dataset.index = index.toString();
      lineElement.style.cssText = `
        padding: 10px;
        margin-bottom: 10px;
        cursor: pointer;
        border-radius: 4px;
        transition: background-color 0.2s;
      `;

      // Add speaker if available
      if (line.speaker) {
        const speaker = document.createElement('div');
        speaker.className = 'vjs-transcript-speaker';
        speaker.style.cssText = `
          font-weight: bold;
          color: #FFD700;
          margin-bottom: 5px;
          font-size: 12px;
        `;
        speaker.textContent = line.speaker;
        lineElement.appendChild(speaker);
      }

      // Add timestamp
      const timestamp = document.createElement('div');
      timestamp.className = 'vjs-transcript-timestamp';
      timestamp.style.cssText = `
        font-size: 11px;
        color: rgba(255, 255, 255, 0.5);
        margin-bottom: 5px;
      `;
      timestamp.textContent = this.formatTime(line.startTime);
      lineElement.appendChild(timestamp);

      // Add text
      const text = document.createElement('div');
      text.className = 'vjs-transcript-text';
      text.style.cssText = `
        line-height: 1.5;
        font-size: 14px;
      `;
      text.textContent = line.text;
      lineElement.appendChild(text);

      // Add click handler
      lineElement.addEventListener('click', () => {
        this.player.currentTime(line.startTime);
        if (this.onTranscriptClick) {
          this.onTranscriptClick(line);
        }
      });

      // Add hover effect
      lineElement.addEventListener('mouseenter', () => {
        if (!lineElement.classList.contains('active')) {
          lineElement.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
        }
      });

      lineElement.addEventListener('mouseleave', () => {
        if (!lineElement.classList.contains('active')) {
          lineElement.style.backgroundColor = 'transparent';
        }
      });

      content.appendChild(lineElement);
    });

    // Assemble panel
    this.transcriptPanel.appendChild(header);
    this.transcriptPanel.appendChild(searchBar);
    this.transcriptPanel.appendChild(content);

    // Add to player container
    const playerEl = this.player.el();
    if (playerEl.parentElement) {
      playerEl.parentElement.style.position = 'relative';
      playerEl.parentElement.appendChild(this.transcriptPanel);
    }

    // Add close button handler
    const closeBtn = this.transcriptPanel.querySelector('.vjs-transcript-close');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => this.hideTranscript());
    }

    // Add search functionality
    const searchInput = this.transcriptPanel.querySelector('input');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        const query = (e.target as HTMLInputElement).value.toLowerCase();
        this.filterTranscript(query);
      });
    }

    // Create toggle button in control bar
    this.createTranscriptButton();
  }

  private createTranscriptButton(): void {
    const Component = videojs.getComponent('Component');

    class TranscriptButton extends Component {
      createEl() {
        const el = videojs.dom.createEl('button', {
          className: 'vjs-transcript-button vjs-control vjs-button',
          innerHTML: `
            <span class="vjs-icon-subtitles" aria-hidden="true"></span>
            <span class="vjs-control-text" aria-live="polite">Transcript</span>
          `,
        });

        el.setAttribute('title', 'Show Transcript');
        return el;
      }
    }

    videojs.registerComponent('TranscriptButton', TranscriptButton);

    const controlBar = this.player.controlBar;
    const transcriptButton = controlBar.addChild('TranscriptButton', {}, controlBar.children().length - 2);

    transcriptButton.on('click', () => this.toggleTranscript());
  }

  private toggleTranscript(): void {
    if (this.transcriptPanel) {
      const isVisible = this.transcriptPanel.style.right === '0px';
      this.transcriptPanel.style.right = isVisible ? '-350px' : '0px';
    }
  }

  private hideTranscript(): void {
    if (this.transcriptPanel) {
      this.transcriptPanel.style.right = '-350px';
    }
  }

  private updateCurrentLine(): void {
    const currentTime = this.player.currentTime();
    let newLineIndex = -1;

    // Find current line
    for (let i = 0; i < this.transcript.length; i++) {
      const line = this.transcript[i];
      if (currentTime >= line.startTime && currentTime < line.endTime) {
        newLineIndex = i;
        break;
      }
    }

    // Update highlighting if line changed
    if (newLineIndex !== this.currentLineIndex && this.transcriptPanel) {
      // Remove previous highlight
      if (this.currentLineIndex >= 0) {
        const prevLine = this.transcriptPanel.querySelector(`[data-index="${this.currentLineIndex}"]`);
        if (prevLine) {
          prevLine.classList.remove('active');
          (prevLine as HTMLElement).style.backgroundColor = 'transparent';
        }
      }

      // Add new highlight
      if (newLineIndex >= 0) {
        const newLine = this.transcriptPanel.querySelector(`[data-index="${newLineIndex}"]`);
        if (newLine) {
          newLine.classList.add('active');
          (newLine as HTMLElement).style.backgroundColor = 'rgba(29, 136, 229, 0.3)';
          
          // Scroll into view
          const content = this.transcriptPanel.querySelector('.vjs-transcript-content');
          if (content) {
            newLine.scrollIntoView({
              behavior: 'smooth',
              block: 'center',
            });
          }
        }
      }

      this.currentLineIndex = newLineIndex;
    }
  }

  private filterTranscript(query: string): void {
    if (!this.transcriptPanel) return;

    const lines = this.transcriptPanel.querySelectorAll('.vjs-transcript-line');
    lines.forEach((line) => {
      const text = line.textContent?.toLowerCase() || '';
      if (query && !text.includes(query)) {
        (line as HTMLElement).style.display = 'none';
      } else {
        (line as HTMLElement).style.display = 'block';
        
        // Highlight matching text
        if (query) {
          const textElement = line.querySelector('.vjs-transcript-text');
          if (textElement) {
            const originalText = this.transcript[parseInt(line.getAttribute('data-index') || '0')].text;
            const regex = new RegExp(`(${query})`, 'gi');
            textElement.innerHTML = originalText.replace(regex, '<mark style="background-color: #FFD700; color: black;">$1</mark>');
          }
        } else {
          // Reset highlighting
          const textElement = line.querySelector('.vjs-transcript-text');
          if (textElement) {
            textElement.textContent = this.transcript[parseInt(line.getAttribute('data-index') || '0')].text;
          }
        }
      }
    });
  }

  private formatTime(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  }

  dispose(): void {
    if (this.transcriptPanel && this.transcriptPanel.parentElement) {
      this.transcriptPanel.parentElement.removeChild(this.transcriptPanel);
    }

    super.dispose();
  }
}

// Register the plugin
videojs.registerPlugin('transcript', TranscriptPlugin);

export default TranscriptPlugin;