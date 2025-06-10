import axios from 'axios';
import { serverTarget } from '@/common/api';

//点赞对象类型
export interface LikesRespType {
  account: string;
  level: number;
  avatarPath: string;
  playerName: string;
  playerId: string;
  likesId: string;
  likesType: number;
  content: string;
  targetPlayerId: string;
  infoType: number;
  createTime: string;
  id: string;
}

//点赞记录响应结构
export interface LikePageRespType {
  code: number;
  msg: string;
  data: PageResponseType;
}

//分页结构
interface PageResponseType {
  current?: any | null;
  pages?: any | null;
  records?: LikesRespType[] | null;
  size?: any | null;
  total?: any | null;
}

const LikesPagePath = '/player/likes/page';
export const Req_LikesPage = async (param: any): Promise<LikePageRespType> => {
  return (await axios.post(serverTarget + LikesPagePath, param)).data;
};
