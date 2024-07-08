import { useLayoutEffect } from 'react';
import {Route, Routes, useLocation } from 'react-router-dom';
import routes from './routers/routers';
import Navbar from '@/components/navbar/Navbar';
import '@/global.less'; // 确保全局样式已导入

const InnerApp = () => {
  const location = useLocation();

  useLayoutEffect(() => {
    document.documentElement.scrollTo(0, 0);
    document.body.scrollTo(0, 0);
    const content = document.querySelector('.content');
    if (content) content.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div className='content'>
      <Routes>
        {routes.map((route, index) => (
          <Route key={index} path={route.path} element={<route.component />} />
        ))}
      </Routes>
    </div>
  );
};

const App: React.FC = () => (
  <div className="main-container">
    <InnerApp />
    <Navbar />
  </div>
);

export default App;
