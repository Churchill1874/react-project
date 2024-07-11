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

  newsList: NewsInfoType[] | null; //新闻页的新闻类型列表
  setNewsList: (newsList: NewsInfoType[] | null) => void;

  sportList: NewsInfoType[] | null; //新闻页的体育新闻
  setSportList: (sportList: NewsInfoType[] | null) => void;

  entertainmentList: NewsInfoType[] | null; //新闻页的娱乐新闻
  setEntertainmentList: (entertainmentList: NewsInfoType[] | null) => void;

  militaryList: NewsInfoType[] | null;//新闻页的军事新闻
  setMilitaryList: (militaryList: NewsInfoType[] | null) => void;

  scienceList: NewsInfoType[] | null;//新闻页的科技新闻
  setScienceList: (scienceList: NewsInfoType[] | null) => void;

  favorList: NewsInfoType[] | null;//新闻页的人情新闻
  setFavorList: (favorList: NewsInfoType[] | null) => void;

  netFriendList: NewsInfoType[] | null;//新闻页的网友新闻
  setNetFriendList: (netFriendList: NewsInfoType[] | null) => void;




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

  newsList: null,
  setNewsList: (newsList) => set(()=>({newsList})),

  sportList: null,
  setSportList: (sportList) => set(()=>({sportList})),

  entertainmentList: null,
  setEntertainmentList: (entertainmentList) => set(()=>({entertainmentList})),

  militaryList: null,
  setMilitaryList: (militaryList) => set(() => ({militaryList})),

  scienceList: null,
  setScienceList: (scienceList) => set(() => ({scienceList})),

  favorList: null,
  setFavorList: (favorList) => set(() => ({favorList})),

  netFriendList: null,
  setNetFriendList: (netFriendList) => set(() => ({netFriendList}))
}));

export default useStore;
