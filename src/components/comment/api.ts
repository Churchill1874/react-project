import axios from 'axios';
import { serverTarget } from '@/common/api';

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

export interface CommentType{
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
    newsId: string;
    playerId: string;
    readStatus: boolean;
    replyId: string;
    targetPlayerId: string;
    topId: string;
}

export interface CommentPageType{
    replyCommentList: CommentType[];
    topComment: CommentType;
    isExpanded?: boolean;
}

export interface CommentPageRespType {
	commentCount: number;
    likesCount: number;
    viewsCount: number;
    list: CommentPageType[];
}

export interface ResponseType{
    code: number;
    data: CommentPageRespType;
    msg: string;
}

/**
 * 获取新闻评论记录
 */
const GetCommentPagePath = '/player/comment/findNewsComments';
export const Request_GetCommentPage = async (param: CommentPageReqType): Promise<ResponseType> => {
    return (await axios.post(serverTarget + GetCommentPagePath, param)).data;
};
