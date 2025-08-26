import videojs from 'video.js';
import { Player } from 'video.js/dist/types';

const Plugin = videojs.getPlugin('plugin');

interface AnalyticsEvent {
  type: string;
  timestamp: number;
  position: number;
  data?: any;
}

interface AnalyticsPluginOptions {
  videoId: string;
  userId: string;
  onEvent?: (event: AnalyticsEvent) => void;
  trackingInterval?: number;
  enableHeatmap?: boolean;
  enableEngagement?: boolean;
}

class AnalyticsPlugin extends Plugin {
  private videoId: string;
  private userId: string;
  private sessionId: string;
  private events: AnalyticsEvent[] = [];
  private heatmap: Map<number, number> = new Map();
  private engagementData: any = {
    playCount: 0,
    pauseCount: 0,
    seekCount: 0,
    bufferCount: 0,
    qualityChanges: 0,
    speedChanges: 0,
    fullscreenToggles: 0,
    totalWatchTime: 0,
    completionPercentage: 0,
  };
  private watchStartTime: number = 0;
  private lastPosition: number = 0;
  private trackingTimer: NodeJS.Timeout | null = null;
  private onEvent?: (event: AnalyticsEvent) => void;
  private options: AnalyticsPluginOptions;

  constructor(player: Player, options: AnalyticsPluginOptions) {
    super(player);

    this.videoId = options.videoId;
    this.userId = options.userId;
    this.sessionId = this.generateSessionId();
    this.onEvent = options.onEvent;
    this.options = options;

    this.initializeTracking();
  }

