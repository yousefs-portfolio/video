import React, { useState, useCallback, useRef, useEffect } from 'react';
import {
  Box,
  TextField,
  Paper,
  Typography,
  Chip,
  Stack,
  IconButton,
  InputAdornment,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Divider,
  CircularProgress,
  Tooltip,
  Badge,
  Button,
  Menu,
  MenuItem,
  Fade,
} from '@mui/material';
import {
  Search,
  Mic,
  Close,
  FilterList,
  TrendingUp,
  History,
  School,
  PlayCircleOutline,
  Quiz,
  Group,
  Psychology,
  AutoAwesome,
  Clear,
  Tune,
} from '@mui/icons-material';
import { useDebounce } from '../../hooks/useDebounce';
import { motion, AnimatePresence } from 'framer-motion';

interface SearchResult {
  id: string;
  type: 'course' | 'video' | 'quiz' | 'discussion' | 'instructor' | 'pathway';
  title: string;
  description: string;
  thumbnail?: string;
  metadata: {
    duration?: number;
    level?: string;
    rating?: number;
    students?: number;
    price?: number;
    instructor?: string;
    tags?: string[];
    relevanceScore: number;
    aiExplanation?: string;
  };
}

interface SearchFilter {
  type: string[];
  level: string[];
  duration: { min: number; max: number };
  price: { min: number; max: number };
  rating: number;
  language: string[];
}

interface NaturalLanguageSearchProps {
  onResultClick?: (result: SearchResult) => void;
  placeholder?: string;
  showFilters?: boolean;
  showSuggestions?: boolean;
  showVoiceSearch?: boolean;
  showAIInsights?: boolean;
}

