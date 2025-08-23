import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { getActivityDetails } from "../services/api";
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  CardActions,
  Typography,
  Button,
  CircularProgress,
  Avatar,
  Chip,
  Grid,
  Paper,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Alert,
  Skeleton,
  IconButton,
  Breadcrumbs,
  Link,
} from "@mui/material";
import {
  DirectionsRun,
  DirectionsWalk,
  DirectionsBike,
  Timer,
  LocalFireDepartment,
  Straighten,
  Speed,
  Favorite,
  ArrowBack,
  TrendingUp,
  CheckCircle,
  Warning,
  Info,
  Home,
  List as ListIcon,
} from "@mui/icons-material";

const MetricCard = ({ title, value, icon, color, subtitle }) => (
  <Card sx={{ height: '100%' }}>
    <CardContent sx={{ textAlign: 'center', p: 3 }}>
      <Avatar
        sx={{
          width: 48,
          height: 48,
          bgcolor: `${color}.light`,
          color: `${color}.main`,
          mx: 'auto',
          mb: 2,
        }}
      >
        {icon}
      </Avatar>
      <Typography variant="h4" fontWeight="bold" color="text.primary" gutterBottom>
        {value}
      </Typography>
      <Typography variant="h6" color="text.secondary" gutterBottom>
        {title}
      </Typography>
      {subtitle && (
        <Typography variant="body2" color="text.secondary">
          {subtitle}
        </Typography>
      )}
    </CardContent>
  </Card>
);

const RecommendationCard = ({ title, content, icon, color, items }) => (
  <Card sx={{ height: '100%' }}>
    <CardContent>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Avatar
          sx={{
            width: 40,
            height: 40,
            bgcolor: `${color}.light`,
            color: `${color}.main`,
            mr: 2,
          }}
        >
          {icon}
        </Avatar>
        <Typography variant="h6" fontWeight="bold">
          {title}
        </Typography>
      </Box>
      
      {items && items.length > 0 ? (
        <List sx={{ p: 0 }}>
          {items.map((item, idx) => (
            <ListItem key={idx} sx={{ px: 0, py: 0.5 }}>
              <ListItemIcon sx={{ minWidth: 32 }}>
                <CheckCircle color={color} fontSize="small" />
              </ListItemIcon>
              <ListItemText
                primary={item}
                primaryTypographyProps={{
                  variant: 'body2',
                  color: 'text.secondary',
                }}
              />
            </ListItem>
          ))}
        </List>
      ) : (
        <Typography variant="body2" color="text.secondary">
          {content}
        </Typography>
      )}
    </CardContent>
  </Card>
);

const ActivityDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activity, setActivity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchActivity = async () => {
    try {
      setLoading(true);
      const response = await getActivityDetails(id);
      setActivity(response.data);
      setError('');
    } catch (error) {
      console.error("Error fetching activity details:", error);
      setError('Failed to load activity details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivity();
  }, [id]);

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

  if (loading) {
    return (
      <Box>
        <Box sx={{ mb: 3 }}>
          <Skeleton variant="rectangular" height={40} width={300} />
          <Skeleton variant="text" width={200} sx={{ mt: 1 }} />
        </Box>
        <Grid container spacing={3}>
          {[1, 2, 3, 4].map((item) => (
            <Grid item xs={12} sm={6} md={3} key={item}>
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

  if (error) {
    return (
      <Alert severity="error" sx={{ mt: 4 }}>
        {error}
      </Alert>
    );
  }

  if (!activity) {
    return (
      <Alert severity="warning" sx={{ mt: 4 }}>
        No activity found.
      </Alert>
    );
  }

  const {
    activityType,
    createdAt,
    recommendation,
    improvements,
    suggestions,
    safetyMeasures,
    duration,
    caloriesBurned,
    additionalMetrics,
  } = activity;

  return (
    <Box>
      {/* Breadcrumbs */}
      <Box sx={{ mb: 3 }}>
        <Breadcrumbs aria-label="breadcrumb">
          <Link
            underline="hover"
            color="inherit"
            href="#"
            onClick={(e) => {
              e.preventDefault();
              navigate('/dashboard');
            }}
            sx={{ display: 'flex', alignItems: 'center' }}
          >
            <Home sx={{ mr: 0.5 }} fontSize="small" />
            Dashboard
          </Link>
          <Link
            underline="hover"
            color="inherit"
            href="#"
            onClick={(e) => {
              e.preventDefault();
              navigate('/activities');
            }}
            sx={{ display: 'flex', alignItems: 'center' }}
          >
            <ListIcon sx={{ mr: 0.5 }} fontSize="small" />
            Activities
          </Link>
          <Typography color="text.primary">Activity Details</Typography>
        </Breadcrumbs>
      </Box>

      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Activity Report
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Detailed analysis and recommendations for your {activityType?.toLowerCase()} session
          </Typography>
        </Box>
        <Button
          variant="outlined"
          startIcon={<ArrowBack />}
          onClick={() => navigate(-1)}
          sx={{ textTransform: 'none' }}
        >
          Back
        </Button>
      </Box>

      {/* Activity Overview */}
      <Card sx={{ mb: 4 }}>
        <CardHeader
          avatar={
            <Avatar
              sx={{
                width: 64,
                height: 64,
                bgcolor: `${getActivityColor(activityType)}.main`,
                color: 'white',
              }}
            >
              {getActivityIcon(activityType)}
            </Avatar>
          }
          title={
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Typography variant="h5" fontWeight="bold">
                {activityType}
              </Typography>
              <Chip
                label={activityType}
                color={getActivityColor(activityType)}
                variant="outlined"
                size="medium"
              />
            </Box>
          }
          subheader={`Generated on ${new Date(createdAt).toLocaleString()}`}
        />
      </Card>

      {/* Key Metrics */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Duration"
            value={`${duration || 0}m`}
            icon={<Timer />}
            color="primary"
            subtitle="Total time"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Calories"
            value={caloriesBurned || 0}
            icon={<LocalFireDepartment />}
            color="warning"
            subtitle="Burned"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Distance"
            value={`${additionalMetrics?.distance || 0}km`}
            icon={<Straighten />}
            color="success"
            subtitle="Covered"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Heart Rate"
            value={`${additionalMetrics?.heartRate || 0}bpm`}
            icon={<Favorite />}
            color="error"
            subtitle="Average"
          />
        </Grid>
      </Grid>

      {/* Analysis and Recommendations */}
      <Grid container spacing={3}>
        {/* Recommendation */}
        <Grid item xs={12} md={6}>
          <RecommendationCard
            title="Overall Recommendation"
            content={recommendation || "Great job on your workout! Keep up the consistency."}
            icon={<TrendingUp />}
            color="success"
          />
        </Grid>

        {/* Improvements */}
        <Grid item xs={12} md={6}>
          <RecommendationCard
            title="Areas for Improvement"
            content="No specific improvements identified at this time."
            icon={<CheckCircle />}
            color="info"
            items={improvements}
          />
        </Grid>

        {/* Suggestions */}
        <Grid item xs={12} md={6}>
          <RecommendationCard
            title="Suggestions"
            content="No specific suggestions at this time."
            icon={<Info />}
            color="primary"
            items={suggestions}
          />
        </Grid>

        {/* Safety Measures */}
        <Grid item xs={12} md={6}>
          <RecommendationCard
            title="Safety Measures"
            content="No specific safety measures identified."
            icon={<Warning />}
            color="warning"
            items={safetyMeasures}
          />
        </Grid>
      </Grid>

      {/* Action Buttons */}
      <Box sx={{ mt: 4, display: 'flex', gap: 2, justifyContent: 'center' }}>
        <Button
          variant="contained"
          startIcon={<TrendingUp />}
          onClick={() => navigate('/analytics')}
          sx={{ textTransform: 'none', px: 4 }}
        >
          View Analytics
        </Button>
        <Button
          variant="outlined"
          startIcon={<DirectionsRun />}
          onClick={() => navigate('/activities/new')}
          sx={{ textTransform: 'none', px: 4 }}
        >
          Add New Activity
        </Button>
      </Box>
    </Box>
  );
};

export default ActivityDetail;
