import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Popover,
  Box,
  Typography,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  IconButton,
  Button,
  Divider,
  Badge,
  Chip,
} from '@mui/material';
import {
  EmojiEvents,
  School,
  Group,
  Info,
  Warning,
  CheckCircle,
  Clear,
  MarkEmailRead,
} from '@mui/icons-material';
import { formatDistanceToNow } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import { RootState, AppDispatch } from '@/store';
import {
  fetchNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
} from '@/store/slices/notificationSlice';
import { Notification } from '@/types';

interface NotificationPanelProps {
  anchorEl: HTMLElement | null;
  open: boolean;
  onClose: () => void;
}

const NotificationPanel: React.FC<NotificationPanelProps> = ({
  anchorEl,
  open,
  onClose,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const { notifications, unreadCount } = useSelector(
    (state: RootState) => state.notification
  );

  useEffect(() => {
    if (open) {
      dispatch(fetchNotifications());
    }
  }, [open, dispatch]);

  const handleMarkAsRead = (notificationId: string) => {
    dispatch(markAsRead(notificationId));
  };

  const handleMarkAllAsRead = () => {
    dispatch(markAllAsRead());
  };

  const handleDelete = (notificationId: string) => {
    dispatch(deleteNotification(notificationId));
  };

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'achievement':
        return <EmojiEvents sx={{ color: '#FFD700' }} />;
      case 'course':
        return <School sx={{ color: '#1E88E5' }} />;
      case 'social':
        return <Group sx={{ color: '#43A047' }} />;
      case 'reminder':
        return <Warning sx={{ color: '#FF9800' }} />;
      default:
        return <Info sx={{ color: '#9E9E9E' }} />;
    }
  };

  const getNotificationColor = (type: Notification['type']) => {
    switch (type) {
      case 'achievement':
        return 'warning';
      case 'course':
        return 'primary';
      case 'social':
        return 'success';
      case 'reminder':
        return 'warning';
      default:
        return 'default';
    }
  };

  return (
    <Popover
      anchorEl={anchorEl}
      open={open}
      onClose={onClose}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      PaperProps={{
        sx: {
          width: 400,
          maxHeight: 500,
          borderRadius: 2,
          mt: 1,
        },
      }}
    >
      {/* Header */}
      <Box
        sx={{
          p: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: 1,
          borderColor: 'divider',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="h6" fontWeight="bold">
            Notifications
          </Typography>
          {unreadCount > 0 && (
            <Chip
              label={unreadCount}
              size="small"
              color="error"
              sx={{ height: 20, minWidth: 20 }}
            />
          )}
        </Box>
        {unreadCount > 0 && (
          <Button
            size="small"
            startIcon={<MarkEmailRead />}
            onClick={handleMarkAllAsRead}
          >
            Mark all read
          </Button>
        )}
      </Box>

      {/* Notifications List */}
      <Box sx={{ maxHeight: 400, overflow: 'auto' }}>
        {notifications.length === 0 ? (
          <Box sx={{ p: 4, textAlign: 'center' }}>
            <Typography color="text.secondary">
              No notifications yet
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              We'll notify you when something important happens
            </Typography>
          </Box>
        ) : (
          <List sx={{ p: 0 }}>
            <AnimatePresence>
              {notifications.map((notification, index) => (
                <motion.div
                  key={notification.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <ListItem
                    sx={{
                      backgroundColor: notification.read
                        ? 'transparent'
                        : 'action.hover',
                      '&:hover': {
                        backgroundColor: 'action.hover',
                      },
                      pr: 1,
                    }}
                  >
                    <ListItemAvatar>
                      <Badge
                        variant="dot"
                        color="error"
                        invisible={notification.read}
                      >
                        <Avatar sx={{ backgroundColor: 'background.paper' }}>
                          {getNotificationIcon(notification.type)}
                        </Avatar>
                      </Badge>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1,
                          }}
                        >
                          <Typography
                            variant="subtitle2"
                            fontWeight={notification.read ? 400 : 600}
                          >
                            {notification.title}
                          </Typography>
                          <Chip
                            label={notification.type}
                            size="small"
                            color={getNotificationColor(notification.type) as any}
                            variant="outlined"
                            sx={{ height: 18 }}
                          />
                        </Box>
                      }
                      secondary={
                        <>
                          <Typography
                            variant="body2"
                            color="text.primary"
                            sx={{ mb: 0.5 }}
                          >
                            {notification.message}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {formatDistanceToNow(new Date(notification.createdAt), {
                              addSuffix: true,
                            })}
                          </Typography>
                        </>
                      }
                    />
                    <Box sx={{ display: 'flex', gap: 0.5 }}>
                      {!notification.read && (
                        <IconButton
                          size="small"
                          onClick={() => handleMarkAsRead(notification.id)}
                          sx={{ opacity: 0.7 }}
                        >
                          <CheckCircle fontSize="small" />
                        </IconButton>
                      )}
                      <IconButton
                        size="small"
                        onClick={() => handleDelete(notification.id)}
                        sx={{ opacity: 0.7 }}
                      >
                        <Clear fontSize="small" />
                      </IconButton>
                    </Box>
                  </ListItem>
                  {index < notifications.length - 1 && <Divider />}
                </motion.div>
              ))}
            </AnimatePresence>
          </List>
        )}
      </Box>

      {/* Footer */}
      {notifications.length > 0 && (
        <>
          <Divider />
          <Box sx={{ p: 1, textAlign: 'center' }}>
            <Button size="small" fullWidth>
              View all notifications
            </Button>
          </Box>
        </>
      )}
    </Popover>
  );
};

export default NotificationPanel;