import axios from 'axios';
import { serverTarget } from '@/common/api';

export interface Response {
  code: number;
  data: PlayerInfoType;
  msg: string;
}

export interface PlayerInfoType {
  account: any;
  avatarPath: any;
  birth?: any;
  city?: any;
  createName?: any;
  createTime?: any;
  email?: any;
  gender?: any;
  id?: any;
  isBot?: any;
  level: any;
  name: any;
  password?: any;
  phone?: any;
  salt?: any;
  selfIntroduction?: any;
  status?: any;
  balance?: any;
  updateName?: any;
  updateTime?: any;
  tg?: any;
  followersCount: any;
  collectCount: any;
  likesReceivedCount: any;
}

//获取用户信息
const getPlayerInfoPath = '/player/player/playerInfo';
export const Request_GetPlayerInfo = async (): Promise<Response> => {
  return (await axios.post(serverTarget + getPlayerInfoPath, {})).data;
};

//退出登陆
const logoutPath = '/player/player/logout';
export const Request_Logout = async (): Promise<Response> => {
  return (await axios.post(serverTarget + logoutPath, {})).data;
};
