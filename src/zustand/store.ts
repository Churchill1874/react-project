import { create } from 'zustand';
import { PlayerInfoType } from '@/pages/personal/api';
import { NewsInfoType } from '@/pages/news/api';

//定义综合状态类型
interface AppState {
  playerInfo: PlayerInfoType | null;
  setPlayerInfo: (playerInfo: PlayerInfoType | null) => void;


  newsInfoList: NewsInfoType[] | null;
  setNewsInfoList: (newsInfo: NewsInfoType[] | null) => void;

  topNewsTitleHtml: JSX.Element | null;
  setTopNewsTitleHtml: (topNewsTitle: JSX.Element | null) => void;
}



const useStore = create<AppState>((set) => ({
  playerInfo: null,
  setPlayerInfo: (playerInfo) => set(() => ({playerInfo})),

  newsInfoList: null,
  setNewsInfoList: (newsInfoList) => set(() => ({newsInfoList})),

  topNewsTitleHtml: null,
  setTopNewsTitleHtml: (topNewsTitleHtml) => set(()=>({topNewsTitleHtml}))
}));

export default useStore;
