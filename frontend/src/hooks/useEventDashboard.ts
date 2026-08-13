import { useQuery } from '@tanstack/react-query';
import { getEventDashboard } from '../api/dashboard';

export function useEventDashboard(eventId: string | undefined) {
  return useQuery({
    queryKey: ['dashboard', eventId],
    queryFn: () => getEventDashboard(eventId!),
    enabled: !!eventId,
    refetchInterval: 15000,
  });
}