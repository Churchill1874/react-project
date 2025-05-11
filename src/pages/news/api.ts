import axios from 'axios';
import { serverTarget } from '@/common/api';

export interface NewsPageRequestType {
  categoryEnum?: any | null;
  commentsSort?: any | null;
  endTime?: any | null;
  likesSort?: any | null;
  newsStatus?: any | null;
  pageNum: any;
  pageSize: any;
  startTime?: any | null;
  title?: any | null;
  viewSort?: any | null;
}

export interface NewsInfoType {
  category?: any | null;
  commentsCount?: any | null;
  content?: any | null;
  contentImagePath?: any | null;
  createName?: any | null;
  createTime?: any | null;
  filterContent?: any | null;
  id?: any | null;
  likesCount?: any | null;
  newsStatus?: any | null;
  photoPath?: any | null;
  source?: any | null;
  title?: any | null;
  updateName?: any | null;
  updateTime?: any | null;
  url?: any | null;
  viewCount?: any | null;
  newsTab?: any;
  newsList?: NewsInfoType[];
  setNewsList?: React.Dispatch<React.SetStateAction<NewsInfoType[]>>;
  setVisibleCloseRight?: any;
}
interface PageResponseType {
  current?: any | null;
  pages?: any | null;
  records?: NewsInfoType[] | null;
  size?: any | null;
  total?: any | null;
}

export interface NewsPageResponseType {
  code: any;
  data: PageResponseType;
  msg: any;
}

//新闻分页查询
const NewsPagePath = '/player/news/page';
export const Request_NewsPage = async (newsPage: NewsPageRequestType): Promise<NewsPageResponseType> => {
  return (await axios.post(serverTarget + NewsPagePath, newsPage)).data;
};
