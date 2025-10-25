export type BillStatus = "Pending" | "Paid" | "Overdue" | "Cancelled";
export type PaymentMode = "Bank Transfer" | "Cheque" | "Cash" | "Credit Card" | "Online";

export interface LineItem {
  id: string;
  name: string;
  quantity: number;
  unitPrice: number;
  tax: number;
  total: number;
}

export interface Bill {
  id: string;
  billNumber: string;
  vendorName: string;
  vendorEmail?: string;
  vendorPhone?: string;
  billDate: string;
  dueDate: string;
  amount: number;
  status: BillStatus;
  paymentMode?: PaymentMode;
  paymentDate?: string;
  referenceNumber?: string;
  lineItems: LineItem[];
  attachments: string[]; // File URLs or paths
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface BillFilters {
  vendor: string;
  status: BillStatus | "";
  dateFrom: string;
  dateTo: string;
  searchQuery: string;
}

export interface BillStats {
  totalBills: number;
  totalPaid: number;
  totalPending: number;
  overdueBills: number;
  totalAmount: number;
  pendingAmount: number;
}

export interface VendorStats {
  name: string;
  amount: number;
  billCount: number;
}

export interface BillTrendData {
  month: string;
  bills: number;
  amount: number;
}
