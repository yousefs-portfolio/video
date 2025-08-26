import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Box, Typography, IconButton, Tooltip, Paper, Chip } from '@mui/material';
import { 
  Whatshot, 
  AcUnit,
  TrendingUp,
  Warning,
  CheckCircle 
} from '@mui/icons-material';
import { format, differenceInDays, addDays, startOfDay } from 'date-fns';

interface StreakTrackerProps {
  currentStreak: number;
  longestStreak: number;
  lastActivityDate: Date;
  streakHistory: Date[];
  freezesAvailable: number;
  freezesUsed: number;
  onUseFreeze?: () => void;
  targetDays?: number;
  showCalendar?: boolean;
}

export const StreakTracker: React.FC<StreakTrackerProps> = ({
  currentStreak,
  longestStreak,
  lastActivityDate,
  streakHistory,
  freezesAvailable,
  freezesUsed,
  onUseFreeze,
  targetDays = 30,
  showCalendar = true,
}) => {
  const [isOnFire, setIsOnFire] = useState(false);
  const [showFreezeModal, setShowFreezeModal] = useState(false);
  const today = startOfDay(new Date());
  const daysSinceLastActivity = differenceInDays(today, startOfDay(new Date(lastActivityDate)));
  const streakInDanger = daysSinceLastActivity === 1 && currentStreak > 0;
  const streakLost = daysSinceLastActivity > 1;

  useEffect(() => {
    setIsOnFire(currentStreak >= 7);
  }, [currentStreak]);

  // Generate flame intensity based on streak length
  const getFlameIntensity = () => {
    if (currentStreak < 3) return 'low';
    if (currentStreak < 7) return 'medium';
    if (currentStreak < 30) return 'high';
    return 'extreme';
  };

  const flameColors = {
    low: ['#FFA500', '#FF6B35'],
    medium: ['#FF6B35', '#FF4500'],
    high: ['#FF4500', '#FF0000'],
    extreme: ['#FF0000', '#FF00FF', '#FFD700'],
  };

  const intensity = getFlameIntensity();

  const FlameIcon = () => (
    <motion.div
      animate={{
        scale: isOnFire ? [1, 1.1, 1] : 1,
        rotate: isOnFire ? [0, -5, 5, 0] : 0,
      }}
      transition={{
        duration: 2,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
      style={{
        position: 'relative',
        display: 'inline-flex',
      }}
    >
      <Whatshot
        sx={{
          fontSize: 48,
          background: `linear-gradient(135deg, ${flameColors[intensity].join(', ')})`,
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          filter: isOnFire ? 'drop-shadow(0 0 10px rgba(255, 107, 53, 0.5))' : 'none',
        }}
      />
      
      {/* Animated particles for high streaks */}
      {currentStreak >= 7 && (
        <AnimatePresence>
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 0, x: 0 }}
              animate={{
                opacity: [0, 1, 0],
                y: [-10, -30, -50],
                x: [0, (i - 1) * 10],
              }}
              transition={{
                duration: 2,
                delay: i * 0.3,
                repeat: Infinity,
              }}
              style={{
                position: 'absolute',
                width: 4,
                height: 4,
                backgroundColor: flameColors[intensity][0],
                borderRadius: '50%',
                top: '50%',
                left: '50%',
              }}
            />
          ))}
        </AnimatePresence>
      )}
    </motion.div>
  );

  const StreakCalendar = () => {
    const last30Days = Array.from({ length: 30 }, (_, i) => {
      const date = addDays(today, -29 + i);
      const hasActivity = streakHistory.some(
        (activityDate) => 
          startOfDay(new Date(activityDate)).getTime() === date.getTime()
      );
      return { date, hasActivity };
    });

    return (
      <Box sx={{ mt: 3 }}>
        <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
          Last 30 Days Activity
        </Typography>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(7, 1fr)',
            gap: 0.5,
          }}
        >
          {last30Days.map(({ date, hasActivity }, index) => (
            <Tooltip
              key={index}
              title={format(date, 'MMM dd, yyyy')}
              placement="top"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: index * 0.01 }}
              >
                <Box
                  sx={{
                    width: 32,
                    height: 32,
                    borderRadius: 1,
                    backgroundColor: hasActivity
                      ? currentStreak > 0 && index === 29
                        ? '#FF6B35'
                        : '#10B981'
                      : '#E5E7EB',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    '&:hover': {
                      transform: 'scale(1.1)',
                      boxShadow: hasActivity ? '0 0 10px rgba(16, 185, 129, 0.5)' : 'none',
                    },
                  }}
                />
              </motion.div>
            </Tooltip>
          ))}
        </Box>
      </Box>
    );
  };

  return (
    <Paper
      elevation={3}
      sx={{
        p: 3,
        borderRadius: 3,
        background: 'linear-gradient(135deg, #FFF5F1 0%, #FFFFFF 100%)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background pattern */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          right: 0,
          width: '50%',
          height: '100%',
          opacity: 0.05,
          background: 'repeating-linear-gradient(45deg, transparent, transparent 10px, #FF6B35 10px, #FF6B35 20px)',
          pointerEvents: 'none',
        }}
      />

      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <FlameIcon />
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#FF6B35' }}>
              {currentStreak}
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              Day Streak
            </Typography>
          </Box>
        </Box>

        {/* Freeze button */}
        {freezesAvailable > 0 && (
          <Tooltip title="Use a streak freeze to protect your streak">
            <IconButton
              onClick={() => setShowFreezeModal(true)}
              sx={{
                backgroundColor: '#E3F2FD',
                '&:hover': { backgroundColor: '#BBDEFB' },
              }}
            >
              <AcUnit sx={{ color: '#1E88E5' }} />
            </IconButton>
          </Tooltip>
        )}
      </Box>

      {/* Status messages */}
      <AnimatePresence mode="wait">
        {streakInDanger && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <Box
              sx={{
                p: 2,
                mb: 2,
                borderRadius: 2,
                backgroundColor: '#FFF3CD',
                border: '1px solid #FFE69C',
                display: 'flex',
                alignItems: 'center',
                gap: 1,
              }}
            >
              <Warning sx={{ color: '#FF9800' }} />
              <Typography variant="body2" sx={{ color: '#8B6914' }}>
                Your streak is in danger! Complete a lesson today to keep it alive.
              </Typography>
            </Box>
          </motion.div>
        )}

        {streakLost && currentStreak === 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <Box
              sx={{
                p: 2,
                mb: 2,
                borderRadius: 2,
                backgroundColor: '#F8D7DA',
                border: '1px solid #F5C2C7',
                display: 'flex',
                alignItems: 'center',
                gap: 1,
              }}
            >
              <Typography variant="body2" sx={{ color: '#842029' }}>
                Your streak was lost. Start a new one today!
              </Typography>
            </Box>
          </motion.div>
        )}

        {currentStreak > 0 && currentStreak % 7 === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
          >
            <Box
              sx={{
                p: 2,
                mb: 2,
                borderRadius: 2,
                background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
                display: 'flex',
                alignItems: 'center',
                gap: 1,
              }}
            >
              <CheckCircle sx={{ color: 'white' }} />
              <Typography variant="body2" sx={{ color: 'white', fontWeight: 'bold' }}>
                Milestone reached! {currentStreak} days in a row!
              </Typography>
            </Box>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Stats */}
      <Box sx={{ display: 'flex', gap: 3, mb: 3 }}>
        <Box>
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            Longest Streak
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <TrendingUp sx={{ fontSize: 20, color: '#10B981' }} />
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
              {longestStreak} days
            </Typography>
          </Box>
        </Box>

        <Box>
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            Freezes Available
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <AcUnit sx={{ fontSize: 20, color: '#1E88E5' }} />
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
              {freezesAvailable}
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Progress to target */}
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            Progress to {targetDays}-day goal
          </Typography>
          <Typography variant="caption" sx={{ fontWeight: 'bold' }}>
            {Math.min(currentStreak, targetDays)}/{targetDays}
          </Typography>
        </Box>
        <Box
          sx={{
            height: 8,
            borderRadius: 4,
            backgroundColor: '#E5E7EB',
            overflow: 'hidden',
          }}
        >
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${(Math.min(currentStreak, targetDays) / targetDays) * 100}%` }}
            transition={{ duration: 1, ease: 'easeOut' }}
            style={{
              height: '100%',
              background: 'linear-gradient(90deg, #FF6B35 0%, #FFD700 100%)',
              borderRadius: 4,
            }}
          />
        </Box>
      </Box>

      {/* Calendar */}
      {showCalendar && <StreakCalendar />}

      {/* Freeze modal */}
      <AnimatePresence>
        {showFreezeModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              inset: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 9999,
            }}
            onClick={() => setShowFreezeModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <Paper sx={{ p: 4, maxWidth: 400, borderRadius: 3 }}>
                <Box sx={{ textAlign: 'center' }}>
                  <AcUnit sx={{ fontSize: 64, color: '#1E88E5', mb: 2 }} />
                  <Typography variant="h5" sx={{ mb: 2, fontWeight: 'bold' }}>
                    Use Streak Freeze?
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 3, color: 'text.secondary' }}>
                    This will protect your streak for one day if you miss your daily learning goal.
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
                    <Chip
                      label={`${freezesAvailable} freezes available`}
                      color="primary"
                      variant="outlined"
                    />
                    <Chip
                      label={`${freezesUsed} used this month`}
                      variant="outlined"
                    />
                  </Box>
                  <Box sx={{ display: 'flex', gap: 2, mt: 4 }}>
                    <button
                      className="btn-primary"
                      style={{ flex: 1 }}
                      onClick={() => {
                        onUseFreeze?.();
                        setShowFreezeModal(false);
                      }}
                    >
                      Use Freeze
                    </button>
                    <button
                      className="btn-secondary"
                      style={{ flex: 1 }}
                      onClick={() => setShowFreezeModal(false)}
                    >
                      Cancel
                    </button>
                  </Box>
                </Box>
              </Paper>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </Paper>
  );
};