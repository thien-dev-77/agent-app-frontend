'use client';

type StatusType = 'healthy' | 'warning' | 'error' | 'inactive' | 'pending';

interface StatusIndicatorProps {
  status: StatusType;
  label?: string;
  size?: 'sm' | 'md' | 'lg';
  showDot?: boolean;
  showLabel?: boolean;
}

const statusConfig: Record<
  StatusType,
  { color: string; bg: string; label: string; glow: string }
> = {
  healthy: {
    color: 'var(--accent-green)',
    bg: 'rgba(52, 211, 153, 0.15)',
    label: 'Healthy',
    glow: 'rgba(52, 211, 153, 0.4)',
  },
  warning: {
    color: 'var(--accent-yellow)',
    bg: 'rgba(251, 191, 36, 0.15)',
    label: 'Warning',
    glow: 'rgba(251, 191, 36, 0.4)',
  },
  error: {
    color: 'var(--accent-red)',
    bg: 'rgba(248, 113, 113, 0.15)',
    label: 'Error',
    glow: 'rgba(248, 113, 113, 0.4)',
  },
  inactive: {
    color: 'var(--text-tertiary)',
    bg: 'rgba(90, 90, 106, 0.15)',
    label: 'Inactive',
    glow: 'transparent',
  },
  pending: {
    color: 'var(--accent)',
    bg: 'rgba(79, 140, 255, 0.15)',
    label: 'Pending',
    glow: 'rgba(79, 140, 255, 0.4)',
  },
};

const sizeConfig = {
  sm: { dot: 6, text: '10px', px: 6, py: 2 },
  md: { dot: 8, text: '11px', px: 8, py: 3 },
  lg: { dot: 10, text: '12px', px: 10, py: 4 },
};

export default function StatusIndicator({
  status,
  label,
  size = 'md',
  showDot = true,
  showLabel = true,
}: StatusIndicatorProps) {
  const config = statusConfig[status];
  const sizeStyles = sizeConfig[size];

  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full font-medium"
      style={{
        background: config.bg,
        color: config.color,
        fontSize: sizeStyles.text,
        padding: `${sizeStyles.py}px ${sizeStyles.px}px`,
      }}
    >
      {showDot && (
        <span
          className="rounded-full flex-shrink-0"
          style={{
            width: sizeStyles.dot,
            height: sizeStyles.dot,
            background: config.color,
            boxShadow: `0 0 ${sizeStyles.dot}px ${config.glow}`,
          }}
        />
      )}
      {showLabel && (label || config.label)}
    </span>
  );
}

// Action badge for tables (Blocked, Fallback, Retried)
type ActionType = 'blocked' | 'fallback' | 'retried' | 'allowed';

interface ActionBadgeProps {
  action: ActionType;
}

const actionConfig: Record<ActionType, { color: string; bg: string; label: string }> = {
  blocked: {
    color: 'var(--accent-red)',
    bg: 'rgba(248, 113, 113, 0.15)',
    label: 'Blocked',
  },
  fallback: {
    color: 'var(--accent-yellow)',
    bg: 'rgba(251, 191, 36, 0.15)',
    label: 'Fallback',
  },
  retried: {
    color: 'var(--accent)',
    bg: 'rgba(79, 140, 255, 0.15)',
    label: 'Retried',
  },
  allowed: {
    color: 'var(--accent-green)',
    bg: 'rgba(52, 211, 153, 0.15)',
    label: 'Allowed',
  },
};

export function ActionBadge({ action }: ActionBadgeProps) {
  const config = actionConfig[action];
  return (
    <span
      className="inline-flex items-center px-2 py-1 rounded text-[11px] font-medium"
      style={{
        background: config.bg,
        color: config.color,
      }}
    >
      {config.label}
    </span>
  );
}
