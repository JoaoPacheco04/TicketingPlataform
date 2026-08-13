import apiClient from './client';
import type { Venue } from '../types/event';
import type { CreateVenuePayload } from '../types/venue';

export async function getVenues(): Promise<Venue[]> {
  const response = await apiClient.get<Venue[]>('/Venues');
  return response.data;
}

export async function createVenue(payload: CreateVenuePayload): Promise<Venue> {
  const response = await apiClient.post<Venue>('/Venues', payload);
  return response.data;
}