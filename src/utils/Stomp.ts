import { Client } from '@stomp/stompjs';
import useStore from '@/zustand/store';

export const getStompClient = (): Client | null => {
  const client = useStore.getState().stompClient as Client;
  if (client && client.connected) {
    return client;
  }
  return null;
};
