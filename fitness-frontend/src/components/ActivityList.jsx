import React, { useEffect, useState } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  CardActions,
  Typography,
  Avatar,
  Chip,
  Button,
  IconButton,
  Skeleton,
  Alert,
  Paper,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Fab,
  useTheme,
} from '@mui/material';
import {
  DirectionsRun,
  DirectionsWalk,
  DirectionsBike,
  Timer,
  LocalFireDepartment,
  Straighten,
  Speed,
  Favorite,
  Add,
  TrendingUp,
  CalendarToday,
  MoreVert,
  Refresh,
} from '@mui/icons-material';
import { useNavigate } from 'react-router';
import { getActivities } from '../services/api';

const ActivityCard = ({ activity, onClick }) => {
  const theme = useTheme();
  
  const getActivityIcon = (type) => {
    switch (type) {
      case 'RUNNING':
        return <DirectionsRun />;
      case 'WALKING':
        return <DirectionsWalk />;
      case 'CYCLING':
        return <DirectionsBike />;
      default:
        return <DirectionsRun />;
    }
  };

  const getActivityColor = (type) => {
    switch (type) {
      case 'RUNNING':
        return 'success';
      case 'WALKING':
        return 'info';
      case 'CYCLING':
        return 'warning';
      default:
        return 'primary';
    }
  };

  const formatTime = (timeString) => {
    if (!timeString) return 'N/A';
    return timeString;
  };

  return (
    <Card
      sx={{
        height: '100%',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        border: '1px solid #e2e8f0',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
          borderColor: `${getActivityColor(activity.type)}.main`,
        },
      }}
      onClick={onClick}
    >
      <CardContent sx={{ pb: 1 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Avatar
            sx={{
              bgcolor: `${getActivityColor(activity.type)}.main`,
              color: 'white',
              width: 48,
              height: 48,
              mr: 2,
            }}
          >
            {getActivityIcon(activity.type)}
          </Avatar>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              {activity.type}
            </Typography>
            <Chip
              label={activity.type}
              size="small"
              color={getActivityColor(activity.type)}
              variant="outlined"
            />
          </Box>
          <IconButton size="small" sx={{ color: 'text.secondary' }}>
            <MoreVert />
          </IconButton>
        </Box>

        {/* Metrics Grid */}
        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid item xs={6}>
            <Box sx={{ textAlign: 'center', p: 1, bgcolor: 'grey.50', borderRadius: 2 }}>
              <Timer color="action" sx={{ fontSize: 20, mb: 0.5 }} />
              <Typography variant="h6" fontWeight="bold" color="primary">
                {activity.duration || 0}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Minutes
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={6}>
            <Box sx={{ textAlign: 'center', p: 1, bgcolor: 'grey.50', borderRadius: 2 }}>
              <LocalFireDepartment color="action" sx={{ fontSize: 20, mb: 0.5 }} />
              <Typography variant="h6" fontWeight="bold" color="warning.main">
                {activity.caloriesBurned || 0}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Calories
              </Typography>
            </Box>
          </Grid>
        </Grid>

        {/* Additional Metrics */}
        {activity.additionalMetrics && (
          <Box sx={{ mb: 2 }}>
            <Divider sx={{ mb: 1 }} />
            <Grid container spacing={1}>
              {activity.additionalMetrics.distance && (
                <Grid item xs={4}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Straighten color="action" sx={{ fontSize: 16 }} />
                    <Typography variant="body2" fontWeight="bold">
                      {activity.additionalMetrics.distance}km
                    </Typography>
                  </Box>
                </Grid>
              )}
              {activity.additionalMetrics.speed && (
                <Grid item xs={4}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Speed color="action" sx={{ fontSize: 16 }} />
                    <Typography variant="body2" fontWeight="bold">
                      {activity.additionalMetrics.speed}km/h
                    </Typography>
                  </Box>
                </Grid>
              )}
              {activity.additionalMetrics.heartRate && (
                <Grid item xs={4}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Favorite color="action" sx={{ fontSize: 16 }} />
                    <Typography variant="body2" fontWeight="bold">
                      {activity.additionalMetrics.heartRate}bpm
                    </Typography>
                  </Box>
                </Grid>
              )}
            </Grid>
          </Box>
        )}

        {/* Time and Date */}
        <Box sx={{ display: 'flex', alignItems: 'center', color: 'text.secondary' }}>
          <CalendarToday sx={{ fontSize: 16, mr: 0.5 }} />
          <Typography variant="caption">
            {formatTime(activity.startTime)}
          </Typography>
        </Box>
      </CardContent>

      <CardActions sx={{ pt: 0, pb: 2, px: 2 }}>
        <Button
          size="small"
          variant="outlined"
          fullWidth
          sx={{ textTransform: 'none' }}
        >
          View Details
        </Button>
      </CardActions>
    </Card>
  );
};

const ActivityList = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const fetchActivities = async () => {
    try {
      setLoading(true);
      const response = await getActivities();
      setActivities(response.data || []);
      setError('');
    } catch (error) {
      console.error("Error fetching activities:", error);
      setError('Failed to load activities. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivities();
  }, []);

  const handleActivityClick = (activityId) => {
    navigate(`/activities/${activityId}`);
  };

  const handleRefresh = () => {
    fetchActivities();
  };

  if (loading) {
    return (
      <Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" fontWeight="bold">
            Your Activities
          </Typography>
          <Skeleton variant="rectangular" width={120} height={40} />
        </Box>
        <Grid container spacing={3}>
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <Grid item xs={12} sm={6} md={4} key={item}>
              <Card>
                <CardContent>
                  <Skeleton variant="rectangular" height={120} />
                  <Skeleton variant="text" sx={{ mt: 1 }} />
                  <Skeleton variant="text" width="60%" />
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    );
  }

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Your Activities
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Track your fitness journey and monitor your progress
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<Refresh />}
            onClick={handleRefresh}
            sx={{ textTransform: 'none' }}
          >
            Refresh
          </Button>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => navigate('/activities/new')}
            sx={{ textTransform: 'none' }}
          >
            Add Activity
          </Button>
        </Box>
      </Box>

      {/* Error Alert */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {/* Activities Grid */}
      {activities.length > 0 ? (
        <Grid container spacing={3}>
          {activities.map((activity) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={activity.id}>
              <ActivityCard
                activity={activity}
                onClick={() => handleActivityClick(activity.id)}
              />
            </Grid>
          ))}
        </Grid>
      ) : (
        <Paper
          sx={{
            p: 6,
            textAlign: 'center',
            bgcolor: 'grey.50',
            border: '2px dashed #e2e8f0',
          }}
        >
          <DirectionsRun sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h5" fontWeight="bold" gutterBottom>
            No activities yet
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Start tracking your fitness journey by adding your first activity
          </Typography>
          <Button
            variant="contained"
            size="large"
            startIcon={<Add />}
            onClick={() => navigate('/activities/new')}
            sx={{
              px: 4,
              py: 1.5,
              textTransform: 'none',
              borderRadius: 3,
            }}
          >
            Add Your First Activity
          </Button>
        </Paper>
      )}

      {/* Floating Action Button */}
      <Fab
        color="primary"
        aria-label="add activity"
        sx={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          display: { xs: 'flex', md: 'none' },
        }}
        onClick={() => navigate('/activities/new')}
      >
        <Add />
      </Fab>
    </Box>
  );
};

export default ActivityList;
