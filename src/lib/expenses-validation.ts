import { z } from "zod";

export const receiptSchema = z.object({
  id: z.string(),
  filename: z.string(),
  size: z.number().max(5 * 1024 * 1024, "File too large (max 5MB)"),
  mime: z.string().optional(),
});

export const expenseFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  category: z.string().min(1, "Category is required"),
  amount: z.number().min(0.01, "Amount must be greater than 0"),
  currency: z.string().min(1, "Currency is required"),
  date: z.string().refine((d) => !isNaN(Date.parse(d)), "Invalid date"),
  vendor: z.string().optional(),
  project: z.string().optional(),
  billable: z.boolean().optional(),
  notes: z.string().optional(),
  receipts: z.array(receiptSchema).optional(),
});

export type ExpenseFormData = z.infer<typeof expenseFormSchema>;
