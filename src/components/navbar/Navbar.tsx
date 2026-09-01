import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Badge, Popup, Toast } from 'antd-mobile';
import {
  AiOutlineMenu,
  AiOutlineHome,
  AiOutlineRead,
  AiOutlineTeam,
  AiOutlineMessage,
  AiOutlineUser,
} from 'react-icons/ai';
import useStore from '@/zustand/store';

// 简单的调试信息显示
const showDebugInfo = (message: string) => {
  Toast.show({
    content: message,
    duration: 2000,
    position: 'top'
  });
};

const MENU_ITEMS: { key: string; title: string; icon: React.ReactNode }[] = [
  { key: 'home', title: '首页', icon: <AiOutlineHome size={20} /> },
  { key: 'news', title: '新闻', icon: <AiOutlineRead size={20} /> },
  { key: 'groupChat', title: '聊天大厅', icon: <AiOutlineTeam size={20} /> },
  { key: 'message', title: '消息', icon: <AiOutlineMessage size={20} /> },
  { key: 'personal', title: '个人', icon: <AiOutlineUser size={20} /> },
];

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeKey, setActiveKey] = useState('');
  const [menuVisible, setMenuVisible] = useState(false);
  const hasUnreadMessage = useStore(state => state.hasUnreadMessage);

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

  const handleMenuSelect = (key: string) => {
    setMenuVisible(false);

    // 添加防抖处理
    if (activeKey === key) return;

    // 添加浏览器兼容性处理
    const isHonorBrowser = /HUAWEI|Honor/i.test(navigator.userAgent);

    try {
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
    <>
      <button
        type="button"
        className="menu-trigger-btn"
        aria-label="打开菜单"
        onClick={() => setMenuVisible(true)}
      >
        <AiOutlineMenu size={20} />
        {hasUnreadMessage && <span className="menu-trigger-dot" />}
      </button>

      <Popup
        visible={menuVisible}
        position="right"
        closeOnMaskClick
        onClose={() => setMenuVisible(false)}
        bodyStyle={{ width: '62vw', maxWidth: 260 }}
      >
        <div className="side-menu">
          {MENU_ITEMS.map(item => (
            <div
              key={item.key}
              className={
                'side-menu-item' + (activeKey === item.key ? ' side-menu-item--active' : '')
              }
              onClick={() => handleMenuSelect(item.key)}
            >
              <span className="side-menu-item-icon">{item.icon}</span>
              {item.key === 'message' && hasUnreadMessage ? (
                <Badge content={Badge.dot}>{item.title}</Badge>
              ) : (
                item.title
              )}
            </div>
          ))}
        </div>
      </Popup>
    </>
  );
};

export default Navbar;
