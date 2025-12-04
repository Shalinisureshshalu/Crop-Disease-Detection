import React, { useState } from 'react';
import axios from 'axios';
import {
  Container,
  Box,
  Typography,
  Paper,
  Button,
  CircularProgress,
  Card,
  CardContent,
  Grid,
  Chip,
  Alert,
  Divider,
} from '@mui/material';
import {
  CloudUpload as UploadIcon,
  CameraAlt as CameraIcon,
  Science as ScienceIcon,
} from '@mui/icons-material';
import { useDropzone } from 'react-dropzone';
import { uploadImage, addDiseasePrediction } from '../services/firebase';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

const DiseaseDetection = () => {
  const { user } = useAuth();
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState(null);

  const onDrop = (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = () => setPreview(reader.result);
      reader.readAsDataURL(file);
      setResult(null); // Clear previous results
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif']
    },
    multiple: false,
    maxSize: 10 * 1024 * 1024, // 10MB
  });

  const handleAnalyze = async () => {
    if (!selectedFile) {
      toast.error('Please select an image first');
      return;
    }

    setAnalyzing(true);
    try {
      // Upload image to Firebase Storage
      //const imageUrl = await uploadImage(selectedFile, user.uid); //$
      
      // Simulate AI analysis (replace with actual API call)
      /*const mockResult = await simulateDiseaseDetection(selectedFile);
      // Save prediction to database
      const predictionData = {
        //imageUrl, //$
        fileName: selectedFile.name,
        predictedClass: mockResult.predicted_class,
        confidenceScore: mockResult.confidence_score,
        cropType: mockResult.crop_type,
        isHealthy: mockResult.is_healthy,
        timestamp: new Date(),
      };*/
      
      const formData = new FormData();
      formData.append('image', selectedFile);
      const resultax = await axios.post("http://localhost:4000/upload", formData);
      //await addDiseasePrediction(predictionData); //$
      
      setResult(resultax.data);
      toast.success('Disease detection completed successfully!');
    } catch (error) {
      console.error('Error analyzing image:', error);
      toast.error('Failed to analyze image. Please try again.');
    } finally {
      setAnalyzing(false);
    }
  };

  const simulateDiseaseDetection = async (file) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Mock disease classes
    const diseases = [
      'Apple___Apple_scab',
      'Apple___Black_rot',
      'Apple___healthy',
      'Tomato___Early_blight',
      'Tomato___healthy',
      'Corn___Common_rust',
      'Corn___healthy',
      'Potato___Late_blight',
      'Potato___healthy',
    ];
    
    const cropTypes = ['Apple', 'Tomato', 'Corn', 'Potato'];
    const randomDisease = diseases[Math.floor(Math.random() * diseases.length)];
    const randomCrop = cropTypes[Math.floor(Math.random() * cropTypes.length)];
    
    return {
      predicted_class: randomDisease,
      confidence_score: (Math.random() * 0.3 + 0.7).toFixed(3), // 70-100%
      crop_type: randomCrop,
      is_healthy: randomDisease.includes('healthy'),
      symptoms: getMockSymptoms(randomDisease),
      treatment: getMockTreatment(randomDisease),
      prevention: getMockPrevention(randomDisease),
    };
  };

  const getMockSymptoms = (disease) => {
    const symptoms = {
      'Apple___Apple_scab': 'Dark, olive-green to brown spots on leaves and fruit, fruit becomes deformed and cracked.',
      'Apple___Black_rot': 'Circular lesions with purple margins, fruit rot with black spots.',
      'Tomato___Early_blight': 'Dark brown spots with concentric rings on lower leaves, stems may develop dark lesions.',
      'Corn___Common_rust': 'Reddish-brown pustules on both sides of leaves, leaves may turn yellow and die.',
      'Potato___Late_blight': 'Water-soaked lesions on leaves, white fungal growth on undersides, rapid plant death.',
    };
    return symptoms[disease] || 'Symptoms vary depending on the specific disease and crop type.';
  };

  const getMockTreatment = (disease) => {
    const treatments = {
      'Apple___Apple_scab': 'Apply fungicides, remove infected leaves and fruit, maintain good air circulation.',
      'Apple___Black_rot': 'Prune infected branches, apply fungicides, improve tree health.',
      'Tomato___Early_blight': 'Remove infected leaves, apply fungicides, improve air circulation.',
      'Corn___Common_rust': 'Apply fungicides early in the season, remove infected plant debris.',
      'Potato___Late_blight': 'Apply fungicides immediately, remove infected plants, improve drainage.',
    };
    return treatments[disease] || 'Consult with agricultural experts for specific treatment recommendations.';
  };

  const getMockPrevention = (disease) => {
    const preventions = {
      'Apple___Apple_scab': 'Plant resistant varieties, prune for good air flow, avoid overhead irrigation.',
      'Apple___Black_rot': 'Maintain tree health, avoid mechanical injuries, proper pruning.',
      'Tomato___Early_blight': 'Space plants properly, avoid overhead watering, rotate crops.',
      'Corn___Common_rust': 'Plant resistant hybrids, avoid late planting, maintain good field hygiene.',
      'Potato___Late_blight': 'Plant resistant varieties, avoid overhead irrigation, monitor weather conditions.',
    };
    return preventions[disease] || 'Implement good agricultural practices and crop rotation strategies.';
  };

  const resetAnalysis = () => {
    setSelectedFile(null);
    setPreview(null);
    setResult(null);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom align="center">
        Crop Disease Detection
      </Typography>
      
      <Typography variant="body1" color="text.secondary" align="center" sx={{ mb: 4 }}>
        Upload a photo of your crop to detect diseases and get treatment recommendations
      </Typography>

      <Grid container spacing={4}>
        {/* Image Upload Section */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Upload Crop Image
            </Typography>
            
            <Box
              {...getRootProps()}
              sx={{
                border: '2px dashed',
                borderColor: isDragActive ? 'primary.main' : 'grey.300',
                borderRadius: 2,
                p: 4,
                textAlign: 'center',
                cursor: 'pointer',
                bgcolor: isDragActive ? 'primary.50' : 'grey.50',
                '&:hover': {
                  borderColor: 'primary.main',
                  bgcolor: 'primary.50',
                },
                transition: 'all 0.3s ease',
              }}
            >
              <input {...getInputProps()} />
              {preview ? (
                <Box>
                  <img
                    src={preview}
                    alt="Preview"
                    style={{
                      maxWidth: '100%',
                      maxHeight: '300px',
                      borderRadius: '8px',
                    }}
                  />
                  <Typography variant="body2" sx={{ mt: 2 }}>
                    {selectedFile?.name}
                  </Typography>
                </Box>
              ) : (
                <Box>
                  <UploadIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
                  <Typography variant="h6" gutterBottom>
                    {isDragActive ? 'Drop the image here' : 'Drag & drop an image here'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    or click to select a file
                  </Typography>
                  <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                    Supports: JPG, PNG, GIF (Max: 10MB)
                  </Typography>
                </Box>
              )}
            </Box>

            <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
              <Button
                variant="contained"
                onClick={handleAnalyze}
                disabled={!selectedFile || analyzing}
                startIcon={analyzing ? <CircularProgress size={20} /> : <ScienceIcon/>}
                fullWidth
              >
                {analyzing ? 'Analyzing...' : 'Analyze Image'}
              </Button>
              
              {selectedFile && (
                <Button
                  variant="outlined"
                  onClick={resetAnalysis}
                  disabled={analyzing}
                >
                  Reset
                </Button>
              )}
            </Box>
          </Paper>
        </Grid>

        {/* Results Section */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 3, minHeight: '400px' }}>
            <Typography variant="h6" gutterBottom>
              Analysis Results
            </Typography>
            
            {analyzing && (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <CircularProgress size={60} />
                <Typography variant="h6" sx={{ mt: 2 }}>
                  Analyzing your crop image...
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  This may take a few moments
                </Typography>
              </Box>
            )}

            {!analyzing && !result && (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <CameraIcon sx={{ fontSize: 48, color: 'grey.400', mb: 2 }} />
                <Typography variant="h6" color="text.secondary">
                  No analysis yet
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Upload an image and click analyze to get started
                </Typography>
              </Box>
            )}

            {result && (
              <Box>
                <Alert
                  severity={result.is_healthy ? 'success' : 'warning'}
                  sx={{ mb: 2 }}
                >
                  {result.is_healthy 
                    ? 'Your crop appears to be healthy!' 
                    : 'Disease detected in your crop'
                  }
                </Alert>

                <Card sx={{ mb: 2 }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Detection Results
                    </Typography>
                    
                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">
                          Disease Class
                        </Typography>
                        <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                          {result.predicted_class.replace(/_/g, ' ')}
                        </Typography>
                      </Grid>
                      
                      <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">
                          Confidence
                        </Typography>
                        <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                          {(result.confidence_score * 100).toFixed(1)}%
                        </Typography>
                      </Grid>
                      
                      <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">
                          Crop Type
                        </Typography>
                        <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                          {result.crop_type}
                        </Typography>
                      </Grid>
                      
                      <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">
                          Status
                        </Typography>
                        <Chip
                          label={result.is_healthy ? 'Healthy' : 'Diseased'}
                          color={result.is_healthy ? 'success' : 'error'}
                          size="small"
                        />
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>

                <Divider sx={{ my: 2 }} />

                <Typography variant="h6" gutterBottom>
                  Symptoms
                </Typography>
                <Typography variant="body2" paragraph>
                  {result.symptoms}
                </Typography>

                <Typography variant="h6" gutterBottom>
                  Treatment
                </Typography>
                <Typography variant="body2" paragraph>
                  {result.treatment}
                </Typography>

                <Typography variant="h6" gutterBottom>
                  Prevention
                </Typography>
                <Typography variant="body2" paragraph>
                  {result.prevention}
                </Typography>
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default DiseaseDetection;
