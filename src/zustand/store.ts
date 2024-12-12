import { create } from 'zustand';
import { PlayerInfoType } from '@/pages/personal/api';
import { NewsInfoType } from '@/pages/news/api';
import { SoutheastAsiaNewsType } from '@/components/southeastasia/api';
import { CompanyPageType } from '@/components/company/api'

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

  //东南亚新闻列表
  southeastAsiaNewsList: SoutheastAsiaNewsType[];
  setSoutheastAsiaNewsList: ( southeastAsiaNewsList: SoutheastAsiaNewsType[] ) => void;
  southeastAsiaNewsHasHore: boolean;
  setSoutheastAsiaNewsHasHore: ( southeastAsiaNewsHasHore: boolean ) => void;
  southeastAsiaNewsPage: number;
  setSoutheastAsiaNewsPage: (southeastAsiaNewsPage: (prev: number) => number) => void;

  //公司及公司事件列表
  companyList: CompanyPageType[];
  setCompanyList: (companyList: CompanyPageType[]) => void;
  companyHasHore: boolean;
  setCompanyHasHore: (companyHasHore: boolean) => void;
  companyPage: number;
  setCompanyPage: (companyPage: (prev: number) => number) => void;
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


  //东南亚新闻
  southeastAsiaNewsList: [],
  setSoutheastAsiaNewsList: (southeastAsiaNewsList) => set(() => ({southeastAsiaNewsList})),
  southeastAsiaNewsHasHore: true,
  setSoutheastAsiaNewsHasHore: (southeastAsiaNewsHasHore) => set(() => ({southeastAsiaNewsHasHore})),
  southeastAsiaNewsPage: 1,
  setSoutheastAsiaNewsPage: (southeastAsiaNewsPage) => set((state) => ({southeastAsiaNewsPage: southeastAsiaNewsPage(state.southeastAsiaNewsPage)})),

  //公司信息
  companyList: [],
  setCompanyList: (companyList) => set(()=>({companyList})),
  companyHasHore: true,
  setCompanyHasHore: (companyHasHore) => set(()=>({companyHasHore})),
  companyPage: 1,
  setCompanyPage: (companyPage) => set((state) => ({companyPage: companyPage(state.companyPage)}))
}));

export default useStore;