import axios from '@/api/axios'
//请求的服务路径前缀
const serverTarget = 'http+ip或者域名+端口';

//请求的具体路径
const path = '/xx/xx'



export const req1 = (params: object) => {
    const headers = {
        headers: {
            'Content-Type': 'application/json'  // 确保请求头的内容类型为 application/json
        }
    }

    return axios.post(serverTarget + path, params, headers);
};