import apiClient from './client';
import type {RegisterPayload, LoginPayload, LoginResponse, UserProfile} from '../types/auth';

export async function register(payload: RegisterPayload): Promise<void> {
    await apiClient.post('/auth/register', payload);
}

export async function login(payload: LoginPayload): Promise<LoginResponse> {
    const response = await apiClient.post<LoginResponse>('/auth/login', payload);
    return response.data;
}

export async function getMe(): Promise<UserProfile> {
  const response = await apiClient.get<UserProfile>('/Auth/me');
  return response.data;
}