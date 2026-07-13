'use client';

import { ReactNode } from 'react';
import { TrendingUp, TrendingDown, Minus, MoreHorizontal } from 'lucide-react';

interface SparklineData {
  values: number[];
  color?: string;
}

interface MetricCardProps {
  title: string;
  value: string | number;
  icon?: ReactNode;
  trend?: {
    value: number;
    label?: string;
    direction: 'up' | 'down' | 'neutral';
  };
  sparkline?: SparklineData;
  prefix?: string;
  suffix?: string;
  onClick?: () => void;
}

function Sparkline({ values, color = 'var(--accent)' }: SparklineData) {
  if (!values || values.length < 2) return null;

  const max = Math.max(...values);
  const min = Math.min(...values);
  const range = max - min || 1;
  const height = 32;
  const width = 80;
  const barWidth = Math.max(4, (width - (values.length - 1) * 2) / values.length);

  return (
    <svg width={width} height={height} className="flex-shrink-0">
      {values.map((v, i) => {
        const barHeight = ((v - min) / range) * (height - 4) + 4;
        const x = i * (barWidth + 2);
        return (
          <rect
            key={i}
            x={x}
            y={height - barHeight}
            width={barWidth}
            height={barHeight}
            rx={2}
            fill={color}
            opacity={0.3 + (i / values.length) * 0.7}
          />
        );
      })}
    </svg>
  );
}

export default function MetricCard({
  title,
  value,
  icon,
  trend,
  sparkline,
  prefix,
  suffix,
  onClick,
}: MetricCardProps) {
  const trendColor =
    trend?.direction === 'up'
      ? 'var(--accent-green)'
      : trend?.direction === 'down'
        ? 'var(--accent-red)'
        : 'var(--text-secondary)';

  const TrendIcon =
    trend?.direction === 'up'
      ? TrendingUp
      : trend?.direction === 'down'
        ? TrendingDown
        : Minus;

  return (
    <div
      className={`rounded-xl p-5 transition-all ${onClick ? 'cursor-pointer hover:border-[var(--border-hover)]' : ''}`}
      style={{
        background: 'var(--bg-surface)',
        border: '1px solid var(--border)',
      }}
      onClick={onClick}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          {icon && (
            <span style={{ color: 'var(--text-secondary)' }}>{icon}</span>
          )}
          <span
            className="text-[12px] font-medium"
            style={{ color: 'var(--text-secondary)' }}
          >
            {title}
          </span>
        </div>
        <button
          className="p-1 rounded-md hover:bg-[var(--bg-hover)] transition-colors"
          style={{ color: 'var(--text-tertiary)' }}
        >
          <MoreHorizontal className="w-4 h-4" />
        </button>
      </div>

      {/* Value + Sparkline */}
      <div className="flex items-end justify-between gap-4">
        <div>
          <div className="flex items-baseline gap-1">
            {prefix && (
              <span
                className="text-lg font-medium"
                style={{ color: 'var(--text-secondary)' }}
              >
                {prefix}
              </span>
            )}
            <span
              className="text-3xl font-bold tracking-tight"
              style={{ color: 'var(--text-primary)' }}
            >
              {value}
            </span>
            {suffix && (
              <span
                className="text-lg font-medium"
                style={{ color: 'var(--text-secondary)' }}
              >
                {suffix}
              </span>
            )}
          </div>

          {/* Trend */}
          {trend && (
            <div className="flex items-center gap-1.5 mt-2">
              <TrendIcon className="w-3.5 h-3.5" style={{ color: trendColor }} />
              <span
                className="text-[12px] font-medium"
                style={{ color: trendColor }}
              >
                {trend.direction === 'up' ? '+' : trend.direction === 'down' ? '' : ''}
                {trend.value}%
              </span>
              {trend.label && (
                <span
                  className="text-[12px]"
                  style={{ color: 'var(--text-tertiary)' }}
                >
                  {trend.label}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Sparkline */}
        {sparkline && <Sparkline {...sparkline} />}
      </div>
    </div>
  );
}
