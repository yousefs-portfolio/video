import React from 'react';
import { Box, Typography, TextField, Button, Paper, Link } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { AppDispatch } from '@/store';
import { login } from '@/store/slices/authSlice';
import { showToast } from '@/store/slices/uiSlice';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormData = z.infer<typeof loginSchema>;

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      await dispatch(login(data)).unwrap();
      dispatch(showToast({ message: 'Welcome back!', type: 'success' }));
      navigate('/dashboard');
    } catch (error) {
      dispatch(showToast({ message: 'Login failed. Please try again.', type: 'error' }));
    }
  };

  return (
    <Box
      sx={{
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'background.default',
      }}
    >
      <Paper sx={{ p: 4, maxWidth: 400, width: '100%', borderRadius: 3 }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom textAlign="center">
          Welcome Back
        </Typography>
        <Typography color="text.secondary" gutterBottom textAlign="center" sx={{ mb: 3 }}>
          Login to continue learning
        </Typography>
        
        <form onSubmit={handleSubmit(onSubmit)}>
          <TextField
            fullWidth
            label="Email"
            type="email"
            {...register('email')}
            error={!!errors.email}
            helperText={errors.email?.message}
            sx={{ mb: 2 }}
          />
          
          <TextField
            fullWidth
            label="Password"
            type="password"
            {...register('password')}
            error={!!errors.password}
            helperText={errors.password?.message}
            sx={{ mb: 3 }}
          />
          
          <Button
            fullWidth
            type="submit"
            variant="contained"
            size="large"
            disabled={isSubmitting}
            sx={{ mb: 2, borderRadius: 2 }}
          >
            {isSubmitting ? 'Logging in...' : 'Login'}
          </Button>
        </form>
        
        <Typography variant="body2" textAlign="center">
          Don't have an account?{' '}
          <Link
            component="button"
            onClick={() => navigate('/register')}
            sx={{ cursor: 'pointer' }}
          >
            Sign up
          </Link>
        </Typography>
      </Paper>
    </Box>
  );
};

export default LoginPage;