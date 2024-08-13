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

  onlinePlayerCount: number;
  setOnlinePlayerCount: (randomOnlineCount: number) => void;

  /**新闻页 */

  //新闻页的新闻类型列表
  newsList: NewsInfoType[];
  setNewsList: (newsList: NewsInfoType[]) => void;
  newsHasMore: boolean;
  setNewsHasMore: (newsHasMore: boolean) => void;
  newsPage: number;
  setNewsPage: (newsPage: (prev: number) => number) => void; // 这里的类型修改

  //新闻页的体育新闻
  sportList: NewsInfoType[];
  setSportList: (sportList: NewsInfoType[]) => void;
  sportHasMore: boolean;
  setSportHasMore: (sportHasMore: boolean) => void;
  sportPage: number;
  setSportPage: (sportPage: (prev: number) => number) => void; // 这里的类型修改

  //新闻页的娱乐新闻
  entertainmentList: NewsInfoType[];
  setEntertainmentList: (entertainmentList: NewsInfoType[]) => void;
  entertainmentHasMore: boolean;
  setEntertainmentHasMore: (entertainmentHasMore: boolean) => void;
  entertainmentPage: number;
  setEntertainmentPage: (entertainmentPage: (prev: number) => number) => void; // 这里的类型修改

  //新闻页的军事新闻
  militaryList: NewsInfoType[];
  setMilitaryList: (militaryList: NewsInfoType[]) => void;
  militaryHasMore: boolean;
  setMilitaryHasMore: (militaryHasMore: boolean) => void;
  militaryPage: number;
  setMilitaryPage: (militaryPage: (prev: number) => number) => void; // 这里的类型修改

  //新闻页的科技新闻
  scienceList: NewsInfoType[];
  setScienceList: (scienceList: NewsInfoType[]) => void;
  scienceHasMore: boolean;
  setScienceHasMore: (scienceHasMore: boolean) => void;
  sciencePage: number;
  setSciencePage: (sciencePage: (prev: number) => number) => void; // 这里的类型修改

  //新闻页的网友新闻
  netFriendList: NewsInfoType[];
  setNetFriendList: (netFriendList: NewsInfoType[]) => void;
  netFriendHasMore: boolean;
  setNetFriendHasMore: (netFriendHasMore: boolean) => void;
  netFriendPage: number;
  setNetFriendPage: (netFriendPage: (prev: number) => number) => void; // 这里的类型修改

  //东南亚
  southeastAsiaList: NewsInfoType[],
  setSoutheastAsiaList: (southeastAsiaList: NewsInfoType[]) => void;
  southeastAsiaMore: boolean;
  setSoutheastAsiaMore: (southeastAsiaMore: boolean) => void;
  southeastAsiaPage: number;
  setSoutheastAsiaPage: (southeastAsiaPage: (prev: number) => number) => void;


  //youtube
  youtubeList: NewsInfoType[];
  setYoutubeList: (youtubeList: NewsInfoType[]) => void;
  youtubeMore: boolean;
  setYoutubeMore: (youtubeMore: boolean) => void;
  youtubePage: number;
  setYoutubePage: (youtubePage: (prev: number) => number) => void;

  //保存新闻列表屏幕位置
  scrollPosition: number;
  setScrollPosition: (scrollPosition: SetStateAction<number>) => void;
  // 其他状态

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

  //运动类型新闻
  sportList: [],
  setSportList: (sportList) => set(() => ({ sportList })),
  sportHasMore: true,
  setSportHasMore: (sportHasMore) => set(() => ({ sportHasMore })),
  sportPage: 1,
  setSportPage: (sportPage) => set((state) => ({ sportPage: sportPage(state.sportPage) })),

  //娱乐新闻类型
  entertainmentList: [],
  setEntertainmentList: (entertainmentList) => set(() => ({ entertainmentList })),
  entertainmentHasMore: true,
  setEntertainmentHasMore: (entertainmentHasMore) => set(() => ({ entertainmentHasMore })),
  entertainmentPage: 1,
  setEntertainmentPage: (entertainmentPage) => set((state) => ({ entertainmentPage: entertainmentPage(state.entertainmentPage) })),

  //军事新闻
  militaryList: [],
  setMilitaryList: (militaryList) => set(() => ({ militaryList })),
  militaryHasMore: true,
  setMilitaryHasMore: (militaryHasMore) => set(() => ({ militaryHasMore })),
  militaryPage: 1,
  setMilitaryPage: (militaryPage) => set((state) => ({ militaryPage: militaryPage(state.militaryPage) })),

  //科技新闻
  scienceList: [],
  setScienceList: (scienceList) => set(() => ({ scienceList })),
  scienceHasMore: true,
  setScienceHasMore: (scienceHasMore) => set(() => ({ scienceHasMore })),
  sciencePage: 1,
  setSciencePage: (sciencePage) => set((state) => ({ sciencePage: sciencePage(state.sciencePage) })),

  //网友新闻
  netFriendList: [],
  setNetFriendList: (netFriendList) => set(() => ({ netFriendList })),
  netFriendHasMore: true,
  setNetFriendHasMore: (netFriendHasMore) => set(() => ({ netFriendHasMore })),
  netFriendPage: 1,
  setNetFriendPage: (netFriendPage) => set((state) => ({ netFriendPage: netFriendPage(state.netFriendPage) })),

  //东南亚
  southeastAsiaList: [],
  setSoutheastAsiaList: (southeastAsiaList) => set(() => ({ southeastAsiaList })),
  southeastAsiaMore: true,
  setSoutheastAsiaMore: (southeastAsiaMore) => set(() => ({ southeastAsiaMore })),
  southeastAsiaPage: 1,
  setSoutheastAsiaPage: (southeastAsiaPage) => set((state) => ({ southeastAsiaPage: southeastAsiaPage(state.southeastAsiaPage) })),

  //youtube
  youtubeList: [],
  setYoutubeList: (youtubeList) => set(() => ({ youtubeList })),
  youtubeMore: true,
  setYoutubeMore: (youtubeMore) => set(() => ({ youtubeMore })),
  youtubePage: 1,
  setYoutubePage: (youtubePage) => set((state) => ({ youtubePage: youtubePage(state.youtubePage) })),


  //保存滚动位置
  scrollPosition: 0,
  setScrollPosition: (scrollPosition) => set((state) => ({
    scrollPosition: typeof scrollPosition === 'function' ? scrollPosition(state.scrollPosition) : scrollPosition,
  })),
}));

export default useStore;