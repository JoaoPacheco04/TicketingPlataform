import { useMutation, useQueryClient } from '@tanstack/react-query';
import { confirmReservation } from '../api/reservation';

export function useConfirmReservation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: confirmReservation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reservations'] });
    },
  });
}