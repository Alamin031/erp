import { z } from "zod";

export const lineItemSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Item name is required"),
  quantity: z.number().min(1, "Quantity must be at least 1"),
  unitPrice: z.number().min(0, "Unit price must be positive"),
  tax: z.number().min(0, "Tax must be non-negative"),
  total: z.number().min(0, "Total must be non-negative"),
});

export const billFormSchema = z.object({
  vendorName: z.string().min(1, "Vendor name is required").min(3, "Vendor name must be at least 3 characters"),
  vendorEmail: z.string().email("Invalid email address").optional().or(z.literal("")),
  vendorPhone: z.string().optional().or(z.literal("")),
  billDate: z.string().refine((date) => !isNaN(Date.parse(date)), "Invalid bill date"),
  dueDate: z.string().refine((date) => !isNaN(Date.parse(date)), "Invalid due date"),
  amount: z.number().min(0.01, "Amount must be greater than 0"),
  status: z.enum(["Pending", "Paid", "Overdue", "Cancelled"]),
  notes: z.string().optional().or(z.literal("")),
  lineItems: z.array(lineItemSchema).optional(),
  attachments: z.array(z.string()).optional(),
});

export const markAsPaidSchema = z.object({
  paymentMode: z.enum(["Bank Transfer", "Cheque", "Cash", "Credit Card", "Online"]),
  referenceNumber: z.string().min(1, "Reference number is required"),
  paymentDate: z.string().refine((date) => !isNaN(Date.parse(date)), "Invalid payment date"),
});

export type BillFormData = z.infer<typeof billFormSchema>;
export type MarkAsPaidData = z.infer<typeof markAsPaidSchema>;
