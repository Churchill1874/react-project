import axios from 'axios';
import { serverTarget } from '@/common/api';

export interface LoginType {
  code: number;
  data: { account: string; level: any; avatarPath: string; loginTime: string; name: string; status: any; tokenId: string };
  msg: string;
}
export interface RegisterType {
  code: number;
  data: { account: string; loginTime: string; name: string; tokenId: string };
  msg: string;
}
export interface VerificationCodeType {
  code: number;
  data: { captchaImage: string };
  msg: string;
}

export interface RandomPlayerCountTypeResponse {
  code: number;
  data: number;
  msg: string;
}

//获取验证码
const getVerificationCodePath = '/player/verificationCode/get';
export const Request_GetVerficationCode = async (): Promise<VerificationCodeType> => {
  return (await axios.post(serverTarget + getVerificationCodePath, {})).data;
};

//注册
const RegisterPath = '/player/player/register';
export const Request_Register = async (player: any): Promise<RegisterType> => {
  return (await axios.post(serverTarget + RegisterPath, player)).data;
};

//登录
const LoginPath = '/player/player/login';
export const Request_Login = async (player: any): Promise<LoginType> => {
  return (await axios.post(serverTarget + LoginPath, player)).data;
};

//退出登陆
const randomPlayerCountPath = '/player/player';
export const Request_RandomPlayerCount = async (): Promise<RandomPlayerCountTypeResponse> => {
  return (await axios.post(serverTarget + randomPlayerCountPath, {})).data;
};
