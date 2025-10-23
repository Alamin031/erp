import { z } from "zod";

export const addShareholderSchema = z.object({
  name: z.string().min(2, "Shareholder name is required"),
  email: z.string().email("Invalid email").optional().or(z.literal("")),
  sharesHeld: z.preprocess(
    (v) => (v === "" ? undefined : Number(v)),
    z.number().min(1, "Shares must be at least 1")
  ),
  equityType: z.enum(["Common", "Preferred", "Options", "Convertible"]),
  joinDate: z.string().min(1, "Join date is required"),
  notes: z.string().optional(),
});

export type AddShareholderInput = z.infer<typeof addShareholderSchema>;

export const editEquityClassSchema = z.object({
  name: z.enum(["Common", "Preferred", "Options", "Convertible"]),
  authorizedShares: z.preprocess(
    (v) => (v === "" ? undefined : Number(v)),
    z.number().min(0, "Authorized shares cannot be negative")
  ),
  issuedShares: z.preprocess(
    (v) => (v === "" ? undefined : Number(v)),
    z.number().min(0, "Issued shares cannot be negative")
  ),
  pricePerShare: z.preprocess(
    (v) => (v === "" ? undefined : Number(v)),
    z.number().min(0, "Price must be non-negative")
  ),
  description: z.string().optional(),
  votingRights: z.preprocess((v) => (v === "" ? undefined : Number(v)), z.number().optional()),
  liquidationPreference: z.preprocess((v) => (v === "" ? undefined : Number(v)), z.number().optional()),
});

export type EditEquityClassInput = z.infer<typeof editEquityClassSchema>;
