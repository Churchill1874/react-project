import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Badge, Tabs, Toast } from 'antd-mobile';

const Navbar = () => {

  const navigate = useNavigate();
  const location = useLocation();
  const [activeKey, setActiveKey] = useState('');

  useEffect(() => {
    const currentPath = location.pathname === '/' ? '' : location.pathname.split('/')[1];
    if (currentPath === '') {
      navigate('/home');
      return;
    }

    // 确保状态更新和路由跳转同步
    if (activeKey !== currentPath) {
      setActiveKey(currentPath);
    }
  }, [location.pathname]);

  const handleTabChange = (key: string) => {
    // 添加防抖处理
    if (activeKey === key) return;

    requestAnimationFrame(() => {
      console.log(`Navigating to: /${key}`);
      navigate(`/${key}`);
      setActiveKey(key);
    });
  };

  return (
    <Tabs
      activeKey={activeKey}
      onChange={handleTabChange}
      className="navbar"
      activeLineMode="auto"
      style={{
        '--fixed-active-line-width': '40px',
        '--active-line-height': '2px',
        '--active-line-border-radius': '1px'
      }}
    >
      <Tabs.Tab title="首页" key="home" />
      <Tabs.Tab title="报纸" key="news" />
      <Tabs.Tab title="聊妹" key="chatgirl" />
      <Tabs.Tab title="投注" key="bet" />
      <Tabs.Tab title={<Badge content={Badge.dot}>消息</Badge>} key="message" />
      <Tabs.Tab title="个人" key="personal" />
    </Tabs>
  );
};

export default Navbar;
