import axios from 'axios';
import { serverTarget } from '@/common/api';

//请求查询分页信息
export interface ChatRoomPageReqType {
  pageNum: number;
  pageSize: number;
  id: number;
}

//聊天室信息内容
export interface ChatRoomType {
  id: string;
  roomNumber: number;
  playerId: string;
  content: string;
  type: number;
  createTime: string;
  isReply: boolean;
  targetPlayerId: string;
  replyId: string;
  replyContent: string;
  name: string;
  avatarPath: string;
  level: number;
}

export interface ChatRoomPageResponseType {
  current: any;
  pages: any;
  records: ChatRoomType[];
  searchCount: any;
  size: any;
  total: any;
}

export interface PageResponseType {
  code: number;
  data: ChatRoomPageResponseType;
  msg: string;
}

export interface SendType {
  roomNumber: number;
  targetPlayerId: string | null;
  content: string;
  replyContent: string | null;
  type: number;
}

export interface RespType {
  code: number;
  data: boolean;
  msg: string;
}

const ChatRoomPagePath = '/player/chatRoom/queryPage';
export const Request_ChatRoomPage = async (param: ChatRoomPageReqType): Promise<PageResponseType> => {
  return (await axios.post(serverTarget + ChatRoomPagePath, param)).data;
};

const SendPath = '/player/chatRoom/send';
export const Request_Send = async (param: SendType): Promise<RespType> => {
  return (await axios.post(serverTarget + SendPath, param)).data;
};
