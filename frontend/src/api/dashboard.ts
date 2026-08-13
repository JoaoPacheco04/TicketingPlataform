import apiClient from './client';
import type { EventDashboard } from '../types/dashboard';

export async function getEventDashboard(eventId: string): Promise<EventDashboard> {
  const response = await apiClient.get<EventDashboard>(`/Events/${eventId}/dashboard`);
  return response.data;
}