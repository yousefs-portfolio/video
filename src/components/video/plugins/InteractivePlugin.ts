import videojs from 'video.js';
import { Player } from 'video.js/dist/types';

const Plugin = videojs.getPlugin('plugin');

interface InteractiveElement {
  id: string;
  type: 'quiz' | 'poll' | 'hotspot' | 'annotation' | 'branch';
  startTime: number;
  endTime: number;
  pauseOnDisplay?: boolean;
  data: any;
  position?: { x: number; y: number };
  size?: { width: number; height: number };
}

interface InteractivePluginOptions {
  elements: InteractiveElement[];
  onInteraction?: (element: InteractiveElement, response: any) => void;
}

class InteractivePlugin extends Plugin {
  private elements: InteractiveElement[];
  private activeElements: Map<string, HTMLElement> = new Map();
  private onInteraction?: (element: InteractiveElement, response: any) => void;
  private overlay: HTMLElement | null = null;

  constructor(player: Player, options: InteractivePluginOptions) {
    super(player);

    this.elements = options.elements || [];
    this.onInteraction = options.onInteraction;

    // Sort elements by start time
    this.elements.sort((a, b) => a.startTime - b.startTime);

    // Create overlay container
    this.createOverlay();

    // Listen to time updates
    this.player.on('timeupdate', this.checkElements.bind(this));
  }

  private createOverlay(): void {
    this.overlay = document.createElement('div');
    this.overlay.className = 'vjs-interactive-overlay';
    this.overlay.style.cssText = `
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: 100;
    `;

    this.player.el().appendChild(this.overlay);
  }

  private checkElements(): void {
    const currentTime = this.player.currentTime();

    // Check which elements should be active
    this.elements.forEach(element => {
      const isActive = currentTime >= element.startTime && currentTime < element.endTime;
      const isCurrentlyActive = this.activeElements.has(element.id);

      if (isActive && !isCurrentlyActive) {
        this.showElement(element);
      } else if (!isActive && isCurrentlyActive) {
        this.hideElement(element);
      }
    });
  }

  private showElement(element: InteractiveElement): void {
    let elementDiv: HTMLElement;

    switch (element.type) {
      case 'quiz':
        elementDiv = this.createQuizElement(element);
        break;
      case 'poll':
        elementDiv = this.createPollElement(element);
        break;
      case 'hotspot':
        elementDiv = this.createHotspotElement(element);
        break;
      case 'annotation':
        elementDiv = this.createAnnotationElement(element);
        break;
      case 'branch':
        elementDiv = this.createBranchElement(element);
        break;
      default:
        return;
    }

    if (element.pauseOnDisplay) {
      this.player.pause();
    }

    this.activeElements.set(element.id, elementDiv);
    this.overlay?.appendChild(elementDiv);

    // Animate in
    requestAnimationFrame(() => {
      elementDiv.style.opacity = '1';
      elementDiv.style.transform = 'scale(1)';
    });
  }

  private hideElement(element: InteractiveElement): void {
    const elementDiv = this.activeElements.get(element.id);
    if (elementDiv) {
      // Animate out
      elementDiv.style.opacity = '0';
      elementDiv.style.transform = 'scale(0.9)';
      
      setTimeout(() => {
        elementDiv.remove();
        this.activeElements.delete(element.id);
      }, 300);
    }
  }

