import React, {
  createContext,
  useState,
  useEffect,
  ReactNode,
  useRef,
  useCallback,
} from 'react';
import { Toast } from 'antd-mobile'
import { useLocation } from 'react-router-dom';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import useStore from '@/zustand/store';
import { serverTarget } from '@/common/api';
import { PrivateChatType } from '@/components/privatechat/api';
import { ChatRoomType } from '@components/chatroom/api';

export interface StompContextType {
  client: Client | null;
  connected: boolean;
  connectStompClient: (tokenId: string) => void;
  disconnectStompClient: () => void;
}

export const StompContext = createContext<StompContextType | null>(null);

export const StompProvider = ({ children }: { children: ReactNode }) => {
  const location = useLocation();
  const latestPathRef = useRef(location.pathname);

  const tokenId = useStore((state) => state.tokenId);
  const [client, setClient] = useState<Client | null>(null);
  const [connected, setConnected] = useState(false);

  // 添加连接状态跟踪
  const isConnectingRef = useRef(false);
  const currentTokenRef = useRef<string | null>(null);

  const pushChatMessageToMap = useStore.getState().pushChatMessageToMap;
  const updatePrivateChatList = useStore.getState().updatePrivateChatList;
  const setHasUnreadMessage = useStore.getState().setHasUnreadMessage;
  const chatRoom1List = useStore.getState().chatRoom1List;
  const setChatRoom1List = useStore.getState().setChatRoom1List;

  //评论未读标记
  const setCommentMessageUnread = useStore.getState().setCommentMessageUnread;
  //私信未读标记
  const setPrivateMessageUnread = useStore.getState().setPrivateMessageUnread;
  //系统消息未读标记
  const setSystemMessageUnread = useStore.getState().setSystemMessageUnread;

  const subscriptionRef = useRef<ReturnType<Client['subscribe']> | null>(null);
  const subscriptionSystemRef = useRef<ReturnType<Client['subscribe']> | null>(null);
  const subscriptionCommentRef = useRef<ReturnType<Client['subscribe']> | null>(null);
  const subscriptionRoomRef = useRef<ReturnType<Client['subscribe']> | null>(null);

  // 清理所有订阅的函数
  const unsubscribeAll = useCallback(() => {
    //console.log('StompProvider: Unsubscribing all...');

    if (subscriptionRef.current) {
      try {
        subscriptionRef.current.unsubscribe();
      } catch (error) {
        //console.error('Error unsubscribing private:', error);
      }
      subscriptionRef.current = null;
    }

    if (subscriptionSystemRef.current) {
      try {
        subscriptionSystemRef.current.unsubscribe();
      } catch (error) {
        //console.error('Error unsubscribing system:', error);
      }
      subscriptionSystemRef.current = null;
    }

    if (subscriptionCommentRef.current) {
      try {
        subscriptionCommentRef.current.unsubscribe();
      } catch (error) {
        //console.error('Error unsubscribing comment:', error);
      }
      subscriptionCommentRef.current = null;
    }

    if (subscriptionRoomRef.current) {
      try {
        subscriptionRoomRef.current.unsubscribe();
      } catch (error) {
        //console.error('Error unsubscribing room:', error);
      }
      subscriptionRoomRef.current = null;
    }

    //console.log('StompProvider: All subscriptions cleared');
  }, []);

  // 断开连接的函数
  const disconnectStompClient = useCallback(() => {
    //console.log('StompProvider: Disconnecting...');

    // 清理所有订阅
    unsubscribeAll();

    // 断开客户端连接
    if (client) {
      try {
        if (client.connected || client.active) {
          client.deactivate();
        }
      } catch (error) {
        //console.error('Error deactivating client:', error);
      }
    }

    // 重置状态
    setClient(null);
    setConnected(false);
    isConnectingRef.current = false;
    currentTokenRef.current = null;

    //console.log('StompProvider: Disconnected and cleaned up');
  }, [client, unsubscribeAll]);

  const connectStompClient = useCallback((token: string) => {
    //console.log('StompProvider: Connecting with token:', token);

    // 避免重复连接
    if (isConnectingRef.current) {
      //console.log('StompProvider: Already connecting, skipping');
      return;
    }

    // 如果已经用相同token连接，跳过
    if (client && client.connected && currentTokenRef.current === token) {
      //console.log('StompProvider: Already connected with same token, skipping');
      return;
    }

    // 先断开旧连接
    if (client && (client.connected || client.active)) {
      //console.log('StompProvider: Disconnecting old connection...');
      disconnectStompClient();

      // 给一点时间让旧连接完全断开
      setTimeout(() => {
        createNewConnection(token);
      }, 100);
    } else {
      createNewConnection(token);
    }
  }, [client, disconnectStompClient]);

  const createNewConnection = (token: string) => {
    if (isConnectingRef.current) {
      //console.log('StompProvider: Already connecting, aborting');
      return;
    }

    isConnectingRef.current = true;
    currentTokenRef.current = token;

    //console.log('StompProvider: Creating new STOMP client...');

    const stompClient = new Client({
      webSocketFactory: () => new SockJS(`${serverTarget}/ws?token-id=${token}`),
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
    });

    stompClient.onConnect = () => {
      //console.log('StompProvider: Connected successfully');
      setClient(stompClient);
      setConnected(true);
      isConnectingRef.current = false;

      // 确保在连接成功后再订阅，并且先清理旧订阅
      unsubscribeAll();

      // 私信订阅
      try {
        const privateSub = stompClient.subscribe('/user/queue/private', (message) => {
          //console.log("私信来了:", message.body);
          const msg = JSON.parse(message.body) as PrivateChatType;
          pushChatMessageToMap(msg);
          updatePrivateChatList(msg);

          //console.log('当前所在路由路径:', latestPathRef.current, ',对比结果:', latestPathRef.current !== '/message');
          if (latestPathRef.current !== '/message') {
            setHasUnreadMessage(true);
          }

          const messageTabKey = useStore.getState().messageTabKey;
          if (latestPathRef.current === '/message' && messageTabKey !== 'private-message') {
            setPrivateMessageUnread(true)
          }
        });
        subscriptionRef.current = privateSub;
        //console.log('StompProvider: Private subscription created');
      } catch (error) {
        //console.error('Error creating private subscription:', error);
      }

      // 系统消息订阅
      try {
        const systemSub = stompClient.subscribe('/user/queue/systemMessage', (message) => {
          //console.log("系统消息来了:", message.body);
          //console.log('当前所在路由路径:', latestPathRef.current, ',对比结果:', latestPathRef.current !== '/message');

          if (latestPathRef.current !== '/message') {
            setHasUnreadMessage(true);
            setSystemMessageUnread(true)
          }

          const messageTabKey = useStore.getState().messageTabKey;
          if (latestPathRef.current === '/message' && messageTabKey !== 'system-message') {
            setSystemMessageUnread(true)
          }
        });
        subscriptionSystemRef.current = systemSub;
        //console.log('StompProvider: System subscription created');
      } catch (error) {
        //console.error('Error creating system subscription:', error);
      }

      // 评论消息订阅
      try {
        const commentSub = stompClient.subscribe('/user/queue/commentMessage', (message) => {
          //console.log("评论消息来了:", message.body);
          //console.log('当前所在路由路径:', latestPathRef.current, ',对比结果:', latestPathRef.current !== '/message');

          if (latestPathRef.current !== '/message') {
            setHasUnreadMessage(true);
            setCommentMessageUnread(true)
          }

          const messageTabKey = useStore.getState().messageTabKey;
          //console.log('messageTabKey:', messageTabKey)
          if (latestPathRef.current === '/message' && messageTabKey !== 'comment-message') {
            setCommentMessageUnread(true)
          }
        });
        subscriptionCommentRef.current = commentSub;
        //console.log('StompProvider: Comment subscription created');
      } catch (error) {
        //console.error('Error creating comment subscription:', error);
      }

      // 聊天室订阅
      try {
        const roomSub = stompClient.subscribe('/topic/room/1', (message) => {
          //console.log("聊天室1号收来消息:", message.body)

          if (chatRoom1List) {
            setChatRoom1List(prev => {
              const data = [...prev, JSON.parse(message.body) as ChatRoomType]
              return data.length > 200 ? data.slice(-200) : data;
            })
          }
        });
        subscriptionRoomRef.current = roomSub;
        //console.log('StompProvider: Room subscription created');
      } catch (error) {
        //console.error('Error creating room subscription:', error);
      }
    };

    stompClient.onDisconnect = () => {
      //console.log('StompProvider: Disconnected from server');
      setConnected(false);
      isConnectingRef.current = false;
    };

    stompClient.onStompError = (error) => {
      //console.error('STOMP error:', error);
      isConnectingRef.current = false;
    };

    stompClient.onWebSocketError = (error) => {
      //console.error('WebSocket error:', error);
      isConnectingRef.current = false;
    };

    try {
      stompClient.activate();
      //console.log('StompProvider: Client activation initiated');
    } catch (error) {
      //console.error('Error activating STOMP client:', error);
      isConnectingRef.current = false;
    }
  };

  // 跟踪 pathname 实时更新
  useEffect(() => {
    latestPathRef.current = location.pathname;
  }, [location]);

  // ✅ 关键修复：只监听 tokenId，不包含函数依赖
  useEffect(() => {
    // console.log('StompProvider: TokenId effect triggered:', tokenId);

    const targetToken = tokenId || '1';

    // 如果已经连接到相同的token，跳过
    if (client && client.connected && currentTokenRef.current === targetToken) {
      //console.log('StompProvider: Already connected with target token, skipping');
      return;
    }

    // 连接到新的token
    connectStompClient(targetToken);
  }, [tokenId]); // ✅ 只包含 tokenId 依赖

  // 组件卸载时清理
  useEffect(() => {
    return () => {
      //console.log('StompProvider: Provider unmounting, cleaning up...');
      disconnectStompClient();
    };
  }, []); // ✅ 空依赖数组

  // ✅ 移除函数依赖，避免重新创建
  const contextValue = React.useMemo(() => ({
    client,
    connected,
    connectStompClient,
    disconnectStompClient,
  }), [client, connected]); // ✅ 只包含状态依赖

  return (
    <StompContext.Provider value={contextValue}>
      {children}
    </StompContext.Provider>
  );
};