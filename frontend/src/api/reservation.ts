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

export async function confirmReservation(reservationId: string): Promise<Reservation> {
  const response = await apiClient.patch<Reservation>(`/Reservations/${reservationId}/confirm`);
  return response.data;
}

export async function fetchReservationQrCode(reservationId: string): Promise<string> {
  const response = await apiClient.get(`/Reservations/${reservationId}/qrcode`, {
    responseType: 'blob',
  });
  return URL.createObjectURL(response.data);
}