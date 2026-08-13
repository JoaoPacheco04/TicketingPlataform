import { useMutation } from '@tanstack/react-query';
import { checkIn } from '../api/reservation';

export function useCheckIn() {
  return useMutation({
    mutationFn: checkIn,
  });
}