import axios from 'axios';
import { serverTarget } from '@/common/api';
interface NewsType {
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
    newsList: NewsType[];
    topNews: NewsType;
  };
  msg: string;
}

//首页新闻
const HOME_NEWS_PATH = '/player/news/homeNews';
export const Request_HOME_NEWS = async (): Promise<HomeNewsType> => {
  return (await axios.post(serverTarget + HOME_NEWS_PATH, {})).data;
};
