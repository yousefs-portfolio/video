import React from 'react';

export const SkeletonLine: React.FC<{ width?: string; height?: string; className?: string }> = ({
  width = '100%',
  height = '1rem',
  className = '',
}) => <div className={`skeleton rounded ${className}`} style={{ width, height }} />;

export const SkeletonAvatar: React.FC<{ size?: number; className?: string }> = ({
  size = 48,
  className = '',
}) => <div className={`skeleton avatar ${className}`} style={{ width: size, height: size }} />;

export const SkeletonCard: React.FC<{ className?: string; height?: number }> = ({
  className = '',
  height = 160,
}) => <div className={`skeleton card ${className}`} style={{ height }} />;

export const PageSkeleton: React.FC = () => (
  <div className="space-y-4">
    <SkeletonLine width="60%" height="1.5rem" className="title" />
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {Array.from({ length: 6 }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  </div>
);

export default {
  SkeletonLine,
  SkeletonAvatar,
  SkeletonCard,
  PageSkeleton,
};
