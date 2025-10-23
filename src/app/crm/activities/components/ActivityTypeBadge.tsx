"use client";

import { ActivityType } from '@/types/activities';

interface Props { type: ActivityType }

export function ActivityTypeBadge({ type }: Props) {
  const map: Record<ActivityType, { color: string }> = {
    Call: { color: '#2563eb' },
    Meeting: { color: '#8b5cf6' },
    Email: { color: '#059669' },
    Task: { color: '#f59e0b' },
  };
  return <span style={{ padding: '4px 8px', borderRadius: 999, background: `${map[type].color}22`, color: map[type].color, fontWeight: 600 }}>{type}</span>;
}
