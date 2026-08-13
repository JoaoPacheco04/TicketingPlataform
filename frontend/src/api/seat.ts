import apiClient from './client';

export interface BulkCreateSeatsPayload {
  sectionId: string;
  rowCount: number;
  seatsPerRow: number;
}

export async function createSeatsBulk(payload: BulkCreateSeatsPayload): Promise<{ created: number }> {
  const response = await apiClient.post<{ created: number }>('/Seats/bulk', payload);
  return response.data;
}