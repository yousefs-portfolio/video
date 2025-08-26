import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Box, Typography, Tooltip } from '@mui/material';
import Lottie from 'lottie-react';
import { 
  School, 
  Whatshot, 
  Star, 
  TrendingUp,
  Group,
  Lock
} from '@mui/icons-material';

interface AchievementBadgeProps {
  id: string;
  name: string;
  description: string;
  icon?: React.ReactNode;
  category: 'course' | 'streak' | 'social' | 'milestone' | 'special';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  progress?: number;
  maxProgress?: number;
  unlocked: boolean;
  unlockedAt?: Date;
  points?: number;
  onClick?: () => void;
  size?: 'small' | 'medium' | 'large';
  showDetails?: boolean;
  animate?: boolean;
  lottieAnimation?: any; // Lottie animation JSON
}

const rarityColors = {
  common: '#9CA3AF',
  rare: '#3B82F6',
  epic: '#8B5CF6',
  legendary: '#FFD700',
};

const rarityGlows = {
  common: 'rgba(156, 163, 175, 0.4)',
  rare: 'rgba(59, 130, 246, 0.5)',
  epic: 'rgba(139, 92, 246, 0.6)',
  legendary: 'rgba(255, 215, 0, 0.7)',
};

const categoryIcons = {
  course: <School />,
  streak: <Whatshot />,
  social: <Group />,
  milestone: <TrendingUp />,
  special: <Star />,
};

const sizeMap = {
  small: { badge: 60, icon: 24, font: 'caption' },
  medium: { badge: 80, icon: 32, font: 'body2' },
  large: { badge: 120, icon: 48, font: 'body1' },
};

