import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';
import { motion } from 'framer-motion';

interface LoadingScreenProps {
  message?: string;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ message = 'Loading...' }) => {
  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'background.default',
        zIndex: 9999,
      }}
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <Box sx={{ position: 'relative', display: 'inline-flex' }}>
          <CircularProgress
            size={80}
            thickness={4}
            sx={{
              color: 'primary.main',
            }}
          />
          <Box
            sx={{
              top: 0,
              left: 0,
              bottom: 0,
              right: 0,
              position: 'absolute',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            >
              <Typography
                variant="h4"
                component="div"
                sx={{
                  fontWeight: 'bold',
                  background: 'linear-gradient(45deg, #1E88E5, #43A047)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                L
              </Typography>
            </motion.div>
          </Box>
        </Box>
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Typography
          variant="h6"
          sx={{
            mt: 3,
            color: 'text.secondary',
            fontWeight: 500,
          }}
        >
          {message}
        </Typography>
      </motion.div>

      {/* Loading dots animation */}
      <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
        {[0, 1, 2].map((index) => (
          <motion.div
            key={index}
            animate={{
              y: [0, -10, 0],
            }}
            transition={{
              duration: 0.6,
              repeat: Infinity,
              delay: index * 0.1,
            }}
          >
            <Box
              sx={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                backgroundColor: 'primary.main',
              }}
            />
          </motion.div>
        ))}
      </Box>
    </Box>
  );
};

export default LoadingScreen;