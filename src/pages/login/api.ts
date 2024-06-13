import axios from '@/api/axios'

interface RegisterType{
    code: number;
    data: {account: string, loginTime: string, name:string, tokenId:string};
    msg: string;
}

interface VerificationCodeType{
    code: number;
    data: {captchaImage:string};
    msg: string;
}



const headers = {
    headers: {
        'Content-Type': 'application/json'  // 确保请求头的内容类型为 application/json
    }
}

const serverTarget = 'http://8.141.144.73:8009';//请求的服务路径前缀




const getVerificationCodePath = '/player/verificationCode/get'//获取验证码
export const Request_GetVerficationCode = ():Promise<VerificationCodeType> => {
    return axios.post(serverTarget + getVerificationCodePath, {}, headers);
};


const RegisterPath = '/player/player/register'//注册
export const Request_Register = (player: any):Promise<RegisterType> => {
    return axios.post(serverTarget + RegisterPath,  player, headers);
};