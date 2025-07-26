import axios from 'axios';
import { Toast } from 'antd-mobile';
import { NavigateFunction } from 'react-router-dom';
import useStore from '@/zustand/store';

let interceptorsRegistered = false; // 添加标志

const setupAxiosInterceptors = (navigate: NavigateFunction) => {
  if (interceptorsRegistered) {
    return;
  }

  // 设置全局请求超时时间为 10 秒（10000 毫秒）
  axios.defaults.timeout = 60000;

  //拦截请求
  axios.interceptors.request.use(
    config => {
      //请求头设置数据格式
      config.headers['Content-Type'] = 'application/json';

      let tokenId = useStore.getState().tokenId;
      if (tokenId) {
        config.headers['TOKEN-ID'] = tokenId;
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
      if (!response.data || response.data.code === -2) {
        navigate('/login');
        Toast.show({ content: response.data.msg, duration: 2000 });
        return Promise.reject(new Error('请先登录'));
      }

      if (response.data.code === -4) {
        navigate('/login');
        Toast.show({ icon: 'fail', content: response.data.msg, duration: 2000 });
        return Promise.reject(new Error('请先登陆'));
      }

      if (response.data.code === -6) {
        Toast.show({
          icon: 'fail',
          content: response.data.msg,
          duration: 1000,
        });
        return Promise.reject(new Error('余额不足'));
      }

      if (response.data.code === -1) {
        Toast.show({
          icon: 'fail',
          content: response.data.msg,
          duration: 2000,
        });
        return Promise.reject(new Error('服务异常'));
      }

      return response;
    },
    error => {
      Toast.show({
        icon: 'fail',
        content: error.message,
        duration: 2000,
      });
      return Promise.reject(error);
    },
  );
  interceptorsRegistered = true; // 标志设置为 true
};

export default setupAxiosInterceptors;
