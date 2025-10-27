'use client';
import { useOnboarding } from '../store/useOnboarding';

export function TaskChecklist({ onboarding }: { onboarding: any }) {
  const { markTaskDone } = useOnboarding();

  function toggleTask(id:string, done:boolean) { markTaskDone(onboarding.id, id, done); }

  return (
    <div className="space-y-2">
      {onboarding.tasks.map((t:any) => (
        <div key={t.id} className="flex items-center justify-between bg-neutral-800 border border-neutral-700 rounded-md p-3">
          <div className="flex items-center gap-3">
            <input type="checkbox" checked={!!t.done} onChange={(e)=> toggleTask(t.id, e.target.checked)} />
            <div>
              <div className={`text-neutral-100 ${t.done ? 'line-through text-neutral-400' : ''}`}>{t.title}</div>
              {t.dueDate && <div className="text-neutral-400 text-sm">Due: {new Date(t.dueDate).toLocaleDateString()}</div>}
            </div>
          </div>
          <div className="text-sm text-neutral-400">{t.done ? 'Done' : 'Pending'}</div>
        </div>
      ))}
    </div>
  );
}
