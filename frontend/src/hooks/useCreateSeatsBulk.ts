import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createSeatsBulk } from '../api/seat';
import type { BulkCreateSeatsPayload } from '../api/seat';

export function useCreateSeatsBulk() {
  const queryClient = useQueryClient();
  return useMutation<{ created: number }, Error, BulkCreateSeatsPayload>({
    mutationFn: createSeatsBulk,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sections'] });
    },
  });
}