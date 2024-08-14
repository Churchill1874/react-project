import axios from 'axios';
import { serverTarget } from '@/common/api';

//请求查询分页评论信息
export interface CommentPageReqType {
	endTime?: string,
	newsId: string,
	pageNum: number,
	pageSize: number,
	playerId?: number,
	replyId?: string;
	startTime?: string;
	targetPlayerId?: number;
	title?: string;
	topId?: string;
}

//评论对象信息
export interface CommentType{
    avatarPath: string;
    commentator: string;
    commentsCount: number;
    content: string;
    createName: string;
    createTime: string;
    id: number;
    infoType: any;
    level: any;
    likesCount: number;
    newsId: number;
    playerId: number;
    readStatus: boolean;
    replyId: number;
    targetPlayerId: number;
    topId: number;
}

//评论列表
export interface CommentPageType{
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
export interface ResponseType{
    code: number;
    data: CommentPageRespType;
    msg: string;
}

//查询新闻评论响应
export interface IncreaseLikesCountRespType{
    code: number;
    data: {value: boolean};
    msg: string;
}

//查询新闻评论响应
export interface IncreaseLikesCountReqType{
    id: number;
}


/**
 * 获取新闻评论记录
 */
const GetCommentPagePath = '/player/comment/findNewsComments';
export const Request_GetCommentPage = async (param: CommentPageReqType): Promise<ResponseType> => {
    return (await axios.post(serverTarget + GetCommentPagePath, param)).data;
};

/**
 * 点赞评论
 */
const IncreaseLikesCountPath = '/player/comment/increaseLikesCount';
export const Request_LikesCount = async (param: IncreaseLikesCountReqType): Promise<IncreaseLikesCountRespType> => {
    return (await axios.post(serverTarget + IncreaseLikesCountPath, param)).data;
};
