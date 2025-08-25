import axios from 'axios';
import { serverTarget } from '@/common/api';

export interface Response {
  code: number;
  data: any;
  msg: string;
}

export interface PersonalUpdateRequestType {
  avatarPath: string;
  email: string;
  name: string;
  phone: string;
  city: string;
  selfIntroduction: string;
  tg: string;
  birth: string | null;
  campType: number;
}

//获取用户信息
const UpdatePlayerInfoPath = '/player/player/update';
export const Request_UpdatePlayerInfo = async (param: PersonalUpdateRequestType): Promise<Response> => {
  return (await axios.post(serverTarget + UpdatePlayerInfoPath, param)).data;
};
