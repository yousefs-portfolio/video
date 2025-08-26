import React from 'react';
import { motion } from 'framer-motion';
import { Box, Typography } from '@mui/material';

interface ProgressRingProps {
  progress: number; // 0-100
  size?: number;
  strokeWidth?: number;
  primaryColor?: string;
  secondaryColor?: string;
  showPercentage?: boolean;
  label?: string;
  animate?: boolean;
}

export const ProgressRing: React.FC<ProgressRingProps> = ({
  progress,
  size = 120,
  strokeWidth = 8,
  primaryColor = '#10B981',
  secondaryColor = '#E5E7EB',
  showPercentage = true,
  label,
  animate = true,
}) => {
  const normalizedProgress = Math.min(100, Math.max(0, progress));
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (normalizedProgress / 100) * circumference;

  return (
    <Box
      className="progress-ring"
      sx={{
        width: size,
        height: size,
        position: 'relative',
      }}
    >
      <svg
        width={size}
        height={size}
        style={{
          transform: 'rotate(-90deg)',
        }}
      >
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={secondaryColor}
          strokeWidth={strokeWidth}
        />
        
        {/* Progress circle */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={primaryColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: animate ? circumference : strokeDashoffset }}
          animate={{ strokeDashoffset }}
          transition={{
            duration: 1.5,
            ease: 'easeInOut',
          }}
        />

        {/* Animated gradient effect */}
        <defs>
          <linearGradient id={`progress-gradient-${progress}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={primaryColor} stopOpacity={0.8} />
            <stop offset="100%" stopColor={primaryColor} stopOpacity={1} />
          </linearGradient>
          
          {/* Glow filter */}
          <filter id={`glow-${progress}`}>
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Animated progress circle with gradient */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={`url(#progress-gradient-${progress})`}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: animate ? circumference : strokeDashoffset }}
          animate={{ strokeDashoffset }}
          filter={`url(#glow-${progress})`}
          transition={{
            duration: 1.5,
            ease: 'easeInOut',
          }}
          style={{
            opacity: 0.6,
          }}
        />
      </svg>

      {/* Center content */}
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          textAlign: 'center',
        }}
      >
        {showPercentage && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            <Typography
              variant="h4"
              sx={{
                fontWeight: 'bold',
                background: `linear-gradient(135deg, ${primaryColor} 0%, ${primaryColor}dd 100%)`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              {Math.round(normalizedProgress)}%
            </Typography>
          </motion.div>
        )}
        
        {label && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.5 }}
          >
            <Typography
              variant="caption"
              sx={{
                color: 'text.secondary',
                fontWeight: 500,
                mt: 0.5,
              }}
            >
              {label}
            </Typography>
          </motion.div>
        )}
      </Box>
    </Box>
  );
};

// Multi-layered progress ring for complex metrics
interface MultiProgressRingProps {
  data: {
    value: number;
    color: string;
    label: string;
  }[];
  size?: number;
  strokeWidth?: number;
}

export const MultiProgressRing: React.FC<MultiProgressRingProps> = ({
  data,
  size = 180,
  strokeWidth = 6,
}) => {
  const sortedData = [...data].sort((a, b) => b.value - a.value);
  
  return (
    <Box sx={{ position: 'relative', width: size, height: size }}>
      {sortedData.map((item, index) => {
        const adjustedSize = size - index * (strokeWidth * 3);
        return (
          <Box
            key={item.label}
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
            }}
          >
            <ProgressRing
              progress={item.value}
              size={adjustedSize}
              strokeWidth={strokeWidth}
              primaryColor={item.color}
              showPercentage={index === 0}
              label={index === 0 ? 'Overall' : undefined}
              animate
            />
          </Box>
        );
      })}
      
      {/* Legend */}
      <Box
        sx={{
          position: 'absolute',
          bottom: -40,
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          gap: 2,
        }}
      >
        {data.map((item) => (
          <Box key={item.label} sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Box
              sx={{
                width: 12,
                height: 12,
                borderRadius: '50%',
                backgroundColor: item.color,
              }}
            />
            <Typography variant="caption" color="text.secondary">
              {item.label}
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
};