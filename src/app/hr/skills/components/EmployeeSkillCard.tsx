"use client";

import type { Employee, EmployeeSkill, Skill } from "@/types/skill";
import { ShieldCheck } from "lucide-react";

export function EmployeeSkillCard({ employee, assignments, skills }: { employee: Employee; assignments: EmployeeSkill[]; skills: Skill[] }) {
  return (
    <div className="rounded-2xl bg-slate-900/60 border border-slate-800 p-4 shadow-lg">
      <div className="text-slate-100 font-semibold mb-2">{employee.name}</div>
      <div className="text-slate-400 text-xs mb-3">{employee.department} • {employee.role}</div>
      <div className="flex flex-wrap gap-2">
        {assignments.map(a => {
          const sk = skills.find(s => s.id === a.skillId);
          return (
            <span key={a.id} className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-slate-800/60 border border-slate-700 text-slate-200 text-xs">
              {sk?.name}
              <span className="ml-1 tabular-nums text-emerald-300">{a.proficiency}</span>
              {a.verified && <ShieldCheck className="h-3 w-3 text-emerald-400" />}
            </span>
          );
        })}
        {assignments.length===0 && <span className="text-slate-400 text-xs">No skills</span>}
      </div>
    </div>
  );
}
