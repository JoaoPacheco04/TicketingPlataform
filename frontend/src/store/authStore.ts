import { create } from "zustand";
import { jwtDecode } from "jwt-decode";

interface JwtPayload {
  sub?: string;
  role?: string;
  'http://schemas.microsoft.com/ws/2008/06/identity/claims/role'?: string;
  fullName?: string;
  email?: string;
}

interface AuthState {
  token: string | null;
  role: string | null;
  userId: string | null;
  setToken: (token: string | null) => void;
  logout: () => void;
}

function decodeToken(token: string | null): { role: string | null; userId: string | null } {
  if (!token) return { role: null, userId: null };
  try {
    const decoded = jwtDecode<JwtPayload>(token);
    return {
      role:
        decoded.role ??
        decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] ??
        null,
      userId: decoded.sub ?? null,
    };
  } catch {
    return { role: null, userId: null };
  }
}

const initialToken = localStorage.getItem('token');
const initialDecoded = decodeToken(initialToken);

export const useAuthStore = create<AuthState>((set) => ({
  token: initialToken,
  role: initialDecoded.role,
  userId: initialDecoded.userId,
  setToken: (token) => {
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
    const decoded = decodeToken(token);
    set({ token, role: decoded.role, userId: decoded.userId });
  },
  logout: () => {
    localStorage.removeItem('token');
    set({ token: null, role: null, userId: null });
  },
}));