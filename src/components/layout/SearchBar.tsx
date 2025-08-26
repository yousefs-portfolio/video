import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import {
  Dialog,
  DialogContent,
  TextField,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Box,
  Chip,
  InputAdornment,
  IconButton,
  Divider,
} from '@mui/material';
import {
  Search,
  Close,
  School,
  VideoLibrary,
  Person,
  Group,
  TrendingUp,
  History,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { AppDispatch } from '@/store';
import { searchCourses } from '@/store/slices/courseSlice';

interface SearchBarProps {
  open: boolean;
  onClose: () => void;
}

interface SearchResult {
  id: string;
  type: 'course' | 'video' | 'instructor' | 'group';
  title: string;
  subtitle?: string;
  icon: React.ReactNode;
  url: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ open, onClose }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    // Load recent searches from localStorage
    const saved = localStorage.getItem('recentSearches');
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    if (query.length > 2) {
      const debounceTimer = setTimeout(() => {
        performSearch();
      }, 300);
      return () => clearTimeout(debounceTimer);
    } else {
      setResults([]);
    }
  }, [query]);

  const performSearch = async () => {
    setIsSearching(true);
    
    // Dispatch search action
    await dispatch(searchCourses(query));
    
    // Mock search results for demonstration
    const mockResults: SearchResult[] = [
      {
        id: '1',
        type: 'course' as const,
        title: 'React Advanced Patterns',
        subtitle: 'Master advanced React patterns and techniques',
        icon: <School />,
        url: '/courses/react-advanced',
      },
      {
        id: '2',
        type: 'video' as const,
        title: 'Understanding Hooks',
        subtitle: 'React Course • Lesson 5',
        icon: <VideoLibrary />,
        url: '/video/understanding-hooks',
      },
      {
        id: '3',
        type: 'instructor' as const,
        title: 'John Doe',
        subtitle: 'React & TypeScript Expert',
        icon: <Person />,
        url: '/instructor/john-doe',
      },
      {
        id: '4',
        type: 'group' as const,
        title: 'React Developers Study Group',
        subtitle: '245 members',
        icon: <Group />,
        url: '/study-groups/react-developers',
      },
    ].filter((result) =>
      result.title.toLowerCase().includes(query.toLowerCase())
    );
    
    setResults(mockResults);
    setIsSearching(false);
  };

  const handleResultClick = (result: SearchResult) => {
    // Save to recent searches
    const newRecent = [result.title, ...recentSearches.filter(s => s !== result.title)].slice(0, 5);
    setRecentSearches(newRecent);
    localStorage.setItem('recentSearches', JSON.stringify(newRecent));
    
    // Navigate to result
    navigate(result.url);
    handleClose();
  };

  const handleClose = () => {
    setQuery('');
    setResults([]);
    onClose();
  };

  const getTypeColor = (type: SearchResult['type']) => {
    switch (type) {
      case 'course': return 'primary';
      case 'video': return 'secondary';
      case 'instructor': return 'info';
      case 'group': return 'success';
      default: return 'default';
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          top: '10%',
          position: 'absolute',
        },
      }}
    >
      <DialogContent sx={{ p: 0, overflow: 'hidden' }}>
        <Box sx={{ p: 2 }}>
          <TextField
            fullWidth
            autoFocus
            placeholder="Search for courses, videos, instructors..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
              endAdornment: query && (
                <InputAdornment position="end">
                  <IconButton size="small" onClick={() => setQuery('')}>
                    <Close />
                  </IconButton>
                </InputAdornment>
              ),
              sx: {
                fontSize: '1.2rem',
                '& .MuiOutlinedInput-notchedOutline': {
                  border: 'none',
                },
              },
            }}
          />
        </Box>

        <Divider />

        <Box sx={{ maxHeight: 400, overflow: 'auto' }}>
          {/* Search Results */}
          {results.length > 0 && (
            <>
              <Typography
                variant="caption"
                sx={{
                  px: 2,
                  pt: 1,
                  pb: 0.5,
                  display: 'block',
                  color: 'text.secondary',
                }}
              >
                SEARCH RESULTS
              </Typography>
              <List>
                <AnimatePresence>
                  {results.map((result, index) => (
                    <motion.div
                      key={result.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <ListItem disablePadding>
                        <ListItemButton onClick={() => handleResultClick(result)}>
                          <ListItemIcon>{result.icon}</ListItemIcon>
                          <ListItemText
                            primary={result.title}
                            secondary={result.subtitle}
                          />
                          <Chip
                            label={result.type}
                            size="small"
                            color={getTypeColor(result.type) as any}
                            variant="outlined"
                          />
                        </ListItemButton>
                      </ListItem>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </List>
            </>
          )}

          {/* Recent Searches */}
          {query.length === 0 && recentSearches.length > 0 && (
            <>
              <Typography
                variant="caption"
                sx={{
                  px: 2,
                  pt: 1,
                  pb: 0.5,
                  display: 'block',
                  color: 'text.secondary',
                }}
              >
                RECENT SEARCHES
              </Typography>
              <List>
                {recentSearches.map((search, index) => (
                  <ListItem key={index} disablePadding>
                    <ListItemButton onClick={() => setQuery(search)}>
                      <ListItemIcon>
                        <History />
                      </ListItemIcon>
                      <ListItemText primary={search} />
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
            </>
          )}

          {/* Trending */}
          {query.length === 0 && (
            <>
              <Typography
                variant="caption"
                sx={{
                  px: 2,
                  pt: 1,
                  pb: 0.5,
                  display: 'block',
                  color: 'text.secondary',
                }}
              >
                TRENDING
              </Typography>
              <List>
                {['TypeScript Mastery', 'React Performance', 'Node.js Backend'].map((trend) => (
                  <ListItem key={trend} disablePadding>
                    <ListItemButton onClick={() => setQuery(trend)}>
                      <ListItemIcon>
                        <TrendingUp />
                      </ListItemIcon>
                      <ListItemText primary={trend} />
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
            </>
          )}

          {/* No results */}
          {query.length > 2 && results.length === 0 && !isSearching && (
            <Box sx={{ p: 4, textAlign: 'center' }}>
              <Typography variant="h6" color="text.secondary">
                No results found
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Try searching with different keywords
              </Typography>
            </Box>
          )}
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default SearchBar;