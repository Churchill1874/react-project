import axios from 'axios';
import { Toast } from 'antd-mobile';
import { NavigateFunction } from 'react-router-dom';
let interceptorsRegistered = false; // 添加标志

const setupAxiosInterceptors = (navigate: NavigateFunction) => {
  if (interceptorsRegistered) {
    return;
  }
  //拦截请求
  axios.interceptors.request.use(
    config => {
      //请求头设置数据格式
      config.headers['Content-Type'] = 'application/json';

      //tokenId令牌
      const tokenId = localStorage.getItem('tokenId');
      if (tokenId) {
        config.headers['TOKEN_ID'] = tokenId;
      }
      return config;
    },
    error => {
      return Promise.reject(error);
    },
  );

  //拦截响应
  axios.interceptors.response.use(
    response => {
      if(!response.data || response.data.code === -2){
        navigate('/login');
        Toast.show('请先登录');
        return Promise.reject(new Error('未登录'));
      }

      if(response.data.code === -4){
        navigate('/login');
        Toast.show(response.data.msg)
        return Promise.reject(new Error('未登陆'));
      }

      if(response.data.code === -1){
        Toast.show(response.data.msg)
        return Promise.reject(new Error('服务异常'));
      }

      return response;
    },
    error => {
      Toast.show({
        icon: 'fail',
        content: error.message,
      });
      return Promise.reject(error);
    },
  );
  interceptorsRegistered = true; // 标志设置为 true

};

export default setupAxiosInterceptors;
