export type ReservationStatus = "Confirmed" | "Pending" | "Cancelled";
export type RoomType = "Single" | "Double" | "Suite" | "Deluxe";

export interface Reservation {
  id: string;
  bookingId: string;
  guestName: string;
  email: string;
  phone: string;
  roomType: RoomType;
  checkInDate: string;
  checkOutDate: string;
  numberOfGuests: number;
  notes?: string;
  status: ReservationStatus;
  paymentStatus: "Paid" | "Pending" | "Overdue";
  createdAt: string;
}

export interface ReservationFormInput {
  guestName: string;
  email: string;
  phone: string;
  roomType: RoomType;
  checkInDate: string;
  checkOutDate: string;
  numberOfGuests: number;
  notes?: string;
}
