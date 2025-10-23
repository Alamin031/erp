export type SecurityType = "Common" | "Preferred" | "Convertible Note";
export type EquityAwardType = "RSU" | "Bonus" | "Performance";
export type OptionStatus = "Active" | "Vested" | "Exercised" | "Expired";
export type SecurityStatus = "Issued" | "Active" | "Vested" | "Transferred" | "Cancelled";

export interface Security {
  id: string;
  holderName: string;
  type: SecurityType;
  shares: number;
  value: number; // per share at issue
  issueDate: string;
  status: SecurityStatus;
  vestingSchedule?: VestingSchedule;
  documents?: Document[];
  transactions?: Transaction[];
  createdAt: string;
  updatedAt: string;
}

export interface VestingSchedule {
  totalShares: number;
  vestedShares: number;
  vestingStartDate: string;
  vestingEndDate: string;
  cliffMonths?: number;
  monthlyVestingPercent?: number;
}

export interface Document {
  id: string;
  name: string;
  url: string;
  type: string; // pdf, image, etc
  uploadedAt: string;
}

export interface Transaction {
  id: string;
  securityId: string;
  type: "Grant" | "Transfer" | "Vest" | "Exercise";
  quantity: number;
  date: string;
  fromHolder?: string;
  toHolder?: string;
  notes?: string;
}

export interface StockOption {
  id: string;
  employeeName: string;
  quantity: number;
  grantDate: string;
  vestingPeriod: number; // in months
  vestingSchedule: VestingSchedule;
  expiryDate: string;
  strikePrice: number;
  status: OptionStatus;
  exercisedQuantity?: number;
  exerciseDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface EquityAward {
  id: string;
  employeeName: string;
  awardType: EquityAwardType;
  quantity: number;
  vestingDate: string;
  status: "Pending" | "Active" | "Vested" | "Revoked";
  revokedDate?: string;
  vestingSchedule?: VestingSchedule;
  history?: AwardHistory[];
  createdAt: string;
  updatedAt: string;
}

export interface AwardHistory {
  id: string;
  timestamp: string;
  type: "Created" | "Vested" | "Updated" | "Revoked";
  user: string;
  details: string;
}

export interface Valuation {
  id: string;
  date: string;
  companyValuation: number;
  perShareValue: number;
}

export interface SecuritiesFilter {
  holderName?: string;
  type?: SecurityType | "All";
  status?: SecurityStatus | "All";
  dateFrom?: string;
  dateTo?: string;
  minShares?: number;
}

export interface CapTableData {
  totalShares: number;
  totalValuation: number;
  ownership: {
    category: string; // Founders, Investors, Employees
    shares: number;
    percentage: number;
    valuation: number;
  }[];
}
