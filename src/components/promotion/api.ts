import axios from 'axios';
import { serverTarget } from '@/common/api';

//查询新闻响应
export interface PromotionRespType {
  code: number;
  msg: string;
  data: PageResponseType;
}

//分页返回数据
interface PageResponseType {
  current?: any | null;
  pages?: any | null;
  records?: PromotionType[] | null;
  size?: any | null;
  total?: any | null;
}

//东南亚新闻返回类型
export interface PromotionType {
  id: number;
  area: string;
  commentsCount: number;
  content: string;
  createName: string;
  createTime: string;
  imagePath: string | null;
  contact: string;
  isTop: boolean;
  videoPath: string;
  videoCover: string;
  viewCount: number;
  type: number;
  status: boolean;
  title: string;
  price: string;
}

//东南亚新闻返回类型
export interface PromotionPageReqType {
  pageNum: number;
  pageSize: number;
  id?: number;
  area?: string;
  type?: number;
  startTime?: string;
  endTime?: string;
  isTop?: boolean;
  source?: string;
  status?: boolean;
}

export interface PromotionFindReqType {
  id: string;
}

export interface PromotionFindRespType {
  code: number;
  msg: string;
  data: PromotionType;
}

//分页社会新闻
const PromotionPagePath = '/player/promotion/queryPage';
export const PromotionPage_Request = async (param: PromotionPageReqType): Promise<PromotionRespType> => {
  return (await axios.post(serverTarget + PromotionPagePath, param)).data;
};

//指定查询社会新闻
const PromotionFindPath = '/player/promotion/find';
export const PromotionFind_Requset = async (param: PromotionFindReqType): Promise<PromotionFindRespType> => {
  return (await axios.post(serverTarget + PromotionFindPath, param)).data;
};
