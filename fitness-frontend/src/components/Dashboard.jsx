import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Avatar,
  LinearProgress,
  Chip,
  Button,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
} from '@mui/material';
import {
  TrendingUp,
  FitnessCenter,
  Timer,
  LocalFireDepartment,
  DirectionsRun,
  DirectionsWalk,
  DirectionsBike,
  CalendarToday,
  Speed,
  HeartBroken,
} from '@mui/icons-material';
import { useNavigate } from 'react-router';
import { getActivities } from '../services/api';

const StatCard = ({ title, value, icon, color, subtitle, progress }) => (
  <Card sx={{ height: '100%', position: 'relative', overflow: 'visible' }}>
    <CardContent>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Avatar
          sx={{
            bgcolor: `${color}.light`,
            color: `${color}.main`,
            width: 48,
            height: 48,
            mr: 2,
          }}
        >
          {icon}
        </Avatar>
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="h4" fontWeight="bold" color="text.primary">
            {value}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {title}
          </Typography>
        </Box>
      </Box>
      {subtitle && (
        <Typography variant="caption" color="text.secondary">
          {subtitle}
        </Typography>
      )}
      {progress !== undefined && (
        <Box sx={{ mt: 2 }}>
          <LinearProgress
            variant="determinate"
            value={progress}
            sx={{
              height: 8,
              borderRadius: 4,
              bgcolor: `${color}.light`,
              '& .MuiLinearProgress-bar': {
                bgcolor: `${color}.main`,
              },
            }}
          />
          <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
            {progress}% of weekly goal
          </Typography>
        </Box>
      )}
    </CardContent>
  </Card>
);

const ActivityTypeCard = ({ type, count, icon, color, percentage }) => (
  <Card sx={{ height: '100%' }}>
    <CardContent>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Avatar
          sx={{
            bgcolor: `${color}.light`,
            color: `${color}.main`,
            width: 40,
            height: 40,
            mr: 2,
          }}
        >
          {icon}
        </Avatar>
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="h6" fontWeight="bold">
            {type}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {count} activities
          </Typography>
        </Box>
        <Chip
          label={`${percentage}%`}
          size="small"
          color="primary"
          variant="outlined"
        />
      </Box>
    </CardContent>
  </Card>
);

const RecentActivityItem = ({ activity }) => (
  <ListItem sx={{ px: 0 }}>
    <ListItemIcon>
      <Avatar
        sx={{
          width: 32,
          height: 32,
          bgcolor: 'primary.light',
          color: 'primary.main',
        }}
      >
        {activity.type === 'RUNNING' && <DirectionsRun />}
        {activity.type === 'WALKING' && <DirectionsWalk />}
        {activity.type === 'CYCLING' && <DirectionsBike />}
      </Avatar>
    </ListItemIcon>
    <ListItemText
      primary={activity.type}
      secondary={`${activity.duration} min • ${activity.caloriesBurned} cal • ${activity.startTime}`}
    />
    <Chip
      label={activity.type}
      size="small"
      variant="outlined"
      color="primary"
    />
  </ListItem>
);

