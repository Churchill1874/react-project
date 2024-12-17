import axios from 'axios';
import { serverTarget } from '@/common/api';

export interface SystemMessageResponseType{
    code: any;
    data: SystemMessagePageResponseType;
    msg: any;
}

export interface SystemMessagePageResponseType{
    current: any;
    pages: any;
    records: SystemMessagePageType[];
    searchCount: any;
    size: any;
    total: any;
}

export interface SystemMessagePageReqType{
  endTime?: any;
	messageType?: any;//消息类型,可用值:系统:1,评论:2
	newsId?: any;
	pageNum: any;
	pageSize: any;
	recipientAccount?: any;//收取人账号
	senderAccount?: any;//发送人账号
	sourceType?: any;//消息来源,可用值:国内新闻:1,东南亚新闻:2
	startTime?: any;
}

export interface SystemMessagePageType{
  avatar: any;//头像
  comment: any;//评论内容
  content: any;//消息内容
  createName: any;
  createTime: any;
  id: any;
  imagePath: any;//图片路径
  messageType: any;//消息类型,可用值:系统:1,评论:2
  newsId: any;
  popUp: any;//需要弹窗
  recipientAccount: any;//收取人账号
  senderAccount: any;//发送人账号
  senderName: any;//评论人名称
  sourceType: any;//评论来源,可用值:国内新闻:1,东南亚新闻:2
  status: any;
  title: any;//信息类型messageType是评论类型的时候,title是自己发表对新闻的评论信息,现在有人对此评论发表评论.信息类型messageType为系统类型的时候,title是系统消息标题
}

const SystemMessagePagePath = '/player/message/queryPage';
export const Request_SystemMessagePage = async (param: SystemMessagePageReqType): Promise<SystemMessageResponseType> =>{
    return (await axios.post(serverTarget + SystemMessagePagePath, param)).data
}