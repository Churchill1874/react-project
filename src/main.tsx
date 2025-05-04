import { createRoot } from 'react-dom/client';
import App from '@/App';
import React from 'react';
import '@/global.less';
import { BrowserRouter as Router, useNavigate } from 'react-router-dom';
import setupAxiosInterceptors from './api/setupAxiosInterceptors';
import ScrollToTop from '@/utils/ScrollToTop';


// 在应用启动时设置Axios拦截器
const SetupInterceptors = () => {
  const navigate = useNavigate();
  React.useEffect(() => {
    setupAxiosInterceptors(navigate);
  }, [navigate]);

  return null;
};

const container = document.getElementById('root');

if (!container) {
  throw new Error('root element not found');
}
const root = createRoot(container);

root.render(

  <Router future={{ v7_relativeSplatPath: true }}>
    <ScrollToTop />
    <SetupInterceptors />
    <App />
  </Router>,

);
