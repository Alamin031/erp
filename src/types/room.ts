export type RoomStatus = "Clean" | "Occupied" | "Needs Cleaning" | "Under Maintenance";
export type RoomType = "Single" | "Double" | "Suite" | "Deluxe";

export interface Room {
  id: string;
  roomNumber: string;
  floor: number;
  type: RoomType;
  status: RoomStatus;
  lastCleaned?: string;
  lastCleanedBy?: string;
  currentGuest?: {
    name: string;
    checkInDate: string;
    checkOutDate: string;
  };
  maintenanceStatus?: {
    issue: string;
    assignedTo?: string;
    eta?: string;
    status: "Pending" | "In Progress" | "Completed";
  };
  createdAt: string;
  updatedAt: string;
}

export interface MaintenanceLog {
  id: string;
  roomId: string;
  issue: string;
  assignedStaff?: string;
  startDate: string;
  eta?: string;
  status: "Pending" | "In Progress" | "Completed";
  notes?: string;
}

export interface RoomFilters {
  status: RoomStatus | "";
  floor: number | "";
  roomType: RoomType | "";
  searchQuery: string;
  dateFrom: string;
  dateTo: string;
}
