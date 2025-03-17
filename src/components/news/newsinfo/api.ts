import axios from 'axios';
import { serverTarget } from '@/common/api';

import { CommentType } from '@/components/comment/api';

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
  data: CommentType;
  msg: string;
}
//查询新闻请求参数
export interface NewsInfoReqType {
  id: number;
}
//新闻信息类型
export interface NewsInfoType {
  category: number;
  commentsCount: number;
  content: string;
  contentImagePath: string;
  createName: string;
  createTime: string;
  filterContent: string;
  id: number;
  likesCount: number;
  newsStatus: boolean;
  photoPath: string;
  source: string;
  title: string;
  updateName: string;
  updateTime: string;
  url: string;
  viewCount: number;
}

//查询新闻响应
export interface NewsInfoRespType {
  code: number;
  msg: string;
  data: NewsInfoType;
}

//点赞请求类型
export interface IncreaseLikesCountReqType {
  id: number;
}

//查询新闻响应
export interface IncreaseLikesCountRespType {
  code: number;
  msg: string;
  data: { value: boolean };
}

//发表新闻评论
const SendNewsCommentPath = '/player/comment/sendNewsComment';
export const Request_SendNewsComment = async (param: SendNewsCommentReqType): Promise<SendNewsCommentResponseType> => {
  return (await axios.post(serverTarget + SendNewsCommentPath, param)).data;
};

//查询新闻详情
const NewsInfoPath = '/player/news/find';
export const Request_NewsInfo = async (param: NewsInfoReqType): Promise<NewsInfoRespType> => {
  return (await axios.post(serverTarget + NewsInfoPath, param)).data;
};

//点赞新闻
const IncreaseLikesCountPath = '/player/news/increaseLikesCount';
export const Request_IncreaseLikesCount = async (param: IncreaseLikesCountReqType): Promise<IncreaseLikesCountRespType> => {
  return (await axios.post(serverTarget + IncreaseLikesCountPath, param)).data;
};
