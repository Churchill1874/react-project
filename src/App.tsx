import {Route, Routes } from 'react-router-dom';
import routes from './routers/routers';
import Navbar from '@/components/navbar/Navbar';
import '@/global.less'; // 确保全局样式已导入

const InnerApp = () => {
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
