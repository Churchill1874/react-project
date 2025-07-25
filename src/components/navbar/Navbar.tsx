import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Badge, Tabs, Toast } from 'antd-mobile';
import useStore from '@/zustand/store';

// 简单的调试信息显示
const showDebugInfo = (message: string) => {
  Toast.show({
    content: message,
    duration: 2000,
    position: 'top'
  });
};

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

    if (currentPath === 'message') {
      useStore.getState().setHasUnreadMessage(false)
    }

    // 确保状态更新和路由跳转同步
    if (activeKey !== currentPath) {
      setActiveKey(currentPath);
    }
  }, [location.pathname]);

  const handleTabChange = (key: string) => {
    // 添加防抖处理
    if (activeKey === key) return;

    // 添加浏览器兼容性处理
    const isHonorBrowser = /HUAWEI|Honor/i.test(navigator.userAgent);

    try {
      //showDebugInfo(`正在跳转到: /${key}`);
      navigate(`/${key}`);

      // 如果3秒后页面仍未跳转，强制刷新
      if (isHonorBrowser) {
        setTimeout(() => {
          if (location.pathname !== `/${key}`) {
            showDebugInfo('跳转失败，正在强制刷新');
            window.location.href = `/${key}`;
          }
        }, 10);
      }

      setActiveKey(key);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '未知错误';
      showDebugInfo(`跳转失败: ${errorMessage}`);
      Toast.show('1')
      if (isHonorBrowser) {
        window.location.href = `/${key}`;
      }
    }
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
        '--active-line-border-radius': '1px',
      }}
    >
      <Tabs.Tab title="首页" key="home" />
      <Tabs.Tab title="新闻" key="news" />
      <Tabs.Tab title="多人游戏" key="game" />
      <Tabs.Tab title="投注" key="bet" />
      <Tabs.Tab
        title={useStore.getState().hasUnreadMessage ? <Badge content={Badge.dot}>消息</Badge> : '消息'}
        key="message"
      />
      <Tabs.Tab title="个人" key="personal" />
    </Tabs>
  );
};

export default Navbar;
