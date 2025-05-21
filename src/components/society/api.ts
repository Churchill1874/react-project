import axios from 'axios';
import { serverTarget } from '@/common/api';

//查询新闻响应
export interface SocietyRespType {
  code: number;
  msg: string;
  data: PageResponseType;
}

//分页返回数据
interface PageResponseType {
  current?: any | null;
  pages?: any | null;
  records?: SocietyType[] | null;
  size?: any | null;
  total?: any | null;
}

//东南亚新闻返回类型
export interface SocietyType {
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
  source: string;
  status: boolean;
  title: string;
}

//东南亚新闻返回类型
export interface SocietyPageReqType {
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

export interface SocietyFindReqType {
  id: string;
}

export interface SocietyFindRespType {
  code: number;
  msg: string;
  data: SocietyType;
}

//分页社会新闻
const SocietyPagePath = '/player/society/queryPage';
export const SocietyPage_Request = async (param: SocietyPageReqType): Promise<SocietyRespType> => {
  return (await axios.post(serverTarget + SocietyPagePath, param)).data;
};

//指定查询社会新闻
const SocietyFindPath = '/player/society/find';
export const SocietyFind_Requset = async (param: SocietyFindReqType): Promise<SocietyFindRespType> => {
  return (await axios.post(serverTarget + SocietyFindPath, param)).data;
};
