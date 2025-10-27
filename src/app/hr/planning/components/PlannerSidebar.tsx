"use client";

import { usePlanning } from "@/store/usePlanning";
import { Download } from "lucide-react";

export function PlannerSidebar({ stats, onAdd }: { stats: any; onAdd?: () => void }) {
  return (
    <div className="rounded-2xl bg-zinc-800/70 border border-zinc-700 p-4 shadow-lg space-y-4">
      <div className="text-zinc-100 text-lg font-semibold">Overview</div>
      <div className="grid grid-cols-2 gap-2">
        <div className="rounded-xl bg-zinc-900/60 p-3 text-center">
          <div className="text-zinc-400 text-xs">Employees</div>
          <div className="text-zinc-100 font-semibold text-xl">{stats.totalEmployees}</div>
        </div>
        <div className="rounded-xl bg-zinc-900/60 p-3 text-center">
          <div className="text-zinc-400 text-xs">Scheduled</div>
          <div className="text-zinc-100 font-semibold text-xl">{stats.scheduledShifts}</div>
        </div>
        <div className="rounded-xl bg-zinc-900/60 p-3 text-center">
          <div className="text-zinc-400 text-xs">Utilization</div>
          <div className="text-zinc-100 font-semibold text-xl">{stats.utilizationPercent}%</div>
        </div>
        <div className="rounded-xl bg-zinc-900/60 p-3 text-center">
          <div className="text-zinc-400 text-xs">Pending</div>
          <div className="text-zinc-100 font-semibold text-xl">0</div>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <button onClick={onAdd} className="px-3 py-2 rounded-xl bg-indigo-500 text-black">Add Shift</button>
        <button className="px-3 py-2 rounded-xl bg-slate-800 text-zinc-100">Export Schedule</button>
      </div>
    </div>
  );
}
