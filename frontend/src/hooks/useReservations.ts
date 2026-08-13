import { useQuery } from '@tanstack/react-query';
import { getReservations } from '../api/reservation';

export function useReservations() {
  return useQuery({
    queryKey: ['reservations'],
    queryFn: getReservations,
  });
}