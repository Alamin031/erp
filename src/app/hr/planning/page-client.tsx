"use client";

import { useEffect, useMemo, useState } from "react";
import { DashboardLayout } from "@/app/dashboard-layout";
import { usePlanning } from "@/store/usePlanning";
import { ToastContainer, useToast } from "@/components/toast";
import { Plus, Download, Upload, Search } from "lucide-react";
import { PlannerSidebar } from "./components/PlannerSidebar";
import { EmployeeScheduleCalendar } from "./components/EmployeeScheduleCalendar";
import { ResourceUtilizationChart } from "./components/ResourceUtilizationChart";
import { TeamAvailabilityPanel } from "./components/TeamAvailabilityPanel";
import { ScheduleTable } from "./components/ScheduleTable";
import { ShiftAssignmentModal } from "./components/ShiftAssignmentModal";
import { ExportScheduleMenu } from "./components/ExportScheduleMenu";

export function PlanningPageClient() {
  const { loadDemoData, shifts, employees, getUtilizationStats } = usePlanning();
  const { showToast } = useToast();
  const [openAssign, setOpenAssign] = useState(false);
  const [editShiftId, setEditShiftId] = useState<string | null>(null);
  const [q, setQ] = useState("");

  useEffect(() => {
    if (employees.length === 0 || shifts.length === 0) loadDemoData();
  }, [loadDemoData, employees.length, shifts.length]);

  const stats = useMemo(() => getUtilizationStats(), [getUtilizationStats]);

  return (
    <div className="dashboard-container">
      <div className="dashboard-header-content">
        <div>
          <h1 className="dashboard-page-title">HR Planning</h1>
          <p className="dashboard-subtitle">Manage your employees' schedule and resource planning</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-slate-400" />
            <input aria-label="Search employees" value={q} onChange={e=> setQ(e.target.value)} placeholder="Search employees..." className="pl-8 pr-3 py-2 rounded-xl bg-slate-800/60 text-slate-100 placeholder:text-slate-400 border border-slate-700" />
          </div>
          <ExportScheduleMenu />
          <button onClick={() => setOpenAssign(true)} className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-indigo-500 text-black hover:bg-indigo-400 shadow-lg">
            <Plus className="h-4 w-4" /> Add Shift
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 space-y-6">
          <div className="rounded-2xl bg-zinc-800/70 border border-zinc-700 p-4 shadow-lg">
            <EmployeeScheduleCalendar />
          </div>

          <div className="rounded-2xl bg-zinc-800/70 border border-zinc-700 p-4 shadow-lg">
            <h3 className="text-zinc-100 font-semibold mb-3">Scheduled Shifts</h3>
            <ScheduleTable onEdit={(id)=> setEditShiftId(id)} />
          </div>
        </div>

        <aside className="space-y-6">
          <PlannerSidebar stats={stats} onAdd={() => setOpenAssign(true)} />
          <div className="rounded-2xl bg-zinc-800/70 border border-zinc-700 p-4 shadow-lg">
            <h3 className="text-zinc-100 font-semibold mb-3">Utilization</h3>
            <ResourceUtilizationChart />
          </div>

          <div className="rounded-2xl bg-zinc-800/70 border border-zinc-700 p-4 shadow-lg">
            <h3 className="text-zinc-100 font-semibold mb-3">Team Availability</h3>
            <TeamAvailabilityPanel />
          </div>
        </aside>
      </div>

      <ToastContainer />

      {openAssign && (
        <ShiftAssignmentModal open={openAssign} onClose={() => setOpenAssign(false)} onSaved={() => { setOpenAssign(false); showToast({ title: 'Shift assigned', type: 'success' }); }} />
      )}

      {editShiftId && (
        <ShiftAssignmentModal open={!!editShiftId} editId={editShiftId!} onClose={() => setEditShiftId(null)} onSaved={() => { setEditShiftId(null); showToast({ title: 'Shift updated', type: 'success' }); }} />
      )}
    </div>
  );
}
