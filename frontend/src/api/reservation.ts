import apiClient from './client';
import type {CreateReservationPayload, Reservation} from '../types/reservation';

export async function createReservation(payload: CreateReservationPayload): Promise<Reservation> {
  const response = await apiClient.post<Reservation>('/reservations', payload);
  return response.data;
}