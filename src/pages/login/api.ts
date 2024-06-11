import axios from '@/api/axios'

const serverTarget = 'http://8.141.144.73:8009';//请求的服务路径前缀

const getVerificationCodePath = '/player/verificationCode/get'//获取验证码


export const Request_GetVerficationCode = () => {
    const headers = {
        headers: {
            'Content-Type': 'application/json'  // 确保请求头的内容类型为 application/json
        }
    }

    return axios.post(serverTarget + getVerificationCodePath, {}, headers);
};



