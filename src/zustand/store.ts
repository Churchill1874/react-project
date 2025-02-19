import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { PlayerInfoType } from '@/pages/personal/api';
import { NewsInfoType } from '@/pages/news/api';
import { CompanyPageType } from '@/components/company/api';

// 定义综合状态类型
interface AppState {
  /** 用户信息 */
  playerInfo: PlayerInfoType | null;
  setPlayerInfo: (playerInfo: PlayerInfoType | null) => void;

  newsInfoList: NewsInfoType[] | null;
  setNewsInfoList: (newsInfo: NewsInfoType[] | null) => void;

  /** 首页 */
  topNewsTitleHtml: JSX.Element | null;
  setTopNewsTitleHtml: (topNewsTitle: JSX.Element | null) => void;

  /** 在线人数 */
  onlinePlayerCount: number;
  setOnlinePlayerCount: (randomOnlineCount: number) => void;
}

const useStore = create<AppState>()(
  persist(
    set => ({
      playerInfo: null, // 玩家信息
      setPlayerInfo: playerInfo => set(() => ({ playerInfo })),

      // 其他状态
      topNewsTitleHtml: null,
      setTopNewsTitleHtml: topNewsTitleHtml => set(() => ({ topNewsTitleHtml })),
      onlinePlayerCount: 0,
      setOnlinePlayerCount: onlinePlayerCount => set(() => ({ onlinePlayerCount })),
      newsInfoList: null,
      setNewsInfoList: newsInfoList => set(() => ({ newsInfoList })),
    }),
    {
      name: 'app-storage', // 存储到 localStorage 的键名
      partialize: state => ({ playerInfo: state.playerInfo }), // 仅持久化 playerInfo
    },
  ),
);

export default useStore;
