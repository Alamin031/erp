import { APBill, APStatus, PaymentMethod } from "@/types/accounting";

export interface BillLineItem {
  id: string;
  itemName: string;
  quantity: number;
  unitPrice: number;
  taxRate?: number; // percentage e.g. 10 for 10%
}

export interface BillAttachment {
  name: string;
  type: string;
  dataUrl: string; // base64 data URL for preview/download
}

export interface Bill extends APBill {
  attachment?: BillAttachment | null;
  paymentMode?: PaymentMethod;
  paidDate?: string | null;
  paymentReference?: string | null;
  lineItems?: BillLineItem[];
}

export type BillStatus = APStatus;
