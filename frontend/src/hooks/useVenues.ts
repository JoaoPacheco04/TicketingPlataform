import { useQuery } from '@tanstack/react-query';
import { getVenues } from '../api/venue';

export function useVenues() {
  return useQuery({ queryKey: ['venues'], queryFn: getVenues });
}