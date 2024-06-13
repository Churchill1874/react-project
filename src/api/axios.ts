import axios from 'axios'
import { Toast } from 'antd-mobile';

//axios的请求拦截器
axios.interceptors.request.use((config)=>{
    const tokenId = localStorage.getItem('tokenId')
    if(tokenId){
       // config.headers.Authorization = `Bearer ${tokenId}`;
       
       config.headers['TOKEN_ID'] = tokenId;
    }
    return config;
})

//axios的响应拦截器
axios.interceptors.response.use(
    response =>{
        return response.data;
    },
    error => {
        Toast.show({
            icon: 'fail',
            content: error.message
        })
        return new Promise(()=>{})
    } 
)


export default axios;