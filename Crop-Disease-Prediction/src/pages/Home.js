import React from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Paper,
} from '@mui/material';
import {
  Agriculture as AgricultureIcon,
  CameraAlt as CameraIcon,
  Science as ScienceIcon,
  Security as SecurityIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Home = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const features = [
    {
      icon: <CameraIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: 'Image Upload',
      description: 'Simply upload a photo of your crop and get instant disease detection results.',
    },
    {
      icon: <ScienceIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: 'AI-Powered Analysis',
      description: 'Advanced machine learning algorithms provide accurate disease identification.',
    },
    {
      icon: <AgricultureIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: 'Expert Solutions',
      description: 'Get detailed treatment recommendations and prevention strategies.',
    },
    {
      icon: <SecurityIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: 'Secure & Private',
      description: 'Your data is protected with enterprise-grade security measures.',
    },
  ];

  return (
    <Box>
      {/* Hero Section */}
      <Paper
        sx={{
          position: 'relative',
          backgroundColor: 'grey.800',
          color: '#fff',
          mb: 4,
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
          backgroundImage: 'linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2232&q=80)',
          minHeight: '60vh',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography
              component="h1"
              variant="h2"
              color="inherit"
              gutterBottom
              sx={{ fontWeight: 'bold' }}
            >
              Crop Disease Detection
            </Typography>
            <Typography variant="h5" color="inherit" paragraph>
              Protect your crops with AI-powered disease detection. 
              Upload a photo and get instant results with expert treatment recommendations.
            </Typography>
            <Box sx={{ mt: 4 }}>
              {user ? (
                <Button
                  variant="contained"
                  size="large"
                  onClick={() => navigate('/detect')}
                  sx={{ mr: 2, mb: 2 }}
                >
                  Detect Disease Now
                </Button>
              ) : (
                <>
                  <Button
                    variant="contained"
                    size="large"
                    onClick={() => navigate('/register')}
                    sx={{ mr: 2, mb: 2 }}
                  >
                    Get Started
                  </Button>
                  <Button
                    variant="outlined"
                    size="large"
                    onClick={() => navigate('/login')}
                    sx={{ color: 'white', borderColor: 'white', mb: 2 }}
                  >
                    Sign In
                  </Button>
                </>
              )}
            </Box>
          </Box>
        </Container>
      </Paper>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography
          component="h2"
          variant="h3"
          align="center"
          color="text.primary"
          gutterBottom
          sx={{ mb: 6 }}
        >
          How It Works
        </Typography>
        
        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  textAlign: 'center',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    transition: 'transform 0.3s ease-in-out',
                    boxShadow: 3,
                  },
                }}
              >
                <CardContent sx={{ flexGrow: 1, py: 3 }}>
                  <Box sx={{ mb: 2 }}>
                    {feature.icon}
                  </Box>
                  <Typography gutterBottom variant="h6" component="h3">
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* CTA Section */}
      <Box sx={{ bgcolor: 'primary.main', color: 'white', py: 8 }}>
        <Container maxWidth="md">
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h4" component="h2" gutterBottom>
              Ready to Protect Your Crops?
            </Typography>
            <Typography variant="h6" paragraph>
              Join thousands of farmers who trust our AI-powered disease detection system.
            </Typography>
            {!user && (
              <Button
                variant="contained"
                size="large"
                onClick={() => navigate('/register')}
                sx={{
                  bgcolor: 'white',
                  color: 'primary.main',
                  '&:hover': {
                    bgcolor: 'grey.100',
                  },
                }}
              >
                Start Free Trial
              </Button>
            )}
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default Home;
