import axios from 'axios';
import { serverTarget } from '@/common/api';

import { NewsInfoType } from '@/pages/news/api';
export interface NewsType {
  badCount: any;
  category: any;
  commentsCount: any;
  content: any;
  createName: any;
  createTime: any;
  id: any;
  likesCount: any;
  newsStatus: any;
  newsTime: any;
  photoPath: any;
  source: any;
  title: any;
  updateName: any;
  updateTime: any;
  url: any;
  viewCount: any;
}

interface HomeNewsType {
  code: number;
  data: {
    newsList: NewsInfoType[];
    topNews: NewsType;
    onlinePlayerCount: number;
  };
  msg: string;
}

//首页新闻
const HOME_NEWS_PATH = '/player/news/homeNews';
export const Request_HOME_NEWS = async (): Promise<HomeNewsType> => {
  return (await axios.post(serverTarget + HOME_NEWS_PATH, {})).data;
};

export interface NewsRankType {
  newsTopId: any;
  newsTitleTop: any;
  news1Id: any;
  newsTitle1: any;
  news2Id: any;
  newsTitle2: any;
  news3Id: any;
  newsTitle3: any;
}

export interface BannerType {
  title: any | '';
  imagePath: any | '';
  imageType: any;
  newsType: any;
  newsId: any;
}

export interface CompanyRankType {
  companyAddress: any;
  companyName: any;
  companyDescription: any;
  eventTime1: any;
  eventContent1: any;
  eventTime2: any;
  eventContent2: any;
  companyNameList: any;
}

export interface HotLotteryType {
  lotteryTitle: any;
  betIcon1: any;
  betName1: any;
  betAmount1: any;
  odds1: any;
  description1: any;
  betIcon2: any;
  betName2: any;
  betAmount2: any;
  odds2: any;
  description2: any;
  betIcon3: any;
  betName3: any;
  betAmount3: any;
  odds3: any;
  description3: any;
  prizePool: any;
  remainingPrizePool: any;
  drawTime: any;
}

export interface BetRecord {
  id: any;
  createTime: any;
  title: any;
  type: any;
  dealerId: any;
  playerId: any;
  playerName: any;
  playerLevel: any;
  playerAvatar: any;
  chooseNumber: any;
  choose: any;
  odds: any;
  dealerUserId: any;
  dealerUsername: any;
  dealerUserLevel: any;
  dealerAvatar: any;
  betAmount: any;
  amount: any;
  drawTime: any;
  status: number;
}

export interface SoutheastAsiaNewsRankType {
  southeastAsiaTitle1: any;
  southeastAsiaView1: any;
  southeastAsiaCount1: any;
  southeastAsiaTime1: any;
  southeastAsiaCountry1: any;

  southeastAsiaTitle2: any;
  southeastAsiaView2: any;
  southeastAsiaCount2: any;
  southeastAsiaTime2: any;
  southeastAsiaCountry2: any;

  southeastAsiaTitle3: any;
  southeastAsiaView3: any;
  southeastAsiaCount3: any;
  southeastAsiaTime3: any;
  southeastAsiaCountry3: any;

  southeastAsiaTitle4: any;
  southeastAsiaView4: any;
  southeastAsiaCount4: any;
  southeastAsiaTime4: any;
  southeastAsiaCountry4: any;

  southeastAsiaTitle5: any;
  southeastAsiaView5: any;
  southeastAsiaCount5: any;
  southeastAsiaTime5: any;
  southeastAsiaCountry5: any;
}

export interface NewsInfo {
  title: any;
  content: any;
  viewCount: any;
  likesCount: any;
  commentsCount: any;
  newsStatus: any;
  imagePath: any;
  country: any;
  source: any;
  createTime: any;
  createName: any;
  id: any;
}

export interface PoliticsType {
  title: any;
  content: any;
  viewCount: any;
  likesCount: any;
  commentsCount: any;
  newsStatus: any;
  imagePath: any;
  country: any;
  source: any;
  createTime: any;
  createName: any;
  id: any;
}

export interface PromotionType {
  /** 标题1 */
  title1: string;
  area1: string;
  /** 视频链接1 */
  videoPath1: string;
  /** 视频封面1 */
  videoCover1: string;
  /** 图片路径1 */
  imagePath1: string;

  /** 标题2 */
  title2: string;
  area2: string;
  /** 视频链接2 */
  videoPath2: string;
  /** 视频封面2 */
  videoCover2: string;
  /** 图片路径2 */
  imagePath2: string;
}

export interface HomeType {
  onlineCount: number;
  newsRank: NewsRankType;
  bannerList: BannerType[];
  company: CompanyRankType;
  hotLottery: HotLotteryType;
  southeastAsiaNewsRank: SoutheastAsiaNewsRankType;
  betOrderList: BetRecord[];
  politicsList: PoliticsType[];
  promotion: PromotionType;
}

interface Resp {
  code: number;
  msg: string;
  data: HomeType;
}

//首页新闻
const HOME_PATH = '/player/news/home';
export const Request_HOME = async (): Promise<Resp> => {
  return (await axios.post(serverTarget + HOME_PATH, {})).data;
};
