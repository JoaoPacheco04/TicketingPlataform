import apiClient from './client';
import type { QueuePosition } from '../types/queue';

export async function joinQueue(eventId: string, userId: string): Promise<QueuePosition> {
  const response = await apiClient.post<QueuePosition>(`/WaitingQueue/${eventId}/join?userId=${userId}`);
  return response.data;
}

export async function getQueuePosition(eventId: string, userId: string): Promise<QueuePosition> {
  const response = await apiClient.get<QueuePosition>(`/WaitingQueue/${eventId}/position?userId=${userId}`);
  return response.data;
}