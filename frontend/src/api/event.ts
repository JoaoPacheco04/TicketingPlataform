import apiClient from "./client";
import type { Event, CreateEventPayload } from "../types/event";

export const getEvents = async (): Promise<Event[]> => {
    const response = await apiClient.get<Event[]>('/events');
    return response.data;
};

export async function createEvent(payload: CreateEventPayload): Promise<Event> {
  const response = await apiClient.post<Event>('/Events', payload);
  return response.data;
}