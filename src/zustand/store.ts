import { create } from 'zustand';
import { PlayerInfoType } from '@/pages/personal/api';
import { NewsInfoType } from '@/pages/news/api';

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

  newsList: NewsInfoType[]; //新闻页的新闻类型列表
  setNewsList: (newsList: NewsInfoType[]) => void;

  sportList: NewsInfoType[]; //新闻页的体育新闻
  setSportList: (sportList: NewsInfoType[]) => void;

  entertainmentList: NewsInfoType[]; //新闻页的娱乐新闻
  setEntertainmentList: (entertainmentList: NewsInfoType[]) => void;

  militaryList: NewsInfoType[];//新闻页的军事新闻
  setMilitaryList: (militaryList: NewsInfoType[]) => void;

  scienceList: NewsInfoType[];//新闻页的科技新闻
  setScienceList: (scienceList: NewsInfoType[]) => void;

  favorList: NewsInfoType[];//新闻页的人情新闻
  setFavorList: (favorList: NewsInfoType[]) => void;

  netFriendList: NewsInfoType[];//新闻页的网友新闻
  setNetFriendList: (netFriendList: NewsInfoType[]) => void;




}




const useStore = create<AppState>((set) => ({
  playerInfo: null,
  setPlayerInfo: (playerInfo) => set(() => ({playerInfo})),

  newsInfoList: null,
  setNewsInfoList: (newsInfoList) => set(() => ({newsInfoList})),

  topNewsTitleHtml: null,
  setTopNewsTitleHtml: (topNewsTitleHtml) => set(()=>({topNewsTitleHtml})),

  onlinePlayerCount: 0,
  setOnlinePlayerCount: (onlinePlayerCount) => set(()=>({onlinePlayerCount})),

  newsList: [],
  setNewsList: (newsList) => set(()=>({newsList})),

  sportList: [],
  setSportList: (sportList) => set(()=>({sportList})),

  entertainmentList: [],
  setEntertainmentList: (entertainmentList) => set(()=>({entertainmentList})),

  militaryList: [],
  setMilitaryList: (militaryList) => set(() => ({militaryList})),

  scienceList: [],
  setScienceList: (scienceList) => set(() => ({scienceList})),

  favorList: [],
  setFavorList: (favorList) => set(() => ({favorList})),

  netFriendList: [],
  setNetFriendList: (netFriendList) => set(() => ({netFriendList}))
}));

export default useStore;
