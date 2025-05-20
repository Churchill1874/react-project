import { useLayoutEffect, useEffect, useRef, useState } from 'react';
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
      document.documentElement.style.minHeight = `${contentHeight}px`;
    }
  }, [location.pathname]);


  //组件加载之前执行的钩子
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

const App: React.FC = () => {
  const location = useLocation();
  const [bgColor, setBgColor] = useState<string>('#fff');

  //获取不同菜单页面的背景颜色
  const getBgColor = () => {
    const pathname = location.pathname;
    if (pathname === '/home') {
      return '#fff';
    }
    if (pathname.startsWith('/news')) { // 检查路径是否以 "/news" 开头
      return '#1890ff';
    }
    if (pathname === '/newsinfo') {
      return '#fff';
    }
    if (pathname === '/chatgirl') {
      return '#1890ff';
    }
    if (pathname === '/bet') {
      return '#1890ff';
    }
    if (pathname === '/message') {
      return '#1890ff';
    }
    if (pathname === '/personal') {
      return '#fff';
    }
    if (pathname === '/politics') {
      return '#1890ff';
    }
    if (pathname === '/interesting') {
      return '#1890ff';
    }
    return '#fff';
  }

  useLayoutEffect(() => {
    setBgColor(getBgColor())
  }, [location.pathname])

  return (
    <div className="main-container" style={{ backgroundColor: bgColor }}>
      <InnerApp />
      <Navbar />
    </div>
  )
}
  ;

export default App;
