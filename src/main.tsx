import { createRoot } from 'react-dom/client';
import App from '@/App';
import React from 'react';
import '@/global.less';
import { BrowserRouter as Router, useNavigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './redux/store';
import setupAxiosInterceptors from './api/setupAxiosInterceptors';

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
   
  <Router>
    <SetupInterceptors />
    <Provider store={store}>
      <App />
    </Provider>
  </Router>,

);
