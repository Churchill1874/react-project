import React, {
  createContext,
  useState,
  useEffect,
  ReactNode,
  useRef,
} from 'react';
import { useLocation } from 'react-router-dom';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import useStore from '@/zustand/store';
import { serverTarget } from '@/common/api';
import { PrivateChatType } from '@/components/privatechat/api';

export interface StompContextType {
  client: Client | null;
  connected: boolean;
  connectStompClient: (tokenId: string) => void;
}

export const StompContext = createContext<StompContextType | null>(null);

export const StompProvider = ({ children }: { children: ReactNode }) => {
  const location = useLocation();
  const latestPathRef = useRef(location.pathname);

  const tokenId = useStore((state) => state.tokenId);
  const [client, setClient] = useState<Client | null>(null);
  const [connected, setConnected] = useState(false);
  const pushChatMessageToMap = useStore.getState().pushChatMessageToMap;
  const updatePrivateChatList = useStore.getState().updatePrivateChatList;
  const setHasUnreadMessage = useStore.getState().setHasUnreadMessage;


  //评论未读标记
  const setCommentMessageUnread = useStore.getState().setCommentMessageUnread;
  //私信未读标记
  const setPrivateMessageUnread = useStore.getState().setPrivateMessageUnread;
  //系统消息未读标记
  const setSystemMessageUnread = useStore.getState().setSystemMessageUnread;

  const subscriptionRef = useRef<ReturnType<Client['subscribe']> | null>(null);
  const subscriptionSystemRef = useRef<ReturnType<Client['subscribe']> | null>(null);
  const subscriptionCommentRef = useRef<ReturnType<Client['subscribe']> | null>(null);

  const connectStompClient = (token: string) => {
    if (client && client.connected) return;

    const stompClient = new Client({
      webSocketFactory: () => new SockJS(`${serverTarget}/ws?token-id=${token}`),
      reconnectDelay: 5000,
    });

    stompClient.onConnect = () => {
      setClient(stompClient);
      setConnected(true);

      // 避免重复订阅
      // 在 onConnect 中订阅前判断是否已订阅
      //处理私信通知
      if (!subscriptionRef.current) {
        const sub = stompClient.subscribe('/user/queue/private', (message) => {
          console.log("私信来了:", message.body);
          const msg = JSON.parse(message.body) as PrivateChatType;
          pushChatMessageToMap(msg);
          updatePrivateChatList(msg);

          console.log('当前所在路由路径:', latestPathRef.current, ',对比结果:', latestPathRef.current !== '/message');
          if (latestPathRef.current !== '/message') {
            setHasUnreadMessage(true);
          }
          //当前message页面所在导航key
          const messageTabKey = useStore.getState().messageTabKey;
          if (latestPathRef.current === '/message' && messageTabKey !== 'private-message') {
            setPrivateMessageUnread(true)
          }

        });

        // 保存订阅引用
        subscriptionRef.current = sub;
      }

      //处理系统消息通知
      if (!subscriptionSystemRef.current) {
        const sub = stompClient.subscribe('/user/queue/systemMessage', (message) => {
          console.log("系统消息来了:", message.body);
          console.log('当前所在路由路径:', latestPathRef.current, ',对比结果:', latestPathRef.current !== '/message');

          if (latestPathRef.current !== '/message') {
            setHasUnreadMessage(true);
            setSystemMessageUnread(true)
          }

          //当前message页面所在导航key
          const messageTabKey = useStore.getState().messageTabKey;
          //判断如果在路由message路径 并且tab 的key正好不在系统消息 ，才给系统消息上面显示提示标记
          if (latestPathRef.current === '/message' && messageTabKey !== 'system-message') {
            setSystemMessageUnread(true)
          }
        });

        // 保存订阅引用
        subscriptionSystemRef.current = sub;
      }

      //处理评论回复通知
      if (!subscriptionCommentRef.current) {
        const sub = stompClient.subscribe('/user/queue/commentMessage', (message) => {
          console.log("评论消息来了:", message.body);
          console.log('当前所在路由路径:', latestPathRef.current, ',对比结果:', latestPathRef.current !== '/message');

          if (latestPathRef.current !== '/message') {
            setHasUnreadMessage(true);
            setCommentMessageUnread(true)
          }

          //判断如果在路由message路径 并且tab 的key正好不在系统消息 ，才给系统消息上面显示提示标记
          //当前message页面所在导航key
          const messageTabKey = useStore.getState().messageTabKey;
          console.log('messageTabKey:', messageTabKey)
          if (latestPathRef.current === '/message' && messageTabKey !== 'comment-message') {
            setCommentMessageUnread(true)
          }
        });

        // 保存订阅引用
        subscriptionCommentRef.current = sub;
      }

    };

    stompClient.onDisconnect = () => setConnected(false);
    stompClient.onStompError = (error) => console.error('STOMP error:', error);

    stompClient.activate();
  };

  // 跟踪 pathname 实时更新
  useEffect(() => {
    latestPathRef.current = location.pathname;
  }, [location]);

  // 当 tokenId 变化时连接 WebSocket
  useEffect(() => {
    if (!tokenId) return;

    if (client && client.active) {
      client.deactivate().then(() => {
        connectStompClient(tokenId);
      });
    } else {
      connectStompClient(tokenId);
    }
  }, [tokenId]);

  return (
    <StompContext.Provider value={{ client, connected, connectStompClient }}>
      {children}
    </StompContext.Provider>
  );
};
