import axios from 'axios';
import { serverTarget } from '@/common/api';

export interface PrivateChatType {
  id: any;
  sendAccount: any;
  receiveAccount: any;
  content: any;
  status: any;
  createTime: any;
  createName: any;
}

export interface PrivateChatRespType {
  id: any;
  sendName: any;
  sendAccount: any;
  sendAvatarPath: any;
  sendLevel: any;
  receiveName: any;
  receiveAccount: any;
  receiveAvatarPath: any;
  receiveLevel: any;
  content: any;
  status: any;
  notRead: any;
  createTime: any;
  createName: any;
}

//查询新闻评论响应
export interface PrivateChatResponseType {
  code: number;
  data: PrivateChatRespType[];
  msg: string;
}

/**
 * 获取聊天记录列表
 */
const PrivateChatListPath = '/player/privateChat/privateChatPage';
export const Request_PrivateChatList = async (): Promise<PrivateChatResponseType> => {
  return (await axios.post(serverTarget + PrivateChatListPath)).data;
};
