'use client';
import { motion } from 'framer-motion';

export function OnboardingProgressCard({ name, percent, tasks }: { name: string; percent: number; tasks: number }) {
  const radius = 36; const stroke = 8; const normalized = Math.min(100, Math.max(0, percent));
  const circumference = 2 * Math.PI * radius; const dash = (normalized / 100) * circumference;

  return (
    <div className="p-4 rounded-xl bg-neutral-900 border border-neutral-800 w-48">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-neutral-400 text-sm">{name}</div>
          <div className="text-neutral-100 text-lg font-semibold">{percent}%</div>
        </div>
        <motion.svg width={radius*2 + stroke} height={radius*2 + stroke} initial={{ rotate: -90 }} animate={{ rotate: -90 }}>
          <circle cx={radius+stroke/2} cy={radius+stroke/2} r={radius} strokeWidth={stroke} stroke="#2b2b2b" fill="none" />
          <motion.circle cx={radius+stroke/2} cy={radius+stroke/2} r={radius} strokeWidth={stroke} stroke="#10b981" fill="none" strokeDasharray={`${dash} ${circumference-dash}`} strokeLinecap="round" initial={{ strokeDashoffset: circumference }} animate={{ strokeDashoffset: circumference - dash }} />
        </motion.svg>
      </div>
      <div className="text-neutral-400 text-xs mt-2">Tasks: {tasks}</div>
    </div>
  );
}
