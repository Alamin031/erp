import { z } from "zod";
import type { Proficiency } from "@/types/skill";

export const skillFormSchema = z.object({
  name: z.string().min(2, "Name is required"),
  category: z.string().optional().or(z.literal("")),
  tags: z.array(z.string().min(1)).optional().default([]),
  description: z.string().optional(),
});

export type SkillFormInput = z.infer<typeof skillFormSchema>;

export const assignmentSchema = z.object({
  employeeId: z.string().min(1),
  skillId: z.string().min(1),
  proficiency: z.number().int().min(1).max(5) as unknown as z.ZodType<Proficiency>,
  verified: z.boolean().optional().default(false),
  acquiredAt: z.string().optional(),
  lastUsedAt: z.string().optional(),
});

export type AssignmentInput = z.infer<typeof assignmentSchema>;

export const csvRowSchema = z.object({
  employeeName: z.string().min(1),
  department: z.string().optional(),
  role: z.string().optional(),
  skillName: z.string().min(1),
  category: z.string().optional(),
  tags: z.string().optional(), // pipe | or comma separated
  proficiency: z.coerce.number().int().min(1).max(5),
  verified: z.coerce.boolean().optional().default(false),
  acquiredAt: z.string().optional(),
  lastUsedAt: z.string().optional(),
  endorsementBy: z.string().optional(),
  endorsementNote: z.string().optional(),
});

export type CSVRow = z.infer<typeof csvRowSchema>;
