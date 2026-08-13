import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createEvent } from '../api/event';
import type { CreateEventPayload } from '../types/event';
import type { Event } from '../types/event';

export function useCreateEvent() {
  const queryClient = useQueryClient();
  return useMutation<Event, Error, CreateEventPayload>({
    mutationFn: createEvent,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['events'] }),
  });
}