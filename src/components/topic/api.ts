import axios from 'axios';
import { serverTarget } from '@/common/api';

//查询新闻响应
export interface TopicRespType {
  code: number;
  msg: string;
  data: PageResponseType;
}

//分页返回数据
interface PageResponseType {
  current?: any | null;
  pages?: any | null;
  records?: TopicType[] | null;
  size?: any | null;
  total?: any | null;
}

//东南亚新闻返回类型
export interface TopicType {
  id: number;
  area: string;
  commentsCount: number;
  content: string;
  createName: string;
  createTime: string;
  imagePath: string;
  isHot: boolean;
  isTop: boolean;
  videoPath: string;
  videoCover: string;
  viewCount: number;
  type: string;
  status: boolean;
  title: string;
}

//东南亚新闻返回类型
export interface TopicPageReqType {
  pageNum: number;
  pageSize: number;
  id?: number;
  area?: string;
  content?: string;
  startTime?: string;
  endTime?: string;
  isHot?: boolean;
  isTop?: boolean;
  source?: string;
  status?: boolean;
}

export interface TopicFindReqType {
  id: string;
}

export interface TopicFindRespType {
  code: number;
  msg: string;
  data: TopicType;
}

//分页社会新闻
const TopicPagePath = '/player/topic/queryPage';
export const TopicPage_Request = async (param: TopicPageReqType): Promise<TopicRespType> => {
  return (await axios.post(serverTarget + TopicPagePath, param)).data;
};

//指定查询社会新闻
const TopicFindPath = '/player/topic/find';
export const TopicFind_Requset = async (param: TopicFindReqType): Promise<TopicFindRespType> => {
  return (await axios.post(serverTarget + TopicFindPath, param)).data;
};
