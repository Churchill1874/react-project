// src/api/setupAxiosInterceptors.ts
//import axiosInstance from '@/api/axiosInstance';
import axios from 'axios';
import { Toast } from 'antd-mobile';
import { NavigateFunction } from 'react-router-dom';

const setupAxiosInterceptors = (navigate: NavigateFunction) => {
  axios.interceptors.request.use(
    config => {
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

  axios.interceptors.response.use(
    response => {
      if (response.data.code === -2) {
        navigate('/login');
        return Promise.reject(new Error('未登录'));
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
};

export default setupAxiosInterceptors;
