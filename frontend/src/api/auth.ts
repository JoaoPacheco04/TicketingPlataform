import apiClient from './client';
import type {RegisterPayload, LoginPayload, LoginResponse} from '../types/auth';

export async function register(payload: RegisterPayload): Promise<void> {
    await apiClient.post('/auth/register', payload);
}

export async function login(payload: LoginPayload): Promise<LoginResponse> {
    const response = await apiClient.post<LoginResponse>('/auth/login', payload);
    return response.data;
}