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
  venueId: string;
  seats: Seat[];
}