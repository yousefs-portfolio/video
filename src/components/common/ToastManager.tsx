import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Snackbar, Alert, Slide, SlideProps } from '@mui/material';
import { AnimatePresence, motion } from 'framer-motion';
import { RootState, AppDispatch } from '@/store';
import { removeToast } from '@/store/slices/uiSlice';

function SlideTransition(props: SlideProps) {
  return <Slide {...props} direction="up" />;
}

const ToastManager: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const toasts = useSelector((state: RootState) => state.ui.toasts);

  // Auto-remove toasts after their duration
  useEffect(() => {
    const timers = toasts.map((toast) => {
      return setTimeout(() => {
        dispatch(removeToast(toast.id));
      }, toast.duration || 5000);
    });

    return () => {
      timers.forEach(clearTimeout);
    };
  }, [toasts, dispatch]);

  return (
    <AnimatePresence>
      {toasts.map((toast, index) => (
        <Snackbar
          key={toast.id}
          open={true}
          autoHideDuration={toast.duration}
          onClose={() => dispatch(removeToast(toast.id))}
          TransitionComponent={SlideTransition}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          sx={{
            bottom: `${24 + index * 70}px !important`,
          }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8, x: 100 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.8, x: 100 }}
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          >
            <Alert
              onClose={() => dispatch(removeToast(toast.id))}
              severity={toast.type}
              variant="filled"
              elevation={6}
              sx={{
                minWidth: 300,
                boxShadow: 4,
                '& .MuiAlert-icon': {
                  fontSize: 28,
                },
                '& .MuiAlert-message': {
                  fontSize: '0.95rem',
                  fontWeight: 500,
                },
              }}
            >
              {toast.message}
            </Alert>
          </motion.div>
        </Snackbar>
      ))}
    </AnimatePresence>
  );
};

export default ToastManager;