import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  Employee,
  SalaryStructure,
  TaxRules,
  PayrollRecord,
  PayrollSummary,
  PayrollFilters,
  SalaryComponent,
} from "@/types/payroll";

interface PayrollStore {
  employees: Employee[];
  salaryStructures: SalaryStructure[];
  taxRules: TaxRules;
  payrollRecords: PayrollRecord[];
  payrollSummary: PayrollSummary;
  filters: PayrollFilters;
  selectedEmployee: Employee | null;
  selectedPayroll: PayrollRecord | null;

  setEmployees: (employees: Employee[]) => void;
  setSalaryStructures: (structures: SalaryStructure[]) => void;
  setTaxRules: (rules: TaxRules) => void;
  setPayrollRecords: (records: PayrollRecord[]) => void;
  setFilters: (filters: PayrollFilters) => void;
  setSelectedEmployee: (employee: Employee | null) => void;
  setSelectedPayroll: (payroll: PayrollRecord | null) => void;

  addSalaryStructure: (structure: SalaryStructure) => void;
  updateSalaryStructure: (id: string, structure: Partial<SalaryStructure>) => void;
  deleteSalaryStructure: (id: string) => void;
  duplicateSalaryStructure: (id: string) => void;
  archiveSalaryStructure: (id: string) => void;

  addEmployee: (employee: Employee) => void;
  updateEmployee: (id: string, employee: Partial<Employee>) => void;
  deleteEmployee: (id: string) => void;

  calculateNetPay: (
    baseSalary: number,
    allowances: number,
    structureId?: string
  ) => {
    netPay: number;
    incomeTax: number;
    providentFund: number;
    insurance: number;
    otherDeductions: number;
    totalDeductions: number;
  };

  saveTaxRules: (rules: Partial<TaxRules>) => void;

  processPayroll: (month: number, year: number, employeeIds?: string[]) => void;
  updatePayrollRecord: (id: string, updates: Partial<PayrollRecord>) => void;
  lockPayrollRecord: (id: string) => void;
  unlockPayrollRecord: (id: string) => void;

  generatePayrollReport: (
    month: number,
    year: number,
    format?: "csv" | "json"
  ) => string;

  getPayrollSummary: () => PayrollSummary;
  filterPayrolls: () => PayrollRecord[];
  getDepartmentStats: () => Record<string, { count: number; totalSalary: number }>;
  getMonthlyTrend: () => Array<{ month: string; expense: number; paid: number }>;
}

const defaultTaxRules: TaxRules = {
  incomeTaxPercentage: 10,
  providentFundPercentage: 12,
  insurancePercentage: 5,
  otherDeductions: {},
  updatedAt: new Date().toISOString(),
};

