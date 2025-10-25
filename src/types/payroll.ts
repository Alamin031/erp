export type PaymentStatus = "Pending" | "Paid" | "Processing" | "Failed";
export type PayrollPeriod = "Monthly" | "Bi-Weekly" | "Weekly";

export interface SalaryComponent {
  id: string;
  name: string;
  type: "base" | "allowance" | "bonus" | "deduction";
  amount: number;
  isPercentage?: boolean;
  description?: string;
}

export interface SalaryStructure {
  id: string;
  name: string;
  department?: string;
  components: SalaryComponent[];
  baseAmount: number;
  totalAllowances: number;
  totalDeductions: number;
  netSalary: number;
  formula?: string;
  createdAt: string;
  updatedAt: string;
  archived?: boolean;
}

export interface TaxRules {
  incomeTaxPercentage: number;
  providentFundPercentage: number;
  insurancePercentage: number;
  otherDeductions: Record<string, number>;
  updatedAt: string;
}

export interface Employee {
  id: string;
  employeeId: string;
  name: string;
  email: string;
  phone?: string;
  department: string;
  position: string;
  baseSalary: number;
  salaryStructureId: string;
  joinDate: string;
  status: "Active" | "Inactive" | "On Leave";
  createdAt: string;
  updatedAt: string;
}

export interface PayrollRecord {
  id: string;
  employeeId: string;
  employee?: Employee;
  period: string;
  month: number;
  year: number;
  baseSalary: number;
  allowances: number;
  deductions: number;
  netPay: number;
  incomeTax: number;
  providentFund: number;
  insurance: number;
  otherDeductions: number;
  paymentStatus: PaymentStatus;
  paymentDate?: string;
  paymentMethod?: "Bank Transfer" | "Cash" | "Cheque";
  notes?: string;
  locked: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PayrollSummary {
  totalEmployees: number;
  pendingPayments: number;
  totalSalaryPaid: number;
  upcomingDeductions: number;
  monthlyExpense: number;
  averageNetPay: number;
  paymentDate: string;
}

export interface PayrollFilters {
  department: string;
  status: PaymentStatus | "";
  month: number;
  year: number;
  searchQuery: string;
}
