"use client";

import { useEffect, useMemo, useState } from "react";
import { useSkills } from "@/store/useSkills";
import { ToastContainer, useToast } from "@/components/toast";
import { Plus, Search, Upload, Download } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { SkillsTable } from "./components/SkillsTable";
import { SkillFormModal } from "./components/SkillFormModal";
import { SkillMatrix } from "./components/SkillMatrix";
import { ProficiencyRadar } from "./components/ProficiencyRadar";
import { TrainingRecommendations } from "./components/TrainingRecommendations";
import { ImportExportControls } from "./components/ImportExportControls";

export function SkillsPageClient() {
  const { loadDemoData, skills, assignments, employees, setSearchQuery } = useSkills();
  const { showToast } = useToast();
  const [openNew, setOpenNew] = useState(false);
  const [q, setQ] = useState("");

  useEffect(() => {
    if (skills.length === 0 || employees.length === 0) {
      loadDemoData();
    }
  }, [loadDemoData, skills.length, employees.length]);

  useEffect(() => { setSearchQuery(q); }, [q, setSearchQuery]);

  const kpis = useMemo(() => {
    const totalSkills = skills.length;
    const totalAssignments = assignments.length;
    const endorsed = assignments.reduce((acc, a) => acc + (a.endorsements?.length || 0), 0);
    const verified = assignments.filter(a => a.verified).length;
    const verifiedRate = totalAssignments ? Math.round((verified / totalAssignments) * 100) : 0;
    return { totalSkills, totalAssignments, endorsed, verifiedRate };
  }, [skills, assignments]);

  return (
    <div className="dashboard-container">
      <div className="dashboard-header-content">
        <div>
          <h1 className="dashboard-page-title">Skills Management</h1>
          <p className="dashboard-subtitle">Manage employee skills, proficiency, endorsements and training</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-slate-400" />
            <input
              aria-label="Search skills or employees"
              value={q}
              onChange={e => setQ(e.target.value)}
              placeholder="Search skills or employees..."
              className="pl-8 pr-3 py-2 rounded-xl bg-slate-800/60 text-slate-100 placeholder:text-slate-400 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-400/60"
            />
          </div>
          <button
            onClick={() => setOpenNew(true)}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-emerald-500 text-black hover:bg-emerald-400 transition-colors shadow-lg"
          >
            <Plus className="h-4 w-4" /> Add Skill
          </button>
          <ImportExportControls />
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <KPICard label="Skills" value={kpis.totalSkills} />
            <KPICard label="# Assignments" value={kpis.totalAssignments} />
            <KPICard label="Endorsements" value={kpis.endorsed} />
            <KPICard label="Verified" value={`${kpis.verifiedRate}%`} />
          </div>
          <SkillsTable onAdd={() => setOpenNew(true)} />
        </div>
        <div className="space-y-6">
          <div className="rounded-2xl bg-slate-900/60 border border-slate-800 p-4 shadow-lg backdrop-blur-sm">
            <h3 className="text-slate-200 font-semibold mb-3">Skill Coverage</h3>
            <ProficiencyRadar />
          </div>
          <TrainingRecommendations />
        </div>
      </div>

      <div className="mt-8 rounded-2xl bg-slate-900/60 border border-slate-800 p-4 shadow-lg backdrop-blur-sm">
        <h3 className="text-slate-200 font-semibold mb-3">Skill Matrix</h3>
        <SkillMatrix />
      </div>

      <AnimatePresence>
        {openNew && (
          <SkillFormModal
            open={openNew}
            onClose={() => setOpenNew(false)}
            onSaved={() => {
              setOpenNew(false);
              showToast({ title: "Skill created", type: "success" });
            }}
          />
        )}
      </AnimatePresence>

      <ToastContainer />
    </div>
  );
}

function KPICard({ label, value }: { label: string; value: number | string }) {
  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl bg-slate-900/60 border border-slate-800 p-4 shadow-lg">
      <div className="text-slate-400 text-sm">{label}</div>
      <div className="text-slate-100 text-2xl font-semibold mt-1">{value}</div>
    </motion.div>
  );
}
