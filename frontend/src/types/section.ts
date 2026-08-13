import type { SeatLayoutType } from './seat';

export interface CreateSectionPayload {
  name: string;
  basePrice: number;
  venueId: string;
  layoutType: SeatLayoutType;
}