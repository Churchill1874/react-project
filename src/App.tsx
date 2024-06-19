import  { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import routes from './routers/routers';
import setupAxiosInterceptors from './api/setupAxiosInterceptors';
import Navbar from '@/components/navbar/Navbar';
import '@/global.less'; // 确保全局样式已导入

const InnerApp = () => {
  const navigate = useNavigate();

  useEffect(() => {
    setupAxiosInterceptors(navigate);
  }, [navigate]);

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

const App = () => {
  return (

    <Router>
      <div className='main-container'>
        <InnerApp />
        <Navbar />
      </div>
    </Router >


  );
};

export default App;
