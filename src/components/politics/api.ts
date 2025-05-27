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
export interface PoliticsPageRespType {
  code: number;
  msg: string;
  data: PageResponseType;
}

//分页返回数据
interface PageResponseType {
  current?: any | null;
  pages?: any | null;
  records?: PoliticsType[] | null;
  size?: any | null;
  total?: any | null;
}

//政治新闻返回类型
export interface PoliticsType {
  id: string;
  title: string;
  content: string;
  viewCount: number;
  likesCount: number;
  commentsCount: number;
  createName: string;
  createTime: string;
  imagePath: string;
  country: string;
  source: string;
  newsStatus: number;
}

//政治新闻返回类型
export interface PoliticsPageReqType {
  pageNum: number;
  pageSize: number;
}

export interface PoliticsFindReqType {
  id: string | undefined;
}

export interface PoliticsFindRespType {
  code: number;
  msg: string;
  data: PoliticsType;
}

//分页政治新闻
const PoliticsPagePath = '/player/politics/page';
export const PoliticsPage_Request = async (param: PoliticsPageReqType): Promise<PoliticsPageRespType> => {
  return (await axios.post(serverTarget + PoliticsPagePath, param)).data;
};

//指定查询政治新闻
const PoliticsFindPath = '/player/politics/find';
export const PoliticsFind_Requset = async (param: PoliticsFindReqType): Promise<PoliticsFindRespType> => {
  return (await axios.post(serverTarget + PoliticsFindPath, param)).data;
};
