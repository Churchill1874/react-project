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
      navigate('/home')
    }


    if (activeKey !== currentPath) {
      setActiveKey(currentPath || '');
    }
  }, [location.pathname, activeKey, navigate]);

  const handleTabChange = (key: string) => {

    if (activeKey !== key) {

      navigate(`/${key}`);
      //console.log(`导航到路径: /${key}`);
      //Toast.show('key:' + key)
      setActiveKey(key);
    }
  };

  return (
    <Tabs activeKey={activeKey} onChange={handleTabChange} className="navbar">
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
