export interface Venue {
  id: string;
  name: string;
  address: string;
}

export interface Event {
  id: string;
  name: string;
  description: string;
  startDate: string;
  salesOpenDate: string;
  salesCloseDate: string;
  venueId: string;
  venue: Venue | null;
  status: number;
}

export interface CreateEventPayload {
  name: string;
  description: string;
  startDate: string;
  salesOpenDate: string;
  salesCloseDate: string;
  venueId: string;
}

export interface CreateVenuePayload {
  name: string;
  address: string;
}