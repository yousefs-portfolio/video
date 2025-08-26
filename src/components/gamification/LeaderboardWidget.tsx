import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Tabs,
  Tab,
  Chip,
  Stack,
  IconButton,
  Badge,
  Divider,
  LinearProgress,
  Button,
  Menu,
  MenuItem,
  Tooltip,
} from '@mui/material';
import {
  EmojiEvents,
  TrendingUp,
  TrendingDown,
  Remove,
  Star,
  WorkspacePremium,
  LocalFireDepartment,
  School,
  Groups,
  Public,
  FilterList,
  MoreVert,
  Share,
  PersonAdd,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';

interface LeaderboardEntry {
  id: string;
  rank: number;
  previousRank: number;
  name: string;
  avatar: string;
  xp: number;
  level: number;
  streak: number;
  badges: number;
  courses: number;
  weeklyXP: number;
  monthlyXP: number;
  allTimeXP: number;
  isCurrentUser: boolean;
  status: 'online' | 'offline' | 'learning';
}

interface LeaderboardWidgetProps {
  userId: string;
  groupId?: string;
  onUserClick?: (userId: string) => void;
  onInvite?: (userId: string) => void;
}

type TimeFrame = 'weekly' | 'monthly' | 'all-time';
type LeaderboardType = 'global' | 'friends' | 'group' | 'course';

const LeaderboardWidget: React.FC<LeaderboardWidgetProps> = ({
  userId,
  groupId,
  onUserClick,
  onInvite,
}) => {
  const [timeFrame, setTimeFrame] = useState<TimeFrame>('weekly');
  const [leaderboardType, setLeaderboardType] = useState<LeaderboardType>('global');
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);

  useEffect(() => {
    loadLeaderboardData();
  }, [timeFrame, leaderboardType, userId, groupId]);

  const loadLeaderboardData = () => {
    setLoading(true);
    
    // Simulate loading data
    setTimeout(() => {
      const mockData: LeaderboardEntry[] = [
        {
          id: '1',
          rank: 1,
          previousRank: 2,
          name: 'Sarah Johnson',
          avatar: '',
          xp: 15420,
          level: 42,
          streak: 28,
          badges: 15,
          courses: 8,
          weeklyXP: 2150,
          monthlyXP: 8400,
          allTimeXP: 15420,
          isCurrentUser: false,
          status: 'learning',
        },
        {
          id: '2',
          rank: 2,
          previousRank: 1,
          name: 'Mike Chen',
          avatar: '',
          xp: 14890,
          level: 40,
          streak: 15,
          badges: 12,
          courses: 7,
          weeklyXP: 1980,
          monthlyXP: 7650,
          allTimeXP: 14890,
          isCurrentUser: false,
          status: 'online',
        },
        {
          id: '3',
          rank: 3,
          previousRank: 5,
          name: 'You',
          avatar: '',
          xp: 12350,
          level: 35,
          streak: 7,
          badges: 10,
          courses: 5,
          weeklyXP: 1650,
          monthlyXP: 6200,
          allTimeXP: 12350,
          isCurrentUser: true,
          status: 'online',
        },
        {
          id: '4',
          rank: 4,
          previousRank: 3,
          name: 'Emma Wilson',
          avatar: '',
          xp: 11200,
          level: 32,
          streak: 21,
          badges: 9,
          courses: 6,
          weeklyXP: 1420,
          monthlyXP: 5800,
          allTimeXP: 11200,
          isCurrentUser: false,
          status: 'offline',
        },
        {
          id: '5',
          rank: 5,
          previousRank: 4,
          name: 'James Park',
          avatar: '',
          xp: 10500,
          level: 30,
          streak: 14,
          badges: 8,
          courses: 4,
          weeklyXP: 1200,
          monthlyXP: 5100,
          allTimeXP: 10500,
          isCurrentUser: false,
          status: 'online',
        },
      ];
      
      setEntries(mockData);
      setLoading(false);
    }, 500);
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <EmojiEvents sx={{ color: '#FFD700' }} />;
      case 2:
        return <EmojiEvents sx={{ color: '#C0C0C0' }} />;
      case 3:
        return <EmojiEvents sx={{ color: '#CD7F32' }} />;
      default:
        return null;
    }
  };

  const getRankChange = (current: number, previous: number) => {
    if (current < previous) {
      return (
        <Chip
          icon={<TrendingUp />}
          label={`+${previous - current}`}
          size="small"
          color="success"
          sx={{ minWidth: 60 }}
        />
      );
    } else if (current > previous) {
      return (
        <Chip
          icon={<TrendingDown />}
          label={`-${current - previous}`}
          size="small"
          color="error"
          sx={{ minWidth: 60 }}
        />
      );
    }
    return (
      <Chip
        icon={<Remove />}
        label="—"
        size="small"
        sx={{ minWidth: 60 }}
      />
    );
  };

  const getXPByTimeFrame = (entry: LeaderboardEntry) => {
    switch (timeFrame) {
      case 'weekly':
        return entry.weeklyXP;
      case 'monthly':
        return entry.monthlyXP;
      case 'all-time':
        return entry.allTimeXP;
    }
  };

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>, userId: string) => {
    setAnchorEl(event.currentTarget);
    setSelectedUser(userId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedUser(null);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online':
        return '#4CAF50';
      case 'learning':
        return '#2196F3';
      case 'offline':
        return '#9E9E9E';
      default:
        return '#9E9E9E';
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 3, maxWidth: 800, mx: 'auto' }}>
      <Box sx={{ mb: 3 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h5" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <EmojiEvents color="primary" />
            Leaderboard
          </Typography>
          <IconButton>
            <FilterList />
          </IconButton>
        </Stack>

        <Tabs
          value={leaderboardType}
          onChange={(_, value) => setLeaderboardType(value)}
          variant="fullWidth"
          sx={{ mb: 2 }}
        >
          <Tab
            icon={<Public />}
            iconPosition="start"
            label="Global"
            value="global"
          />
          <Tab
            icon={<Groups />}
            iconPosition="start"
            label="Friends"
            value="friends"
          />
          <Tab
            icon={<School />}
            iconPosition="start"
            label="Group"
            value="group"
          />
          <Tab
            icon={<WorkspacePremium />}
            iconPosition="start"
            label="Course"
            value="course"
          />
        </Tabs>

        <Stack direction="row" spacing={1} justifyContent="center">
          <Chip
            label="This Week"
            onClick={() => setTimeFrame('weekly')}
            color={timeFrame === 'weekly' ? 'primary' : 'default'}
            variant={timeFrame === 'weekly' ? 'filled' : 'outlined'}
          />
          <Chip
            label="This Month"
            onClick={() => setTimeFrame('monthly')}
            color={timeFrame === 'monthly' ? 'primary' : 'default'}
            variant={timeFrame === 'monthly' ? 'filled' : 'outlined'}
          />
          <Chip
            label="All Time"
            onClick={() => setTimeFrame('all-time')}
            color={timeFrame === 'all-time' ? 'primary' : 'default'}
            variant={timeFrame === 'all-time' ? 'filled' : 'outlined'}
          />
        </Stack>
      </Box>

      {loading && <LinearProgress sx={{ mb: 2 }} />}

      <List sx={{ width: '100%' }}>
        <AnimatePresence>
          {entries.map((entry, index) => (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <ListItem
                sx={{
                  mb: 1,
                  bgcolor: entry.isCurrentUser ? 'primary.main' : 'background.paper',
                  color: entry.isCurrentUser ? 'primary.contrastText' : 'text.primary',
                  borderRadius: 2,
                  border: entry.rank <= 3 ? '2px solid' : 'none',
                  borderColor: 
                    entry.rank === 1 ? '#FFD700' :
                    entry.rank === 2 ? '#C0C0C0' :
                    entry.rank === 3 ? '#CD7F32' : 'transparent',
                  '&:hover': {
                    bgcolor: entry.isCurrentUser ? 'primary.dark' : 'action.hover',
                  },
                }}
              >
                <ListItemAvatar>
                  <Stack alignItems="center" spacing={1}>
                    <Box sx={{ position: 'relative' }}>
                      <Badge
                        overlap="circular"
                        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                        badgeContent={
                          <Box
                            sx={{
                              width: 12,
                              height: 12,
                              borderRadius: '50%',
                              bgcolor: getStatusColor(entry.status),
                              border: '2px solid white',
                            }}
                          />
                        }
                      >
                        <Avatar
                          src={entry.avatar}
                          sx={{
                            width: 56,
                            height: 56,
                            border: entry.rank <= 3 ? '3px solid' : 'none',
                            borderColor:
                              entry.rank === 1 ? '#FFD700' :
                              entry.rank === 2 ? '#C0C0C0' :
                              entry.rank === 3 ? '#CD7F32' : 'transparent',
                          }}
                        >
                          {entry.name.charAt(0)}
                        </Avatar>
                      </Badge>
                      {getRankIcon(entry.rank) && (
                        <Box
                          sx={{
                            position: 'absolute',
                            top: -8,
                            right: -8,
                          }}
                        >
                          {getRankIcon(entry.rank)}
                        </Box>
                      )}
                    </Box>
                    <Typography
                      variant="h6"
                      fontWeight="bold"
                      sx={{ color: entry.isCurrentUser ? 'inherit' : 'text.primary' }}
                    >
                      #{entry.rank}
                    </Typography>
                  </Stack>
                </ListItemAvatar>

                <ListItemText
                  primary={
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <Typography variant="subtitle1" fontWeight="bold">
                        {entry.name}
                      </Typography>
                      <Chip
                        label={`Lvl ${entry.level}`}
                        size="small"
                        sx={{
                          bgcolor: entry.isCurrentUser ? 'primary.light' : 'secondary.main',
                          color: 'white',
                        }}
                      />
                      {entry.streak > 7 && (
                        <Tooltip title={`${entry.streak} day streak!`}>
                          <LocalFireDepartment
                            sx={{
                              color: entry.isCurrentUser ? 'inherit' : '#FF6B35',
                              fontSize: 20,
                            }}
                          />
                        </Tooltip>
                      )}
                    </Stack>
                  }
                  secondary={
                    <Stack spacing={1} mt={1}>
                      <Stack direction="row" spacing={2}>
                        <Typography variant="body2">
                          <strong>{getXPByTimeFrame(entry).toLocaleString()}</strong> XP
                        </Typography>
                        <Typography variant="body2">
                          {entry.badges} badges
                        </Typography>
                        <Typography variant="body2">
                          {entry.courses} courses
                        </Typography>
                      </Stack>
                      <LinearProgress
                        variant="determinate"
                        value={(entry.xp % 1000) / 10}
                        sx={{
                          height: 6,
                          borderRadius: 3,
                          bgcolor: entry.isCurrentUser ? 'primary.light' : 'grey.200',
                          '& .MuiLinearProgress-bar': {
                            bgcolor: entry.isCurrentUser ? 'white' : 'primary.main',
                          },
                        }}
                      />
                    </Stack>
                  }
                />

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  {getRankChange(entry.rank, entry.previousRank)}
                  {!entry.isCurrentUser && (
                    <IconButton
                      size="small"
                      onClick={(e) => handleMenuClick(e, entry.id)}
                      sx={{ color: 'inherit' }}
                    >
                      <MoreVert />
                    </IconButton>
                  )}
                </Box>
              </ListItem>
              {index < entries.length - 1 && <Divider variant="inset" component="li" />}
            </motion.div>
          ))}
        </AnimatePresence>
      </List>

      {/* User Action Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem
          onClick={() => {
            if (selectedUser && onUserClick) {
              onUserClick(selectedUser);
            }
            handleMenuClose();
          }}
        >
          View Profile
        </MenuItem>
        <MenuItem
          onClick={() => {
            if (selectedUser && onInvite) {
              onInvite(selectedUser);
            }
            handleMenuClose();
          }}
        >
          <PersonAdd sx={{ mr: 1 }} fontSize="small" />
          Add Friend
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <Share sx={{ mr: 1 }} fontSize="small" />
          Challenge
        </MenuItem>
      </Menu>

      <Box sx={{ mt: 3, textAlign: 'center' }}>
        <Button variant="outlined" fullWidth>
          View Full Leaderboard
        </Button>
      </Box>
    </Paper>
  );
};

export default LeaderboardWidget;