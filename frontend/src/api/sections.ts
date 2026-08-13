import apiClient from "./client";
import type{ Section } from "../types/seat";

export const getSections = async (): Promise<Section[]> => {
  const response = await apiClient.get<Section[]>("/sections");
  return response.data;
}