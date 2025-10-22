import { z } from "zod";

export const guestFormSchema = z.object({
  firstName: z.string().min(2, "First name is required"),
  lastName: z.string().min(2, "Last name is required"),
  email: z.string().email("Valid email is required"),
  phone: z.string().min(10, "Valid phone number is required"),
  nationality: z.string().min(2, "Nationality is required"),
  passportNumber: z.string().min(5, "Valid passport number is required"),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  preferredLanguage: z.string().min(1, "Preferred language is required"),
  tags: z.array(z.string()).optional(),
  preferences: z.object({
    preferredFloor: z.number().optional(),
    allergies: z.string().optional(),
    bedPreference: z.enum(["Single", "Double", "Twin", "Queen", "King"]).optional(),
    specialRequests: z.string().optional(),
  }).optional(),
  emergencyContact: z.object({
    name: z.string().min(2, "Emergency contact name is required"),
    relationship: z.string().min(2, "Relationship is required"),
    phone: z.string().min(10, "Valid phone number is required"),
  }),
  notes: z.string().optional(),
  photoUrl: z.string().url().optional().or(z.literal("")),
});

export const checkInOutSchema = z.object({
  roomNumber: z.string().min(1, "Room number is required"),
  floor: z.number().optional(),
  checkInDate: z.string().min(1, "Check-in date is required"),
  checkOutDate: z.string().optional(),
});

export const messageGuestSchema = z.object({
  message: z.string().min(5, "Message must be at least 5 characters").max(1000, "Message must not exceed 1000 characters"),
  sendMethod: z.enum(["Email", "SMS", "InApp"]),
});

export type GuestFormInput = z.infer<typeof guestFormSchema>;
export type CheckInOutInput = z.infer<typeof checkInOutSchema>;
export type MessageGuestInput = z.infer<typeof messageGuestSchema>;
