import React from 'react';
import { render, screen } from '@testing-library/react';
import { SkeletonBlock } from '../../common/Skeleton';

describe('SkeletonBlock', () => {
  it('renders the specified count of skeleton items', () => {
    render(<SkeletonBlock width={200} height={20} count={3} data-testid-prefix="sk" />);
    expect(screen.getAllByTestId(/^sk-/)).toHaveLength(3);
  });

  it('applies width and height styles', () => {
    render(<SkeletonBlock width={150} height={12} count={1} data-testid-prefix="sk" />);
    const el = screen.getByTestId('sk-0');
    expect(el).toHaveStyle({ width: '150px', height: '12px' });
  });

  it('applies rounded class when rounded is true', () => {
    render(<SkeletonBlock width={100} height={10} rounded count={1} data-testid-prefix="sk" />);
    const el = screen.getByTestId('sk-0');
    expect(el.className).toMatch(/rounded/);
  });
});
