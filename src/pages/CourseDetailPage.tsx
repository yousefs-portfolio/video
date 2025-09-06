import React, { useEffect, useState } from 'react';
import { Box, IconButton, TextField, Typography } from '@mui/material';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { AppDispatch } from '@/store';
import { setCourseTheme } from '@/store/slices/uiSlice';
import { PageSkeleton } from '@/components/common/Skeletons';
import { Bookmark } from '@mui/icons-material';

const CourseDetailPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { courseId } = useParams();
  const [loading, setLoading] = useState(true);
  const [bookmarked, setBookmarked] = useState(false);

  useEffect(() => {
    // Dynamic course theme based on courseId heuristics
    let theme: 'default' | 'math' | 'cs' | 'design' = 'default';
    const id = (courseId || '').toLowerCase();
    if (id.includes('math')) theme = 'math';
    else if (id.includes('design')) theme = 'design';
    else if (id) theme = 'cs';
    dispatch(setCourseTheme(theme));

    const t = setTimeout(() => setLoading(false), 800);
    return () => {
      clearTimeout(t);
      dispatch(setCourseTheme('default'));
    };
  }, [courseId, dispatch]);

  if (loading) return <PageSkeleton />;

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
        <Typography variant="h4" className="text-3d text-gradient">
          Course Detail
        </Typography>
        <IconButton
          className={`bookmark-toggle ${bookmarked ? 'active' : ''}`}
          onClick={() => setBookmarked((v) => !v)}
          aria-label="Bookmark course"
        >
          <Bookmark />
        </IconButton>
      </Box>

      <Typography paragraph>
        This course page demonstrates dynamic topic theming, bookmark animation and note-taking
        micro-interactions.
      </Typography>

      <TextField
        fullWidth
        placeholder="Write a quick note..."
        multiline
        minRows={3}
        className="note-input"
      />
    </Box>
  );
};

export default CourseDetailPage;
