export type ARStatus = "Pending" | "Paid" | "Overdue" | "Partial";
export type APStatus = "Pending" | "Paid" | "Overdue" | "Partial";
export type PaymentMethod = "Cash" | "Card" | "Bank Transfer" | "Check";
export type JournalLineType = "Debit" | "Credit";
export type AccountType = "Asset" | "Liability" | "Equity" | "Revenue" | "Expense";
export type ReconciliationStatus = "Unmatched" | "Matched" | "Reconciled";

export interface ARInvoice {
  id: string;
  invoiceNumber: string;
  clientId: string;
  clientName: string;
  invoiceDate: string;
  dueDate: string;
  amount: number;
  paidAmount: number;
  balance: number;
  status: ARStatus;
  terms?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface APBill {
  id: string;
  billNumber: string;
  vendorId: string;
  vendorName: string;
  billDate: string;
  dueDate: string;
  amount: number;
  paidAmount: number;
  balance: number;
  status: APStatus;
  terms?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ChartOfAccounts {
  id: string;
  code: string;
  name: string;
  type: AccountType;
  balance: number;
  currency: string;
  active: boolean;
  createdAt: string;
}

export interface JournalLine {
  accountId: string;
  accountCode: string;
  accountName: string;
  type: JournalLineType;
  amount: number;
  description: string;
}

export interface JournalEntry {
  id: string;
  referenceNumber: string;
  date: string;
  lines: JournalLine[];
  description?: string;
  isPosted: boolean;
  createdAt: string;
  createdBy?: string;
  postedAt?: string;
  postedBy?: string;
  updatedAt: string;
}

export interface Payment {
  id: string;
  date: string;
  amount: number;
  method: PaymentMethod;
  reference: string;
  transactionId?: string;
  bankAccountId?: string;
  notes?: string;
  linkedInvoices?: string[];
  linkedBills?: string[];
  createdAt: string;
}

export interface BankAccount {
  id: string;
  accountNumber: string;
  accountName: string;
  bankName: string;
  balance: number;
  currency: string;
  lastReconciled?: string;
  status: "Active" | "Inactive";
  createdAt: string;
}

export interface BankTransaction {
  id: string;
  bankAccountId: string;
  date: string;
  amount: number;
  description: string;
  transactionType: "Debit" | "Credit";
  status: ReconciliationStatus;
  matchedPaymentId?: string;
  createdAt: string;
}

export interface AccountingFilters {
  dateFrom: string;
  dateTo: string;
  accountType: AccountType | "";
  clientOrVendor: string;
  status: ARStatus | APStatus | "";
  minAmount: number;
  maxAmount: number;
  searchQuery: string;
}

export interface FinancialReport {
  period: string;
  periodStart: string;
  periodEnd: string;
  data: Record<string, number>;
  generatedAt: string;
}
