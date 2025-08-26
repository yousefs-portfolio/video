import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Box, Typography, LinearProgress, Chip, Paper } from '@mui/material';
import { 
  Star, 
  TrendingUp, 
  EmojiEvents,
  Speed,
  Bolt,
  Diamond
} from '@mui/icons-material';

interface XPSystemProps {
  currentXP: number;
  currentLevel: number;
  xpForNextLevel: number;
  totalXP: number;
  rank?: string;
  showAnimation?: boolean;
  recentXPGains?: XPGain[];
  onLevelUp?: (newLevel: number) => void;
}

interface XPGain {
  id: string;
  amount: number;
  source: string;
  timestamp: Date;
  multiplier?: number;
}

const levelColors = [
  '#9CA3AF', // 1-10: Gray
  '#10B981', // 11-20: Green
  '#3B82F6', // 21-30: Blue
  '#8B5CF6', // 31-40: Purple
  '#EC4899', // 41-50: Pink
  '#F59E0B', // 51-60: Amber
  '#EF4444', // 61-70: Red
  '#FFD700', // 71-80: Gold
  '#E5E4E2', // 81-90: Platinum
  '#B9F2FF', // 91-100: Diamond
];

const getLevelColor = (level: number): string => {
  const index = Math.min(Math.floor((level - 1) / 10), levelColors.length - 1);
  return levelColors[index];
};

const getLevelIcon = (level: number) => {
  if (level < 20) return <Star />;
  if (level < 40) return <TrendingUp />;
  if (level < 60) return <EmojiEvents />;
  if (level < 80) return <Speed />;
  if (level < 100) return <Bolt />;
  return <Diamond />;
};

const getRankTitle = (level: number): string => {
  if (level < 10) return 'Novice';
  if (level < 20) return 'Apprentice';
  if (level < 30) return 'Adept';
  if (level < 40) return 'Expert';
  if (level < 50) return 'Master';
  if (level < 60) return 'Grandmaster';
  if (level < 70) return 'Champion';
  if (level < 80) return 'Legend';
  if (level < 90) return 'Mythic';
  if (level < 100) return 'Immortal';
  return 'Transcendent';
};

