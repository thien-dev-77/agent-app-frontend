'use client';

import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface TrendIndicatorProps {
  value: number;
  label?: string;
  direction?: 'up' | 'down' | 'neutral';
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
  invertColors?: boolean; // true = up is bad (e.g., latency increase)
}

const sizeConfig = {
  sm: { icon: 12, text: '10px' },
  md: { icon: 14, text: '12px' },
  lg: { icon: 16, text: '14px' },
};

export default function TrendIndicator({
  value,
  label,
  direction,
  size = 'md',
  showIcon = true,
  invertColors = false,
}: TrendIndicatorProps) {
  // Auto-detect direction if not provided
  const dir = direction ?? (value > 0 ? 'up' : value < 0 ? 'down' : 'neutral');

  // Determine color based on direction and inversion
  const isPositive = dir === 'up';
  const color = invertColors
    ? isPositive
      ? 'var(--accent-red)'
      : dir === 'down'
        ? 'var(--accent-green)'
        : 'var(--text-secondary)'
    : isPositive
      ? 'var(--accent-green)'
      : dir === 'down'
        ? 'var(--accent-red)'
        : 'var(--text-secondary)';

  const Icon =
    dir === 'up' ? TrendingUp : dir === 'down' ? TrendingDown : Minus;
  const sizeStyles = sizeConfig[size];

  const displayValue = Math.abs(value);
  const prefix = dir === 'up' ? '+' : dir === 'down' ? '-' : '';

  return (
    <span className="inline-flex items-center gap-1" style={{ color }}>
      {showIcon && (
        <Icon
          style={{ width: sizeStyles.icon, height: sizeStyles.icon }}
          className="flex-shrink-0"
        />
      )}
      <span className="font-medium" style={{ fontSize: sizeStyles.text }}>
        {prefix}
        {displayValue}
        {typeof value === 'number' && '%'}
      </span>
      {label && (
        <span
          className="font-normal"
          style={{ fontSize: sizeStyles.text, color: 'var(--text-tertiary)' }}
        >
          {label}
        </span>
      )}
    </span>
  );
}
