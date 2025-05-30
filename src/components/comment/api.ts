import axios from 'axios';
import { serverTarget } from '@/common/api';

//请求查询分页评论信息
export interface CommentPageReqType {
  newsType: number;
  endTime?: string;
  newsId: string;
  pageNum: number;
  pageSize: number;
  playerId?: number;
  replyId?: string;
  startTime?: string;
  targetPlayerId?: number;
  title?: string;
  topId?: string;
}

//评论对象信息
export interface CommentType {
  avatarPath: string;
  commentator: string;
  commentsCount: number;
  content: string;
  createName: string;
  createTime: string;
  id: string;
  infoType: any;
  level: any;
  likesCount: number;
  newsId: number;
  playerId: string;
  readStatus: boolean;
  replyId: string;
  targetPlayerId: string;
  topId: number;
}

//评论列表
export interface CommentPageType {
  replyCommentList: CommentType[];
  topComment: CommentType;
  isExpanded?: boolean;
}

//评论分页数据
export interface CommentPageRespType {
  commentCount: number;
  list: CommentPageType[];
}

//查询新闻评论响应
export interface ResponseType {
  code: number;
  data: CommentPageRespType;
  msg: string;
}

//查询新闻评论响应
export interface IncreaseLikesCountRespType {
  code: number;
  data: { value: boolean };
  msg: string;
}

//查询新闻评论响应
export interface IncreaseLikesCountReqType {
  id: string;
}

//请求发送评论参数
export interface SendNewsCommentReqType {
  newsType: any;
  newsId: any;
  replyId?: any;
  topId?: any;
  content: any;
  needCommentPoint: any;
}
//发送评论响应
export interface SendNewsCommentResponseType {
  code: number;
  data: CommentType;
  msg: string;
}

/**
 * 获取新闻评论记录
 */
const CommentPagePath = '/player/comment/findNewsComments';
export const Request_GetCommentPage = async (param: CommentPageReqType): Promise<ResponseType> => {
  return (await axios.post(serverTarget + CommentPagePath, param)).data;
};

/**
 * 点赞评论
 */
const IncreaseLikesCountPath = '/player/comment/increaseLikesCount';
export const Request_LikesCount = async (param: IncreaseLikesCountReqType): Promise<IncreaseLikesCountRespType> => {
  return (await axios.post(serverTarget + IncreaseLikesCountPath, param)).data;
};

//发表新闻评论
const SendNewsCommentPath = '/player/comment/sendNewsComment';
export const Request_SendNewsComment = async (param: SendNewsCommentReqType): Promise<SendNewsCommentResponseType> => {
  return (await axios.post(serverTarget + SendNewsCommentPath, param)).data;
};
