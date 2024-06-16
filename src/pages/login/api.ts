import axios from 'axios';

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

const headers = {
  headers: {
    'Content-Type': 'application/json', // 确保请求头的内容类型为 application/json
  },
};

const serverTarget = 'http://8.141.144.73:8009'; //请求的服务路径前缀

//获取验证码
const getVerificationCodePath = '/player/verificationCode/get';
export const Request_GetVerficationCode = async (): Promise<VerificationCodeType> => {
  return (await axios.post(serverTarget + getVerificationCodePath, {}, headers)).data;
};

//注册
const RegisterPath = '/player/player/register';
export const Request_Register = async (player: any): Promise<RegisterType> => {
  return (await axios.post(serverTarget + RegisterPath, player, headers)).data;
};

//登录
const LoginPath = '/player/player/login';
export const Request_Login = async (player: any): Promise<LoginType> => {
  return (await axios.post(serverTarget + LoginPath, player, headers)).data;
};
