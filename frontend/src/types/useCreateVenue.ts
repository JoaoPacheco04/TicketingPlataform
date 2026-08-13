import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createVenue } from '../api/venue';
import type { CreateVenuePayload, Venue } from '../types/event';

export function useCreateVenue() {
  const queryClient = useQueryClient();
  return useMutation<Venue, Error, CreateVenuePayload>({
    mutationFn: createVenue,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['venues'] });
    },
  });
}