import { useLayoutEffect, useEffect, useRef, useState, useContext } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import routes from '@/routers/routers';
import Navbar from '@/components/navbar/Navbar';
import '@/global.less';
import useStore from '@/zustand/store';
import { StompContext } from '@/utils/StompContext';

const getBgColor = (pathname: string) => {
  if (pathname === '/home') return '#fff';
  if (pathname.startsWith('/news')) return '#1890ff';
  if (pathname === '/newsinfo') return '#fff';
  if (pathname === '/game') return '#1890ff';
  if (pathname === '/bet') return '#1890ff';
  if (pathname === '/message') return '#1890ff';
  if (pathname === '/personal') return '#1890ff';
  if (pathname === '/politics') return '#1890ff';
  if (pathname === '/interesting') return '#1890ff';
  if (pathname === '/politicsevent') return '#1890ff';
  if (pathname.startsWith('/betOrder')) return '#1890ff';
  return '#fff';
};

const InnerApp = () => {
  return (
    <Routes>
      {routes.map((route, index) => (
        <Route key={index} path={route.path} element={<route.component />} />
      ))}
    </Routes>
  );
};

const App: React.FC = () => {
  const location = useLocation();
  const [bgColor, setBgColor] = useState<string>('#fff');
  const { tokenId } = useStore();

  // 固定导航栏高度，避免动态计算带来的性能问题
  const navbarHeight = 35;

  // 计算内容区域高度
  const [contentHeight, setContentHeight] = useState(() => {
    return window.innerHeight - navbarHeight;
  });

  // 只在必要时更新高度，减少不必要的重新计算
  useEffect(() => {
    const updateHeight = () => {
      // 只有非 /hall 页面才需要重新计算高度
      if (location.pathname !== '/hall') {
        const newHeight = window.innerHeight - navbarHeight;
        setContentHeight(newHeight);
      }
    };

    // 初始化高度
    updateHeight();

    // 监听屏幕尺寸变化
    window.addEventListener('resize', updateHeight);
    window.addEventListener('orientationchange', updateHeight);

    return () => {
      window.removeEventListener('resize', updateHeight);
      window.removeEventListener('orientationchange', updateHeight);
    };
  }, [location.pathname]); // 添加 location.pathname 依赖

  // 处理背景色变化
  useLayoutEffect(() => {
    const newBgColor = getBgColor(location.pathname);
    setBgColor(newBgColor);

    // 设置 body 背景色与页面保持一致
    if (location.pathname !== '/hall') {
      document.body.style.backgroundColor = newBgColor;
    } else {
      document.body.style.backgroundColor = '';
    }
  }, [location.pathname]);

  return (
    <div
      className='main-container'
      style={
        location.pathname === '/hall'
          ? { backgroundImage: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }
          : { backgroundColor: bgColor }
      }
    >
      <div className="content-area">
        <InnerApp />
      </div>

      <Navbar />
    </div>
  );
};

export default App;