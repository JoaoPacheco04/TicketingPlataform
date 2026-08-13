export interface RegisterPayload{
    fullName: string;
    email: string;
    password: string;
    role: 'Customer' | 'Organizer';
}

export interface LoginPayload{
    email: string;
    password: string;
}

export interface LoginResponse{
    token: string;
}