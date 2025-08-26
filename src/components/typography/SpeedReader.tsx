import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Box,
  Paper,
  Typography,
  Slider,
  IconButton,
  Button,
  Stack,
  Chip,
  LinearProgress,
} from '@mui/material';
import {
  PlayArrow,
  Pause,
  SkipNext,
  SkipPrevious,
  Settings,
  Close,
  RestartAlt,
} from '@mui/icons-material';

interface SpeedReaderProps {
  text: string;
  onClose?: () => void;
  initialWPM?: number;
}

const SpeedReader: React.FC<SpeedReaderProps> = ({ 
  text, 
  onClose,
  initialWPM = 300 
}) => {
  const [words, setWords] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [wpm, setWpm] = useState(initialWPM);
  const [showSettings, setShowSettings] = useState(false);
  const [chunkSize, setChunkSize] = useState(1);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Process text into words
    const processedWords = text
      .replace(/\n+/g, ' ')
      .replace(/\s+/g, ' ')
      .split(' ')
      .filter(word => word.length > 0);
    setWords(processedWords);
  }, [text]);

  useEffect(() => {
    if (isPlaying && words.length > 0) {
      const interval = 60000 / (wpm / chunkSize); // milliseconds per chunk
      
      intervalRef.current = setInterval(() => {
        setCurrentIndex(prev => {
          const nextIndex = prev + chunkSize;
          if (nextIndex >= words.length) {
            setIsPlaying(false);
            return words.length - 1;
          }
          return nextIndex;
        });
      }, interval);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPlaying, wpm, words.length, chunkSize]);

  const togglePlay = useCallback(() => {
    if (currentIndex >= words.length - 1) {
      setCurrentIndex(0);
    }
    setIsPlaying(!isPlaying);
  }, [isPlaying, currentIndex, words.length]);

  const skipForward = useCallback(() => {
    setCurrentIndex(Math.min(currentIndex + 10, words.length - 1));
  }, [currentIndex, words.length]);

  const skipBackward = useCallback(() => {
    setCurrentIndex(Math.max(currentIndex - 10, 0));
  }, [currentIndex]);

  const restart = useCallback(() => {
    setCurrentIndex(0);
    setIsPlaying(false);
  }, []);

  const getDisplayWord = useCallback(() => {
    if (words.length === 0) return '';
    
    const wordsToShow = words.slice(currentIndex, currentIndex + chunkSize);
    return wordsToShow.join(' ');
  }, [words, currentIndex, chunkSize]);

  const getContextWords = useCallback((offset: number, count: number) => {
    const start = Math.max(0, currentIndex + offset);
    const end = Math.min(words.length, start + count);
    return words.slice(start, end).join(' ');
  }, [words, currentIndex]);

  const progress = words.length > 0 ? (currentIndex / words.length) * 100 : 0;
  const timeRemaining = words.length > 0 
    ? Math.ceil((words.length - currentIndex) / wpm * 60)
    : 0;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Paper elevation={3} sx={{ p: 3, maxWidth: 800, mx: 'auto', position: 'relative' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h5">Speed Reader</Typography>
        <Stack direction="row" spacing={1}>
          <IconButton onClick={() => setShowSettings(!showSettings)}>
            <Settings />
          </IconButton>
          {onClose && (
            <IconButton onClick={onClose}>
              <Close />
            </IconButton>
          )}
        </Stack>
      </Box>

      <LinearProgress variant="determinate" value={progress} sx={{ mb: 2 }} />
      
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Chip label={`${currentIndex} / ${words.length} words`} size="small" />
        <Chip label={`${wpm} WPM`} size="small" color="primary" />
        <Chip label={`${formatTime(timeRemaining)} remaining`} size="small" />
      </Box>

      {/* Context display */}
      <Box sx={{ mb: 3, p: 2, bgcolor: 'background.default', borderRadius: 1 }}>
        <Typography 
          variant="body2" 
          color="text.secondary"
          sx={{ textAlign: 'center', opacity: 0.5 }}
        >
          {getContextWords(-10, 10)}
        </Typography>
      </Box>

      {/* Main display word */}
      <Box
        sx={{
          minHeight: 150,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          bgcolor: 'background.paper',
          borderRadius: 2,
          border: '2px solid',
          borderColor: 'primary.main',
          mb: 3,
        }}
      >
        {/* Focus guides */}
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '80%',
            height: '60%',
            border: '1px dashed',
            borderColor: 'divider',
            opacity: 0.3,
            pointerEvents: 'none',
          }}
        />
        
        <Typography
          variant="h2"
          sx={{
            fontWeight: 'bold',
            fontSize: { xs: '2rem', sm: '3rem', md: '4rem' },
            textAlign: 'center',
            px: 3,
            letterSpacing: 2,
            fontFamily: 'monospace',
            // Highlight middle character for better focus
            '& .focus-char': {
              color: 'primary.main',
              textDecoration: 'underline',
            }
          }}
        >
          {getDisplayWord()}
        </Typography>
      </Box>

      {/* Upcoming context */}
      <Box sx={{ mb: 3, p: 2, bgcolor: 'background.default', borderRadius: 1 }}>
        <Typography 
          variant="body2" 
          color="text.secondary"
          sx={{ textAlign: 'center', opacity: 0.5 }}
        >
          {getContextWords(chunkSize, 10)}
        </Typography>
      </Box>

      {/* Controls */}
      <Stack spacing={2}>
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
          <IconButton onClick={restart} size="large">
            <RestartAlt />
          </IconButton>
          <IconButton onClick={skipBackward} size="large">
            <SkipPrevious />
          </IconButton>
          <IconButton 
            onClick={togglePlay} 
            size="large"
            color="primary"
            sx={{
              bgcolor: 'primary.main',
              color: 'white',
              '&:hover': {
                bgcolor: 'primary.dark',
              }
            }}
          >
            {isPlaying ? <Pause /> : <PlayArrow />}
          </IconButton>
          <IconButton onClick={skipForward} size="large">
            <SkipNext />
          </IconButton>
        </Box>

        {showSettings && (
          <Paper elevation={1} sx={{ p: 2, bgcolor: 'background.default' }}>
            <Stack spacing={2}>
              <Box>
                <Typography gutterBottom>
                  Reading Speed: {wpm} WPM
                </Typography>
                <Slider
                  value={wpm}
                  onChange={(_e, newValue) => setWpm(newValue as number)}
                  min={100}
                  max={1000}
                  step={50}
                  marks={[
                    { value: 200, label: 'Slow' },
                    { value: 400, label: 'Normal' },
                    { value: 600, label: 'Fast' },
                    { value: 800, label: 'Expert' },
                  ]}
                  valueLabelDisplay="auto"
                />
              </Box>

              <Box>
                <Typography gutterBottom>
                  Words per View: {chunkSize}
                </Typography>
                <Slider
                  value={chunkSize}
                  onChange={(_e, newValue) => setChunkSize(newValue as number)}
                  min={1}
                  max={5}
                  step={1}
                  marks
                  valueLabelDisplay="auto"
                />
              </Box>

              <Stack direction="row" spacing={1}>
                <Button
                  variant="outlined"
                  onClick={() => setWpm(200)}
                  size="small"
                >
                  Beginner (200)
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => setWpm(400)}
                  size="small"
                >
                  Intermediate (400)
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => setWpm(600)}
                  size="small"
                >
                  Advanced (600)
                </Button>
              </Stack>
            </Stack>
          </Paper>
        )}
      </Stack>
    </Paper>
  );
};

export default SpeedReader;