const NaturalLanguageSearch: React.FC<NaturalLanguageSearchProps> = ({
  onResultClick,
  placeholder = "Ask anything... 'explain React hooks', 'beginner Python courses', 'how to build a REST API'",
  showFilters = true,
  showSuggestions = true,
  showVoiceSearch = true,
  showAIInsights = true,
}) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [trendingSearches, setTrendingSearches] = useState<string[]>([]);
  const [filters, setFilters] = useState<SearchFilter>({
    type: [],
    level: [],
    duration: { min: 0, max: 999 },
    price: { min: 0, max: 999 },
    rating: 0,
    language: [],
  });
  const [filterAnchorEl, setFilterAnchorEl] = useState<null | HTMLElement>(null);
  const [searchMode, setSearchMode] = useState<'natural' | 'semantic' | 'exact'>('natural');
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);
  
  const searchInputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<any>(null);
  const debouncedQuery = useDebounce(query, 300);

  useEffect(() => {
    // Load recent searches from localStorage
    const saved = localStorage.getItem('recentSearches');
    if (saved) {
      setRecentSearches(JSON.parse(saved).slice(0, 5));
    }

    // Load trending searches (mock data)
    setTrendingSearches([
      'JavaScript async await',
      'Machine learning basics',
      'React hooks tutorial',
      'Python data science',
      'Web3 development',
    ]);

    // Initialize speech recognition
    if (showVoiceSearch && 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setQuery(transcript);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
  }, [showVoiceSearch]);

  useEffect(() => {
    if (debouncedQuery.length > 2) {
      performSearch(debouncedQuery);
    } else if (debouncedQuery.length === 0) {
      setResults([]);
      setShowResults(false);
    }
  }, [debouncedQuery]);

  const performSearch = async (searchQuery: string) => {
    setLoading(true);
    setShowResults(true);

    try {
      // Simulate AI-powered natural language search
      await new Promise(resolve => setTimeout(resolve, 500));

      // Mock results with AI relevance scoring
      const mockResults: SearchResult[] = [
        {
          id: '1',
          type: 'course',
          title: 'Complete React Developer Course',
          description: 'Master React, Redux, React Router, and more. Build real-world applications.',
          thumbnail: '',
          metadata: {
            duration: 2400,
            level: 'Intermediate',
            rating: 4.8,
            students: 15420,
            price: 89.99,
            instructor: 'John Doe',
            tags: ['React', 'JavaScript', 'Web Development'],
            relevanceScore: 0.95,
            aiExplanation: 'Highly relevant based on your query about React hooks. This course covers hooks extensively in modules 3-5.',
          },
        },
        {
          id: '2',
          type: 'video',
          title: 'Understanding React Hooks in 30 Minutes',
          description: 'A comprehensive guide to useState, useEffect, and custom hooks.',
          thumbnail: '',
          metadata: {
            duration: 1800,
            level: 'Beginner',
            rating: 4.6,
            relevanceScore: 0.92,
            aiExplanation: 'Quick tutorial focused specifically on React hooks concepts you asked about.',
          },
        },
        {
          id: '3',
          type: 'pathway',
          title: 'Frontend Developer Learning Path',
          description: 'Structured curriculum from HTML/CSS to React and beyond.',
          thumbnail: '',
          metadata: {
            duration: 12000,
            level: 'All Levels',
            relevanceScore: 0.85,
            aiExplanation: 'Comprehensive learning path that includes React hooks as part of the curriculum.',
          },
        },
        {
          id: '4',
          type: 'quiz',
          title: 'React Hooks Assessment',
          description: 'Test your knowledge of React hooks with this interactive quiz.',
          thumbnail: '',
          metadata: {
            duration: 900,
            level: 'Intermediate',
            relevanceScore: 0.88,
            aiExplanation: 'Perfect for testing your understanding of the React hooks concepts.',
          },
        },
        {
          id: '5',
          type: 'discussion',
          title: 'Common React Hooks Patterns and Best Practices',
          description: 'Community discussion about effective hook usage patterns.',
          thumbnail: '',
          metadata: {
            relevanceScore: 0.82,
            aiExplanation: 'Active discussion thread with expert insights on React hooks.',
          },
        },
      ];

      // Filter and sort by relevance
      const filteredResults = mockResults
        .filter(result => applyFilters(result))
        .sort((a, b) => b.metadata.relevanceScore - a.metadata.relevanceScore);

      setResults(filteredResults);

      // Generate AI suggestions based on query
      if (showAIInsights) {
        generateAISuggestions(searchQuery);
      }

      // Save to recent searches
      saveRecentSearch(searchQuery);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = (result: SearchResult): boolean => {
    if (filters.type.length > 0 && !filters.type.includes(result.type)) {
      return false;
    }
    
    if (filters.level.length > 0 && result.metadata.level && 
        !filters.level.includes(result.metadata.level)) {
      return false;
    }
    
    if (result.metadata.rating && result.metadata.rating < filters.rating) {
      return false;
    }
    
    if (result.metadata.duration) {
      const duration = result.metadata.duration / 60; // Convert to minutes
      if (duration < filters.duration.min || duration > filters.duration.max) {
        return false;
      }
    }
    
    if (result.metadata.price !== undefined) {
      if (result.metadata.price < filters.price.min || result.metadata.price > filters.price.max) {
        return false;
      }
    }
    
    return true;
  };

  const generateAISuggestions = (searchQuery: string) => {
    // Simulate AI-generated related searches
    const suggestions = [
      `${searchQuery} for beginners`,
      `Advanced ${searchQuery} techniques`,
      `${searchQuery} best practices`,
      `${searchQuery} project ideas`,
      `${searchQuery} vs alternatives`,
    ];
    setAiSuggestions(suggestions);
  };

  const saveRecentSearch = (searchQuery: string) => {
    const updated = [searchQuery, ...recentSearches.filter(s => s !== searchQuery)].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem('recentSearches', JSON.stringify(updated));
  };

  const handleVoiceSearch = () => {
    if (recognitionRef.current) {
      if (isListening) {
        recognitionRef.current.stop();
      } else {
        recognitionRef.current.start();
        setIsListening(true);
      }
    }
  };

  const handleClearSearch = () => {
    setQuery('');
    setResults([]);
    setShowResults(false);
    searchInputRef.current?.focus();
  };

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion);
    performSearch(suggestion);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'course':
        return <School />;
      case 'video':
        return <PlayCircleOutline />;
      case 'quiz':
        return <Quiz />;
      case 'discussion':
        return <Group />;
      case 'pathway':
        return <TrendingUp />;
      case 'instructor':
        return <Psychology />;
      default:
        return <School />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'course':
        return 'primary';
      case 'video':
        return 'secondary';
      case 'quiz':
        return 'success';
      case 'discussion':
        return 'info';
      case 'pathway':
        return 'warning';
      case 'instructor':
        return 'error';
      default:
        return 'default';
    }
  };

  return (
    <Box sx={{ position: 'relative', width: '100%', maxWidth: 800, mx: 'auto' }}>
      <Paper
        elevation={showResults ? 8 : 2}
        sx={{
          p: 2,
          borderRadius: showResults ? '24px 24px 0 0' : 3,
          transition: 'all 0.3s ease',
        }}
      >
        <Stack spacing={2}>
          {/* Search Mode Selector */}
          {showAIInsights && (
            <Stack direction="row" spacing={1} justifyContent="center">
              <Chip
                label="Natural Language"
                onClick={() => setSearchMode('natural')}
                color={searchMode === 'natural' ? 'primary' : 'default'}
                icon={<AutoAwesome />}
                size="small"
              />
              <Chip
                label="Semantic Search"
                onClick={() => setSearchMode('semantic')}
                color={searchMode === 'semantic' ? 'primary' : 'default'}
                icon={<Psychology />}
                size="small"
              />
              <Chip
                label="Exact Match"
                onClick={() => setSearchMode('exact')}
                color={searchMode === 'exact' ? 'primary' : 'default'}
                icon={<Search />}
                size="small"
              />
            </Stack>
          )}

          {/* Main Search Input */}
          <TextField
            ref={searchInputRef}
            fullWidth
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={placeholder}
            variant="outlined"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  {loading ? <CircularProgress size={20} /> : <Search />}
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <Stack direction="row" spacing={1}>
                    {query && (
                      <IconButton size="small" onClick={handleClearSearch}>
                        <Clear />
                      </IconButton>
                    )}
                    {showVoiceSearch && (
                      <IconButton
                        size="small"
                        onClick={handleVoiceSearch}
                        color={isListening ? 'error' : 'default'}
                      >
                        <Mic />
                      </IconButton>
                    )}
                    {showFilters && (
                      <IconButton
                        size="small"
                        onClick={(e) => setFilterAnchorEl(e.currentTarget)}
                      >
                        <Badge
                          badgeContent={
                            Object.values(filters).filter(f => 
                              Array.isArray(f) ? f.length > 0 : f > 0
                            ).length
                          }
                          color="primary"
                        >
                          <FilterList />
                        </Badge>
                      </IconButton>
                    )}
                  </Stack>
                </InputAdornment>
              ),
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 3,
              },
            }}
          />

          {/* Quick Suggestions */}
          {showSuggestions && !query && (
            <Box>
              <Stack direction="row" spacing={1} sx={{ mb: 1, flexWrap: 'wrap' }}>
                <Typography variant="caption" color="text.secondary">
                  Trending:
                </Typography>
                {trendingSearches.map((search, index) => (
                  <Chip
                    key={index}
                    label={search}
                    size="small"
                    onClick={() => handleSuggestionClick(search)}
                    icon={<TrendingUp />}
                    variant="outlined"
                    sx={{ mb: 0.5 }}
                  />
                ))}
              </Stack>
              
              {recentSearches.length > 0 && (
                <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap' }}>
                  <Typography variant="caption" color="text.secondary">
                    Recent:
                  </Typography>
                  {recentSearches.map((search, index) => (
                    <Chip
                      key={index}
                      label={search}
                      size="small"
                      onClick={() => handleSuggestionClick(search)}
                      icon={<History />}
                      variant="outlined"
                      sx={{ mb: 0.5 }}
                    />
                  ))}
                </Stack>
              )}
            </Box>
          )}

          {/* AI Suggestions */}
          {showAIInsights && query && aiSuggestions.length > 0 && (
            <Box>
              <Typography variant="caption" color="text.secondary" sx={{ mb: 1 }}>
                AI Suggestions:
              </Typography>
              <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap' }}>
                {aiSuggestions.map((suggestion, index) => (
                  <Chip
                    key={index}
                    label={suggestion}
                    size="small"
                    onClick={() => handleSuggestionClick(suggestion)}
                    icon={<AutoAwesome />}
                    color="primary"
                    variant="outlined"
                    sx={{ mb: 0.5 }}
                  />
                ))}
              </Stack>
            </Box>
          )}
        </Stack>
      </Paper>

      {/* Search Results */}
      <AnimatePresence>
        {showResults && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
          >
            <Paper
              elevation={8}
              sx={{
                maxHeight: 500,
                overflow: 'auto',
                borderRadius: '0 0 24px 24px',
                borderTop: '1px solid',
                borderColor: 'divider',
              }}
            >
              <List>
                {results.map((result, index) => (
                  <React.Fragment key={result.id}>
                    <ListItem
                      button
                      onClick={() => onResultClick?.(result)}
                      sx={{
                        '&:hover': {
                          bgcolor: 'action.hover',
                        },
                      }}
                    >
                      <ListItemAvatar>
                        <Avatar
                          sx={{
                            bgcolor: `${getTypeColor(result.type)}.light`,
                            color: `${getTypeColor(result.type)}.main`,
                          }}
                        >
                          {getTypeIcon(result.type)}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Stack direction="row" alignItems="center" spacing={1}>
                            <Typography variant="subtitle1">
                              {result.title}
                            </Typography>
                            <Chip
                              label={result.type}
                              size="small"
                              color={getTypeColor(result.type) as any}
                            />
                            {result.metadata.relevanceScore > 0.9 && (
                              <Chip
                                label="Best Match"
                                size="small"
                                color="success"
                                icon={<AutoAwesome />}
                              />
                            )}
                          </Stack>
                        }
                        secondary={
                          <Box>
                            <Typography variant="body2" color="text.secondary">
                              {result.description}
                            </Typography>
                            {showAIInsights && result.metadata.aiExplanation && (
                              <Box sx={{ mt: 1, p: 1, bgcolor: 'info.light', borderRadius: 1 }}>
                                <Typography variant="caption" color="info.dark">
                                  <AutoAwesome sx={{ fontSize: 14, mr: 0.5, verticalAlign: 'middle' }} />
                                  {result.metadata.aiExplanation}
                                </Typography>
                              </Box>
                            )}
                            <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                              {result.metadata.level && (
                                <Chip label={result.metadata.level} size="small" />
                              )}
                              {result.metadata.duration && (
                                <Chip 
                                  label={`${Math.floor(result.metadata.duration / 60)} min`} 
                                  size="small" 
                                />
                              )}
                              {result.metadata.rating && (
                                <Chip 
                                  label={`★ ${result.metadata.rating}`} 
                                  size="small" 
                                  color="warning"
                                />
                              )}
                              {result.metadata.price !== undefined && (
                                <Chip 
                                  label={result.metadata.price === 0 ? 'Free' : `$${result.metadata.price}`} 
                                  size="small" 
                                  color={result.metadata.price === 0 ? 'success' : 'default'}
                                />
                              )}
                            </Stack>
                          </Box>
                        }
                      />
                    </ListItem>
                    {index < results.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
                {results.length === 0 && !loading && (
                  <ListItem>
                    <ListItemText
                      primary="No results found"
                      secondary="Try adjusting your search or filters"
                    />
                  </ListItem>
                )}
              </List>
            </Paper>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Filter Menu */}
      <Menu
        anchorEl={filterAnchorEl}
        open={Boolean(filterAnchorEl)}
        onClose={() => setFilterAnchorEl(null)}
        PaperProps={{
          sx: { width: 300, p: 2 },
        }}
      >
        <Typography variant="h6" sx={{ mb: 2 }}>
          Filters
        </Typography>
        
        {/* Filter controls would go here */}
        <Button
          fullWidth
          variant="contained"
          onClick={() => setFilterAnchorEl(null)}
        >
          Apply Filters
        </Button>
      </Menu>
    </Box>
  );
};

export default NaturalLanguageSearch;