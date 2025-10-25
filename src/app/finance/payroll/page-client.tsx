"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Plus, FileDown, PlayCircle, ChevronDown } from "lucide-react";
import { usePayrollStore } from "@/store/usePayrollStore";
import { useToast } from "@/components/toast";
import { EmployeePayrollDetailsDrawer } from "@/components/employee-payroll-details-drawer";
import {
  Employee,
  SalaryStructure,
  PayrollRecord,
  PayrollFilters,
} from "@/types/payroll";
import { PayrollOverview } from "@/components/payroll-overview";
import { PayrollEmployeesTable } from "@/components/payroll-employees-table";
import { PayrollSalaryStructures } from "@/components/payroll-salary-structures";
import { PayrollTaxDeductions } from "@/components/payroll-tax-deductions";
import { PayrollPaymentsTable } from "@/components/payroll-payments-table";
import { PayrollReports } from "@/components/payroll-reports";
import { SalaryStructureModal } from "@/components/payroll-modals";

import { X } from "lucide-react";

interface AddEmployeeSalaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  employees: Employee[];
  onSave: (data: { employeeId: string; amount: number; paymentDate: string; note?: string }) => void;
}

function AddEmployeeSalaryModal({ isOpen, onClose, employees, onSave }: AddEmployeeSalaryModalProps) {
  const [employeeId, setEmployeeId] = useState("");
  const [amount, setAmount] = useState(0);
  const [paymentDate, setPaymentDate] = useState("");
  const [note, setNote] = useState("");

  useEffect(() => {
    if (isOpen) {
      setEmployeeId("");
      setAmount(0);
      setPaymentDate("");
      setNote("");
    }
  }, [isOpen]);

  const handleSave = () => {
    if (!employeeId || !amount || !paymentDate) return;
    onSave({ employeeId, amount, paymentDate, note });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0  bg-opacity-50 flex items-center justify-center z-50 p-4"
        >
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            style={{ background: 'var(--card-bg)', borderRadius: 16, boxShadow: '0 8px 32px 0 rgba(0,0,0,0.25)' }}
            className="max-w-md w-full max-h-[90vh] overflow-y-auto"
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 24, borderBottom: '1px solid var(--border)', position: 'sticky', top: 0, background: 'var(--card-bg)', zIndex: 1 }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--foreground)' }}>
                Add Employee Salary
              </h2>
              <button
                onClick={onClose}
                style={{ padding: 8, borderRadius: 8, background: 'none', transition: 'background 0.2s', cursor: 'pointer' }}
                onMouseOver={e => (e.currentTarget.style.background = 'var(--sidebar-hover)')}
                onMouseOut={e => (e.currentTarget.style.background = 'none')}
              >
                <X size={20} color="var(--secondary)" />
              </button>
            </div>
            <div style={{ padding: 24 }} className="space-y-4">
              <div>
                <label className="block text-sm font-medium" style={{ color: 'var(--secondary)', marginBottom: 8 }}>
                  Employee *
                </label>
                <select
                  value={employeeId}
                  onChange={e => setEmployeeId(e.target.value)}
                  style={{ width: '100%', padding: '8px 16px', border: '1px solid var(--border)', borderRadius: 8, background: 'var(--background)', color: 'var(--foreground)', outline: 'none', fontSize: '1rem' }}
                >
                  <option value="">Select employee</option>
                  {employees.map(emp => (
                    <option key={emp.id} value={emp.id}>{emp.name} ({emp.employeeId})</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium" style={{ color: 'var(--secondary)', marginBottom: 8 }}>
                  Amount *
                </label>
                <input
                  type="number"
                  value={amount}
                  onChange={e => setAmount(Number(e.target.value))}
                  placeholder="Enter amount"
                  style={{ width: '100%', padding: '8px 16px', border: '1px solid var(--border)', borderRadius: 8, background: 'var(--background)', color: 'var(--foreground)', outline: 'none', fontSize: '1rem' }}
                />
              </div>
              <div>
                <label className="block text-sm font-medium" style={{ color: 'var(--secondary)', marginBottom: 8 }}>
                  Payment Date *
                </label>
                <input
                  type="date"
                  value={paymentDate}
                  onChange={e => setPaymentDate(e.target.value)}
                  style={{ width: '100%', padding: '8px 16px', border: '1px solid var(--border)', borderRadius: 8, background: 'var(--background)', color: 'var(--foreground)', outline: 'none', fontSize: '1rem' }}
                />
              </div>
              <div>
                <label className="block text-sm font-medium" style={{ color: 'var(--secondary)', marginBottom: 8 }}>
                  Note
                </label>
                <textarea
                  value={note}
                  onChange={e => setNote(e.target.value)}
                  placeholder="Optional note"
                  style={{ width: '100%', padding: '8px 16px', border: '1px solid var(--border)', borderRadius: 8, background: 'var(--background)', color: 'var(--foreground)', outline: 'none', fontSize: '1rem', minHeight: 60 }}
                />
              </div>
            </div>
            <div style={{ borderTop: '1px solid var(--border)', padding: 24, background: 'var(--background)', display: 'flex', gap: 12, position: 'sticky', bottom: 0 }}>
              <button
                onClick={onClose}
                style={{ flex: 1, padding: '10px 0', border: '1px solid var(--border)', borderRadius: 8, background: 'var(--background)', color: 'var(--secondary)', fontWeight: 500, fontSize: 16, cursor: 'pointer', transition: 'background 0.2s' }}
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                style={{ flex: 1, padding: '10px 0', borderRadius: 8, background: '#2563eb', color: '#fff', fontWeight: 600, fontSize: 16, cursor: 'pointer', border: 'none', transition: 'background 0.2s' }}
                disabled={!employeeId || !amount || !paymentDate}
              >
                Save
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}


type TabType =
  | "overview"
  | "employees"
  | "salarystructures"
  | "taxdeductions"
  | "payments"
  | "reports";

const MOCK_EMPLOYEES: Employee[] = [
  {
    id: "emp-001",
    employeeId: "E001",
    name: "John Smith",
    email: "john@company.com",
    phone: "+1-555-0101",
    department: "Engineering",
    position: "Senior Developer",
    baseSalary: 85000,
    salaryStructureId: "struct-001",
    joinDate: "2022-01-15",
    status: "Active",
    createdAt: "2022-01-15T00:00:00Z",
    updatedAt: "2024-01-15T00:00:00Z",
  },
  {
    id: "emp-002",
    employeeId: "E002",
    name: "Sarah Johnson",
    email: "sarah@company.com",
    phone: "+1-555-0102",
    department: "HR",
    position: "HR Manager",
    baseSalary: 72000,
    salaryStructureId: "struct-002",
    joinDate: "2021-06-10",
    status: "Active",
    createdAt: "2021-06-10T00:00:00Z",
    updatedAt: "2024-01-15T00:00:00Z",
  },
  {
    id: "emp-003",
    employeeId: "E003",
    name: "Michael Brown",
    email: "michael@company.com",
    phone: "+1-555-0103",
    department: "Sales",
    position: "Sales Lead",
    baseSalary: 65000,
    salaryStructureId: "struct-003",
    joinDate: "2022-03-20",
    status: "Active",
    createdAt: "2022-03-20T00:00:00Z",
    updatedAt: "2024-01-15T00:00:00Z",
  },
  {
    id: "emp-004",
    employeeId: "E004",
    name: "Emily Davis",
    email: "emily@company.com",
    phone: "+1-555-0104",
    department: "Finance",
    position: "Finance Analyst",
    baseSalary: 68000,
    salaryStructureId: "struct-002",
    joinDate: "2022-11-05",
    status: "Active",
    createdAt: "2022-11-05T00:00:00Z",
    updatedAt: "2024-01-15T00:00:00Z",
  },
];

const MOCK_SALARY_STRUCTURES: SalaryStructure[] = [
  {
    id: "struct-001",
    name: "Senior Developer",
    department: "Engineering",
    components: [
      {
        id: "comp-001",
        name: "Base Salary",
        type: "base",
        amount: 85000,
      },
      {
        id: "comp-002",
        name: "Performance Bonus",
        type: "bonus",
        amount: 10000,
      },
      {
        id: "comp-003",
        name: "Housing Allowance",
        type: "allowance",
        amount: 5000,
      },
    ],
    baseAmount: 85000,
    totalAllowances: 5000,
    totalDeductions: 10000,
    netSalary: 80000,
    createdAt: "2023-01-01T00:00:00Z",
    updatedAt: "2023-01-01T00:00:00Z",
  },
  {
    id: "struct-002",
    name: "Manager",
    department: "General",
    components: [
      {
        id: "comp-004",
        name: "Base Salary",
        type: "base",
        amount: 70000,
      },
      {
        id: "comp-005",
        name: "Allowance",
        type: "allowance",
        amount: 5000,
      },
    ],
    baseAmount: 70000,
    totalAllowances: 5000,
    totalDeductions: 8500,
    netSalary: 66500,
    createdAt: "2023-01-01T00:00:00Z",
    updatedAt: "2023-01-01T00:00:00Z",
  },
  {
    id: "struct-003",
    name: "Sales Executive",
    department: "Sales",
    components: [
      {
        id: "comp-006",
        name: "Base Salary",
        type: "base",
        amount: 60000,
      },
      {
        id: "comp-007",
        name: "Commission",
        type: "bonus",
        amount: 5000,
      },
    ],
    baseAmount: 60000,
    totalAllowances: 0,
    totalDeductions: 8000,
    netSalary: 52000,
    createdAt: "2023-01-01T00:00:00Z",
    updatedAt: "2023-01-01T00:00:00Z",
  },
];

export function PayrollPageClient() {
  const {
    employees,
    salaryStructures,
    taxRules,
    payrollRecords,
    filters,
    selectedEmployee,
    selectedPayroll,
    setEmployees,
    setSalaryStructures,
    setPayrollRecords,
    setFilters,
    setSelectedEmployee,
    setSelectedPayroll,
    addSalaryStructure,
    updateSalaryStructure,
    deleteSalaryStructure,
    duplicateSalaryStructure,
    archiveSalaryStructure,
    saveTaxRules,
    processPayroll,
    updatePayrollRecord,
    getPayrollSummary,
    filterPayrolls,
    getDepartmentStats,
    getMonthlyTrend,
    generatePayrollReport,
  } = usePayrollStore();

  const [activeTab, setActiveTab] = useState<TabType>("overview");
  const [isStructureModalOpen, setIsStructureModalOpen] = useState(false);
  const [isEmployeeDetailsOpen, setIsEmployeeDetailsOpen] = useState(false);
  const [selectedStructure, setSelectedStructure] = useState<SalaryStructure | null>(null);
  const { showToast } = useToast();

  const [isAddPaymentModalOpen, setIsAddPaymentModalOpen] = useState(false);

  useEffect(() => {
    if (employees.length === 0) {
      setEmployees(MOCK_EMPLOYEES);
    }
    if (salaryStructures.length === 0) {
      setSalaryStructures(MOCK_SALARY_STRUCTURES);
    }
  }, []);

  const payrollSummary = getPayrollSummary();
  const monthlyTrend = getMonthlyTrend();
  const departmentStats = getDepartmentStats();
  const filteredPayrolls = filterPayrolls();


  const handleAddStructure = () => {
    setSelectedStructure(null);
    setIsStructureModalOpen(true);
  };

  const handleAddEmployeePayment = () => {
    setIsAddPaymentModalOpen(true);
  };

  const handleSaveEmployeePayment = (data: { employeeId: string; amount: number; paymentDate: string; note?: string }) => {
    // Here you would update the payroll store or add a new payroll record
    // For now, just show a toast
    showToast("Employee payment/salary added successfully", "success");
    setIsAddPaymentModalOpen(false);
  };

  const handleEditStructure = (structure: SalaryStructure) => {
    setSelectedStructure(structure);
    setIsStructureModalOpen(true);
  };

  const handleSaveStructure = (structure: SalaryStructure) => {
    if (selectedStructure) {
      updateSalaryStructure(selectedStructure.id, structure);
      showToast("Salary structure updated successfully", "success");
    } else {
      addSalaryStructure(structure);
      showToast("Salary structure created successfully", "success");
    }
  };

  const handleViewEmployeeDetails = (employee: Employee) => {
    const payroll = payrollRecords.find((p) => p.employeeId === employee.id);
    setSelectedEmployee(employee);
    setSelectedPayroll(payroll || null);
    setIsEmployeeDetailsOpen(true);
  };

  const handleProcessPayroll = () => {
    const currentMonth = new Date().getMonth() + 1;
    const currentYear = new Date().getFullYear();
    processPayroll(currentMonth, currentYear);
    showToast("Payroll processed successfully", "success");
  };

  const handleExportReport = (format: "pdf" | "excel", reportFilters: any) => {
    const report = generatePayrollReport(
      reportFilters.month,
      reportFilters.year,
      format === "pdf" ? "json" : "csv"
    );

    const element = document.createElement("a");
    if (format === "pdf") {
      element.setAttribute(
        "href",
        "data:application/json;charset=utf-8," + encodeURIComponent(report)
      );
      element.setAttribute(
        "download",
        `payroll-report-${reportFilters.month}-${reportFilters.year}.json`
      );
    } else {
      element.setAttribute(
        "href",
        "data:text/csv;charset=utf-8," + encodeURIComponent(report)
      );
      element.setAttribute(
        "download",
        `payroll-report-${reportFilters.month}-${reportFilters.year}.csv`
      );
    }
    element.style.display = "none";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const tabs: Array<{ id: TabType; label: string }> = [
    { id: "overview", label: "Overview" },
    { id: "employees", label: "Employees" },
    { id: "salarystructures", label: "Salary Structures" },
    { id: "taxdeductions", label: "Tax & Deductions" },
    { id: "payments", label: "Payments" },
    { id: "reports", label: "Reports" },
  ];

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ background: 'transparent', border: '1px solid var(--border)' }}
        className="rounded-xl p-6"
      >
        <h1 className="text-3xl font-bold" style={{ color: 'var(--foreground)', marginBottom: 8 }}>
          Payroll Management
        </h1>
        <p style={{ color: 'var(--secondary)', marginBottom: 16 }}>
          Manage employee payroll, salary structures, deductions, and payment processing.
        </p>
        <div className="flex flex-wrap gap-2">
          <span className="text-sm px-3 py-1 rounded-full border" style={{ background: 'var(--background)', borderColor: 'var(--border)', color: 'var(--secondary)' }}>
            Finance
          </span>
          <span className="text-sm px-3 py-1 rounded-full border" style={{ background: 'var(--background)', borderColor: 'var(--border)', color: 'var(--secondary)' }}>
            Payroll
          </span>
        </div>
      </motion.div>

      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={handleAddStructure}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus size={18} />
            Add Salary Structure
          </button>
          <button
            onClick={handleAddEmployeePayment}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            <Plus size={18} />
            Add Employee Salary
          </button>
          <button
            onClick={handleProcessPayroll}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <PlayCircle size={18} />
            Process Payroll
          </button>
        </div>
        <button
          className="flex items-center gap-2 px-4 py-2 rounded-lg transition-colors group"
          style={{ background: 'var(--background)', border: '1px solid var(--border)', color: 'var(--secondary)' }}
        >
          <FileDown size={18} className="group-hover:text-blue-600" />
          <span className="flex items-center gap-1">
            Export Report
            <ChevronDown size={16} />
          </span>
        </button>
      </div>

  <div className="rounded-xl shadow-md overflow-hidden" style={{ background: 'transparent', border: '1px solid var(--border)' }}>
        <div className="flex overflow-x-auto" style={{ borderBottom: '1px solid var(--border)' }}>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-4 text-sm font-medium transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? "border-b-2 border-blue-600 text-blue-600"
                  : "text-[var(--secondary)] hover:text-[var(--foreground)]"
              }`}
              style={activeTab === tab.id ? {} : { borderBottom: '2px solid transparent' }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="p-6">
          {activeTab === "overview" && (
            <PayrollOverview
              totalEmployees={payrollSummary.totalEmployees}
              pendingPayments={payrollSummary.pendingPayments}
              totalSalaryPaid={payrollSummary.totalSalaryPaid}
              upcomingDeductions={payrollSummary.upcomingDeductions}
              monthlyTrend={monthlyTrend}
              departmentStats={departmentStats}
              onGeneratePayroll={handleProcessPayroll}
              onSendPayslips={() =>
                showToast("Payslips sent to all employees", "success")
              }
              onReviewTaxes={() => setActiveTab("taxdeductions")}
            />
          )}

          {activeTab === "employees" && (
            <PayrollEmployeesTable
              employees={employees}
              payrollRecords={payrollRecords}
              onViewDetails={handleViewEmployeeDetails}
              onEdit={(emp) => showToast("Edit employee feature coming soon", "info")}
              onDelete={(id) => {
                showToast("Employee deleted successfully", "success");
              }}
              filters={filters}
              onFilterChange={setFilters}
            />
          )}

          {activeTab === "salarystructures" && (
            <PayrollSalaryStructures
              structures={salaryStructures}
              onAdd={handleAddStructure}
              onEdit={handleEditStructure}
              onDelete={(id) => {
                deleteSalaryStructure(id);
                showToast("Salary structure deleted", "success");
              }}
              onDuplicate={(id) => {
                duplicateSalaryStructure(id);
                showToast("Salary structure duplicated", "success");
              }}
              onArchive={(id) => {
                archiveSalaryStructure(id);
                showToast("Salary structure archived", "success");
              }}
            />
          )}

          {activeTab === "taxdeductions" && (
            <PayrollTaxDeductions
              taxRules={taxRules}
              onSave={(rules) => {
                saveTaxRules(rules);
                showToast("Tax rules updated successfully", "success");
              }}
            />
          )}

          {activeTab === "payments" && (
            <PayrollPaymentsTable
              payments={filteredPayrolls}
              onProcessPayroll={handleProcessPayroll}
              onUpdateStatus={(id, status) => {
                updatePayrollRecord(id, { paymentStatus: status, paymentDate: new Date().toISOString() });
              }}
              onExport={(format) => {
                showToast(`Exporting as ${format.toUpperCase()}...`, "info");
              }}
              filters={{
                status: filters.status as any,
                month: filters.month,
                year: filters.year,
              }}
              onFilterChange={setFilters}
            />
          )}

          {activeTab === "reports" && (
            <PayrollReports
              onExportReport={handleExportReport}
              onPrint={(reportFilters) => {
                window.print();
              }}
            />
          )}
        </div>
      </div>

      <SalaryStructureModal
        isOpen={isStructureModalOpen}
        onClose={() => {
          setIsStructureModalOpen(false);
          setSelectedStructure(null);
        }}
        structure={selectedStructure}
        onSave={handleSaveStructure}
      />

      <AddEmployeeSalaryModal
        isOpen={isAddPaymentModalOpen}
        onClose={() => setIsAddPaymentModalOpen(false)}
        employees={employees}
        onSave={handleSaveEmployeePayment}
      />

      <EmployeePayrollDetailsDrawer
        isOpen={isEmployeeDetailsOpen}
        onClose={() => {
          setIsEmployeeDetailsOpen(false);
          setSelectedEmployee(null);
          setSelectedPayroll(null);
        }}
        employee={selectedEmployee}
        payroll={selectedPayroll}
      />
    </div>
  );
}
