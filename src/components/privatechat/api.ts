import axios from 'axios';
import { serverTarget } from '@/common/api';

export interface PrivateChatType {
  id?: string;
  sendId: string;
  receiveId: string;
  content: any;
  status: any;
  type: any;
  createTime: any;
  createName: any;
  isSender?: any;
  notRead: any;
  sendAvatarPath: any;
}

export interface PrivateChatListType {
  id: string;
  sendName: any;
  sendId: string;
  sendAvatarPath: any;
  sendLevel: any;
  receiveName: any;
  receiveId: string;
  receiveAvatarPath: any;
  receiveLevel: any;
  content: any;
  status: any;
  notRead: any;
  createTime: any;
  createName: any;
}

//查询聊天记录外层响应
export interface PrivateChatRespType {
  code: number;
  data: PrivateChatPageRespType;
  msg: string;
}

//与玩家一对一分页聊天记录查询
export interface ChatPageRespType {
  current: any;
  pages: any;
  records: PrivateChatType[];
  searchCount: any;
  size: any;
  total: any;
}

//一对一 并 包含了登陆人信息的 聊天记录分页
export interface PrivateChatPageRespType {
  loginId: any;
  loginAvatar: any;
  loginLevel: any;
  loginName: any;
  list: PrivateChatListType[];
}

//玩家一对一聊天响应
export interface PlayerPrivateChatPageRespType {
  code: number;
  data: ChatPageRespType;
  msg: string;
}

//请求查询一对一私聊参数
export interface ChatPageReqType {
  playerAId: any;
  pageNum: any;
  pageSize: any;
}

/**
 * 获取外层聊天记录列表
 */
const PrivateChatListPath = '/player/privateChat/privateChatList';
export const Request_PrivateChatList = async (): Promise<PrivateChatRespType> => {
  return (await axios.post(serverTarget + PrivateChatListPath)).data;
};

//查询一对一私聊聊天记录
const PlayerPrivateChatPagePath = '/player/privateChat/playerPrivateChatPage';
export const Request_PlayerPrivateChatPage = async (param: ChatPageReqType): Promise<PlayerPrivateChatPageRespType> => {
  return (await axios.post(serverTarget + PlayerPrivateChatPagePath, param)).data;
};

/**
 * 清除指定人所有的未读状态
 */
const CleanUnreadStatusPath = '/player/privateChat/cleanUnreadStatus';
export const Request_CleanUnreadStatus = async (param: { id: string }): Promise<{ code: string; data: any; msg: string }> => {
  return (await axios.post(serverTarget + CleanUnreadStatusPath, param)).data;
};