export const AchievementBadge: React.FC<AchievementBadgeProps> = ({
  name,
  description,
  icon,
  category,
  rarity,
  progress = 0,
  maxProgress = 100,
  unlocked,
  unlockedAt,
  points,
  onClick,
  size = 'medium',
  showDetails = true,
  animate = true,
  lottieAnimation,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showUnlockAnimation, setShowUnlockAnimation] = useState(false);
  
  const dimensions = sizeMap[size];
  const progressPercentage = maxProgress > 0 ? (progress / maxProgress) * 100 : 0;
  const displayIcon = icon || categoryIcons[category];

  const handleUnlock = () => {
    if (!unlocked && progressPercentage >= 100) {
      setShowUnlockAnimation(true);
      setTimeout(() => setShowUnlockAnimation(false), 3000);
    }
  };

  const badgeVariants: any = {
    initial: {
      scale: 0,
      rotate: -180,
      opacity: 0,
    },
    animate: {
      scale: 1,
      rotate: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 260,
        damping: 20,
      },
    },
    hover: {
      scale: 1.1,
      rotate: [0, -5, 5, -5, 0],
      transition: {
        rotate: {
          duration: 0.5,
          ease: 'easeInOut',
        },
        scale: {
          duration: 0.2,
        },
      },
    },
    tap: {
      scale: 0.95,
    },
    unlock: {
      scale: [1, 1.5, 1.2, 1],
      rotate: [0, 360],
      transition: {
        duration: 1,
        ease: 'easeInOut',
      },
    },
  };

  const glowAnimation = {
    animate: {
      boxShadow: [
        `0 0 20px ${rarityGlows[rarity]}`,
        `0 0 40px ${rarityGlows[rarity]}`,
        `0 0 20px ${rarityGlows[rarity]}`,
      ],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: 'easeInOut' as const,
      },
    },
  };

  const BadgeContent = (
    <motion.div
      variants={badgeVariants}
      initial={animate ? 'initial' : false}
      animate={showUnlockAnimation ? 'unlock' : 'animate'}
      whileHover="hover"
      whileTap="tap"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => {
        handleUnlock();
        onClick?.();
      }}
      style={{
        position: 'relative',
        cursor: onClick ? 'pointer' : 'default',
      }}
    >
      <Box
        sx={{
          width: dimensions.badge,
          height: dimensions.badge,
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* Outer ring */}
        <motion.div
          animate={unlocked && animate ? glowAnimation.animate : {}}
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: '50%',
            background: `conic-gradient(from 0deg, ${rarityColors[rarity]}40, ${rarityColors[rarity]}, ${rarityColors[rarity]}40)`,
            padding: 3,
          }}
        >
          <Box
            sx={{
              width: '100%',
              height: '100%',
              borderRadius: '50%',
              background: unlocked 
                ? `linear-gradient(135deg, ${rarityColors[rarity]}20, ${rarityColors[rarity]}40)`
                : '#1F2937',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {/* Progress indicator */}
            {!unlocked && progressPercentage > 0 && (
              <svg
                style={{
                  position: 'absolute',
                  inset: 0,
                  transform: 'rotate(-90deg)',
                }}
                width={dimensions.badge}
                height={dimensions.badge}
              >
                <circle
                  cx={dimensions.badge / 2}
                  cy={dimensions.badge / 2}
                  r={(dimensions.badge - 10) / 2}
                  fill="none"
                  stroke={rarityColors[rarity]}
                  strokeWidth={3}
                  strokeDasharray={`${(progressPercentage / 100) * Math.PI * (dimensions.badge - 10)} ${Math.PI * (dimensions.badge - 10)}`}
                  strokeLinecap="round"
                  opacity={0.7}
                />
              </svg>
            )}

            {/* Badge icon */}
            <Box
              sx={{
                color: unlocked ? rarityColors[rarity] : '#6B7280',
                fontSize: dimensions.icon,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                filter: unlocked ? 'none' : 'grayscale(100%)',
                opacity: unlocked ? 1 : 0.5,
              }}
            >
              {lottieAnimation && unlocked ? (
                <Lottie
                  animationData={lottieAnimation}
                  loop={isHovered}
                  style={{
                    width: dimensions.icon,
                    height: dimensions.icon,
                  }}
                />
              ) : (
                displayIcon
              )}
            </Box>

            {/* Lock overlay */}
            {!unlocked && (
              <Box
                sx={{
                  position: 'absolute',
                  bottom: 0,
                  right: 0,
                  backgroundColor: '#1F2937',
                  borderRadius: '50%',
                  p: 0.5,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Lock sx={{ fontSize: dimensions.icon / 2, color: '#6B7280' }} />
              </Box>
            )}

            {/* Sparkle effect for legendary items */}
            {unlocked && rarity === 'legendary' && (
              <AnimatePresence>
                {isHovered && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    style={{
                      position: 'absolute',
                      inset: 0,
                      pointerEvents: 'none',
                    }}
                  >
                    {[...Array(6)].map((_, i) => (
                      <motion.div
                        key={i}
                        style={{
                          position: 'absolute',
                          width: 4,
                          height: 4,
                          backgroundColor: '#FFD700',
                          borderRadius: '50%',
                        }}
                        animate={{
                          x: [0, Math.random() * 100 - 50],
                          y: [0, Math.random() * 100 - 50],
                          opacity: [0, 1, 0],
                        }}
                        transition={{
                          duration: 1,
                          delay: i * 0.1,
                          repeat: Infinity,
                        }}
                      />
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            )}
          </Box>
        </motion.div>

        {/* Points indicator */}
        {points && unlocked && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3 }}
            style={{
              position: 'absolute',
              top: -8,
              right: -8,
              backgroundColor: rarityColors[rarity],
              color: 'white',
              borderRadius: '50%',
              width: 24,
              height: 24,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '0.75rem',
              fontWeight: 'bold',
            }}
          >
            {points}
          </motion.div>
        )}
      </Box>

      {/* Unlock animation overlay */}
      <AnimatePresence>
        {showUnlockAnimation && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 3, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            style={{
              position: 'absolute',
              inset: 0,
              borderRadius: '50%',
              border: `2px solid ${rarityColors[rarity]}`,
              pointerEvents: 'none',
            }}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );

  if (!showDetails) {
    return BadgeContent;
  }

  return (
    <Tooltip
      title={
        <Box sx={{ p: 1 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: rarityColors[rarity] }}>
            {name}
          </Typography>
          <Typography variant="caption" sx={{ display: 'block', mt: 0.5 }}>
            {description}
          </Typography>
          {!unlocked && (
            <Box sx={{ mt: 1 }}>
              <Typography variant="caption" sx={{ display: 'block' }}>
                Progress: {progress}/{maxProgress}
              </Typography>
              <Box
                sx={{
                  width: '100%',
                  height: 4,
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  borderRadius: 2,
                  mt: 0.5,
                  overflow: 'hidden',
                }}
              >
                <Box
                  sx={{
                    width: `${progressPercentage}%`,
                    height: '100%',
                    backgroundColor: rarityColors[rarity],
                    borderRadius: 2,
                  }}
                />
              </Box>
            </Box>
          )}
          {unlocked && unlockedAt && (
            <Typography variant="caption" sx={{ display: 'block', mt: 1, opacity: 0.7 }}>
              Unlocked: {new Date(unlockedAt).toLocaleDateString()}
            </Typography>
          )}
        </Box>
      }
      placement="top"
      arrow
    >
      {BadgeContent}
    </Tooltip>
  );
};

// Achievement showcase grid
interface AchievementShowcaseProps {
  achievements: AchievementBadgeProps[];
  columns?: number;
}

export const AchievementShowcase: React.FC<AchievementShowcaseProps> = ({
  achievements,
  columns = 4,
}) => {
  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
        gap: 3,
        p: 2,
      }}
    >
      {achievements.map((achievement, index) => (
        <motion.div
          key={achievement.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <AchievementBadge {...achievement} />
        </motion.div>
      ))}
    </Box>
  );
};