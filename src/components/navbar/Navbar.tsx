import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Tabs } from 'antd-mobile';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeKey, setActiveKey] = useState('');

  useEffect(() => {
    const currentPath = location.pathname === '/' ? '' : location.pathname.split('/')[1];
    if(currentPath === ''){
      navigate('/home')
    }
    if (activeKey !== currentPath) {
      setActiveKey(currentPath || '');
    }
  }, [location.pathname, activeKey]);

  const handleTabChange = (key: string) => {
    if (activeKey !== key) {
      navigate(`/${key}`);
      //console.log(`导航到路径: /${key}`);
      setActiveKey(key);
    }
  };

  return (
    <Tabs activeKey={activeKey} onChange={handleTabChange} className="navbar">
      <Tabs.Tab title="首页" key="home" />
      <Tabs.Tab title="新闻" key="news" />
      <Tabs.Tab title="政治盘" key="market" />
      <Tabs.Tab title="消息" key="message" />
      <Tabs.Tab title="个人" key="personal" />
    </Tabs>
  );
};

export default Navbar;
