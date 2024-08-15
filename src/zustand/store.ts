import { create } from 'zustand';
import { PlayerInfoType } from '@/pages/personal/api';
import { NewsInfoType } from '@/pages/news/api';

type SetStateAction<T> = T | ((prevState: T) => T);

//定义综合状态类型
interface AppState {
  /**用户信息 */
  playerInfo: PlayerInfoType | null;
  setPlayerInfo: (playerInfo: PlayerInfoType | null) => void;

  newsInfoList: NewsInfoType[] | null;
  setNewsInfoList: (newsInfo: NewsInfoType[] | null) => void;

  /**首页 */
  topNewsTitleHtml: JSX.Element | null;
  setTopNewsTitleHtml: (topNewsTitle: JSX.Element | null) => void;

  /**
   * 在线人数
   */
  onlinePlayerCount: number;
  setOnlinePlayerCount: (randomOnlineCount: number) => void;

  //新闻页的新闻列表
  newsList: NewsInfoType[];
  setNewsList: (newsList: NewsInfoType[]) => void;
  newsHasMore: boolean;
  setNewsHasMore: (newsHasMore: boolean) => void;
  newsPage: number;
  setNewsPage: (newsPage: (prev: number) => number) => void; // 这里的类型修改

  //保存新闻列表屏幕位置
  scrollPosition: number;
  setScrollPosition: (scrollPosition: SetStateAction<number>) => void;

}

const useStore = create<AppState>((set) => ({
  playerInfo: null,  //玩家信息
  setPlayerInfo: (playerInfo) => set(() => ({ playerInfo })),
  topNewsTitleHtml: null,//置顶新闻
  setTopNewsTitleHtml: (topNewsTitleHtml) => set(() => ({ topNewsTitleHtml })),
  onlinePlayerCount: 0,//在线人数
  setOnlinePlayerCount: (onlinePlayerCount) => set(() => ({ onlinePlayerCount })),
  newsInfoList: null,//新闻首页新闻
  setNewsInfoList: (newsInfoList) => set(() => ({ newsInfoList })),

  
  //新闻类型页
  newsList: [],
  setNewsList: (newsList) => set(() => ({ newsList })),
  newsHasMore: true,
  setNewsHasMore: (newsHasMore) => set(() => ({ newsHasMore })),
  newsPage: 1,
  setNewsPage: (newsPage) => set((state) => ({ newsPage: newsPage(state.newsPage) })),


  //保存滚动位置
  scrollPosition: 0,
  setScrollPosition: (scrollPosition) => set((state) => ({
    scrollPosition: typeof scrollPosition === 'function' ? scrollPosition(state.scrollPosition) : scrollPosition,
  })),
}));

export default useStore;