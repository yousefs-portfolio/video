import React from 'react';
import { Box, Typography, Button, Card, CardContent, Container } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Container maxWidth="lg">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Box sx={{ py: 8, textAlign: 'center' }}>
          <Typography
            variant="h2"
            sx={{
              fontWeight: 'bold',
              mb: 2,
              background: 'linear-gradient(45deg, #1E88E5, #43A047)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            Learn Without Limits
          </Typography>
          <Typography variant="h5" color="text.secondary" sx={{ mb: 4 }}>
            Master new skills with gamified learning experiences
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate('/courses')}
              sx={{ borderRadius: 3, px: 4 }}
            >
              Browse Courses
            </Button>
            <Button
              variant="outlined"
              size="large"
              onClick={() => navigate('/register')}
              sx={{ borderRadius: 3, px: 4 }}
            >
              Get Started
            </Button>
          </Box>
        </Box>

        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 4, mt: 4 }}>
          {['Interactive Videos', 'Gamification', 'Community Learning'].map((feature) => (
            <Card key={feature} sx={{ height: '100%', borderRadius: 3 }}>
              <CardContent>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  {feature}
                </Typography>
                <Typography color="text.secondary">
                  Experience learning with cutting-edge features
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Box>
      </motion.div>
    </Container>
  );
};

export default HomePage;