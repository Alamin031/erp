import { z } from "zod";

export const workOrderFormSchema = z.object({
  title: z.string().min(3, "Title is required"),
  description: z.string().min(5, "Description is required"),
  assetId: z.string().optional(),
  assetName: z.string().optional(),
  assetType: z.enum(["Room", "HVAC", "Electrical", "Plumbing", "Elevator", "Other"]).optional(),
  requestedBy: z.string().min(2, "Requested By is required"),
  priority: z.enum(["Low", "Medium", "High", "Critical"]),
  dueAt: z.string().optional(),
  attachments: z.array(z.string()).optional(),
  assignedTechId: z.string().optional(),
});

export type WorkOrderFormInput = z.infer<typeof workOrderFormSchema>;
