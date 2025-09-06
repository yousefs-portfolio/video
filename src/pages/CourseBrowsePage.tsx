import React, { useEffect, useState } from 'react';
import { Box, Typography } from '@mui/material';
import { PageSkeleton } from '@/components/common/Skeletons';

const CourseBrowsePage: React.FC = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(t);
  }, []);

  if (loading) {
    return <PageSkeleton />;
  }

  return (
    <Box>
      <Typography variant="h4" className="text-3d">
        Browse Courses
      </Typography>
      {/* content would go here */}
    </Box>
  );
};

export default CourseBrowsePage;
