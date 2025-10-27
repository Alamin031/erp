"use client";

import { useMemo, useState } from "react";
import { useSkills } from "@/store/useSkills";
import type { Proficiency } from "@/types/skill";
import { motion } from "framer-motion";

export function SkillMatrix() {
  const { getMatrixData, setFilters, filters, employees, skills } = useSkills();
  const [local, setLocal] = useState({ department: filters.department || "", category: filters.category || "", proficiencyMin: filters.proficiencyMin || 0 as any, verified: filters.verified as any });

  const data = useMemo(() => getMatrixData({
    department: local.department || undefined,
    category: local.category || undefined,
    proficiencyMin: (Number(local.proficiencyMin) || 0) as Proficiency,
    verified: typeof local.verified === 'boolean' ? local.verified : undefined,
  }), [local, getMatrixData]);

  const departments = Array.from(new Set(employees.map(e => e.department).filter(Boolean))) as string[];
  const categories = Array.from(new Set(skills.map(s => s.category).filter(Boolean))) as string[];

  function colorFor(p: Proficiency | 0) {
    if (!p) return "bg-slate-800/60";
    const map: Record<number,string> = {
      1: "bg-rose-500/70",
      2: "bg-orange-400/70",
      3: "bg-amber-300/70",
      4: "bg-emerald-400/80",
      5: "bg-emerald-300",
    };
    return map[p as number] || "bg-slate-700";
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <select aria-label="Filter by department" value={local.department} onChange={e=> setLocal(s=> ({...s, department: e.target.value}))} className="rounded-xl bg-slate-900 border border-slate-800 text-slate-100 px-3 py-2">
          <option value="">All Departments</option>
          {departments.map(d => <option key={d} value={d}>{d}</option>)}
        </select>
        <select aria-label="Filter by category" value={local.category} onChange={e=> setLocal(s=> ({...s, category: e.target.value}))} className="rounded-xl bg-slate-900 border border-slate-800 text-slate-100 px-3 py-2">
          <option value="">All Categories</option>
          {categories.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <select aria-label="Min proficiency" value={String(local.proficiencyMin||0)} onChange={e=> setLocal(s=> ({...s, proficiencyMin: Number(e.target.value)}))} className="rounded-xl bg-slate-900 border border-slate-800 text-slate-100 px-3 py-2">
          <option value="0">Any Level</option>
          {[1,2,3,4,5].map(n => <option key={n} value={n}>≥ {n}</option>)}
        </select>
        <select aria-label="Verified filter" value={local.verified===true?"true":local.verified===false?"false":""} onChange={e=> setLocal(s=> ({...s, verified: e.target.value==="true"? true : e.target.value==="false"? false : undefined as any}))} className="rounded-xl bg-slate-900 border border-slate-800 text-slate-100 px-3 py-2">
          <option value="">Any Verification</option>
          <option value="true">Verified</option>
          <option value="false">Unverified</option>
        </select>
        <button onClick={()=> setFilters(local)} className="px-3 py-2 rounded-xl bg-emerald-500 text-black hover:bg-emerald-400">Apply</button>
      </div>

      <div className="overflow-auto">
        <table className="min-w-full text-xs">
          <thead className="sticky top-0 bg-slate-900/80 backdrop-blur-sm">
            <tr>
              <th className="px-2 py-2 text-left text-slate-300">Employee \ Skill</th>
              {data.skills.map(s => <th key={s.id} className="px-2 py-2 text-left text-slate-300 whitespace-nowrap">{s.name}</th>)}
            </tr>
          </thead>
          <tbody>
            {data.employees.map(e => (
              <tr key={e.id} className="border-t border-slate-800/60 hover:bg-slate-800/30">
                <td className="px-2 py-2 text-slate-200 whitespace-nowrap">{e.name}</td>
                {data.skills.map(s => {
                  const p = data.values[e.id]?.[s.id] || 0;
                  return (
                    <td key={s.id} className="px-2 py-2">
                      <motion.div layout className={`h-6 w-10 rounded ${colorFor(p)}`} aria-label={`Proficiency ${p||0}`}></motion.div>
                    </td>
                  );
                })}
              </tr>
            ))}
            {data.employees.length===0 && (
              <tr><td colSpan={1+data.skills.length} className="px-4 py-6 text-center text-slate-400">No data</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