  private createQuizElement(element: InteractiveElement): HTMLElement {
    const div = document.createElement('div');
    div.className = 'vjs-interactive-quiz';
    div.style.cssText = `
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%) scale(0.9);
      background: linear-gradient(135deg, rgba(29, 136, 229, 0.95) 0%, rgba(156, 39, 176, 0.95) 100%);
      color: white;
      padding: 24px;
      border-radius: 16px;
      min-width: 400px;
      max-width: 600px;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
      pointer-events: auto;
      opacity: 0;
      transition: all 0.3s ease;
    `;

    const quiz = element.data;
    
    div.innerHTML = `
      <div style="margin-bottom: 20px;">
        <h3 style="margin: 0 0 8px 0; font-size: 20px; font-weight: 600;">
          ${quiz.question}
        </h3>
        ${quiz.description ? `<p style="margin: 0; opacity: 0.9; font-size: 14px;">${quiz.description}</p>` : ''}
      </div>
      <div class="quiz-options" style="display: flex; flex-direction: column; gap: 12px;">
        ${quiz.options.map((option: any, index: number) => `
          <button class="quiz-option" data-index="${index}" style="
            background: rgba(255, 255, 255, 0.1);
            border: 2px solid rgba(255, 255, 255, 0.3);
            color: white;
            padding: 12px 16px;
            border-radius: 8px;
            cursor: pointer;
            text-align: left;
            font-size: 15px;
            transition: all 0.2s ease;
          ">
            ${option.text}
          </button>
        `).join('')}
      </div>
      <div style="margin-top: 20px; display: flex; justify-content: space-between; align-items: center;">
        <span style="font-size: 12px; opacity: 0.7;">Interactive Quiz</span>
        <button class="skip-btn" style="
          background: rgba(255, 255, 255, 0.2);
          border: none;
          color: white;
          padding: 8px 16px;
          border-radius: 6px;
          cursor: pointer;
          font-size: 14px;
        ">Skip</button>
      </div>
    `;

    // Add event listeners
    const options = div.querySelectorAll('.quiz-option');
    options.forEach((option) => {
      option.addEventListener('click', (e) => {
        const index = parseInt((e.target as HTMLElement).dataset.index || '0');
        this.handleQuizAnswer(element, index);
      });

      option.addEventListener('mouseenter', (e) => {
        (e.target as HTMLElement).style.background = 'rgba(255, 255, 255, 0.2)';
        (e.target as HTMLElement).style.borderColor = 'white';
      });

      option.addEventListener('mouseleave', (e) => {
        (e.target as HTMLElement).style.background = 'rgba(255, 255, 255, 0.1)';
        (e.target as HTMLElement).style.borderColor = 'rgba(255, 255, 255, 0.3)';
      });
    });

    const skipBtn = div.querySelector('.skip-btn');
    skipBtn?.addEventListener('click', () => {
      this.hideElement(element);
      this.player.play();
    });

    return div;
  }

  private createPollElement(element: InteractiveElement): HTMLElement {
    const div = document.createElement('div');
    div.className = 'vjs-interactive-poll';
    div.style.cssText = `
      position: absolute;
      bottom: 80px;
      right: 20px;
      background: rgba(0, 0, 0, 0.9);
      color: white;
      padding: 16px;
      border-radius: 12px;
      min-width: 250px;
      pointer-events: auto;
      opacity: 0;
      transform: scale(0.9);
      transition: all 0.3s ease;
      border: 1px solid rgba(255, 215, 0, 0.5);
    `;

    const poll = element.data;
    
    div.innerHTML = `
      <div style="margin-bottom: 12px;">
        <h4 style="margin: 0 0 4px 0; font-size: 16px; color: #FFD700;">
          Quick Poll
        </h4>
        <p style="margin: 0; font-size: 14px;">${poll.question}</p>
      </div>
      <div style="display: flex; flex-direction: column; gap: 8px;">
        ${poll.options.map((option: string, index: number) => `
          <button class="poll-option" data-index="${index}" style="
            background: rgba(255, 255, 255, 0.05);
            border: 1px solid rgba(255, 255, 255, 0.2);
            color: white;
            padding: 8px 12px;
            border-radius: 6px;
            cursor: pointer;
            font-size: 14px;
            text-align: left;
            transition: all 0.2s ease;
          ">
            ${option}
          </button>
        `).join('')}
      </div>
    `;

    // Add event listeners
    const options = div.querySelectorAll('.poll-option');
    options.forEach((option) => {
      option.addEventListener('click', (e) => {
        const index = parseInt((e.target as HTMLElement).dataset.index || '0');
        this.handlePollVote(element, index);
      });
    });

    return div;
  }

