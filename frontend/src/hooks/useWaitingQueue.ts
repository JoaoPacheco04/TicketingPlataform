import { useState, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { joinQueue, getQueuePosition } from '../api/queue';
import { useAuthStore } from '../store/authStore';

export function useWaitingQueue(eventId: string | undefined) {
  const userId = useAuthStore((state) => state.userId);
  const [hasJoined, setHasJoined] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ['queue-position', eventId, userId],
    queryFn: () => getQueuePosition(eventId!, userId!),
    enabled: hasJoined && !!eventId && !!userId,
    refetchInterval: 5000,
  });

  const join = useCallback(async () => {
    if (!eventId || !userId) return;
    await joinQueue(eventId, userId);
    setHasJoined(true);
  }, [eventId, userId]);

  return { position: data?.position ?? null, hasJoined, isLoading, join };
}