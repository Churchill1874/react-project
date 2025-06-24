import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { PlayerInfoType } from '@/pages/personal/api';
import { NewsInfoType } from '@/pages/news/api';
import { PrivateChatType, PrivateChatListType } from '@/components/privatechat/api';

interface AppState {
  playerInfo: PlayerInfoType | null;
  setPlayerInfo: (playerInfo: PlayerInfoType | null) => void;

  newsInfoList: NewsInfoType[] | null;
  setNewsInfoList: (newsInfo: NewsInfoType[] | null) => void;

  topNewsTitleHtml: JSX.Element | null;
  setTopNewsTitleHtml: (topNewsTitle: JSX.Element | null) => void;

  onlinePlayerCount: number;
  setOnlinePlayerCount: (randomOnlineCount: number) => void;

  //底部消息导航未读消息标记
  hasUnreadMessage: boolean;
  setHasUnreadMessage: (v: boolean) => void;

  //私信未读标记
  privateMessageUnread: boolean;
  setPrivateMessageUnread: (privateMessageUnread: boolean) => void;

  //系统消息未读标记
  systemMessageUnread: boolean;
  setSystemMessageUnread: (systemMessageUnread: boolean) => void;

  //收到的评论未读消息标记
  commentMessageUnread: boolean;
  setCommentMessageUnread: (commentMessageUnread: boolean) => void;

  //当前消息页面的tab key
  messageTabKey: string;
  setMessageTabKey: (messageTabKey: string) => void;

  tokenId: string;
  setTokenId: (tokenId: string) => void;

  chatMessageMap: Map<string, PrivateChatType[]>;
  setChatMessageMap: (map: Map<string, PrivateChatType[]>) => void;
  pushChatMessageToMap: (msg: PrivateChatType) => void;

  privateChatList: PrivateChatListType[];
  setPrivateChatList: (listOrFn: PrivateChatListType[] | ((prev: PrivateChatListType[]) => PrivateChatListType[])) => void;
  updatePrivateChatList: (msg: PrivateChatType) => void;
  markNotReadFalseByReceiveId: (targetId: string) => void;
}

const useStore = create<AppState>()(
  persist(
    set => ({
      playerInfo: null,
      setPlayerInfo: playerInfo => set(() => ({ playerInfo })),

      newsInfoList: null,
      setNewsInfoList: newsInfoList => set(() => ({ newsInfoList })),

      topNewsTitleHtml: null,
      setTopNewsTitleHtml: topNewsTitleHtml => set(() => ({ topNewsTitleHtml })),

      onlinePlayerCount: 0,
      setOnlinePlayerCount: onlinePlayerCount => set(() => ({ onlinePlayerCount })),

      hasUnreadMessage: false,
      setHasUnreadMessage: v => set({ hasUnreadMessage: v }),

      privateMessageUnread: false,
      setPrivateMessageUnread: privateMessageUnread => set(() => ({ privateMessageUnread })),

      systemMessageUnread: false,
      setSystemMessageUnread: systemMessageUnread => set(() => ({ systemMessageUnread })),

      commentMessageUnread: false,
      setCommentMessageUnread: commentMessageUnread => set(() => ({ commentMessageUnread })),

      messageTabKey: 'private-message',
      setMessageTabKey: messageTabKey => set(() => ({ messageTabKey })),

      tokenId: '',
      setTokenId: tokenId => set({ tokenId }),

      chatMessageMap: new Map(),
      setChatMessageMap: map => set(() => ({ chatMessageMap: map })),

      pushChatMessageToMap: msg =>
        set(state => {
          const playerId = state.playerInfo?.id;
          if (!playerId) return {};

          const otherId = msg.sendId === playerId ? msg.receiveId : msg.sendId;
          const oldMessages = state.chatMessageMap.get(otherId) || [];
          const newMessages = [...oldMessages, msg];
          const newMap = new Map(state.chatMessageMap);
          newMap.set(otherId, newMessages);

          return { chatMessageMap: newMap };
        }),

      privateChatList: [],
      setPrivateChatList: listOrFn =>
        set(state => ({
          privateChatList: typeof listOrFn === 'function' ? listOrFn(state.privateChatList) : listOrFn,
        })),

      //更新聊天的外层列表
      updatePrivateChatList: msg =>
        set(state => {
          const playerId = state.playerInfo?.id;
          if (!playerId || !msg.sendId || !msg.receiveId) return {};
          //找到聊天对方id
          const otherId = msg.sendId === playerId ? msg.receiveId : msg.sendId;
          const foundIndex = state.privateChatList.findIndex(item => (item.sendId === otherId && item.receiveId === playerId) || (item.receiveId === otherId && item.sendId === playerId));

          let newList = [...state.privateChatList];

          //如果当前聊天列表已经存在对方 就更新对方最后一次给我发信息的时间和内容 否则 就插入一个新的
          if (foundIndex >= 0) {
            newList[foundIndex] = {
              ...newList[foundIndex],
              content: msg.content,
              createTime: msg.createTime,
              notRead: playerId !== msg.sendId,
            };
          } else {
            newList.unshift({
              id: '-1',
              sendId: msg.sendId,
              receiveId: msg.receiveId,
              sendName: msg.sendId === playerId ? state.playerInfo?.name : '',
              receiveName: msg.receiveId === playerId ? state.playerInfo?.name : '',
              sendAvatarPath: msg.sendId === playerId ? state.playerInfo?.avatarPath : '',
              receiveAvatarPath: msg.receiveId === playerId ? state.playerInfo?.avatarPath : '',
              sendLevel: '',
              receiveLevel: '',
              content: msg.content,
              createTime: msg.createTime,
              notRead: playerId !== msg.sendId,
              status: false,
              createName: '',
            });
          }

          newList.sort((a, b) => new Date(b.createTime).getTime() - new Date(a.createTime).getTime());

          return { privateChatList: newList };
        }),

      markNotReadFalseByReceiveId: targetId =>
        set(state => ({
          privateChatList: state.privateChatList.map(item => (item.sendId === targetId ? { ...item, notRead: false } : item)),
        })),
    }),
    {
      name: 'app-storage',
      partialize: state => ({ playerInfo: state.playerInfo, tokenId: state.tokenId }),
    },
  ),
);

export default useStore;