  private createHotspotElement(element: InteractiveElement): HTMLElement {
    const div = document.createElement('div');
    div.className = 'vjs-interactive-hotspot';
    
    const position = element.position || { x: 50, y: 50 };
    const size = element.size || { width: 100, height: 100 };
    
    div.style.cssText = `
      position: absolute;
      left: ${position.x}%;
      top: ${position.y}%;
      transform: translate(-50%, -50%);
      width: ${size.width}px;
      height: ${size.height}px;
      pointer-events: auto;
      cursor: pointer;
    `;

    const hotspot = element.data;
    
    // Create pulsing circle
    div.innerHTML = `
      <div style="
        width: 100%;
        height: 100%;
        border: 3px solid #FFD700;
        border-radius: 50%;
        position: relative;
        animation: pulse 2s infinite;
      ">
        <div style="
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          background: #FFD700;
          color: black;
          width: 30px;
          height: 30px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
        ">i</div>
      </div>
      <style>
        @keyframes pulse {
          0% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.1); opacity: 0.8; }
          100% { transform: scale(1); opacity: 1; }
        }
      </style>
    `;

    // Tooltip on hover
    const tooltip = document.createElement('div');
    tooltip.style.cssText = `
      position: absolute;
      bottom: 120%;
      left: 50%;
      transform: translateX(-50%);
      background: rgba(0, 0, 0, 0.95);
      color: white;
      padding: 12px;
      border-radius: 8px;
      min-width: 200px;
      display: none;
      z-index: 10;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
    `;
    
    tooltip.innerHTML = `
      <div style="font-weight: bold; margin-bottom: 4px;">${hotspot.title}</div>
      <div style="font-size: 14px;">${hotspot.description}</div>
      ${hotspot.link ? `<a href="${hotspot.link}" target="_blank" style="color: #FFD700; font-size: 12px;">Learn More →</a>` : ''}
    `;
    
    div.appendChild(tooltip);

    // Show/hide tooltip
    div.addEventListener('mouseenter', () => {
      tooltip.style.display = 'block';
    });
    
    div.addEventListener('mouseleave', () => {
      tooltip.style.display = 'none';
    });

    // Click handler
    div.addEventListener('click', () => {
      if (this.onInteraction) {
        this.onInteraction(element, { clicked: true });
      }
      if (hotspot.link) {
        window.open(hotspot.link, '_blank');
      }
    });

    return div;
  }

  private createAnnotationElement(element: InteractiveElement): HTMLElement {
    const div = document.createElement('div');
    div.className = 'vjs-interactive-annotation';
    
    const position = element.position || { x: 70, y: 20 };
    
    div.style.cssText = `
      position: absolute;
      left: ${position.x}%;
      top: ${position.y}%;
      transform: translate(-50%, 0);
      background: linear-gradient(135deg, rgba(255, 215, 0, 0.95) 0%, rgba(255, 140, 0, 0.95) 100%);
      color: black;
      padding: 12px 16px;
      border-radius: 8px;
      max-width: 300px;
      pointer-events: auto;
      opacity: 0;
      transform: translateY(-10px) scale(0.9);
      transition: all 0.3s ease;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    `;

    const annotation = element.data;
    
    div.innerHTML = `
      <div style="display: flex; align-items: start; gap: 8px;">
        <div style="
          background: rgba(0, 0, 0, 0.2);
          width: 24px;
          height: 24px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        ">
          <span style="font-size: 14px;">💡</span>
        </div>
        <div>
          ${annotation.title ? `<div style="font-weight: bold; margin-bottom: 4px;">${annotation.title}</div>` : ''}
          <div style="font-size: 14px; line-height: 1.4;">${annotation.text}</div>
        </div>
        <button style="
          background: none;
          border: none;
          font-size: 18px;
          cursor: pointer;
          padding: 0;
          margin: -4px -8px 0 0;
        " class="close-annotation">×</button>
      </div>
    `;

    // Close button
    const closeBtn = div.querySelector('.close-annotation');
    closeBtn?.addEventListener('click', () => {
      this.hideElement(element);
    });

    return div;
  }

