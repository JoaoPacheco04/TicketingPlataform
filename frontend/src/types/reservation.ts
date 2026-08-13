import type { Seat } from './seat';

export interface CreateReservationPayload {
  seatId: string;
  eventId: string;
}

export interface Reservation {
  id: string;
  seatId: string;
  seat: Seat | null;
  eventId: string;
  userId: string;
  status: number;
  createdAt: string;
  expiresAt: string;
  qrCode: string | null;
  checkedIn: boolean;
}

export interface CheckInResponse {
  message: string;
  reservationId: string;
}