  private generateSessionId(): string {
    return `${this.userId}_${this.videoId}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private initializeTracking(): void {
    // Track play events
    this.player.on('play', () => {
      this.watchStartTime = Date.now();
      this.engagementData.playCount++;
      this.trackEvent({
        type: 'play',
        timestamp: Date.now(),
        position: this.player.currentTime(),
      });

      // Start periodic tracking
      this.startPeriodicTracking();
    });

    // Track pause events
    this.player.on('pause', () => {
      this.engagementData.pauseCount++;
      this.trackEvent({
        type: 'pause',
        timestamp: Date.now(),
        position: this.player.currentTime(),
      });

      // Stop periodic tracking
      this.stopPeriodicTracking();
      this.updateWatchTime();
    });

    // Track seeking
    this.player.on('seeking', () => {
      this.trackEvent({
        type: 'seek_start',
        timestamp: Date.now(),
        position: this.lastPosition,
      });
    });

    this.player.on('seeked', () => {
      this.engagementData.seekCount++;
      this.trackEvent({
        type: 'seek_end',
        timestamp: Date.now(),
        position: this.player.currentTime(),
        data: {
          from: this.lastPosition,
          to: this.player.currentTime(),
        },
      });
    });

    // Track buffering
    this.player.on('waiting', () => {
      this.engagementData.bufferCount++;
      this.trackEvent({
        type: 'buffer_start',
        timestamp: Date.now(),
        position: this.player.currentTime(),
      });
    });

    this.player.on('playing', () => {
      this.trackEvent({
        type: 'buffer_end',
        timestamp: Date.now(),
        position: this.player.currentTime(),
      });
    });

    // Track quality changes
    this.player.on('qualitychange', (e: any) => {
      this.engagementData.qualityChanges++;
      this.trackEvent({
        type: 'quality_change',
        timestamp: Date.now(),
        position: this.player.currentTime(),
        data: {
          quality: e.quality,
        },
      });
    });

    // Track playback rate changes
    this.player.on('ratechange', () => {
      this.engagementData.speedChanges++;
      this.trackEvent({
        type: 'speed_change',
        timestamp: Date.now(),
        position: this.player.currentTime(),
        data: {
          rate: this.player.playbackRate(),
        },
      });
    });

    // Track fullscreen
    this.player.on('fullscreenchange', () => {
      this.engagementData.fullscreenToggles++;
      this.trackEvent({
        type: 'fullscreen_toggle',
        timestamp: Date.now(),
        position: this.player.currentTime(),
        data: {
          fullscreen: this.player.isFullscreen(),
        },
      });
    });

    // Track volume changes
    this.player.on('volumechange', () => {
      this.trackEvent({
        type: 'volume_change',
        timestamp: Date.now(),
        position: this.player.currentTime(),
        data: {
          volume: this.player.volume(),
          muted: this.player.muted(),
        },
      });
    });

    // Track progress
    this.player.on('progress', () => {
      const buffered = this.player.buffered();
      const duration = this.player.duration();
      
      if (buffered.length > 0 && duration > 0) {
        const bufferedEnd = buffered.end(buffered.length - 1);
        const bufferedPercentage = (bufferedEnd / duration) * 100;
        
        this.trackEvent({
          type: 'progress',
          timestamp: Date.now(),
          position: this.player.currentTime(),
          data: {
            buffered: bufferedPercentage,
          },
        });
      }
    });

    // Track time updates for heatmap
    if (this.options.enableHeatmap) {
      this.player.on('timeupdate', () => {
        const position = Math.floor(this.player.currentTime());
        const count = this.heatmap.get(position) || 0;
        this.heatmap.set(position, count + 1);
        this.lastPosition = this.player.currentTime();
      });
    }

    // Track video ended
    this.player.on('ended', () => {
      this.engagementData.completionPercentage = 100;
      this.updateWatchTime();
      this.trackEvent({
        type: 'ended',
        timestamp: Date.now(),
        position: this.player.duration(),
      });
      this.sendAnalytics();
    });

    // Track errors
    this.player.on('error', () => {
      const error = this.player.error();
      this.trackEvent({
        type: 'error',
        timestamp: Date.now(),
        position: this.player.currentTime(),
        data: {
          code: error?.code,
          message: error?.message,
        },
      });
    });

    // Send analytics on page unload
    window.addEventListener('beforeunload', () => {
      this.sendAnalytics();
    });

    // Send initial load event
    this.trackEvent({
      type: 'load',
      timestamp: Date.now(),
      position: 0,
      data: {
        videoId: this.videoId,
        userId: this.userId,
        sessionId: this.sessionId,
        userAgent: navigator.userAgent,
        screenResolution: `${window.screen.width}x${window.screen.height}`,
        viewport: `${window.innerWidth}x${window.innerHeight}`,
      },
    });
  }

  private startPeriodicTracking(): void {
    if (this.trackingTimer) return;

    const interval = this.options.trackingInterval || 10000; // Default 10 seconds

    this.trackingTimer = setInterval(() => {
      const currentTime = this.player.currentTime();
      const duration = this.player.duration();
      
      if (duration > 0) {
        this.engagementData.completionPercentage = (currentTime / duration) * 100;
      }

      this.trackEvent({
        type: 'heartbeat',
        timestamp: Date.now(),
        position: currentTime,
        data: {
          watchedPercentage: this.engagementData.completionPercentage,
          engagement: this.calculateEngagementScore(),
        },
      });
    }, interval);
  }

  private stopPeriodicTracking(): void {
    if (this.trackingTimer) {
      clearInterval(this.trackingTimer);
      this.trackingTimer = null;
    }
  }

  private updateWatchTime(): void {
    if (this.watchStartTime > 0) {
      const sessionTime = (Date.now() - this.watchStartTime) / 1000;
      this.engagementData.totalWatchTime += sessionTime;
      this.watchStartTime = 0;
    }
  }

  private calculateEngagementScore(): number {
    // Calculate engagement score based on various factors
    const duration = this.player.duration();
    if (!duration || duration === 0) return 0;

    const watchPercentage = (this.player.currentTime() / duration) * 100;
    const interactionRate = (this.engagementData.pauseCount + 
                           this.engagementData.seekCount + 
                           this.engagementData.speedChanges) / 
                           Math.max(1, this.engagementData.totalWatchTime / 60);
    
    // Penalize too many seeks or pauses (might indicate confusion)
    const seekPenalty = Math.min(1, 10 / Math.max(1, this.engagementData.seekCount));
    const bufferPenalty = Math.min(1, 5 / Math.max(1, this.engagementData.bufferCount));
    
    // Calculate final score (0-100)
    const score = (watchPercentage * 0.4) + 
                  (Math.min(100, interactionRate * 10) * 0.2) +
                  (seekPenalty * 100 * 0.2) +
                  (bufferPenalty * 100 * 0.2);
    
    return Math.min(100, Math.max(0, score));
  }

  private trackEvent(event: AnalyticsEvent): void {
    this.events.push(event);
    
    if (this.onEvent) {
      this.onEvent(event);
    }

    // Send batch of events if buffer is full
    if (this.events.length >= 50) {
      this.sendAnalytics();
    }
  }

  private sendAnalytics(): void {
    if (this.events.length === 0) return;

    const analyticsData = {
      sessionId: this.sessionId,
      videoId: this.videoId,
      userId: this.userId,
      events: [...this.events],
      engagement: { ...this.engagementData },
      heatmap: this.options.enableHeatmap ? Array.from(this.heatmap.entries()) : [],
      timestamp: Date.now(),
    };

    // Send to analytics endpoint
    this.sendToServer(analyticsData);

    // Clear events after sending
    this.events = [];
  }

  private sendToServer(data: any): void {
    // Use sendBeacon for reliability on page unload
    const blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
    const sent = navigator.sendBeacon('/api/analytics/video', blob);
    
    if (!sent) {
      // Fallback to fetch if sendBeacon fails
      fetch('/api/analytics/video', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      }).catch(error => {
        console.error('Failed to send analytics:', error);
      });
    }
  }

  public getEngagementData(): any {
    return {
      ...this.engagementData,
      engagementScore: this.calculateEngagementScore(),
    };
  }

  public getHeatmapData(): Array<[number, number]> {
    return Array.from(this.heatmap.entries()).sort((a, b) => a[0] - b[0]);
  }

  dispose(): void {
    this.stopPeriodicTracking();
    this.sendAnalytics();
    
    window.removeEventListener('beforeunload', () => {
      this.sendAnalytics();
    });

    super.dispose();
  }
}

// Register the plugin
videojs.registerPlugin('analytics', AnalyticsPlugin);

export default AnalyticsPlugin;