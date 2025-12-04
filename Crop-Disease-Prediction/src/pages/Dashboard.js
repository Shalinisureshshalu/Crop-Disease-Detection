import React, { useState, useEffect } from 'react';
import {
  Container,
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Paper,
  Button,
  Chip,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Divider,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  Agriculture as AgricultureIcon,
  TrendingUp as TrendingUpIcon,
  History as HistoryIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  CameraAlt as CameraIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getUserPredictions } from '../services/firebase';
import { useQuery } from 'react-query';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalDetections: 0,
    healthyCrops: 0,
    diseasedCrops: 0,
    averageConfidence: 0,
  });

  // Fetch user predictions
  const { data: predictions, isLoading, error } = useQuery(
    ['userPredictions', user?.uid],
    () => getUserPredictions(user?.uid),
    {
      enabled: !!user?.uid,
      refetchInterval: 30000, // Refetch every 30 seconds
    }
  );

  useEffect(() => {
    if (predictions) {
      const total = predictions.length;
      const healthy = predictions.filter(p => p.isHealthy).length;
      const diseased = total - healthy;
      const avgConfidence = predictions.length > 0 
        ? predictions.reduce((sum, p) => sum + p.confidenceScore, 0) / total 
        : 0;

      setStats({
        totalDetections: total,
        healthyCrops: healthy,
        diseasedCrops: diseased,
        averageConfidence: avgConfidence,
      });
    }
  }, [predictions]);

  const getStatusColor = (isHealthy) => {
    return isHealthy ? 'success' : 'error';
  };

  const getStatusIcon = (isHealthy) => {
    return isHealthy ? <CheckCircleIcon /> : <WarningIcon />;
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return 'Unknown';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getCropIcon = (cropType) => {
    return <AgricultureIcon />;
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
          Failed to load dashboard data: {error.message}
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Welcome back, {user?.email?.split('@')[0]}! 👋
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Here's an overview of your crop disease detection activities
        </Typography>
      </Box>

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={2}>
            <CardContent sx={{ textAlign: 'center' }}>
              <CameraIcon sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
              <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
                {stats.totalDetections}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Detections
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={2}>
            <CardContent sx={{ textAlign: 'center' }}>
              <CheckCircleIcon sx={{ fontSize: 40, color: 'success.main', mb: 1 }} />
              <Typography variant="h4" component="div" sx={{ fontWeight: 'bold', color: 'success.main' }}>
                {stats.healthyCrops}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Healthy Crops
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={2}>
            <CardContent sx={{ textAlign: 'center' }}>
              <WarningIcon sx={{ fontSize: 40, color: 'error.main', mb: 1 }} />
              <Typography variant="h4" component="div" sx={{ fontWeight: 'bold', color: 'error.main' }}>
                {stats.diseasedCrops}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Diseased Crops
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={2}>
            <CardContent sx={{ textAlign: 'center' }}>
              <TrendingUpIcon sx={{ fontSize: 40, color: 'info.main', mb: 1 }} />
              <Typography variant="h4" component="div" sx={{ fontWeight: 'bold', color: 'info.main' }}>
                {(stats.averageConfidence * 100).toFixed(1)}%
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Avg Confidence
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Quick Actions */}
      <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Quick Actions
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <Button
            variant="contained"
            startIcon={<CameraIcon />}
            onClick={() => navigate('/detect')}
          >
            Detect New Disease
          </Button>
          <Button
            variant="outlined"
            startIcon={<HistoryIcon />}
            onClick={() => navigate('/profile')}
          >
            View Full History
          </Button>
        </Box>
      </Paper>

      {/* Recent Detections */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper elevation={2} sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">
                Recent Detections
              </Typography>
              <Button
                size="small"
                onClick={() => navigate('/profile')}
              >
                View All
              </Button>
            </Box>

            {predictions && predictions.length > 0 ? (
              <List>
                {predictions.slice(0, 5).map((prediction, index) => (
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
                    {index < Math.min(predictions.length, 5) - 1 && <Divider variant="inset" component="li" />}
                  </React.Fragment>
                ))}
              </List>
            ) : (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <CameraIcon sx={{ fontSize: 48, color: 'grey.400', mb: 2 }} />
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  No detections yet
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Start by uploading your first crop image for disease detection
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<CameraIcon />}
                  onClick={() => navigate('/detect')}
                >
                  Detect Disease
                </Button>
              </Box>
            )}
          </Paper>
        </Grid>

        {/* Health Overview */}
        <Grid item xs={12} md={4}>
          <Paper elevation={2} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Health Overview
            </Typography>
            
            {stats.totalDetections > 0 ? (
              <Box>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Overall Crop Health
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                      {((stats.healthyCrops / stats.totalDetections) * 100).toFixed(1)}%
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      healthy
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Disease Rate
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'error.main' }}>
                      {((stats.diseasedCrops / stats.totalDetections) * 100).toFixed(1)}%
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      diseased
                    </Typography>
                  </Box>
                </Box>

                <Box>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Detection Accuracy
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'info.main' }}>
                      {(stats.averageConfidence * 100).toFixed(1)}%
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      confidence
                    </Typography>
                  </Box>
                </Box>
              </Box>
            ) : (
              <Box sx={{ textAlign: 'center', py: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  No data available yet
                </Typography>
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard;
