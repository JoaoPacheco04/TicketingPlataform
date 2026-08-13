import { useQuery } from '@tanstack/react-query';
import { getMe } from '../api/auth';

export function useProfile() {
  return useQuery({ queryKey: ['profile'], queryFn: getMe });
}