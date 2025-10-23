import { z } from "zod";

export const newTransactionSchema = z.object({
  type: z.enum(["Issuance", "Exercise", "Transfer", "Cancellation", "Conversion"]),
  entity: z.string().min(2, "Entity name is required"),
  securityType: z.enum(["Common", "Preferred", "Option"]),
  quantity: z.preprocess((v) => (v === "" ? undefined : Number(v)), z.number().min(1, "Quantity must be at least 1")),
  unitPrice: z.preprocess((v) => (v === "" ? undefined : Number(v)), z.number().min(0, "Unit price must be non-negative")),
  date: z.string().min(1, "Transaction date is required"),
  status: z.enum(["Draft", "Approved", "Rejected", "Pending", "Executed"]).default("Draft"),
  notes: z.string().optional(),
});

export type NewTransactionInput = z.infer<typeof newTransactionSchema>;

export const documentUploadSchema = z.object({
  name: z.string().min(1, "File name is required"),
  type: z.string().min(1, "File type is required"),
  url: z.string().url("Invalid file URL"),
});

export type DocumentUploadInput = z.infer<typeof documentUploadSchema>;
