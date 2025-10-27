"use client";

import { useInterviews } from '../store/useInterviews';

export function InterviewersPanel({ onAssign }: { onAssign?: (id: string) => void }) {
  const { interviewers, interviews } = useInterviews();

  return (
    <div>
      <div className="text-zinc-100 font-semibold mb-2">Interviewers</div>
      <ul className="space-y-2">
        {interviewers.map(iv => {
          const todays = interviews.filter(i=> i.interviewers.includes(iv.id) && i.date === new Date().toISOString().slice(0,10)).length;
          return (
            <li key={iv.id} className="flex items-center justify-between p-2 rounded bg-zinc-900 border border-zinc-800">
              <div>
                <div className="text-zinc-100">{iv.name}</div>
                <div className="text-zinc-400 text-xs">{iv.role}</div>
              </div>
              <div className="text-zinc-300 text-sm">{todays} today</div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
