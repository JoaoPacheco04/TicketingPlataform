import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createSection } from '../api/sections';
import type { CreateSectionPayload } from '../types/section';
import type { Section } from '../types/seat';

export function useCreateSection() {
  const queryClient = useQueryClient();
  return useMutation<Section, Error, CreateSectionPayload>({
    mutationFn: createSection,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sections'] });
    },
  });
}