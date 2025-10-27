"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle, ShieldCheck } from "lucide-react";
import { useSkills } from "@/store/useSkills";
import { EndorsementsList } from "./EndorsementsList";

interface Props {
  open: boolean;
  skillId: string | null;
  onClose: () => void;
}

export function SkillDetailsDrawer({ open, skillId, onClose }: Props) {
  const { skills, assignments, employees } = useSkills();
  const skill = skills.find(s => s.id === skillId || "");
  const asg = assignments.filter(a => a.skillId === (skill?.id || ""));
  const top = asg
    .map(a => ({ a, emp: employees.find(e => e.id === a.employeeId) }))
    .filter(x => !!x.emp)
    .sort((x, y) => (y!.a.proficiency - x!.a.proficiency))
    .slice(0, 5);

  return (
    <AnimatePresence>
      {open && (
        <motion.div initial={{ x: 400, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: 400, opacity: 0 }} className="fixed inset-y-0 right-0 w-full sm:w-[480px] z-50 bg-slate-900 border-l border-slate-800 shadow-2xl">
          <div className="flex items-center justify-between p-4 border-b border-slate-800">
            <div>
              <h3 className="text-slate-100 font-semibold">{skill?.name}</h3>
              <p className="text-slate-400 text-sm">{skill?.category}</p>
            </div>
            <button aria-label="Close" onClick={onClose} className="text-slate-400 hover:text-slate-200"><X className="h-5 w-5" /></button>
          </div>

          <div className="p-4 space-y-6 overflow-y-auto h-full">
            <div>
              <h4 className="text-slate-200 font-medium mb-2">Top Employees</h4>
              <ul className="space-y-2">
                {top.map(({ a, emp }) => (
                  <li key={a.id} className="flex items-center justify-between rounded-xl bg-slate-800/60 border border-slate-700 p-3">
                    <div>
                      <div className="text-slate-100">{emp!.name}</div>
                      <div className="text-slate-400 text-xs">{emp!.department} • {emp!.role}</div>
                    </div>
                    <div className="flex items-center gap-2 text-slate-200">
                      <span className="tabular-nums">{a.proficiency}/5</span>
                      {a.verified && <ShieldCheck className="h-4 w-4 text-emerald-400" />}
                    </div>
                  </li>
                ))}
                {top.length === 0 && <div className="text-slate-400 text-sm">No assignments yet.</div>}
              </ul>
            </div>

            <div>
              <h4 className="text-slate-200 font-medium mb-2">Endorsements</h4>
              <EndorsementsList items={asg.flatMap(a => a.endorsements.map(e => ({ ...e, employeeId: a.employeeId })))} />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
