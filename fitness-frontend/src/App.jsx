import React, { useContext, useEffect, useState, useCallback } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router";
import { AuthContext } from "react-oauth2-code-pkce";
import { useDispatch } from "react-redux";
import { setCredentials } from "./store/authSlice";
import ActivityForm from "./components/ActivityForm";
import ActivityDetail from "./components/ActivityDetail";
import ActivityList from "./components/ActivityList";
import Dashboard from "./components/Dashboard";
import {
  Box,
  CssBaseline,
  ThemeProvider,
  createTheme,
  Drawer,
  AppBar,
  Toolbar,
  List,
  Typography,
  Divider,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Avatar,
  Chip,
  Button,
  Container,
  Paper,
  Alert,
} from "@mui/material";
import {
  Dashboard as DashboardIcon,
  FitnessCenter as FitnessIcon,
  Add as AddIcon,
  List as ListIcon,
  Logout as LogoutIcon,
  Person as PersonIcon,
  TrendingUp as TrendingUpIcon,
} from "@mui/icons-material";

// Create a professional theme
const theme = createTheme({
  palette: {
    primary: {
      main: "#1976d2",
      light: "#42a5f5",
      dark: "#1565c0",
    },
    secondary: {
      main: "#dc004e",
      light: "#ff5983",
      dark: "#9a0036",
    },
    background: {
      default: "#f8fafc",
      paper: "#ffffff",
    },
    text: {
      primary: "#1a2027",
      secondary: "#637381",
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 700,
    },
    h6: {
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
          border: "1px solid #e2e8f0",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          borderRadius: 8,
          fontWeight: 600,
        },
      },
    },
  },
});

const drawerWidth = 280;

const MainLayout = ({ children, logOut, user }) => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const menuItems = [
    { text: "Dashboard", icon: <DashboardIcon />, path: "/dashboard" },
    { text: "Activities", icon: <ListIcon />, path: "/activities" },
    { text: "Add Activity", icon: <AddIcon />, path: "/activities/new" },
    { text: "Analytics", icon: <TrendingUpIcon />, path: "/analytics" },
  ];

  const drawer = (
    <Box>
      <Box
        sx={{
          p: 3,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          borderBottom: "1px solid #e2e8f0",
        }}
      >
        <Avatar
          sx={{
            width: 64,
            height: 64,
            bgcolor: "primary.main",
            mb: 2,
            fontSize: "1.5rem",
          }}
        >
          <FitnessIcon />
        </Avatar>
        <Typography variant="h6" fontWeight="bold" color="primary">
          Fitness Tracker
        </Typography>
        <Typography variant="body2" color="text.secondary" textAlign="center">
          Track • Improve • Achieve
        </Typography>
      </Box>
      
      <Divider />
      
      <List sx={{ pt: 2 }}>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              sx={{
                mx: 1,
                borderRadius: 2,
                mb: 0.5,
                "&:hover": {
                  bgcolor: "primary.light",
                  color: "white",
                  "& .MuiListItemIcon-root": {
                    color: "white",
                  },
                },
              }}
            >
              <ListItemIcon sx={{ minWidth: 40, color: "primary.main" }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      
      <Divider sx={{ mt: "auto" }} />
      
      <Box sx={{ p: 2 }}>
        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          <Avatar sx={{ width: 32, height: 32, mr: 1 }}>
            <PersonIcon />
          </Avatar>
          <Box>
            <Typography variant="body2" fontWeight={600}>
              {user?.name || "User"}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {user?.email || "user@example.com"}
            </Typography>
          </Box>
        </Box>
        <Button
          fullWidth
          variant="outlined"
          startIcon={<LogoutIcon />}
          onClick={logOut}
          sx={{ borderRadius: 2 }}
        >
          Sign Out
        </Button>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      
      {/* App Bar */}
      <AppBar
        position="fixed"
        sx={{
          width: { md: `calc(100% - ${drawerWidth}px)` },
          ml: { md: `${drawerWidth}px` },
          bgcolor: "white",
          color: "text.primary",
          boxShadow: "0 1px 3px 0 rgb(0 0 0 / 0.1)",
          borderBottom: "1px solid #e2e8f0",
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { md: "none" } }}
          >
            <FitnessIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            Fitness Dashboard
          </Typography>
          <Chip
            label="Active"
            color="success"
            size="small"
            sx={{ fontWeight: 600 }}
          />
        </Toolbar>
      </AppBar>

      {/* Sidebar */}
      <Box
        component="nav"
        sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: "block", md: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
              bgcolor: "background.paper",
            },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", md: "block" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
              bgcolor: "background.paper",
              borderRight: "1px solid #e2e8f0",
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { md: `calc(100% - ${drawerWidth}px)` },
          mt: "64px",
        }}
      >
        <Container maxWidth="xl">
          {children}
        </Container>
      </Box>
    </Box>
  );
};

