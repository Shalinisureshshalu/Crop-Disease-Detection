import React, { useState, useEffect } from 'react';
import {
  Container,
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Chip,
  Divider,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  Person as PersonIcon,
  Email as EmailIcon,
  History as HistoryIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { getUserPredictions } from '../services/firebase';
import { useQuery } from 'react-query';

const Profile = () => {
  const { user } = useAuth();

  // Fetch user predictions
  const { data: predictions, isLoading, error } = useQuery(
    ['userPredictions', user?.uid],
    () => getUserPredictions(user?.uid),
    {
      enabled: !!user?.uid,
    }
  );

  const formatDate = (timestamp) => {
    if (!timestamp) return 'Unknown';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusIcon = (isHealthy) => {
    return isHealthy ? <CheckCircleIcon /> : <WarningIcon />;
  };

  const getStatusColor = (isHealthy) => {
    return isHealthy ? 'success' : 'error';
  };

  if (isLoading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress size={60} />
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          Failed to load profile data: {error.message}
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom align="center">
        User Profile
      </Typography>

      <Grid container spacing={4}>
        {/* User Info Card */}
        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Box sx={{ textAlign: 'center', mb: 3 }}>
              <Avatar sx={{ width: 80, height: 80, mx: 'auto', mb: 2 }}>
                <PersonIcon sx={{ fontSize: 40 }} />
              </Avatar>
              <Typography variant="h6" gutterBottom>
                {user?.email?.split('@')[0] || 'User'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {user?.email || 'No email'}
              </Typography>
            </Box>

            <Divider sx={{ my: 2 }} />

            <Box>
              <Typography variant="h6" gutterBottom>
                Account Details
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <EmailIcon sx={{ mr: 1, color: 'primary.main' }} />
                <Typography variant="body2">
                  {user?.email || 'No email'}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <HistoryIcon sx={{ mr: 1, color: 'primary.main' }} />
                <Typography variant="body2">
                  Member since: {user?.metadata?.creationTime ? 
                    new Date(user.metadata.creationTime).toLocaleDateString() : 
                    'Unknown'
                  }
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Grid>

        {/* Detection History */}
        <Grid item xs={12} md={8}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Detection History
            </Typography>

            {predictions && predictions.length > 0 ? (
              <List>
                {predictions.map((prediction, index) => (
                  <React.Fragment key={prediction.id}>
                    <ListItem alignItems="flex-start">
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: getStatusColor(prediction.isHealthy) }}>
                          {getStatusIcon(prediction.isHealthy)}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                              {prediction.predictedClass?.replace(/_/g, ' ') || 'Unknown Disease'}
                            </Typography>
                            <Chip
                              label={prediction.isHealthy ? 'Healthy' : 'Diseased'}
                              color={getStatusColor(prediction.isHealthy)}
                              size="small"
                            />
                          </Box>
                        }
                        secondary={
                          <Box>
                            <Typography variant="body2" color="text.secondary">
                              Crop: {prediction.cropType || 'Unknown'} • 
                              Confidence: {(prediction.confidenceScore * 100).toFixed(1)}%
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {formatDate(prediction.timestamp)}
                            </Typography>
                          </Box>
                        }
                      />
                    </ListItem>
                    {index < predictions.length - 1 && <Divider variant="inset" component="li" />}
                  </React.Fragment>
                ))}
              </List>
            ) : (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <HistoryIcon sx={{ fontSize: 48, color: 'grey.400', mb: 2 }} />
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  No detections yet
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Start by uploading your first crop image for disease detection
                </Typography>
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Profile;
