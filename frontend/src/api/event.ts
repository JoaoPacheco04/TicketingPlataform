import apiClient from "./client";
import type { Event } from "../types/event";

export const getEvents = async (): Promise<Event[]> => {
    const response = await apiClient.get<Event[]>('/events');
    return response.data;
};