  private createBranchElement(element: InteractiveElement): HTMLElement {
    const div = document.createElement('div');
    div.className = 'vjs-interactive-branch';
    div.style.cssText = `
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%) scale(0.9);
      background: rgba(0, 0, 0, 0.95);
      color: white;
      padding: 32px;
      border-radius: 16px;
      min-width: 500px;
      pointer-events: auto;
      opacity: 0;
      transition: all 0.3s ease;
      border: 2px solid #FFD700;
    `;

    const branch = element.data;
    
    div.innerHTML = `
      <div style="text-align: center;">
        <h3 style="margin: 0 0 16px 0; font-size: 24px; color: #FFD700;">
          Choose Your Path
        </h3>
        <p style="margin: 0 0 24px 0; font-size: 16px; opacity: 0.9;">
          ${branch.description}
        </p>
        <div style="display: flex; gap: 16px; justify-content: center;">
          ${branch.options.map((option: any, index: number) => `
            <div class="branch-option" data-index="${index}" style="
              background: rgba(255, 255, 255, 0.05);
              border: 2px solid rgba(255, 215, 0, 0.5);
              padding: 20px;
              border-radius: 12px;
              cursor: pointer;
              flex: 1;
              transition: all 0.3s ease;
            ">
              <div style="font-size: 32px; margin-bottom: 8px;">${option.icon || '🎯'}</div>
              <div style="font-weight: bold; margin-bottom: 8px;">${option.title}</div>
              <div style="font-size: 14px; opacity: 0.8;">${option.description}</div>
            </div>
          `).join('')}
        </div>
      </div>
    `;

    // Add event listeners
    const options = div.querySelectorAll('.branch-option');
    options.forEach((option) => {
      option.addEventListener('click', (e) => {
        const index = parseInt((e.currentTarget as HTMLElement).dataset.index || '0');
        this.handleBranchChoice(element, index);
      });

      option.addEventListener('mouseenter', (e) => {
        (e.currentTarget as HTMLElement).style.background = 'rgba(255, 215, 0, 0.1)';
        (e.currentTarget as HTMLElement).style.borderColor = '#FFD700';
        (e.currentTarget as HTMLElement).style.transform = 'scale(1.05)';
      });

      option.addEventListener('mouseleave', (e) => {
        (e.currentTarget as HTMLElement).style.background = 'rgba(255, 255, 255, 0.05)';
        (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255, 215, 0, 0.5)';
        (e.currentTarget as HTMLElement).style.transform = 'scale(1)';
      });
    });

    return div;
  }

  private handleQuizAnswer(element: InteractiveElement, answerIndex: number): void {
    const correct = element.data.options[answerIndex].correct;
    
    if (this.onInteraction) {
      this.onInteraction(element, {
        type: 'quiz_answer',
        answerIndex,
        correct,
        timestamp: this.player.currentTime(),
      });
    }

    // Show feedback
    const elementDiv = this.activeElements.get(element.id);
    if (elementDiv) {
      const options = elementDiv.querySelectorAll('.quiz-option');
      const selectedOption = options[answerIndex] as HTMLElement;
      
      if (correct) {
        selectedOption.style.background = 'rgba(76, 175, 80, 0.3)';
        selectedOption.style.borderColor = '#4CAF50';
      } else {
        selectedOption.style.background = 'rgba(244, 67, 54, 0.3)';
        selectedOption.style.borderColor = '#F44336';
        
        // Show correct answer
        element.data.options.forEach((opt: any, index: number) => {
          if (opt.correct) {
            (options[index] as HTMLElement).style.background = 'rgba(76, 175, 80, 0.3)';
            (options[index] as HTMLElement).style.borderColor = '#4CAF50';
          }
        });
      }

      // Continue after 2 seconds
      setTimeout(() => {
        this.hideElement(element);
        this.player.play();
      }, 2000);
    }
  }

  private handlePollVote(element: InteractiveElement, optionIndex: number): void {
    if (this.onInteraction) {
      this.onInteraction(element, {
        type: 'poll_vote',
        optionIndex,
        timestamp: this.player.currentTime(),
      });
    }

    // Show thank you message
    const elementDiv = this.activeElements.get(element.id);
    if (elementDiv) {
      elementDiv.innerHTML = `
        <div style="text-align: center; padding: 16px;">
          <div style="font-size: 24px; margin-bottom: 8px;">✅</div>
          <div style="font-weight: bold;">Thank you for voting!</div>
        </div>
      `;

      setTimeout(() => {
        this.hideElement(element);
      }, 1500);
    }
  }

  private handleBranchChoice(element: InteractiveElement, choiceIndex: number): void {
    const choice = element.data.options[choiceIndex];
    
    if (this.onInteraction) {
      this.onInteraction(element, {
        type: 'branch_choice',
        choiceIndex,
        nextVideo: choice.nextVideo,
        timestamp: this.player.currentTime(),
      });
    }

    // Navigate to next video or timestamp
    if (choice.nextVideo) {
      // This would trigger navigation to a different video
      console.log('Navigate to:', choice.nextVideo);
    } else if (choice.timestamp) {
      this.player.currentTime(choice.timestamp);
    }

    this.hideElement(element);
    this.player.play();
  }

  dispose(): void {
    // Clean up all active elements
    this.activeElements.forEach((element) => {
      element.remove();
    });
    this.activeElements.clear();

    // Remove overlay
    if (this.overlay) {
      this.overlay.remove();
    }

    super.dispose();
  }
}

// Register the plugin
videojs.registerPlugin('interactive', InteractivePlugin);

export default InteractivePlugin;