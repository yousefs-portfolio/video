import React from 'react';

interface SkeletonBlockProps {
  width: number;
  height: number;
  count?: number;
  rounded?: boolean;
  className?: string;
  'data-testid-prefix'?: string;
}

export const SkeletonBlock: React.FC<SkeletonBlockProps> = ({
  width,
  height,
  count = 1,
  rounded = false,
  className = '',
  'data-testid-prefix': testIdPrefix = 'skeleton',
}) => {
  const items = Array.from({ length: count });
  return (
    <div>
      {items.map((_, idx) => (
        <div
          key={idx}
          data-testid={`${testIdPrefix}-${idx}`}
          className={`skeleton ${rounded ? 'rounded' : ''} ${className}`.trim()}
          style={{ width: `${width}px`, height: `${height}px` }}
        />
      ))}
    </div>
  );
};

export default SkeletonBlock;