const Dashboard = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const response = await getActivities();
        setActivities(response.data || []);
      } catch (error) {
        console.error('Error fetching activities:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, []);

  // Calculate statistics
  const totalActivities = activities.length;
  const totalDuration = activities.reduce((sum, activity) => sum + (activity.duration || 0), 0);
  const totalCalories = activities.reduce((sum, activity) => sum + (activity.caloriesBurned || 0), 0);
  const totalDistance = activities.reduce((sum, activity) => sum + (activity.additionalMetrics?.distance || 0), 0);

  // Activity type breakdown
  const activityTypes = activities.reduce((acc, activity) => {
    acc[activity.type] = (acc[activity.type] || 0) + 1;
    return acc;
  }, {});

  const activityTypeData = [
    { type: 'Running', count: activityTypes.RUNNING || 0, icon: <DirectionsRun />, color: 'success', percentage: totalActivities ? Math.round((activityTypes.RUNNING || 0) / totalActivities * 100) : 0 },
    { type: 'Walking', count: activityTypes.WALKING || 0, icon: <DirectionsWalk />, color: 'info', percentage: totalActivities ? Math.round((activityTypes.WALKING || 0) / totalActivities * 100) : 0 },
    { type: 'Cycling', count: activityTypes.CYCLING || 0, icon: <DirectionsBike />, color: 'warning', percentage: totalActivities ? Math.round((activityTypes.CYCLING || 0) / totalActivities * 100) : 0 },
  ];

  // Recent activities (last 5)
  const recentActivities = activities.slice(0, 5);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <Typography>Loading dashboard...</Typography>
      </Box>
    );
  }

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Welcome back! 👋
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Here's your fitness overview for today
        </Typography>
      </Box>

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Activities"
            value={totalActivities}
            icon={<FitnessCenter />}
            color="primary"
            subtitle="This week"
            progress={Math.min(Math.round((totalActivities / 7) * 100), 100)}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Duration"
            value={`${totalDuration}m`}
            icon={<Timer />}
            color="success"
            subtitle="This week"
            progress={Math.min(Math.round((totalDuration / 420) * 100), 100)}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Calories Burned"
            value={totalCalories}
            icon={<LocalFireDepartment />}
            color="warning"
            subtitle="This week"
            progress={Math.min(Math.round((totalCalories / 2000) * 100), 100)}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Distance"
            value={`${totalDistance.toFixed(1)}km`}
            icon={<TrendingUp />}
            color="info"
            subtitle="This week"
            progress={Math.min(Math.round((totalDistance / 50) * 100), 100)}
          />
        </Grid>
      </Grid>

      {/* Activity Types and Recent Activities */}
      <Grid container spacing={3}>
        {/* Activity Types */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Activity Breakdown
              </Typography>
              <Grid container spacing={2}>
                {activityTypeData.map((item) => (
                  <Grid item xs={12} key={item.type}>
                    <ActivityTypeCard {...item} />
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Activities */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" fontWeight="bold">
                  Recent Activities
                </Typography>
                <Button
                  size="small"
                  onClick={() => navigate('/activities')}
                  sx={{ textTransform: 'none' }}
                >
                  View All
                </Button>
              </Box>
              {recentActivities.length > 0 ? (
                <List sx={{ p: 0 }}>
                  {recentActivities.map((activity, index) => (
                    <React.Fragment key={activity.id}>
                      <RecentActivityItem activity={activity} />
                      {index < recentActivities.length - 1 && <Divider />}
                    </React.Fragment>
                  ))}
                </List>
              ) : (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <FitnessCenter sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                  <Typography variant="body1" color="text.secondary" gutterBottom>
                    No activities yet
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Start tracking your fitness journey by adding your first activity
                  </Typography>
                  <Button
                    variant="contained"
                    onClick={() => navigate('/activities/new')}
                    startIcon={<FitnessCenter />}
                    sx={{ textTransform: 'none' }}
                  >
                    Add Activity
                  </Button>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Quick Actions */}
      <Box sx={{ mt: 4 }}>
        <Card>
          <CardContent>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Quick Actions
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={3}>
                <Button
                  fullWidth
                  variant="contained"
                  startIcon={<FitnessCenter />}
                  onClick={() => navigate('/activities/new')}
                  sx={{ py: 2, textTransform: 'none' }}
                >
                  Add Activity
                </Button>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<TrendingUp />}
                  onClick={() => navigate('/analytics')}
                  sx={{ py: 2, textTransform: 'none' }}
                >
                  View Analytics
                </Button>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<CalendarToday />}
                  onClick={() => navigate('/activities')}
                  sx={{ py: 2, textTransform: 'none' }}
                >
                  Activity History
                </Button>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<Speed />}
                  sx={{ py: 2, textTransform: 'none' }}
                >
                  Set Goals
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};

export default Dashboard;