const LoginPage = ({ logIn }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleLoginClick = () => {
    setIsLoading(true);
    setError(null);
    
    try {
      logIn();
    } catch (err) {
      console.error('Login failed:', err);
      setError('Authentication failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={24}
          sx={{
            p: 6,
            borderRadius: 4,
            textAlign: "center",
            bgcolor: "rgba(255, 255, 255, 0.95)",
            backdropFilter: "blur(10px)",
          }}
        >
          <Avatar
            sx={{
              width: 80,
              height: 80,
              bgcolor: "primary.main",
              mx: "auto",
              mb: 3,
              fontSize: "2.5rem",
            }}
          >
            <FitnessIcon />
          </Avatar>
          
          <Typography variant="h3" fontWeight="bold" gutterBottom color="primary">
            Fitness Tracker
          </Typography>
          
          <Typography variant="h6" color="text.secondary" gutterBottom sx={{ mb: 4 }}>
            Track your fitness journey with precision and insights
          </Typography>
          
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            Monitor your activities, analyze performance, and achieve your fitness goals
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 3, textAlign: 'left' }}>
              {error}
            </Alert>
          )}

          <Button
            variant="contained"
            size="large"
            onClick={handleLoginClick}
            disabled={isLoading}
            sx={{
              px: 6,
              py: 2,
              fontSize: "1.1rem",
              borderRadius: 3,
              boxShadow: "0 8px 25px rgba(25, 118, 210, 0.3)",
              "&:hover": {
                transform: "translateY(-2px)",
                boxShadow: "0 12px 35px rgba(25, 118, 210, 0.4)",
              },
              transition: "all 0.3s ease",
            }}
          >
            {isLoading ? 'Connecting...' : 'Get Started'}
          </Button>
        </Paper>
      </Container>
    </Box>
  );
};

const App = () => {
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Error boundary for authentication errors
  if (hasError) {
    return (
      <ThemeProvider theme={theme}>
        <Box
          sx={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          }}
        >
          <Container maxWidth="sm">
            <Paper
              elevation={24}
              sx={{
                p: 6,
                borderRadius: 4,
                textAlign: "center",
                bgcolor: "rgba(255, 255, 255, 0.95)",
                backdropFilter: "blur(10px)",
              }}
            >
              <Typography variant="h4" color="error" gutterBottom>
                Authentication Error
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                {errorMessage || 'An unexpected error occurred during authentication.'}
              </Typography>
              <Button
                variant="contained"
                onClick={() => window.location.reload()}
                sx={{ textTransform: 'none' }}
              >
                Reload Page
              </Button>
            </Paper>
          </Container>
        </Box>
      </ThemeProvider>
    );
  }

  return <AppContent setHasError={setHasError} setErrorMessage={setErrorMessage} />;
};

const AppContent = ({ setHasError, setErrorMessage }) => {
  const { token, tokenData, logIn, logOut, isAuthenticated } = useContext(AuthContext);
  const dispatch = useDispatch();
  const [authReady, setAuthReady] = useState(false);

  // Simple login handler without complex error handling
  const handleLogin = useCallback(() => {
    try {
      // Check if logIn is available and call it directly
      if (logIn && typeof logIn === 'function') {
        logIn();
      } else {
        console.error('logIn function not available');
        setErrorMessage('Authentication not available');
        setHasError(true);
      }
    } catch (error) {
      console.error('Login error:', error);
      setErrorMessage('Authentication failed');
      setHasError(true);
    }
  }, [logIn, setErrorMessage, setHasError]);

  useEffect(() => {
    if (token) {
      dispatch(
        setCredentials({
          token,
          user: tokenData,
          userId: tokenData?.sub,
        })
      );
      setAuthReady(true);
    }
  }, [token, tokenData, dispatch]);

  return (
    <ThemeProvider theme={theme}>
      <Router>
        {!token ? (
          <LoginPage logIn={handleLogin} />
        ) : (
          <MainLayout logOut={logOut} user={tokenData}>
            <Routes>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/activities" element={<ActivityList />} />
              <Route path="/activities/new" element={<ActivityForm />} />
              <Route path="/activities/:id" element={<ActivityDetail />} />
              <Route path="/analytics" element={<div>Analytics coming soon...</div>} />
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </MainLayout>
        )}
      </Router>
    </ThemeProvider>
  );
};

export default App;