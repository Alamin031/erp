import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Shift, PlanningFilters, UtilizationSummary } from "@/types/planning";
import type { Employee } from "@/types/skill";

interface PlanningState {
  employees: Employee[];
  shifts: Shift[];
  filters: PlanningFilters;
  loading: boolean;
  error?: string;

  loadDemoData: () => Promise<void>;
  assignShift: (shift: Omit<Shift,'id'>) => void;
  updateShift: (id: string, data: Partial<Shift>) => void;
  deleteShift: (id: string) => void;
  filterByDepartment: (dept?: string) => void;
  getUtilizationStats: () => UtilizationSummary;
}

function uid(prefix: string) { return `${prefix}-${Math.random().toString(36).slice(2,8)}-${Date.now().toString(36)}`; }

export const usePlanning = create<PlanningState>()(
  persist((set, get) => ({
    employees: [],
    shifts: [],
    filters: {},
    loading: false,

    async loadDemoData() {
      set({ loading: true });
      try {
        const [employees, shifts, departments] = await Promise.all([
          fetch('/demo/planningEmployees.json').then(r=> r.json()).catch(()=>[]),
          fetch('/demo/planningShifts.json').then(r=> r.json()).catch(()=>[]),
          fetch('/demo/planningDepartments.json').then(r=> r.json()).catch(()=>[]),
        ]);
        set({ employees, shifts, loading: false });
      } catch (e) { console.error(e); set({ loading: false, error: 'Failed to load demo data' }); }
    },

    assignShift(shift) {
      const id = uid('shift');
      const sh = { id, ...shift } as Shift;
      set(state => ({ shifts: [sh, ...state.shifts] }));
    },

    updateShift(id, data) {
      set(state => ({ shifts: state.shifts.map(s => s.id === id ? { ...s, ...data } : s) }));
    },

    deleteShift(id) {
      set(state => ({ shifts: state.shifts.filter(s => s.id !== id) }));
    },

    filterByDepartment(dept) {
      set({ filters: { ...get().filters, department: dept } });
    },

    getUtilizationStats() {
      const employees = get().employees;
      const shifts = get().shifts;
      const totalEmployees = employees.length;
      const scheduledShifts = shifts.length;
      const byDept: Record<string, { hours: number; available: number }> = {};

      shifts.forEach(s => {
        const dur = (() => {
          const [sh, sm] = s.startTime.split(':').map(Number);
          const [eh, em] = s.endTime.split(':').map(Number);
          let diff = (eh*60+em) - (sh*60+sm);
          if (diff < 0) diff += 24*60;
          return diff/60;
        })();
        const dept = s.department || 'Unknown';
        byDept[dept] = byDept[dept] || { hours: 0, available: (employees.filter(e => e.department === dept).length || 1) * 8 };
        byDept[dept].hours += dur;
      });

      const byDepartment = Object.entries(byDept).map(([name, v]) => ({ name, utilization: Math.round((v.hours / Math.max(1, v.available)) * 100) }));
      const totalHours = Object.values(byDept).reduce((acc, v) => acc + v.hours, 0);
      const totalAvailable = Object.values(byDept).reduce((acc, v) => acc + v.available, 0) || 1;
      const utilizationPercent = Math.round((totalHours / totalAvailable) * 100);

      return { totalEmployees, scheduledShifts, utilizationPercent, byDepartment } as UtilizationSummary;
    },

  }), { name: 'planning-store' })
);
