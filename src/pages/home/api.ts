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
  newsTitleTop: any;
  newsTitle1: any;
  newsTitle2: any;
  newsTitle3: any;
}

export interface BannerType {
  title: any | '';
  imagePath: any | '';
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
}

export interface HomeType {
  onlineCount: number;
  newsRank: NewsRankType;
  bannerList: BannerType[];
  company: CompanyRankType;
  hotLottery: HotLotteryType;
  southeastAsiaNewsRank: SoutheastAsiaNewsRankType;
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
