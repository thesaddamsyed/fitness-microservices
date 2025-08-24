import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  TextField,
  Button,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Grid,
  Typography,
  Avatar,
  Chip,
  Stepper,
  Step,
  StepLabel,
  Alert,
  Snackbar,
  IconButton,
  InputAdornment,
} from '@mui/material';
import {
  FitnessCenter,
  DirectionsRun,
  DirectionsWalk,
  DirectionsBike,
  Timer,
  LocalFireDepartment,
  Straighten,
  Speed,
  Favorite,
  CheckCircle,
} from '@mui/icons-material';
import { addActivity } from '../services/api';

const ActivityForm = () => {
  const [activity, setActivity] = useState({
    userId: '',
    type: "RUNNING",
    duration: '',
    caloriesBurned: '',
    additionalMetrics: { distance: '', speed: '', heartRate: '' }
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const activityTypes = [
    { value: "RUNNING", label: "Running", icon: <DirectionsRun />, color: "success" },
    { value: "WALKING", label: "Walking", icon: <DirectionsWalk />, color: "info" },
    { value: "CYCLING", label: "Cycling", icon: <DirectionsBike />, color: "warning" },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Compute current time in HH:mm format
      const now = new Date();
      const hh = String(now.getHours()).padStart(2, "0");
      const mm = String(now.getMinutes()).padStart(2, "0");
      const startTime = `${hh}:${mm}`;

      const parsedActivity = {
        userId: parseInt(localStorage.getItem("userId"), 10),
        type: activity.type,
        duration: parseInt(activity.duration, 10),
        caloriesBurned: parseInt(activity.caloriesBurned, 10),
        startTime: startTime,
        additionalMetrics: {
          distance: parseFloat(activity.additionalMetrics.distance) || 0,
          speed: parseFloat(activity.additionalMetrics.speed) || 0,
          heartRate: parseInt(activity.additionalMetrics.heartRate, 10) || 0,
        },
      };

      await addActivity(parsedActivity);
      setSuccess(true);

      // Reset form
      setActivity({
        userId: "",
        type: "RUNNING",
        duration: "",
        caloriesBurned: "",
        additionalMetrics: { distance: "", speed: "", heartRate: "" },
      });
    } catch (error) {
      console.error(error);
      setError('Failed to add activity. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSuccess = () => {
    setSuccess(false);
  };

  const handleCloseError = () => {
    setError('');
  };

  const getCurrentActivityType = () => {
    return activityTypes.find(type => type.value === activity.type);
  };

  return (
    <Box>
      <Card sx={{ maxWidth: 800, mx: 'auto' }}>
        <CardHeader
          avatar={
            <Avatar sx={{ bgcolor: 'primary.main' }}>
              <FitnessCenter />
            </Avatar>
          }
          title="Add New Activity"
          subheader="Track your fitness progress with detailed metrics"
          sx={{ borderBottom: '1px solid #e2e8f0' }}
        />
        
        <CardContent sx={{ pt: 3 }}>
          <form onSubmit={handleSubmit}>
            {/* Activity Type Selection */}
            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Choose Activity Type
              </Typography>
              <Grid container spacing={2}>
                {activityTypes.map((type) => (
                  <Grid item xs={12} sm={4} key={type.value}>
                    <Card
                      sx={{
                        cursor: 'pointer',
                        border: activity.type === type.value ? '2px solid' : '1px solid',
                        borderColor: activity.type === type.value ? `${type.color}.main` : '#e2e8f0',
                        bgcolor: activity.type === type.value ? `${type.color}.light` : 'background.paper',
                        transition: 'all 0.2s ease',
                        '&:hover': {
                          transform: 'translateY(-2px)',
                          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                        },
                      }}
                      onClick={() => setActivity({ ...activity, type: type.value })}
                    >
                      <CardContent sx={{ textAlign: 'center', py: 3 }}>
                        <Avatar
                          sx={{
                            width: 48,
                            height: 48,
                            bgcolor: `${type.color}.main`,
                            color: 'white',
                            mx: 'auto',
                            mb: 2,
                          }}
                        >
                          {type.icon}
                        </Avatar>
                        <Typography variant="h6" fontWeight="bold" gutterBottom>
                          {type.label}
                        </Typography>
                        {activity.type === type.value && (
                          <Chip
                            icon={<CheckCircle />}
                            label="Selected"
                            color={type.color}
                            size="small"
                          />
                        )}
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Box>

            {/* Basic Metrics */}
            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Basic Metrics
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Duration (Minutes)"
                    type="number"
                    required
                    value={activity.duration}
                    onChange={(e) => setActivity({ ...activity, duration: e.target.value })}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Timer color="action" />
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                      },
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Calories Burned"
                    type="number"
                    required
                    value={activity.caloriesBurned}
                    onChange={(e) => setActivity({ ...activity, caloriesBurned: e.target.value })}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LocalFireDepartment color="action" />
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                      },
                    }}
                  />
                </Grid>
              </Grid>
            </Box>

            {/* Additional Metrics */}
            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Additional Metrics
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Optional metrics to track your performance in detail
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    label="Distance (km)"
                    type="number"
                    value={activity.additionalMetrics.distance}
                    onChange={(e) =>
                      setActivity({
                        ...activity,
                        additionalMetrics: {
                          ...activity.additionalMetrics,
                          distance: e.target.value,
                        },
                      })
                    }
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Straighten color="action" />
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                      },
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    label="Speed (km/h)"
                    type="number"
                    value={activity.additionalMetrics.speed}
                    onChange={(e) =>
                      setActivity({
                        ...activity,
                        additionalMetrics: {
                          ...activity.additionalMetrics,
                          speed: e.target.value,
                        },
                      })
                    }
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Speed color="action" />
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                      },
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    label="Heart Rate (bpm)"
                    type="number"
                    value={activity.additionalMetrics.heartRate}
                    onChange={(e) =>
                      setActivity({
                        ...activity,
                        additionalMetrics: {
                          ...activity.additionalMetrics,
                          heartRate: e.target.value,
                        },
                      })
                    }
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Favorite color="action" />
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                      },
                    }}
                  />
                </Grid>
              </Grid>
            </Box>

            {/* Submit Button */}
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <Button
                type="submit"
                variant="contained"
                size="large"
                disabled={loading || !activity.duration || !activity.caloriesBurned}
                startIcon={<FitnessCenter />}
                sx={{
                  px: 6,
                  py: 1.5,
                  fontSize: '1.1rem',
                  borderRadius: 3,
                  textTransform: 'none',
                  fontWeight: 600,
                  boxShadow: '0 4px 12px rgba(25, 118, 210, 0.3)',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 8px 25px rgba(25, 118, 210, 0.4)',
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                {loading ? 'Adding Activity...' : 'Add Activity'}
              </Button>
            </Box>
          </form>
        </CardContent>
      </Card>

      {/* Success Snackbar */}
      <Snackbar
        open={success}
        autoHideDuration={6000}
        onClose={handleCloseSuccess}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          onClose={handleCloseSuccess}
          severity="success"
          variant="filled"
          sx={{ width: '100%' }}
        >
          Activity added successfully! 🎉
        </Alert>
      </Snackbar>

      {/* Error Snackbar */}
      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={handleCloseError}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          onClose={handleCloseError}
          severity="error"
          variant="filled"
          sx={{ width: '100%' }}
        >
          {error}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ActivityForm;
