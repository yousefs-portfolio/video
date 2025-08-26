import React, { useRef, useEffect, useState } from 'react';
import videojs from 'video.js';
import 'video.js/dist/video-js.css';
import '@videojs/themes/dist/fantasy/index.css';
import { Box, Paper } from '@mui/material';
import Player from 'video.js/dist/types/player';

// Custom video.js plugins
import './plugins/ChapterPlugin';
import './plugins/TranscriptPlugin';
import './plugins/InteractivePlugin';
import './plugins/AnalyticsPlugin';
import './plugins/KeyboardShortcuts';
import './plugins/SpeedMemory';
import './plugins/QualitySelector';
import './plugins/ThumbnailPreview';

interface VideoJsPlayerProps {
  videoId: string;
  sources: {
    src: string;
    type: string;
    quality?: string;
  }[];
  poster?: string;
  chapters?: Chapter[];
  transcript?: TranscriptLine[];
  captions?: CaptionTrack[];
  interactive?: InteractiveElement[];
  onProgress?: (progress: VideoProgress) => void;
  onInteraction?: (interaction: VideoInteraction) => void;
  onComplete?: () => void;
  autoplay?: boolean;
  muted?: boolean;
  controls?: boolean;
  fluid?: boolean;
  responsive?: boolean;
  playbackRates?: number[];
  preload?: 'auto' | 'metadata' | 'none';
  startTime?: number;
  analyticsEnabled?: boolean;
  keyboardShortcuts?: boolean;
  thumbnailPreview?: ThumbnailPreviewConfig;
}

interface Chapter {
  id: string;
  title: string;
  startTime: number;
  endTime: number;
  thumbnail?: string;
  description?: string;
}

interface TranscriptLine {
  id: string;
  startTime: number;
  endTime: number;
  text: string;
  speaker?: string;
}

interface CaptionTrack {
  src: string;
  srclang: string;
  label: string;
  kind: 'subtitles' | 'captions' | 'descriptions' | 'chapters' | 'metadata';
  default?: boolean;
}

interface InteractiveElement {
  id: string;
  type: 'quiz' | 'poll' | 'hotspot' | 'annotation' | 'branch';
  startTime: number;
  endTime: number;
  pauseOnDisplay?: boolean;
  data: any;
}

interface VideoProgress {
  currentTime: number;
  duration: number;
  percentage: number;
  buffered: number;
  played: TimeRanges;
  seekable: TimeRanges;
}

interface VideoInteraction {
  type: string;
  timestamp: number;
  position: number;
  data?: any;
}

interface ThumbnailPreviewConfig {
  src: string;
  width: number;
  height: number;
  columns: number;
  interval: number;
}

