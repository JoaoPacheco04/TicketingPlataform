import { useQuery } from '@tanstack/react-query';
import { getSections } from '../api/sections';

export function useSections() {
  return useQuery({
    queryKey: ['sections'],
    queryFn: getSections,
  });
}