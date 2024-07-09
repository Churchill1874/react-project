import { useLayoutEffect, useEffect, useRef } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import routes from './routers/routers';
import Navbar from '@/components/navbar/Navbar';
import '@/global.less'; // 确保全局样式已导入

const InnerApp = () => {
  const location = useLocation();
  const contentRef = useRef<HTMLDivElement>(null);


  //根据页面元素的高度 改变页面的实际高度长度
  useEffect(() => {
    if (contentRef.current) {
      const contentHeight = contentRef.current.scrollHeight;//增加20是为了超过底部固定不动的导航高度 不被遮挡
      document.documentElement.style.height = `${contentHeight}px`;
    }
  }, [location.pathname]);


  useLayoutEffect(() => {
    document.documentElement.scrollTo(0, 0);
    document.body.scrollTo(0, 0);
    const content = document.querySelector('.content');
    if (content) content.scrollTo(0, 0);
  }, [location.pathname]);


  return (
    <div className='content' ref={contentRef}>
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