export const XPSystem: React.FC<XPSystemProps> = ({
  currentXP,
  currentLevel,
  xpForNextLevel,
  totalXP,
  rank,
  showAnimation = true,
  recentXPGains = [],
  onLevelUp,
}) => {
  const [displayXP, setDisplayXP] = useState(currentXP);
  const [showLevelUpAnimation, setShowLevelUpAnimation] = useState(false);
  const [floatingXP, setFloatingXP] = useState<XPGain[]>([]);
  
  const progress = (currentXP / xpForNextLevel) * 100;
  const levelColor = getLevelColor(currentLevel);
  const levelIcon = getLevelIcon(currentLevel);
  const rankTitle = rank || getRankTitle(currentLevel);

  useEffect(() => {
    if (showAnimation && displayXP !== currentXP) {
      const difference = currentXP - displayXP;
      const increment = difference / 30;
      const timer = setInterval(() => {
        setDisplayXP((prev) => {
          const next = prev + increment;
          if ((increment > 0 && next >= currentXP) || (increment < 0 && next <= currentXP)) {
            clearInterval(timer);
            return currentXP;
          }
          return next;
        });
      }, 30);

      // Check for level up
      if (currentXP >= xpForNextLevel && !showLevelUpAnimation) {
        setShowLevelUpAnimation(true);
        onLevelUp?.(currentLevel + 1);
        setTimeout(() => setShowLevelUpAnimation(false), 3000);
      }

      return () => clearInterval(timer);
    }
  }, [currentXP, displayXP, xpForNextLevel, currentLevel, showAnimation, showLevelUpAnimation, onLevelUp]);

  useEffect(() => {
    // Add floating XP animations for recent gains
    if (recentXPGains.length > 0) {
      const latestGain = recentXPGains[recentXPGains.length - 1];
      setFloatingXP((prev) => [...prev, latestGain]);
      setTimeout(() => {
        setFloatingXP((prev) => prev.filter((xp) => xp.id !== latestGain.id));
      }, 2000);
    }
  }, [recentXPGains]);

  const LevelBadge = () => (
    <motion.div
      animate={{
        scale: showLevelUpAnimation ? [1, 1.3, 1] : 1,
        rotate: showLevelUpAnimation ? [0, 360] : 0,
      }}
      transition={{
        duration: 1,
        ease: 'easeInOut',
      }}
    >
      <Box
        sx={{
          position: 'relative',
          width: 100,
          height: 100,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* Outer ring */}
        <svg
          width="100"
          height="100"
          style={{
            position: 'absolute',
            transform: 'rotate(-90deg)',
          }}
        >
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="#E5E7EB"
            strokeWidth="4"
          />
          <motion.circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke={levelColor}
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray={`${progress * 2.83} 283`}
            initial={{ strokeDashoffset: 283 }}
            animate={{ strokeDashoffset: 283 - (progress * 2.83) }}
            transition={{ duration: 1, ease: 'easeOut' }}
          />
        </svg>

        {/* Level display */}
        <Box
          sx={{
            backgroundColor: 'white',
            borderRadius: '50%',
            width: 80,
            height: 80,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
            border: `3px solid ${levelColor}`,
          }}
        >
          <Box sx={{ color: levelColor, fontSize: 24 }}>
            {levelIcon}
          </Box>
          <Typography
            variant="h5"
            sx={{
              fontWeight: 'bold',
              color: levelColor,
              mt: 0.5,
            }}
          >
            {currentLevel}
          </Typography>
        </Box>

        {/* Level up effect */}
        <AnimatePresence>
          {showLevelUpAnimation && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 2, opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1 }}
              style={{
                position: 'absolute',
                inset: 0,
                border: `2px solid ${levelColor}`,
                borderRadius: '50%',
                pointerEvents: 'none',
              }}
            />
          )}
        </AnimatePresence>
      </Box>
    </motion.div>
  );

  return (
    <Paper
      elevation={3}
      sx={{
        p: 3,
        borderRadius: 3,
        background: `linear-gradient(135deg, ${levelColor}10 0%, #FFFFFF 100%)`,
        position: 'relative',
        overflow: 'visible',
      }}
    >
      {/* Floating XP gains */}
      <AnimatePresence>
        {floatingXP.map((xp) => (
          <motion.div
            key={xp.id}
            initial={{ opacity: 1, y: 0, x: '50%' }}
            animate={{ opacity: 0, y: -50 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 2 }}
            style={{
              position: 'absolute',
              top: 20,
              right: 20,
              pointerEvents: 'none',
            }}
          >
            <Typography
              sx={{
                fontWeight: 'bold',
                fontSize: '1.5rem',
                color: levelColor,
                textShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
              }}
            >
              +{xp.amount} XP
            </Typography>
            {xp.multiplier && xp.multiplier > 1 && (
              <Chip
                label={`${xp.multiplier}x`}
                size="small"
                sx={{
                  backgroundColor: '#FFD700',
                  color: 'white',
                  fontWeight: 'bold',
                  ml: 1,
                }}
              />
            )}
          </motion.div>
        ))}
      </AnimatePresence>

      <Box sx={{ display: 'flex', gap: 3, alignItems: 'center' }}>
        {/* Level badge */}
        <LevelBadge />

        {/* XP Info */}
        <Box sx={{ flex: 1 }}>
          {/* Header */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 'bold', color: levelColor }}>
                {rankTitle}
              </Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                Level {currentLevel}
              </Typography>
            </Box>
            <Box sx={{ textAlign: 'right' }}>
              <Typography variant="h5" sx={{ fontWeight: 'bold', color: levelColor }}>
                {Math.round(displayXP).toLocaleString()}
              </Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                / {xpForNextLevel.toLocaleString()} XP
              </Typography>
            </Box>
          </Box>

          {/* Progress bar */}
          <Box sx={{ position: 'relative' }}>
            <LinearProgress
              variant="determinate"
              value={progress}
              sx={{
                height: 12,
                borderRadius: 6,
                backgroundColor: '#E5E7EB',
                '& .MuiLinearProgress-bar': {
                  borderRadius: 6,
                  background: `linear-gradient(90deg, ${levelColor}80, ${levelColor})`,
                },
              }}
            />
            <Box
              sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
              }}
            >
              <Typography
                variant="caption"
                sx={{
                  color: 'white',
                  fontWeight: 'bold',
                  fontSize: '0.7rem',
                  textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)',
                }}
              >
                {Math.round(progress)}%
              </Typography>
            </Box>
          </Box>

          {/* Stats */}
          <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
            <Chip
              label={`Total XP: ${totalXP.toLocaleString()}`}
              size="small"
              sx={{ backgroundColor: `${levelColor}20` }}
            />
            <Chip
              label={`Next Level: ${(xpForNextLevel - currentXP).toLocaleString()} XP`}
              size="small"
              variant="outlined"
            />
          </Box>

          {/* Recent XP gains */}
          {recentXPGains.length > 0 && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 1 }}>
                Recent Activity
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                {recentXPGains.slice(-3).map((gain) => (
                  <motion.div
                    key={gain.id}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 500 }}
                  >
                    <Chip
                      label={`+${gain.amount} ${gain.source}`}
                      size="small"
                      sx={{
                        backgroundColor: `${levelColor}10`,
                        color: levelColor,
                        fontWeight: 'bold',
                      }}
                    />
                  </motion.div>
                ))}
              </Box>
            </Box>
          )}
        </Box>
      </Box>

      {/* Level up animation overlay */}
      <AnimatePresence>
        {showLevelUpAnimation && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              inset: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.8)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 9999,
              pointerEvents: 'none',
            }}
          >
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 200, damping: 20 }}
            >
              <Box sx={{ textAlign: 'center' }}>
                <motion.div
                  animate={{
                    rotate: [0, 360],
                    scale: [1, 1.2, 1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                  }}
                >
                  <Star sx={{ fontSize: 100, color: '#FFD700', mb: 2 }} />
                </motion.div>
                <Typography
                  variant="h2"
                  sx={{
                    fontWeight: 'bold',
                    color: 'white',
                    mb: 1,
                    textShadow: '0 4px 8px rgba(0, 0, 0, 0.3)',
                  }}
                >
                  LEVEL UP!
                </Typography>
                <Typography
                  variant="h4"
                  sx={{
                    color: levelColor,
                    fontWeight: 'bold',
                  }}
                >
                  Level {currentLevel}
                </Typography>
                <Typography
                  variant="h5"
                  sx={{
                    color: 'white',
                    mt: 1,
                  }}
                >
                  {rankTitle}
                </Typography>
              </Box>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </Paper>
  );
};