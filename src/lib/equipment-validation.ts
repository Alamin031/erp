import { z } from "zod";

export const equipmentFormSchema = z.object({
  name: z.string().min(2, "Name is required"),
  sku: z.string().optional(),
  category: z.string().min(2, "Category is required"),
  serialNumber: z.string().optional(),
  purchaseDate: z.string().optional(),
  supplierId: z.string().optional(),
  purchasePrice: z.preprocess((v)=> v === '' ? undefined : Number(v), z.number().min(0).optional()),
  warrantyExpiry: z.string().optional(),
  location: z.string().optional(),
  quantity: z.preprocess((v)=> Number(v), z.number().int().min(0, "Quantity cannot be negative")),
  minStock: z.preprocess((v)=> Number(v), z.number().int().min(0)),
  depreciationMethod: z.enum(["Straight-line", "None"]).optional(),
  depreciationRate: z.preprocess((v)=> v === '' ? undefined : Number(v), z.number().min(0).max(100).optional()),
  notes: z.string().optional(),
  images: z.array(z.string()).optional(),
  status: z.enum(["Active","In Use","Under Maintenance","Retired"]).default("Active"),
});

export type EquipmentFormInput = z.infer<typeof equipmentFormSchema>;