const VideoJsPlayer: React.FC<VideoJsPlayerProps> = ({
  videoId,
  sources,
  poster,
  chapters = [],
  transcript = [],
  captions = [],
  interactive = [],
  onProgress,
  onInteraction,
  onComplete,
  autoplay = false,
  muted = false,
  controls = true,
  fluid = true,
  responsive = true,
  playbackRates = [0.5, 0.75, 1, 1.25, 1.5, 1.75, 2],
  preload = 'metadata',
  startTime = 0,
  analyticsEnabled = true,
  keyboardShortcuts = true,
  thumbnailPreview,
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const playerRef = useRef<Player | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Initialize Video.js player
    if (!playerRef.current && videoRef.current) {
      const videoElement = videoRef.current;
      
      // Configure player options
      const playerOptions: any = {
        autoplay,
        muted,
        controls,
        fluid,
        responsive,
        playbackRates,
        preload,
        sources,
        poster,
        userActions: {
          hotkeys: keyboardShortcuts,
          doubleClick: true,
        },
        controlBar: {
          volumePanel: {
            inline: false,
          },
          remainingTimeDisplay: {
            displayNegative: false,
          },
          progressControl: {
            seekBar: {
              playProgressBar: {
                timeTooltip: true,
              },
            },
          },
          playbackRateMenuButton: {
            playbackRates,
          },
          pictureInPictureToggle: true,
          fullscreenToggle: true,
          subtitlesButton: true,
          captionsButton: true,
          chaptersButton: chapters.length > 0,
          descriptionsButton: false,
          subsCapsButton: false,
          audioTrackButton: false,
          qualitySelector: true,
        },
        html5: {
          vhs: {
            overrideNative: true,
            smoothQualityChange: true,
            fastQualityChange: true,
          },
          nativeVideoTracks: false,
          nativeAudioTracks: false,
          nativeTextTracks: false,
        },
      };

      // Create player instance
      const player = videojs(videoElement, playerOptions, function onPlayerReady() {
        console.log('Video.js player ready');
        setIsReady(true);

        // Add caption tracks
        captions.forEach(caption => {
          player.addRemoteTextTrack({
            src: caption.src,
            srclang: caption.srclang,
            label: caption.label,
            kind: caption.kind,
            default: caption.default,
          }, false);
        });

        // Initialize custom plugins
        if (chapters.length > 0) {
          (player as any).chapters({
            chapters,
            onChapterClick: (chapter: Chapter) => {
              player.currentTime(chapter.startTime);
              if (onInteraction) {
                onInteraction({
                  type: 'chapter_click',
                  timestamp: Date.now(),
                  position: chapter.startTime,
                  data: chapter,
                });
              }
            },
          });
        }

        if (transcript.length > 0) {
          (player as any).transcript({
            transcript,
            onTranscriptClick: (line: TranscriptLine) => {
              player.currentTime(line.startTime);
              if (onInteraction) {
                onInteraction({
                  type: 'transcript_click',
                  timestamp: Date.now(),
                  position: line.startTime,
                  data: line,
                });
              }
            },
          });
        }

        if (interactive.length > 0) {
          (player as any).interactive({
            elements: interactive,
            onInteraction: (element: InteractiveElement, response: any) => {
              if (onInteraction) {
                onInteraction({
                  type: `interactive_${element.type}`,
                  timestamp: Date.now(),
                  position: player.currentTime(),
                  data: { element, response },
                });
              }
            },
          });
        }

        if (analyticsEnabled) {
          (player as any).analytics({
            videoId,
            userId: 'current-user-id', // Get from auth context
            onEvent: (event: any) => {
              if (onInteraction) {
                onInteraction({
                  type: `analytics_${event.type}`,
                  timestamp: Date.now(),
                  position: player.currentTime(),
                  data: event,
                });
              }
            },
          });
        }

        if (keyboardShortcuts) {
          (player as any).keyboardShortcuts({
            shortcuts: {
              // Playback controls
              'space': () => player.paused() ? player.play() : player.pause(),
              'k': () => player.paused() ? player.play() : player.pause(),
              
              // Seek controls
              'j': () => player.currentTime(player.currentTime() - 10),
              'l': () => player.currentTime(player.currentTime() + 10),
              'left': () => player.currentTime(player.currentTime() - 5),
              'right': () => player.currentTime(player.currentTime() + 5),
              'home': () => player.currentTime(0),
              'end': () => player.currentTime(player.duration()),
              
              // Speed controls
              'shift+,': () => player.playbackRate(Math.max(0.25, player.playbackRate() - 0.25)),
              'shift+.': () => player.playbackRate(Math.min(2, player.playbackRate() + 0.25)),
              
              // Volume controls
              'up': () => player.volume(Math.min(1, player.volume() + 0.1)),
              'down': () => player.volume(Math.max(0, player.volume() - 0.1)),
              'm': () => player.muted(!player.muted()),
              
              // Fullscreen
              'f': () => player.isFullscreen() ? player.exitFullscreen() : player.requestFullscreen(),
              
              // Captions
              'c': () => {
                const tracks = player.textTracks();
                for (let i = 0; i < tracks.length; i++) {
                  const track = tracks[i];
                  if (track.kind === 'captions' || track.kind === 'subtitles') {
                    track.mode = track.mode === 'showing' ? 'hidden' : 'showing';
                    break;
                  }
                }
              },
              
              // Numbers for seeking to percentage
              '0': () => player.currentTime(0),
              '1': () => player.currentTime(player.duration() * 0.1),
              '2': () => player.currentTime(player.duration() * 0.2),
              '3': () => player.currentTime(player.duration() * 0.3),
              '4': () => player.currentTime(player.duration() * 0.4),
              '5': () => player.currentTime(player.duration() * 0.5),
              '6': () => player.currentTime(player.duration() * 0.6),
              '7': () => player.currentTime(player.duration() * 0.7),
              '8': () => player.currentTime(player.duration() * 0.8),
              '9': () => player.currentTime(player.duration() * 0.9),
            },
          });
        }

        // Load speed from localStorage
        (player as any).speedMemory();

        // Initialize quality selector
        (player as any).qualitySelector({
          default: '720p',
        });

        // Initialize thumbnail preview
        if (thumbnailPreview) {
          (player as any).thumbnailPreview(thumbnailPreview);
        }

        // Set start time
        if (startTime > 0) {
          player.currentTime(startTime);
        }

        // Event listeners
        player.on('timeupdate', () => {
          if (onProgress) {
            onProgress({
              currentTime: player.currentTime(),
              duration: player.duration(),
              percentage: (player.currentTime() / player.duration()) * 100,
              buffered: player.bufferedPercent(),
              played: player.played(),
              seekable: player.seekable(),
            });
          }
        });

        player.on('ended', () => {
          if (onComplete) {
            onComplete();
          }
        });

        player.on('play', () => {
          if (onInteraction) {
            onInteraction({
              type: 'play',
              timestamp: Date.now(),
              position: player.currentTime(),
            });
          }
        });

        player.on('pause', () => {
          if (onInteraction) {
            onInteraction({
              type: 'pause',
              timestamp: Date.now(),
              position: player.currentTime(),
            });
          }
        });

        player.on('seeking', () => {
          if (onInteraction) {
            onInteraction({
              type: 'seek_start',
              timestamp: Date.now(),
              position: player.currentTime(),
            });
          }
        });

        player.on('seeked', () => {
          if (onInteraction) {
            onInteraction({
              type: 'seek_end',
              timestamp: Date.now(),
              position: player.currentTime(),
            });
          }
        });

        player.on('ratechange', () => {
          if (onInteraction) {
            onInteraction({
              type: 'speed_change',
              timestamp: Date.now(),
              position: player.currentTime(),
              data: { speed: player.playbackRate() },
            });
          }
        });

        player.on('volumechange', () => {
          if (onInteraction) {
            onInteraction({
              type: 'volume_change',
              timestamp: Date.now(),
              position: player.currentTime(),
              data: { 
                volume: player.volume(),
                muted: player.muted(),
              },
            });
          }
        });

        player.on('fullscreenchange', () => {
          if (onInteraction) {
            onInteraction({
              type: 'fullscreen_change',
              timestamp: Date.now(),
              position: player.currentTime(),
              data: { fullscreen: player.isFullscreen() },
            });
          }
        });

        player.on('error', (error: any) => {
          console.error('Video player error:', error);
          if (onInteraction) {
            onInteraction({
              type: 'error',
              timestamp: Date.now(),
              position: player.currentTime(),
              data: { error: error.message || 'Unknown error' },
            });
          }
        });
      });

      playerRef.current = player;

      // Apply custom styles
      player.addClass('vjs-theme-fantasy');
      player.addClass('vjs-big-play-centered');
    }

    // Cleanup
    return () => {
      const player = playerRef.current;
      if (player && !player.isDisposed()) {
        player.dispose();
        playerRef.current = null;
        setIsReady(false);
      }
    };
  }, [videoId]);

  // Update sources when they change
  useEffect(() => {
    const player = playerRef.current;
    if (player && isReady && sources.length > 0) {
      player.src(sources);
    }
  }, [sources, isReady]);

  return (
    <Box ref={containerRef} sx={{ width: '100%', position: 'relative' }}>
      <Paper
        elevation={3}
        sx={{
          width: '100%',
          backgroundColor: 'black',
          borderRadius: 2,
          overflow: 'hidden',
        }}
      >
        <div data-vjs-player>
          <video
            ref={videoRef}
            className="video-js vjs-big-play-centered vjs-theme-fantasy"
            style={{ width: '100%', height: '100%' }}
          />
        </div>
      </Paper>
    </Box>
  );
};

export default VideoJsPlayer;