export interface EventDashboard {
  eventId: string;
  eventName: string;
  totalSeats: number;
  occupiedSeats: number;
  availableSeats: number;
  occupancyRate: number;
  reservationsByStatus: {
    confirmed: number;
    pending: number;
    expired: number;
    cancelled: number;
  };
  checkedInCount: number;
  revenue: number;
}