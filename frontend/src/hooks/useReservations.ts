import { useQuery } from '@tanstack/react-query';
import { getReservations } from '../api/reservation';

export function useReservations() {
  return useQuery({
    queryKey: ['reservations'],
    queryFn: getReservations,
    refetchInterval: 15000, // refetch every 15 seconds
  });
}