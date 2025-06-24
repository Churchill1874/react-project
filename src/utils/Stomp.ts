import { Client } from '@stomp/stompjs';
import { useContext } from 'react';
import { StompContext } from '@/utils/StompContext';

/**
 * 自定义 Hook：获取 STOMP 客户端状态（client 实例 和 connected 状态）
 */
export const useStompClientStatus = (): {
  client: Client | null;
  connected: boolean;
} => {
  const context = useContext(StompContext);

  if (!context) {
    throw new Error('useStompClientStatus must be used within a StompProvider');
  }

  return {
    client: context.client,
    connected: context.connected,
  };
};
