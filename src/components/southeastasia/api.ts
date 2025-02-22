import axios from 'axios';
import { serverTarget } from '@/common/api';

//请求发送评论参数
export interface SendNewsCommentReqType {
  newsType: any;
  newsId: any;
  replyId?: any;
  topId?: any;
  content: any;
}

//发送评论响应
export interface SendNewsCommentResponseType {
  code: number;
  data: any;
  msg: string;
}

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
  commentCount: number;
  content: string;
  createName: string;
  createTime: string;
  imagePath: string;
  isHot: boolean;
  isTop: boolean;
  readCount: number;
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

//查询东南亚新闻
const SoutheastAsiaNewsPagePath = '/player/southeastAsia/queryPage';
export const SoutheastAsiaNewsPageReq = async (param: SoutheastAsiaNewsPageReqType): Promise<SoutheastAsiaNewsRespType> => {
  return (await axios.post(serverTarget + SoutheastAsiaNewsPagePath, param)).data;
};

//发表新闻评论
const SendNewsCommentPath = '/player/comment/sendNewsComment';
export const Request_SendNewsComment = async (param: SendNewsCommentReqType): Promise<SendNewsCommentResponseType> => {
  return (await axios.post(serverTarget + SendNewsCommentPath, param)).data;
};
