import { useLayoutEffect, useEffect, useRef, useState, useContext } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import routes from './routers/routers';
import Navbar from '@/components/navbar/Navbar';
import '@/global.less';
import useStore from '@/zustand/store';
import { StompContext } from '@/utils/StompContext';

const InnerApp = () => {
  const location = useLocation();
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (contentRef.current) {
      const contentHeight = contentRef.current.scrollHeight;
      document.documentElement.style.minHeight = `${contentHeight}px`;
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

const App: React.FC = () => {
  const location = useLocation();
  const [bgColor, setBgColor] = useState<string>('#fff');
  const { tokenId } = useStore();
  const { connectStompClient } = useContext(StompContext)!;

  useEffect(() => {
    if (!tokenId) {
      connectStompClient('1');
    } else {
      connectStompClient(tokenId);
    }

  }, [tokenId]);

  const getBgColor = () => {
    const pathname = location.pathname;
    if (pathname === '/home') return '#fff';
    if (pathname.startsWith('/news')) return '#1890ff';
    if (pathname === '/newsinfo') return '#fff';
    if (pathname === '/chatgirl') return '#1890ff';
    if (pathname === '/bet') return '#1890ff';
    if (pathname === '/message') return '#1890ff';
    if (pathname === '/personal') return '#fff';
    if (pathname === '/politics') return '#1890ff';
    if (pathname === '/interesting') return '#1890ff';
    if (pathname === '/politicsevent') return '#1890ff'

    return '#fff';
  };

  useLayoutEffect(() => {
    setBgColor(getBgColor());
  }, [location.pathname]);

  return (
    <div className="main-container" style={{ backgroundColor: bgColor }}>
      <InnerApp />
      <Navbar />
    </div>
  );
};

export default App;
