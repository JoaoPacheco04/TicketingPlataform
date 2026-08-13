import apiClient from './client';
import type { Section } from '../types/seat';
import type { CreateSectionPayload } from '../types/section';

export async function getSections(): Promise<Section[]> {
  const response = await apiClient.get<Section[]>('/Sections');
  return response.data;
}

export async function createSection(payload: CreateSectionPayload): Promise<Section> {
  const response = await apiClient.post<Section>('/Sections', payload);
  return response.data;
}