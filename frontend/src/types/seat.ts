export const SeatLayoutType = {
  Rows: 0,
  Curved: 1,
  Grid: 2,
} as const;

export type SeatLayoutType = typeof SeatLayoutType[keyof typeof SeatLayoutType];

export interface Seat {
  id: string;
  row: string;
  number: string;
  sectionId: string;
}

export interface Section {
  id: string;
  name: string;
  basePrice: number;
  layoutType: SeatLayoutType;
  venueId: string;
  seats: Seat[];
}