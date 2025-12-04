import React from 'react';
import {
  Container,
  Box,
  Typography,
  Paper,
  Grid,
  Chip,
  Divider,
} from '@mui/material';
import { useParams } from 'react-router-dom';

const DiseaseInfo = () => {
  const { id } = useParams();

  // Mock disease data - replace with actual data from Firebase
  const mockDiseases = {
    'apple-scab': {
      name: 'Apple Scab',
      cropType: 'Apple',
      severity: 'High',
      symptoms: 'Dark, olive-green to brown spots on leaves and fruit, fruit becomes deformed and cracked.',
      treatment: 'Apply fungicides, remove infected leaves and fruit, maintain good air circulation.',
      prevention: 'Plant resistant varieties, prune for good air flow, avoid overhead irrigation.',
      lifecycle: 'Spores overwinter on fallen leaves and fruit, spread by wind and rain in spring.',
    },
    'tomato-blight': {
      name: 'Tomato Early Blight',
      cropType: 'Tomato',
      severity: 'Medium',
      symptoms: 'Dark brown spots with concentric rings on lower leaves, stems may develop dark lesions.',
      treatment: 'Remove infected leaves, apply fungicides, improve air circulation.',
      prevention: 'Space plants properly, avoid overhead watering, rotate crops.',
      lifecycle: 'Fungus survives in soil and plant debris, spreads during warm, humid weather.',
    },
  };

  const disease = mockDiseases[id] || {
    name: 'Unknown Disease',
    cropType: 'Unknown',
    severity: 'Unknown',
    symptoms: 'Information not available.',
    treatment: 'Consult with agricultural experts.',
    prevention: 'Implement good agricultural practices.',
    lifecycle: 'Information not available.',
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom align="center">
        Disease Information
      </Typography>

      <Paper elevation={3} sx={{ p: 4, mt: 3 }}>
        <Grid container spacing={4}>
          {/* Disease Header */}
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
              <Typography variant="h5" component="h2" sx={{ fontWeight: 'bold' }}>
                {disease.name}
              </Typography>
              <Chip 
                label={disease.cropType} 
                color="primary" 
                variant="outlined"
              />
              <Chip 
                label={disease.severity} 
                color={disease.severity === 'High' ? 'error' : 'warning'}
              />
            </Box>
            <Divider sx={{ mb: 3 }} />
          </Grid>

          {/* Symptoms */}
          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom color="error.main">
              Symptoms
            </Typography>
            <Typography variant="body1" paragraph>
              {disease.symptoms}
            </Typography>
          </Grid>

          {/* Treatment */}
          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom color="success.main">
              Treatment
            </Typography>
            <Typography variant="body1" paragraph>
              {disease.treatment}
            </Typography>
          </Grid>

          {/* Prevention */}
          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom color="info.main">
              Prevention
            </Typography>
            <Typography variant="body1" paragraph>
              {disease.prevention}
            </Typography>
          </Grid>

          {/* Lifecycle */}
          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom color="secondary.main">
              Disease Lifecycle
            </Typography>
            <Typography variant="body1" paragraph>
              {disease.lifecycle}
            </Typography>
          </Grid>
        </Grid>
      </Paper>

      <Box sx={{ mt: 4, textAlign: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          For more detailed information, consult with agricultural experts or extension services.
        </Typography>
      </Box>
    </Container>
  );
};

export default DiseaseInfo;
