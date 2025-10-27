export type ShiftStatus = 'scheduled' | 'completed' | 'cancelled' | 'conflict';

export interface Shift {
  id: string;
  employeeId: string;
  department?: string;
  role?: string;
  date: string; // ISO date
  startTime: string; // HH:MM
  endTime: string; // HH:MM
  notes?: string;
  status?: ShiftStatus;
}

export interface PlanningFilters {
  department?: string;
  role?: string;
  dateFrom?: string;
  dateTo?: string;
}

export interface UtilizationSummary {
  totalEmployees: number;
  scheduledShifts: number;
  utilizationPercent: number;
  byDepartment: { name: string; utilization: number }[];
}
