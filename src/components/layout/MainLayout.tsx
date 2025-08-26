import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  Box,
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Avatar,
  Menu,
  MenuItem,
  Badge,
  Divider,
  useTheme,
  useMediaQuery,
  Tooltip,
  Chip,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Home,
  School,
  Dashboard,
  EmojiEvents,
  Group,
  Settings,
  Logout,
  Person,
  Notifications,
  Search,
  DarkMode,
  LightMode,
  Leaderboard,
  VideoLibrary,
  ChevronLeft,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { RootState, AppDispatch } from '@/store';
import { logout } from '@/store/slices/authSlice';
import { toggleSidebar, setTheme } from '@/store/slices/uiSlice';
import SearchBar from './SearchBar';
import NotificationPanel from './NotificationPanel';

const drawerWidth = 280;

const MainLayout: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch<AppDispatch>();
  
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);
  const { sidebarOpen, theme: appTheme } = useSelector((state: RootState) => state.ui);
  const { unreadCount } = useSelector((state: RootState) => state.notification);
  const { xp, streak } = useSelector((state: RootState) => state.gamification);
  
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [notificationAnchor, setNotificationAnchor] = useState<null | HTMLElement>(null);
  const [searchOpen, setSearchOpen] = useState(false);

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const handleNotificationOpen = (event: React.MouseEvent<HTMLElement>) => {
    setNotificationAnchor(event.currentTarget);
  };

  const handleNotificationClose = () => {
    setNotificationAnchor(null);
  };

  const handleThemeToggle = () => {
    const newTheme = appTheme === 'light' ? 'dark' : 'light';
    dispatch(setTheme(newTheme));
    localStorage.setItem('theme', newTheme);
  };

  const handleLogout = async () => {
    await dispatch(logout());
    navigate('/');
    handleProfileMenuClose();
  };

  const navigationItems = [
    { text: 'Home', icon: <Home />, path: '/', public: true },
    { text: 'Browse Courses', icon: <School />, path: '/courses', public: true },
    { text: 'Dashboard', icon: <Dashboard />, path: '/dashboard', public: false },
    { text: 'My Learning', icon: <VideoLibrary />, path: '/my-learning', public: false },
    { text: 'Achievements', icon: <EmojiEvents />, path: '/achievements', public: false },
    { text: 'Leaderboard', icon: <Leaderboard />, path: '/leaderboard', public: false },
    { text: 'Study Groups', icon: <Group />, path: '/study-groups', public: false },
  ];

  const drawerContent = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Logo and Close button */}
      <Box
        sx={{
          p: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Typography
          variant="h5"
          sx={{
            fontWeight: 'bold',
            background: 'linear-gradient(45deg, #1E88E5, #43A047)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          LearnHub
        </Typography>
        {isMobile && (
          <IconButton onClick={() => dispatch(toggleSidebar())}>
            <ChevronLeft />
          </IconButton>
        )}
      </Box>

      <Divider />

      {/* User Info (if authenticated) */}
      {isAuthenticated && user && (
        <>
          <Box sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar
                src={user.avatar}
                alt={user.name}
                sx={{ width: 48, height: 48 }}
              >
                {user.name.charAt(0)}
              </Avatar>
              <Box sx={{ flex: 1 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                  {user.name}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Level {xp.level} • {streak.currentStreak} day streak
                </Typography>
              </Box>
            </Box>

            {/* XP Progress Bar */}
            <Box sx={{ mt: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                <Typography variant="caption" color="text.secondary">
                  XP Progress
                </Typography>
                <Typography variant="caption" sx={{ fontWeight: 'bold' }}>
                  {xp.current}/{xp.xpForNextLevel}
                </Typography>
              </Box>
              <Box
                sx={{
                  height: 6,
                  borderRadius: 3,
                  backgroundColor: 'action.hover',
                  overflow: 'hidden',
                }}
              >
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(xp.current / xp.xpForNextLevel) * 100}%` }}
                  transition={{ duration: 0.5 }}
                  style={{
                    height: '100%',
                    background: 'linear-gradient(90deg, #1E88E5, #43A047)',
                    borderRadius: 3,
                  }}
                />
              </Box>
            </Box>
          </Box>
          <Divider />
        </>
      )}

      {/* Navigation Items */}
      <List sx={{ flex: 1, px: 1 }}>
        {navigationItems
          .filter((item) => item.public || isAuthenticated)
          .map((item) => (
            <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                onClick={() => {
                  navigate(item.path);
                  if (isMobile) dispatch(toggleSidebar());
                }}
                sx={{
                  borderRadius: 2,
                  '&:hover': {
                    backgroundColor: 'action.hover',
                  },
                }}
              >
                <ListItemIcon sx={{ color: 'primary.main' }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            </ListItem>
          ))}
      </List>

      {/* Settings */}
      {isAuthenticated && (
        <>
          <Divider />
          <List sx={{ px: 1, pb: 2 }}>
            <ListItem disablePadding>
              <ListItemButton
                onClick={() => navigate('/settings')}
                sx={{
                  borderRadius: 2,
                  '&:hover': {
                    backgroundColor: 'action.hover',
                  },
                }}
              >
                <ListItemIcon>
                  <Settings />
                </ListItemIcon>
                <ListItemText primary="Settings" />
              </ListItemButton>
            </ListItem>
          </List>
        </>
      )}
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {/* App Bar */}
      <AppBar
        position="fixed"
        sx={{
          width: { md: sidebarOpen ? `calc(100% - ${drawerWidth}px)` : '100%' },
          ml: { md: sidebarOpen ? `${drawerWidth}px` : 0 },
          transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
          backgroundColor: 'background.paper',
          color: 'text.primary',
          boxShadow: 1,
        }}
      >
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={() => dispatch(toggleSidebar())}
            sx={{ mr: 2, display: { md: sidebarOpen ? 'none' : 'inline-flex' } }}
          >
            <MenuIcon />
          </IconButton>

          <Box sx={{ flexGrow: 1 }} />

          {/* Search */}
          <IconButton
            color="inherit"
            onClick={() => setSearchOpen(true)}
            sx={{ mr: 1 }}
          >
            <Search />
          </IconButton>

          {/* Theme Toggle */}
          <Tooltip title="Toggle theme">
            <IconButton onClick={handleThemeToggle} color="inherit" sx={{ mr: 1 }}>
              {appTheme === 'light' ? <DarkMode /> : <LightMode />}
            </IconButton>
          </Tooltip>

          {/* Notifications */}
          {isAuthenticated && (
            <Tooltip title="Notifications">
              <IconButton
                color="inherit"
                onClick={handleNotificationOpen}
                sx={{ mr: 2 }}
              >
                <Badge badgeContent={unreadCount} color="error">
                  <Notifications />
                </Badge>
              </IconButton>
            </Tooltip>
          )}

          {/* User Menu */}
          {isAuthenticated ? (
            <>
              <Chip
                avatar={
                  <Avatar src={user?.avatar} alt={user?.name}>
                    {user?.name.charAt(0)}
                  </Avatar>
                }
                label={user?.name}
                onClick={handleProfileMenuOpen}
                sx={{ cursor: 'pointer' }}
              />
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleProfileMenuClose}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
              >
                <MenuItem onClick={() => { navigate('/profile'); handleProfileMenuClose(); }}>
                  <ListItemIcon>
                    <Person fontSize="small" />
                  </ListItemIcon>
                  Profile
                </MenuItem>
                <MenuItem onClick={() => { navigate('/settings'); handleProfileMenuClose(); }}>
                  <ListItemIcon>
                    <Settings fontSize="small" />
                  </ListItemIcon>
                  Settings
                </MenuItem>
                <Divider />
                <MenuItem onClick={handleLogout}>
                  <ListItemIcon>
                    <Logout fontSize="small" />
                  </ListItemIcon>
                  Logout
                </MenuItem>
              </Menu>
            </>
          ) : (
            <Box sx={{ display: 'flex', gap: 1 }}>
              <button
                className="btn-primary"
                style={{ padding: '8px 16px' }}
                onClick={() => navigate('/login')}
              >
                Login
              </button>
              <button
                className="btn-success"
                style={{ padding: '8px 16px' }}
                onClick={() => navigate('/register')}
              >
                Sign Up
              </button>
            </Box>
          )}
        </Toolbar>
      </AppBar>

      {/* Sidebar Drawer */}
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            borderRight: '1px solid',
            borderColor: 'divider',
          },
        }}
        variant={isMobile ? 'temporary' : 'persistent'}
        anchor="left"
        open={sidebarOpen}
        onClose={() => dispatch(toggleSidebar())}
      >
        {drawerContent}
      </Drawer>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { md: sidebarOpen ? `calc(100% - ${drawerWidth}px)` : '100%' },
          ml: { md: sidebarOpen ? `${drawerWidth}px` : 0 },
          transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
          mt: 8,
          minHeight: 'calc(100vh - 64px)',
        }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </Box>

      {/* Search Modal */}
      <SearchBar open={searchOpen} onClose={() => setSearchOpen(false)} />

      {/* Notifications Panel */}
      <NotificationPanel
        anchorEl={notificationAnchor}
        open={Boolean(notificationAnchor)}
        onClose={handleNotificationClose}
      />
    </Box>
  );
};

export default MainLayout;