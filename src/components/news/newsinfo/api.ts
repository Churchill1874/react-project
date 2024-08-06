import axios from 'axios';
import { serverTarget } from '@/common/api';

export interface SendNewsCommentReqType {
    newsId: any;
	replyId?: any ;
	topId?: any;
    content: any;
}

export interface SendNewsCommentResponseType{
    code: number;
    data: any;
    msg: string;
}


//发表新闻评论
const SendNewsCommentPath = '/player/comment/sendComment';
export const Request_SendNewsComment = async (param: SendNewsCommentReqType): Promise<SendNewsCommentResponseType> => {
    return (await axios.post(serverTarget + SendNewsCommentPath, param)).data;
};


