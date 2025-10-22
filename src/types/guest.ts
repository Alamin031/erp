export type GuestStatus = "Checked-in" | "Checked-out" | "Reserved" | "Cancelled";
export type GuestTag = "VIP" | "Do-not-disturb" | "No-smoking" | "Wheelchair-accessible" | "Extended-stay" | "Corporate";

export interface Guest {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  nationality: string;
  passportNumber: string;
  dateOfBirth: string;
  preferredLanguage: string;
  status: GuestStatus;
  currentRoomNumber?: string;
  currentFloor?: number;
  tags: GuestTag[];
  preferences: {
    preferredFloor?: number;
    allergies?: string;
    bedPreference?: "Single" | "Double" | "Twin" | "Queen" | "King";
    specialRequests?: string;
  };
  emergencyContact: {
    name: string;
    relationship: string;
    phone: string;
  };
  photoUrl?: string;
  checkInDate: string;
  checkOutDate?: string;
  totalNights?: number;
  notes: string;
  paymentStatus: "Paid" | "Pending" | "Overdue";
  createdAt: string;
  updatedAt: string;
  activityLog: ActivityEntry[];
}

export interface ActivityEntry {
  id: string;
  timestamp: string;
  type: "check-in" | "check-out" | "service-request" | "note" | "edit" | "message";
  description: string;
  performedBy: string;
}

export interface GuestFilters {
  status: GuestStatus | "All";
  tag: GuestTag | "All";
  dateFromArrival: string;
  dateToArrival: string;
  floor?: number | "All";
  roomType?: string | "All";
}

export interface GuestStats {
  totalGuests: number;
  checkedInGuests: number;
  vipGuests: number;
  newGuestsToday: number;
}
