import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

//这个滚动保证了其他页面 上下滑动以后 影响了跳转下一个页面的位置
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
    document.documentElement.scrollTo(0, 0);
    document.body.scrollTo(0, 0);

    // 其他可能的滚动容器
    const content = document.querySelector('.content');
    if (content) content.scrollTo(0, 0);

    const mainContainer = document.querySelector('.main-container');
    if (mainContainer) mainContainer.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

export default ScrollToTop;
