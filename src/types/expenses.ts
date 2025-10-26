export type ExpenseStatus = "Draft" | "Pending" | "Manager Approved" | "Finance Approved" | "Reimbursed" | "Rejected" | "Cancelled";

export interface Receipt {
  id: string;
  filename: string;
  url?: string;
  size?: number;
  mime?: string;
}

export interface Expense {
  id: string;
  title: string;
  category: string;
  amount: number;
  currency: string;
  date: string;
  vendor?: string;
  project?: string;
  billable?: boolean;
  notes?: string;
  receipts: Receipt[];
  submitterId: string;
  status: ExpenseStatus;
  approvals?: Array<{ by: string; role: string; decision: string; comment?: string; date: string }>;
  reimbursements?: Array<{ method: string; reference: string; date: string; amount: number }>;
  deleted?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  limit?: number; // policy limit
  disallowed?: boolean;
}

export interface ExpenseFilters {
  query: string;
  status: ExpenseStatus | "";
  dateFrom: string;
  dateTo: string;
  category: string;
  project: string;
  minAmount?: number;
  maxAmount?: number;
}
