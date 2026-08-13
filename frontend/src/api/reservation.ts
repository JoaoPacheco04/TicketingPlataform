import apiClient from './client';
import type { CreateReservationPayload, Reservation, CheckInResponse } from '../types/reservation';

export async function createReservation(payload: CreateReservationPayload): Promise<Reservation> {
  const response = await apiClient.post<Reservation>('/Reservations', payload);
  return response.data;
}

export async function getReservations(): Promise<Reservation[]> {
  const response = await apiClient.get<Reservation[]>('/Reservations');
  return response.data;
}

export async function checkIn(qrCode: string): Promise<CheckInResponse> {
  const response = await apiClient.post<CheckInResponse>(`/Reservations/checkin?qrCode=${qrCode}`);
  return response.data;
}