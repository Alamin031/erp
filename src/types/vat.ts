import { z } from "zod";

export type VatStatus = "Draft" | "Ready" | "Filed" | "Submitted" | "Rejected";

export interface Attachment {
  id: string;
  name: string;
  size: number;
  type: string;
  url?: string;
}

export interface VatReturnVersion {
  id: string;
  timestamp: string; // ISO
  snapshot: VatReturnInput;
}

export interface FilingInfo {
  filedAt?: string; // ISO
  reference?: string;
  notes?: string;
}

export const vatReturnSchema = z.object({
  periodStart: z.string().min(1, "Start date required"),
  periodEnd: z.string().min(1, "End date required"),
  taxableSales: z.number().nonnegative(),
  zeroRatedSales: z.number().nonnegative(),
  exemptSales: z.number().nonnegative(),
  outputVat: z.number().nonnegative(),
  inputVat: z.number().nonnegative(),
  adjustments: z.number().default(0),
  credits: z.number().default(0),
  penalties: z.number().default(0),
});

export type VatReturnInput = z.infer<typeof vatReturnSchema>;

export interface VatReturn extends VatReturnInput {
  id: string;
  status: VatStatus;
  attachments: Attachment[];
  versions: VatReturnVersion[];
  activity: { id: string; at: string; type: string; message: string }[];
}

export type TransactionType = "Sale" | "Purchase";

export type VatCategory = "VATable" | "Non-VATable" | "Zero-rated" | "Exempt";

export interface Transaction {
  id: string;
  date: string; // ISO
  type: TransactionType;
  vendorId?: string;
  invoiceNumber?: string;
  amount: number;
  vatAmount: number;
  category?: string;
  vatCategory: VatCategory;
  matched?: boolean;
}

export interface Vendor {
  id: string;
  name: string;
  vatNumber?: string;
  country?: string;
}

export const csvTransactionColumns = [
  "date",
  "type",
  "vendor",
  "invoiceNumber",
  "amount",
  "vatAmount",
  "vatCategory",
  "category",
] as const;
