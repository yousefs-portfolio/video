import React from 'react';
import { Box, Button, Link, Paper, TextField, Typography } from '@mui/material';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { AppDispatch } from '@/store';
import { register as registerThunk } from '@/store/slices/authSlice';
import { showToast } from '@/store/slices/uiSlice';

const schema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type FormData = z.infer<typeof schema>;

const RegisterPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    try {
      await dispatch(registerThunk(data)).unwrap();
      dispatch(showToast({ message: 'Account created! Welcome aboard!', type: 'success' }));
      navigate('/dashboard');
    } catch {
      dispatch(showToast({ message: 'Registration failed. Please try again.', type: 'error' }));
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
      <Paper sx={{ p: 4, maxWidth: 420, width: '100%', borderRadius: 3 }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom textAlign="center">
          Create your account
        </Typography>
        <Typography color="text.secondary" gutterBottom textAlign="center" sx={{ mb: 3 }}>
          Start your learning journey
        </Typography>
        <form onSubmit={handleSubmit(onSubmit)}>
          <TextField
            fullWidth
            label="Full name"
            {...register('name')}
            error={!!errors.name}
            helperText={errors.name?.message}
            sx={{ mb: 2 }}
          />
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
            {isSubmitting ? 'Creating account...' : 'Create account'}
          </Button>
        </form>
        <Typography variant="body2" textAlign="center">
          Already have an account?{' '}
          <Link component="button" onClick={() => navigate('/login')} sx={{ cursor: 'pointer' }}>
            Sign in
          </Link>
        </Typography>
      </Paper>
    </Box>
  );
};

export default RegisterPage;
