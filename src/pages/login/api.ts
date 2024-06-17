import axios from 'axios';
import { serverTarget } from '@/common/api';

interface LoginType {
  code: number;
  data: { account: string; loginTime: string; name: string; tokenId: string };
  msg: string;
}
interface RegisterType {
  code: number;
  data: { account: string; loginTime: string; name: string; tokenId: string };
  msg: string;
}
interface VerificationCodeType {
  code: number;
  data: { captchaImage: string };
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
