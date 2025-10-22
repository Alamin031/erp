import { z } from "zod";

export const newServiceRequestSchema = z.object({
  guestName: z.string().min(2, "Guest name is required"),
  roomNumber: z.string().min(1, "Room number is required"),
  serviceType: z.enum(
    ["Room Service", "Housekeeping Request", "Maintenance", "Wake-up Call", "Laundry", "Other"],
    { message: "Please select a valid service type" }
  ),
  priority: z.enum(["Low", "Normal", "High", "Urgent"], {
    message: "Please select a valid priority",
  }),
  eta: z.string().optional(),
  assignedStaffIds: z.array(z.string()).optional(),
  notes: z.string().min(3, "Notes must be at least 3 characters").max(500, "Notes must not exceed 500 characters"),
  attachmentUrl: z.string().url().optional().or(z.literal("")),
});

export const assignStaffSchema = z.object({
  staffIds: z.array(z.string()).min(1, "Please select at least one staff member"),
  eta: z.string().optional(),
});

export const addNoteSchema = z.object({
  note: z.string().min(3, "Note must be at least 3 characters").max(500, "Note must not exceed 500 characters"),
});

export const updatePrioritySchema = z.object({
  priority: z.enum(["Low", "Normal", "High", "Urgent"]),
});

export type NewServiceRequestInput = z.infer<typeof newServiceRequestSchema>;
export type AssignStaffInput = z.infer<typeof assignStaffSchema>;
export type AddNoteInput = z.infer<typeof addNoteSchema>;
export type UpdatePriorityInput = z.infer<typeof updatePrioritySchema>;
