export type InvoiceStatus = "Paid" | "Pending" | "Overdue";
export type PaymentMethod = "Cash" | "Card" | "Bank Transfer";
export type ClientType = "Guest" | "Corporate";

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  rate: number;
  amount: number;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  clientName: string;
  clientCompany?: string;
  clientEmail?: string;
  clientPhone?: string;
  clientType: ClientType;
  roomNumber?: string;
  serviceDescription?: string;
  items: InvoiceItem[];
  issueDate: string;
  dueDate: string;
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  discountRate: number;
  discountAmount: number;
  totalAmount: number;
  status: InvoiceStatus;
  paymentMethod?: PaymentMethod;
  transactionId?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  paidDate?: string;
}

export interface InvoiceFilters {
  status: InvoiceStatus | "";
  clientType: ClientType | "";
  searchQuery: string;
  dateFrom: string;
  dateTo: string;
}
