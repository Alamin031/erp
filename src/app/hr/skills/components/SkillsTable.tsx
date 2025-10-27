"use client";

import { useMemo, useState } from "react";
import { useSkills } from "@/store/useSkills";
import { Edit2, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { SkillFormModal } from "./SkillFormModal";
import { useToast } from "@/components/toast";

export function SkillsTable({ onAdd }: { onAdd?: () => void }) {
  const { skills, assignments, employees, searchQuery, pagination, setPage, deleteSkill } = useSkills();
  const { showToast } = useToast();
  const [editingId, setEditingId] = useState<string | null>(null);

  const rows = useMemo(() => {
    const q = searchQuery.toLowerCase();
    return skills
      .filter(s => s.name.toLowerCase().includes(q) || (s.category || "").toLowerCase().includes(q))
      .map(s => {
        const asg = assignments.filter(a => a.skillId === s.id);
        const avg = asg.length ? (asg.reduce((acc, a) => acc + a.proficiency, 0) / asg.length) : 0;
        const employeeCount = new Set(asg.map(a => a.employeeId)).size;
        return { skill: s, avg, employeeCount };
      })
      .sort((a,b)=> a.skill.name.localeCompare(b.skill.name));
  }, [skills, assignments, searchQuery]);

  const pageStart = (pagination.page - 1) * pagination.pageSize;
  const pageRows = rows.slice(pageStart, pageStart + pagination.pageSize);
  const totalPages = Math.max(1, Math.ceil(rows.length / pagination.pageSize));

  return (
    <div className="rounded-2xl bg-slate-900/60 border border-slate-800 shadow-lg overflow-hidden">
      <div className="flex items-center justify-between p-4">
        <h3 className="text-slate-200 font-semibold">Skills</h3>
        <button onClick={onAdd} className="text-emerald-400 hover:text-emerald-300">+ Add</button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-800/60 text-slate-300">
            <tr>
              <th className="text-left px-4 py-2">Skill</th>
              <th className="text-left px-4 py-2">Category</th>
              <th className="text-left px-4 py-2"># Employees</th>
              <th className="text-left px-4 py-2">Avg Proficiency</th>
              <th className="text-right px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {pageRows.map(({ skill, avg, employeeCount }) => (
              <motion.tr key={skill.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="border-t border-slate-800/80 hover:bg-slate-800/40">
                <td className="px-4 py-2 text-slate-100">{skill.name}</td>
                <td className="px-4 py-2 text-slate-300">{skill.category || "-"}</td>
                <td className="px-4 py-2 text-slate-300">{employeeCount}</td>
                <td className="px-4 py-2">
                  <div className="flex items-center gap-2">
                    <div className="h-2 flex-1 rounded bg-slate-800">
                      <div className="h-2 rounded bg-emerald-400" style={{ width: `${(avg/5)*100}%` }} />
                    </div>
                    <span className="text-slate-200 tabular-nums">{avg.toFixed(1)}</span>
                  </div>
                </td>
                <td className="px-4 py-2 text-right">
                  <button aria-label={`Edit ${skill.name}`} className="text-slate-300 hover:text-slate-100 mr-3" onClick={() => setEditingId(skill.id)}>
                    <Edit2 className="inline h-4 w-4" />
                  </button>
                  <button
                    aria-label={`Delete ${skill.name}`}
                    className="text-rose-400 hover:text-rose-300"
                    onClick={() => {
                      deleteSkill(skill.id);
                      showToast({ title: "Skill deleted", type: "success", description: `${skill.name} removed` });
                    }}
                  >
                    <Trash2 className="inline h-4 w-4" />
                  </button>
                </td>
              </motion.tr>
            ))}
            {pageRows.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-slate-400">No skills found. Add your first skill or import from CSV.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="flex items-center justify-between p-3 border-t border-slate-800/80 text-slate-300">
        <div>Page {pagination.page} / {totalPages}</div>
        <div className="flex items-center gap-2">
          <button disabled={pagination.page<=1} onClick={()=> setPage(Math.max(1, pagination.page-1))} className="disabled:opacity-40 rounded-lg px-2 py-1 bg-slate-800 hover:bg-slate-700">
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button disabled={pagination.page>=totalPages} onClick={()=> setPage(Math.min(totalPages, pagination.page+1))} className="disabled:opacity-40 rounded-lg px-2 py-1 bg-slate-800 hover:bg-slate-700">
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {editingId && (
          <SkillFormModal
            open={!!editingId}
            editId={editingId}
            onClose={() => setEditingId(null)}
            onSaved={() => setEditingId(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
