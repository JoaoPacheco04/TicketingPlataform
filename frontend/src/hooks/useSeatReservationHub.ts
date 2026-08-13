import { useEffect, useRef } from 'react';
import * as signalR from '@microsoft/signalr';
import { useQueryClient } from '@tanstack/react-query';

export function useSeatReservationHub(eventId: string | undefined) {
  const connectionRef = useRef<signalR.HubConnection | null>(null);
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!eventId) return;

    const connection = new signalR.HubConnectionBuilder()
      .withUrl('https://localhost:7015/hubs/seat-reservation')
      .withAutomaticReconnect()
      .build();

    connection.on('SeatReserved', () => {
      queryClient.invalidateQueries({ queryKey: ['reservations'] });
    });

    connection
      .start()
      .then(() => connection.invoke('JoinEventGroup', eventId))
      .catch((err) => console.error('SignalR connection failed:', err));

    connectionRef.current = connection;

    return () => {
      connection.stop();
    };
  }, [eventId, queryClient]);
}