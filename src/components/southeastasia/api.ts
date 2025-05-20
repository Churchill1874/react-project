import axios from 'axios';
import { serverTarget } from '@/common/api';

//查询新闻响应
export interface SoutheastAsiaNewsRespType {
  code: number;
  msg: string;
  data: PageResponseType;
}

//分页返回数据
interface PageResponseType {
  current?: any | null;
  pages?: any | null;
  records?: SoutheastAsiaNewsType[] | null;
  size?: any | null;
  total?: any | null;
}

//东南亚新闻返回类型
export interface SoutheastAsiaNewsType {
  id: number;
  area: string;
  commentsCount: number;
  content: string;
  createName: string;
  createTime: string;
  imagePath: string;
  isHot: boolean;
  isTop: boolean;
  viewCount: number;
  source: string;
  status: boolean;
  title: string;
}

//东南亚新闻返回类型
export interface SoutheastAsiaNewsPageReqType {
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

export interface SoutheastAsiaFindReqType {
  id: string;
}

export interface SoutheastAsiaFindRespType {
  code: number;
  msg: string;
  data: SoutheastAsiaNewsType;
}

//查询东南亚新闻
const SoutheastAsiaNewsPagePath = '/player/southeastAsia/queryPage';
export const SoutheastAsiaNewsPage_Request = async (param: SoutheastAsiaNewsPageReqType): Promise<SoutheastAsiaNewsRespType> => {
  return (await axios.post(serverTarget + SoutheastAsiaNewsPagePath, param)).data;
};

//指定查询政治新闻
const SoutheastAsiaFindPath = '/player/southeastAsia/find';
export const SoutheastAsiaFind_Requset = async (param: SoutheastAsiaFindReqType): Promise<SoutheastAsiaFindRespType> => {
  return (await axios.post(serverTarget + SoutheastAsiaFindPath, param)).data;
};
