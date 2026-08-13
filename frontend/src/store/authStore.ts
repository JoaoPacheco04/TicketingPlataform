import { create } from "zustand";
import { jwtDecode } from "jwt-decode";

interface JwtPayload {
  role?: string;
  'http://schemas.microsoft.com/ws/2008/06/identity/claims/role'?: string;
  fullName?: string;
  email?: string;
}

interface AuthState {
  token: string | null;
  role: string | null;
  setToken: (token: string | null) => void;
  logout: () => void;
}

function getRoleFromToken(token: string | null): string | null {
  if (!token) return null;
  try {
    const decoded = jwtDecode<JwtPayload>(token);
    return (
      decoded.role ??
      decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] ??
      null
    );
  } catch {
    return null;
  }
}

const initialToken = localStorage.getItem('token');

export const useAuthStore = create<AuthState>((set) => ({
  token: initialToken,
  role: getRoleFromToken(initialToken),
  setToken: (token) => {
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
    set({ token, role: getRoleFromToken(token) });
  },
  logout: () => {
    localStorage.removeItem('token');
    set({ token: null, role: null });
  },
}));