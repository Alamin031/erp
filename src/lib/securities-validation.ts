import { z } from "zod";

export const newSecuritySchema = z.object({
  holderName: z.string().min(2, "Holder name is required"),
  type: z.enum(["Common", "Preferred", "Convertible Note"]),
  shares: z.preprocess((v) => (v === "" ? undefined : Number(v)), z.number().min(1, "Shares must be at least 1")),
  value: z.preprocess((v) => (v === "" ? undefined : Number(v)), z.number().min(0, "Value must be non-negative")),
  issueDate: z.string().min(1, "Issue date is required"),
  status: z.enum(["Issued", "Active", "Vested", "Transferred", "Cancelled"]).default("Issued"),
});

export type NewSecurityInput = z.infer<typeof newSecuritySchema>;

export const newStockOptionSchema = z.object({
  employeeName: z.string().min(2, "Employee name is required"),
  quantity: z.preprocess((v) => (v === "" ? undefined : Number(v)), z.number().min(1, "Quantity must be at least 1")),
  grantDate: z.string().min(1, "Grant date is required"),
  vestingPeriod: z.preprocess((v) => (v === "" ? undefined : Number(v)), z.number().min(1, "Vesting period must be at least 1 month")),
  expiryDate: z.string().min(1, "Expiry date is required"),
  strikePrice: z.preprocess((v) => (v === "" ? undefined : Number(v)), z.number().min(0, "Strike price must be non-negative")),
  status: z.enum(["Active", "Vested", "Exercised", "Expired"]).default("Active"),
});

export type NewStockOptionInput = z.infer<typeof newStockOptionSchema>;

export const newEquityAwardSchema = z.object({
  employeeName: z.string().min(2, "Employee name is required"),
  awardType: z.enum(["RSU", "Bonus", "Performance"]),
  quantity: z.preprocess((v) => (v === "" ? undefined : Number(v)), z.number().min(1, "Quantity must be at least 1")),
  vestingDate: z.string().min(1, "Vesting date is required"),
  status: z.enum(["Pending", "Active", "Vested", "Revoked"]).default("Pending"),
});

export type NewEquityAwardInput = z.infer<typeof newEquityAwardSchema>;

export const documentUploadSchema = z.object({
  name: z.string().min(1, "File name is required"),
  type: z.string().min(1, "File type is required"),
  url: z.string().url("Invalid file URL"),
});

export type DocumentUploadInput = z.infer<typeof documentUploadSchema>;
