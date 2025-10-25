"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Plus, FileDown, PlayCircle, ChevronDown } from "lucide-react";
import { usePayrollStore } from "@/store/usePayrollStore";
import { useToast } from "@/components/toast";
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
import {
  SalaryStructureModal,
  EmployeePayrollDetailsModal,
} from "@/components/payroll-modals";

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
        className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100"
      >
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Payroll Management
        </h1>
        <p className="text-gray-600 mb-4">
          Manage employee payroll, salary structures, deductions, and payment processing.
        </p>
        <div className="flex flex-wrap gap-2">
          <span className="text-sm px-3 py-1 bg-white rounded-full border border-blue-200 text-gray-700">
            Finance
          </span>
          <span className="text-sm px-3 py-1 bg-white rounded-full border border-blue-200 text-gray-700">
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
            onClick={handleProcessPayroll}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <PlayCircle size={18} />
            Process Payroll
          </button>
        </div>
        <button
          className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors group"
        >
          <FileDown size={18} className="group-hover:text-blue-600" />
          <span className="flex items-center gap-1">
            Export Report
            <ChevronDown size={16} />
          </span>
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
        <div className="flex overflow-x-auto border-b border-gray-100">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-4 text-sm font-medium transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? "border-b-2 border-blue-600 text-blue-600"
                  : "text-gray-700 hover:text-gray-900"
              }`}
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

      <EmployeePayrollDetailsModal
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
