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