export const usePayrollStore = create<PayrollStore>()(
  persist(
    (set, get) => ({
      employees: [],
      salaryStructures: [],
      taxRules: defaultTaxRules,
      payrollRecords: [],
      payrollSummary: {
        totalEmployees: 0,
        pendingPayments: 0,
        totalSalaryPaid: 0,
        upcomingDeductions: 0,
        monthlyExpense: 0,
        averageNetPay: 0,
        paymentDate: new Date().toISOString(),
      },
      filters: {
        department: "",
        status: "",
        month: new Date().getMonth() + 1,
        year: new Date().getFullYear(),
        searchQuery: "",
      },
      selectedEmployee: null,
      selectedPayroll: null,

      setEmployees: (employees) => set({ employees }),

      setSalaryStructures: (structures) => set({ salaryStructures: structures }),

      setTaxRules: (rules) => set({ taxRules: rules }),

      setPayrollRecords: (records) => set({ payrollRecords: records }),

      setFilters: (filters) => set({ filters }),

      setSelectedEmployee: (employee) => set({ selectedEmployee: employee }),

      setSelectedPayroll: (payroll) => set({ selectedPayroll: payroll }),

      addSalaryStructure: (structure) => {
        set((state) => ({
          salaryStructures: [...state.salaryStructures, structure],
        }));
      },

      updateSalaryStructure: (id, updates) => {
        set((state) => ({
          salaryStructures: state.salaryStructures.map((s) =>
            s.id === id
              ? {
                  ...s,
                  ...updates,
                  updatedAt: new Date().toISOString(),
                }
              : s
          ),
        }));
      },

      deleteSalaryStructure: (id) => {
        set((state) => ({
          salaryStructures: state.salaryStructures.filter((s) => s.id !== id),
        }));
      },

      duplicateSalaryStructure: (id) => {
        const { salaryStructures } = get();
        const structure = salaryStructures.find((s) => s.id === id);
        if (structure) {
          const newStructure: SalaryStructure = {
            ...structure,
            id: `struct-${Date.now()}`,
            name: `${structure.name} (Copy)`,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };
          set((state) => ({
            salaryStructures: [...state.salaryStructures, newStructure],
          }));
        }
      },

      archiveSalaryStructure: (id) => {
        set((state) => ({
          salaryStructures: state.salaryStructures.map((s) =>
            s.id === id
              ? { ...s, archived: true, updatedAt: new Date().toISOString() }
              : s
          ),
        }));
      },

      addEmployee: (employee) => {
        set((state) => ({
          employees: [...state.employees, employee],
        }));
      },

      updateEmployee: (id, updates) => {
        set((state) => ({
          employees: state.employees.map((e) =>
            e.id === id
              ? {
                  ...e,
                  ...updates,
                  updatedAt: new Date().toISOString(),
                }
              : e
          ),
        }));
      },

      deleteEmployee: (id) => {
        set((state) => ({
          employees: state.employees.filter((e) => e.id !== id),
        }));
      },

      calculateNetPay: (baseSalary, allowances, structureId) => {
        const { taxRules, salaryStructures } = get();
        const grossSalary = baseSalary + allowances;

        const incomeTax = (grossSalary * taxRules.incomeTaxPercentage) / 100;
        const providentFund = (baseSalary * taxRules.providentFundPercentage) / 100;
        const insurance = (grossSalary * taxRules.insurancePercentage) / 100;

        let otherDeductions = 0;
        Object.values(taxRules.otherDeductions).forEach((val) => {
          otherDeductions += val;
        });

        const totalDeductions =
          incomeTax + providentFund + insurance + otherDeductions;
        const netPay = grossSalary - totalDeductions;

        return {
          netPay: Math.max(0, netPay),
          incomeTax,
          providentFund,
          insurance,
          otherDeductions,
          totalDeductions,
        };
      },

      saveTaxRules: (rules) => {
        set((state) => ({
          taxRules: {
            ...state.taxRules,
            ...rules,
            updatedAt: new Date().toISOString(),
          },
        }));
      },

      processPayroll: (month, year, employeeIds) => {
        const { employees, calculateNetPay, payrollRecords } = get();
        const now = new Date().toISOString();

        const employeesToProcess = employeeIds
          ? employees.filter((e) => employeeIds.includes(e.id))
          : employees.filter((e) => e.status === "Active");

        const newRecords: PayrollRecord[] = employeesToProcess.map((emp) => {
          const { netPay, incomeTax, providentFund, insurance, otherDeductions } =
            calculateNetPay(emp.baseSalary, emp.baseSalary * 0.15);

          return {
            id: `payroll-${Date.now()}-${emp.id}`,
            employeeId: emp.id,
            employee: emp,
            period: `${month}/${year}`,
            month,
            year,
            baseSalary: emp.baseSalary,
            allowances: emp.baseSalary * 0.15,
            deductions: incomeTax + providentFund + insurance + otherDeductions,
            netPay,
            incomeTax,
            providentFund,
            insurance,
            otherDeductions,
            paymentStatus: "Pending" as const,
            locked: false,
            createdAt: now,
            updatedAt: now,
          };
        });

        set((state) => ({
          payrollRecords: [...state.payrollRecords, ...newRecords],
        }));
      },

      updatePayrollRecord: (id, updates) => {
        set((state) => ({
          payrollRecords: state.payrollRecords.map((record) =>
            record.id === id
              ? {
                  ...record,
                  ...updates,
                  updatedAt: new Date().toISOString(),
                }
              : record
          ),
        }));
      },

      lockPayrollRecord: (id) => {
        get().updatePayrollRecord(id, { locked: true });
      },

      unlockPayrollRecord: (id) => {
        get().updatePayrollRecord(id, { locked: false });
      },

      generatePayrollReport: (month, year, format = "json") => {
        const { payrollRecords } = get();
        const records = payrollRecords.filter(
          (r) => r.month === month && r.year === year
        );

        if (format === "csv") {
          const headers = [
            "Employee ID",
            "Name",
            "Base Salary",
            "Allowances",
            "Deductions",
            "Net Pay",
            "Status",
          ];
          const rows = records.map((r) => [
            r.employeeId,
            r.employee?.name || "Unknown",
            r.baseSalary.toFixed(2),
            r.allowances.toFixed(2),
            r.deductions.toFixed(2),
            r.netPay.toFixed(2),
            r.paymentStatus,
          ]);

          const csv = [
            headers.join(","),
            ...rows.map((row) => row.join(",")),
          ].join("\n");

          return csv;
        }

        return JSON.stringify(records, null, 2);
      },

      getPayrollSummary: () => {
        const { employees, payrollRecords } = get();
        const currentMonth = new Date().getMonth() + 1;
        const currentYear = new Date().getFullYear();

        const monthRecords = payrollRecords.filter(
          (r) => r.month === currentMonth && r.year === currentYear
        );

        const totalSalaryPaid = monthRecords
          .filter((r) => r.paymentStatus === "Paid")
          .reduce((sum, r) => sum + r.netPay, 0);

        const pendingPayments = monthRecords.filter(
          (r) => r.paymentStatus === "Pending"
        ).length;

        const totalDeductions = monthRecords.reduce(
          (sum, r) => sum + r.deductions,
          0
        );

        const monthlyExpense = monthRecords.reduce(
          (sum, r) => sum + r.netPay + r.deductions,
          0
        );

        const averageNetPay =
          monthRecords.length > 0
            ? monthRecords.reduce((sum, r) => sum + r.netPay, 0) /
              monthRecords.length
            : 0;

        return {
          totalEmployees: employees.filter((e) => e.status === "Active").length,
          pendingPayments,
          totalSalaryPaid,
          upcomingDeductions: totalDeductions,
          monthlyExpense,
          averageNetPay,
          paymentDate: new Date().toISOString(),
        };
      },

      filterPayrolls: () => {
        const { payrollRecords, filters } = get();
        let filtered = payrollRecords;

        if (filters.searchQuery) {
          const query = filters.searchQuery.toLowerCase();
          filtered = filtered.filter(
            (r) =>
              r.employee?.name.toLowerCase().includes(query) ||
              r.employeeId.toLowerCase().includes(query)
          );
        }

        if (filters.status) {
          filtered = filtered.filter((r) => r.paymentStatus === filters.status);
        }

        if (filters.month) {
          filtered = filtered.filter((r) => r.month === filters.month);
        }

        if (filters.year) {
          filtered = filtered.filter((r) => r.year === filters.year);
        }

        if (filters.department) {
          filtered = filtered.filter(
            (r) => r.employee?.department === filters.department
          );
        }

        return filtered;
      },

      getDepartmentStats: () => {
        const { payrollRecords } = get();
        const stats: Record<string, { count: number; totalSalary: number }> = {};

        payrollRecords.forEach((record) => {
          const dept = record.employee?.department || "Unknown";
          if (!stats[dept]) {
            stats[dept] = { count: 0, totalSalary: 0 };
          }
          stats[dept].count++;
          stats[dept].totalSalary += record.netPay;
        });

        return stats;
      },

      getMonthlyTrend: () => {
        const { payrollRecords } = get();
        const trends: Record<string, { expense: number; paid: number }> = {};

        payrollRecords.forEach((record) => {
          const key = `${record.month}/${record.year}`;
          if (!trends[key]) {
            trends[key] = { expense: 0, paid: 0 };
          }
          trends[key].expense += record.netPay + record.deductions;
          if (record.paymentStatus === "Paid") {
            trends[key].paid += record.netPay;
          }
        });

        return Object.entries(trends)
          .sort(([a], [b]) => {
            const [aMonth, aYear] = a.split("/").map(Number);
            const [bMonth, bYear] = b.split("/").map(Number);
            return aYear - bYear || aMonth - bMonth;
          })
          .map(([month, data]) => ({
            month,
            expense: Math.round(data.expense),
            paid: Math.round(data.paid),
          }));
      },
    }),
    {
      name: "payroll-store",
    }
  )
);
