"use client";

import { useMemo } from "react";
import { useSkills } from "@/store/useSkills";
import { BookOpen } from "lucide-react";

export function TrainingRecommendations() {
  const { assignments, employees, skills } = useSkills();
  const recs = useMemo(() => {
    const low = assignments.filter(a => a.proficiency <= 2).slice(0, 8);
    return low.map(a => ({
      emp: employees.find(e => e.id === a.employeeId)?.name || "",
      skill: skills.find(s => s.id === a.skillId)?.name || "",
      course: `Improve ${skills.find(s => s.id === a.skillId)?.name} fundamentals`,
    }));
  }, [assignments, employees, skills]);

  return (
    <div className="rounded-2xl bg-slate-900/60 border border-slate-800 p-4 shadow-lg backdrop-blur-sm">
      <h3 className="text-slate-200 font-semibold mb-3">Training Recommendations</h3>
      <ul className="space-y-2">
        {recs.map((r, i) => (
          <li key={i} className="flex items-center gap-3 text-sm text-slate-200">
            <BookOpen className="h-4 w-4 text-emerald-400" />
            <span className="text-slate-300">{r.emp}</span>
            <span className="text-slate-500">→</span>
            <span>{r.course}</span>
          </li>
        ))}
        {recs.length===0 && <li className="text-slate-400 text-sm">No gaps detected. Great job!</li>}
      </ul>
      <div className="mt-3 text-xs text-slate-400">Integrate with your LMS or course provider to fetch real courses.</div>
    </div>
  );
}
