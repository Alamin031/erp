"use client";

import { useMemo } from "react";
import { usePlanning } from "@/store/usePlanning";
import { Edit2, Trash2 } from "lucide-react";
import { useToast } from "@/components/toast";

export function ScheduleTable({ onEdit }: { onEdit?: (id: string) => void }) {
  const { shifts, employees, deleteShift } = usePlanning();
  const { showToast } = useToast();

  const rows = useMemo(() => {
    return shifts.map(s => {
      const emp = employees.find(e => e.id === s.employeeId);
      const duration = (() => {
        const [sh, sm] = s.startTime.split(':').map(Number);
        const [eh, em] = s.endTime.split(':').map(Number);
        let diff = (eh*60+em) - (sh*60+sm);
        if (diff < 0) diff += 24*60;
        return `${Math.round(diff/60)}h ${diff%60}m`;
      })();
      return { s, emp, duration };
    }).sort((a,b)=> a.s.date.localeCompare(b.s.date));
  }, [shifts, employees]);

  return (
    <div className="overflow-auto">
      <table className="min-w-full text-sm">
        <thead className="text-zinc-400 text-xs">
          <tr>
            <th className="px-3 py-2 text-left">Employee</th>
            <th className="px-3 py-2 text-left">Department</th>
            <th className="px-3 py-2 text-left">Date</th>
            <th className="px-3 py-2 text-left">Shift</th>
            <th className="px-3 py-2 text-left">Duration</th>
            <th className="px-3 py-2 text-left">Status</th>
            <th className="px-3 py-2 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(({ s, emp, duration }) => (
            <tr key={s.id} className="border-t border-zinc-700 hover:bg-zinc-800/40">
              <td className="px-3 py-2 text-zinc-100">{emp?.name}</td>
              <td className="px-3 py-2 text-zinc-300">{s.department}</td>
              <td className="px-3 py-2 text-zinc-300">{s.date}</td>
              <td className="px-3 py-2 text-zinc-200">{s.startTime} - {s.endTime}</td>
              <td className="px-3 py-2 text-zinc-300">{duration}</td>
              <td className="px-3 py-2 text-zinc-300">{s.status}</td>
              <td className="px-3 py-2 text-right">
                <button onClick={() => onEdit?.(s.id)} className="text-slate-300 hover:text-slate-100 mr-3"><Edit2 className="h-4 w-4" /></button>
                <button onClick={() => { if (confirm('Delete shift?')) { deleteShift(s.id); showToast({ title: 'Deleted', type: 'success' }); }}} className="text-rose-400 hover:text-rose-300"><Trash2 className="h-4 w-4" /></button>
              </td>
            </tr>
          ))}
          {rows.length === 0 && <tr><td colSpan={7} className="px-3 py-8 text-center text-zinc-400">No shifts scheduled</td></tr>}
        </tbody>
      </table>
    </div>
  );
}
