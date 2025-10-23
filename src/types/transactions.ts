export type TransactionType = "Issuance" | "Exercise" | "Transfer" | "Cancellation" | "Conversion";
export type TransactionStatus = "Draft" | "Approved" | "Rejected" | "Pending" | "Executed";
export type SecurityType = "Common" | "Preferred" | "Option";

export interface Transaction {
  id: string;
  date: string;
  type: TransactionType;
  entity: string; // Shareholder or Employee name
  entityId?: string; // Reference to security holder
  securityType: SecurityType;
  quantity: number;
  unitPrice: number;
  totalAmount: number; // Quantity × Unit Price
  status: TransactionStatus;
  notes?: string;
  documents?: Document[];
  auditLog?: AuditEntry[];
  approvedBy?: string;
  approvalDate?: string;
  executedDate?: string;
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
}

export interface Document {
  id: string;
  name: string;
  url: string;
  type: string;
  uploadedAt: string;
}

export interface AuditEntry {
  id: string;
  timestamp: string;
  action: "Created" | "Approved" | "Rejected" | "Executed";
  user: string;
  details: string;
}

export interface TransactionFilters {
  type?: TransactionType | "All";
  status?: TransactionStatus | "All";
  entity?: string;
  dateFrom?: string;
  dateTo?: string;
}

export interface TransactionStats {
  totalTransactions: number;
  totalSharesIssued: number;
  totalExercisesCompleted: number;
  pendingTransfers: number;
  issuanceCount: number;
  issuanceValue: number;
  exerciseCount: number;
  exerciseValue: number;
  transferCount: number;
  cancellationCount: number;
}

export interface MonthlyTransactionData {
  month: string;
  issuances: number;
  exercises: number;
  transfers: number;
  cancellations: number;
  totalShares: number;
}

export interface Shareholder {
  id: string;
  name: string;
  email?: string;
  type: "Founder" | "Investor" | "Employee" | "Other";
  joinDate?: string;
}
