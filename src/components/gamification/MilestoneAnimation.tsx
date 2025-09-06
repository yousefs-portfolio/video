import React, { useEffect, useState } from 'react';
import { Box, IconButton, Paper, Stack, Typography } from '@mui/material';
import { AnimatePresence, motion } from 'framer-motion';
import { AutoAwesome, Celebration, Close, Star } from '@mui/icons-material';

// Optional confetti: relies on window.confetti if loaded at runtime
const launchConfetti = (opts: any) => {
  try {
    (window as any).confetti?.(opts);
  } catch {}
};

interface Milestone {
  id: string;
  type: 'achievement' | 'level-up' | 'streak' | 'course-complete' | 'skill-unlock';
  title: string;
  description: string;
  icon: React.ReactNode;
  xpReward: number;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

interface MilestoneAnimationProps {
  milestone: Milestone | null;
  onClose: () => void;
}

const MilestoneAnimation: React.FC<MilestoneAnimationProps> = ({ milestone, onClose }) => {
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    if (milestone) {
      // Trigger confetti animation
      triggerConfetti(milestone.rarity);

      // Show details after initial animation
      setTimeout(() => {
        setShowDetails(true);
      }, 500);
    } else {
      setShowDetails(false);
    }
  }, [milestone]);

  const triggerConfetti = (rarity: string) => {
    const colors = {
      common: ['#4CAF50', '#8BC34A'],
      rare: ['#2196F3', '#03A9F4'],
      epic: ['#9C27B0', '#E91E63'],
      legendary: ['#FFD700', '#FFA000', '#FF6B35'],
    };

    const particleCount = {
      common: 50,
      rare: 100,
      epic: 150,
      legendary: 200,
    };

    const selectedColors = colors[rarity as keyof typeof colors] || colors.common;
    const count = particleCount[rarity as keyof typeof particleCount] || 50;

    // Center burst
    launchConfetti({
      particleCount: count,
      spread: 70,
      origin: { x: 0.5, y: 0.5 },
      colors: selectedColors,
    });

    // Side bursts for epic and legendary
    if (rarity === 'epic' || rarity === 'legendary') {
      setTimeout(() => {
        launchConfetti({
          particleCount: count / 2,
          angle: 60,
          spread: 55,
          origin: { x: 0, y: 0.6 },
          colors: selectedColors,
        });
        launchConfetti({
          particleCount: count / 2,
          angle: 120,
          spread: 55,
          origin: { x: 1, y: 0.6 },
          colors: selectedColors,
        });
      }, 250);
    }

    // Extra burst for legendary
    if (rarity === 'legendary') {
      setTimeout(() => {
        const duration = 3 * 1000;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

        const interval = setInterval(() => {
          const timeLeft = animationEnd - Date.now();
          if (timeLeft <= 0) {
            clearInterval(interval);
            return;
          }

          const particleCount = 50 * (timeLeft / duration);
          launchConfetti({
            ...defaults,
            particleCount,
            origin: { x: Math.random(), y: Math.random() - 0.2 },
            colors: selectedColors,
          });
        }, 250);
      }, 500);
    }
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common':
        return '#4CAF50';
      case 'rare':
        return '#2196F3';
      case 'epic':
        return '#9C27B0';
      case 'legendary':
        return 'linear-gradient(135deg, #FFD700 0%, #FFA000 50%, #FF6B35 100%)';
      default:
        return '#4CAF50';
    }
  };

  const getRarityGlow = (rarity: string) => {
    switch (rarity) {
      case 'common':
        return '0 0 20px rgba(76, 175, 80, 0.5)';
      case 'rare':
        return '0 0 30px rgba(33, 150, 243, 0.6)';
      case 'epic':
        return '0 0 40px rgba(156, 39, 176, 0.7)';
      case 'legendary':
        return '0 0 60px rgba(255, 215, 0, 0.8), 0 0 120px rgba(255, 215, 0, 0.4)';
      default:
        return 'none';
    }
  };

  if (!milestone) return null;

  return (
    <AnimatePresence>
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: 'rgba(0, 0, 0, 0.8)',
          zIndex: 9999,
          backdropFilter: 'blur(8px)',
        }}
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          exit={{ scale: 0, rotate: 180 }}
          transition={{
            type: 'spring',
            stiffness: 260,
            damping: 20,
            duration: 0.6,
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <Paper
            elevation={10}
            sx={{
              position: 'relative',
              width: 400,
              p: 4,
              textAlign: 'center',
              background: getRarityColor(milestone.rarity),
              boxShadow: getRarityGlow(milestone.rarity),
              overflow: 'hidden',
            }}
          >
            {/* Close button */}
            <IconButton
              sx={{
                position: 'absolute',
                top: 8,
                right: 8,
                color: 'white',
                zIndex: 1,
              }}
              onClick={onClose}
            >
              <Close />
            </IconButton>

            {/* Animated background pattern */}
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                opacity: 0.1,
                background: `repeating-linear-gradient(
                  45deg,
                  transparent,
                  transparent 10px,
                  rgba(255,255,255,0.1) 10px,
                  rgba(255,255,255,0.1) 20px
                )`,
                animation: 'slide 20s linear infinite',
                '@keyframes slide': {
                  '0%': { transform: 'translate(0, 0)' },
                  '100%': { transform: 'translate(50px, 50px)' },
                },
              }}
            />

            {/* Stars decoration */}
            <motion.div
              animate={{
                rotate: 360,
              }}
              transition={{
                duration: 20,
                repeat: Infinity,
                ease: 'linear',
              }}
              style={{
                position: 'absolute',
                top: -20,
                right: -20,
                opacity: 0.3,
              }}
            >
              <AutoAwesome sx={{ fontSize: 100, color: 'white' }} />
            </motion.div>

            <motion.div
              animate={{
                rotate: -360,
              }}
              transition={{
                duration: 15,
                repeat: Infinity,
                ease: 'linear',
              }}
              style={{
                position: 'absolute',
                bottom: -20,
                left: -20,
                opacity: 0.3,
              }}
            >
              <Star sx={{ fontSize: 80, color: 'white' }} />
            </motion.div>

            {/* Main content */}
            <Stack spacing={3} sx={{ position: 'relative', zIndex: 1 }}>
              {/* Icon */}
              <motion.div
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <Box
                  sx={{
                    width: 120,
                    height: 120,
                    borderRadius: '50%',
                    bgcolor: 'rgba(255, 255, 255, 0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mx: 'auto',
                    backdropFilter: 'blur(10px)',
                    boxShadow: '0 0 40px rgba(255, 255, 255, 0.3)',
                  }}
                >
                  <Box sx={{ fontSize: 64, color: 'white' }}>{milestone.icon}</Box>
                </Box>
              </motion.div>

              {/* Title */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: 'bold',
                    color: 'white',
                    textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
                  }}
                >
                  {milestone.title}
                </Typography>
              </motion.div>

              {/* Description */}
              {showDetails && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  <Typography
                    variant="body1"
                    sx={{
                      color: 'rgba(255, 255, 255, 0.9)',
                      mb: 2,
                    }}
                  >
                    {milestone.description}
                  </Typography>
                </motion.div>
              )}

              {/* XP Reward */}
              {showDetails && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{
                    delay: 0.5,
                    type: 'spring',
                    stiffness: 500,
                    damping: 10,
                  }}
                >
                  <Box
                    sx={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 1,
                      px: 3,
                      py: 1.5,
                      borderRadius: 20,
                      bgcolor: 'rgba(255, 255, 255, 0.2)',
                      backdropFilter: 'blur(10px)',
                    }}
                  >
                    <Celebration sx={{ color: 'white' }} />
                    <Typography
                      variant="h6"
                      sx={{
                        color: 'white',
                        fontWeight: 'bold',
                      }}
                    >
                      +{milestone.xpReward} XP
                    </Typography>
                  </Box>
                </motion.div>
              )}

              {/* Rarity indicator */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                <Stack direction="row" spacing={0.5} justifyContent="center">
                  {Array.from({
                    length:
                      milestone.rarity === 'common'
                        ? 1
                        : milestone.rarity === 'rare'
                          ? 2
                          : milestone.rarity === 'epic'
                            ? 3
                            : 4,
                  }).map((_, i) => (
                    <Star
                      key={i}
                      sx={{
                        fontSize: 20,
                        color:
                          milestone.rarity === 'legendary' ? '#FFD700' : 'rgba(255, 255, 255, 0.8)',
                      }}
                    />
                  ))}
                </Stack>
              </motion.div>
            </Stack>
          </Paper>
        </motion.div>
      </Box>
    </AnimatePresence>
  );
};

// Milestone trigger hook
export const useMilestone = () => {
  const [currentMilestone, setCurrentMilestone] = useState<Milestone | null>(null);

  const triggerMilestone = (milestone: Omit<Milestone, 'id'>) => {
    setCurrentMilestone({
      ...milestone,
      id: Date.now().toString(),
    } as Milestone);
  };

  const closeMilestone = () => {
    setCurrentMilestone(null);
  };

  return {
    currentMilestone,
    triggerMilestone,
    closeMilestone,
    MilestoneComponent: () => (
      <MilestoneAnimation milestone={currentMilestone} onClose={closeMilestone} />
    ),
  };
};

export default MilestoneAnimation;