import React, { useEffect } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import routes from './routers/routers';
import setupAxiosInterceptors from './api/setupAxiosInterceptors';

const App = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // 设置 Axios 拦截器并传递 navigate 函数
    setupAxiosInterceptors(navigate);
  }, [navigate]);

  return (
    <Routes>
      {routes.map((route, index) => (
        <Route key={index} path={route.path} element={<route.component />} />
      ))}
    </Routes>
  );
};

export default App;
