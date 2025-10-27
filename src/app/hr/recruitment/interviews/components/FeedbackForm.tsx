"use client";

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useInterviews } from '../store/useInterviews';

const schema = z.object({ technical: z.number().min(1).max(5), communication: z.number().min(1).max(5), culture: z.number().min(1).max(5), comments: z.string().min(5) });

export function FeedbackForm({ interviewId, onSaved }: { interviewId: string; onSaved?: ()=> void }) {
  const { addFeedback, markCompleted } = useInterviews();
  const { register, handleSubmit, formState: { errors } } = useForm({ resolver: zodResolver(schema) });

  function onSubmit(values: any) {
    addFeedback(interviewId, values);
    markCompleted(interviewId, 'Feedback submitted');
    onSaved?.();
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
      <div>
        <label className="text-zinc-300 text-sm">Technical</label>
        <input type="number" {...register('technical')} className="w-full rounded-xl bg-zinc-900 border border-zinc-800 px-3 py-2" />
      </div>
      <div>
        <label className="text-zinc-300 text-sm">Communication</label>
        <input type="number" {...register('communication')} className="w-full rounded-xl bg-zinc-900 border border-zinc-800 px-3 py-2" />
      </div>
      <div>
        <label className="text-zinc-300 text-sm">Culture Fit</label>
        <input type="number" {...register('culture')} className="w-full rounded-xl bg-zinc-900 border border-zinc-800 px-3 py-2" />
      </div>
      <div>
        <label className="text-zinc-300 text-sm">Comments</label>
        <textarea {...register('comments')} className="w-full rounded-xl bg-zinc-900 border border-zinc-800 px-3 py-2" />
      </div>
      <div className="flex justify-end">
        <button type="submit" className="px-3 py-2 rounded-xl bg-emerald-400 text-black">Submit Feedback</button>
      </div>
    </form>
  );
}
