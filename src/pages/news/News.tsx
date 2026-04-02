import React, { useState, useRef, useEffect, useLayoutEffect } from "react";
import { CapsuleTabs } from "antd-mobile";
import '@/pages/news/News.less';
import NewsList from '@/components/news/NewsList';
import Job from '@/components/job/Job';
import Company from '@/components/company/Company';
import SoutheastAsia from '@/components/southeastasia/SoutheastAsia';
import Politics from "@/components/politics/politics";
import Society from "@/components/society/Society";
import Promotion from '@/components/promotion/Promotion';
import Topic from '@/components/topic/Topic';
import Exposure from "@/components/exposure/Exposure";
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import useStore from '@/zustand/store';

// 这些 tab 由子组件自己负责恢复滚动位置，News.tsx 不干预
const SELF_MANAGED_SCROLL_TABS = ['southeastAsia'];

const News: React.FC = React.memo(() => {
  const { typeId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [newsActiveTab, setNewsActiveTab] = useState<string>(() => {
    if (typeId) return typeId;
    if (location.pathname.startsWith('/news/')) {
      const parts = location.pathname.split('/').filter(Boolean);
      return parts[1] || 'news';
    }
    return 'news';
  });
  const [isScrollReady, setIsScrollReady] = useState(false);
  const newsContentRef = useRef<HTMLDivElement>(null);
  const { setNewsScrollPosition, getNewsScrollPosition } = useStore();

  // 组件卸载时清理定时器
  useEffect(() => {
    return () => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, []);

  // URL 有参数时，同步到 tab
  useEffect(() => {
    if (location.pathname.startsWith('/newsInfo')) {
      return;
    }

    if (typeId) {
      setNewsActiveTab(typeId);
      localStorage.setItem('newsActiveTab', typeId);
      if (window.location.pathname !== `/news/${typeId}`) {
        navigate(`/news/${typeId}`, { replace: true });
      }
      return;
    }

    if (location.pathname === '/news') {
      setNewsActiveTab('news');
      localStorage.setItem('newsActiveTab', 'news');
      if (window.location.pathname !== '/news/news') {
        navigate('/news/news', { replace: true });
      }
    }
  }, [typeId, navigate, location.pathname]);

  // 保存滚动位置，当 tab 改变时
  const handleTabChange = (key: string) => {
    if (newsContentRef.current) {
      setNewsScrollPosition(newsActiveTab, newsContentRef.current.scrollTop);
    }
    setIsScrollReady(false);
    setNewsActiveTab(key);
    localStorage.setItem('newsActiveTab', key);
    navigate('/news/' + key, { replace: true });
  };

  // 恢复滚动位置（自管理的 tab 跳过，由子组件自己处理）
  useLayoutEffect(() => {
    if (!newsContentRef.current) {
      setIsScrollReady(true);
      return;
    }

    // 东南亚等自管理 tab，直接显示，不操作 scrollTop
    if (SELF_MANAGED_SCROLL_TABS.includes(newsActiveTab)) {
      setIsScrollReady(true);
      return;
    }

    setIsScrollReady(false);

    const savedPosition = getNewsScrollPosition(newsActiveTab);

    const raf = requestAnimationFrame(() => {
      if (newsContentRef.current && savedPosition > 0) {
        newsContentRef.current.scrollTop = savedPosition;
      }
      setIsScrollReady(true);
    });

    return () => cancelAnimationFrame(raf);
  }, [newsActiveTab]);

  // URL 参数改变时切换 tab
  useEffect(() => {
    if (typeId) {
      setNewsActiveTab(typeId);
    }
  }, [typeId]);

  const scrollTimeoutRef = useRef<number>();

  // 实时记录滚动位置（防抖优化）
  const handleScroll = () => {
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }

    scrollTimeoutRef.current = window.setTimeout(() => {
      if (newsContentRef.current) {
        const container = newsContentRef.current;
        const maxScroll = container.scrollHeight - container.clientHeight;
        const scrollTop = container.scrollTop;
        const value = (maxScroll - scrollTop <= 200 ? maxScroll : scrollTop);
        setNewsScrollPosition(newsActiveTab, value);
      }
    }, 100);
  };

  const renderActiveComponent = () => {
    switch (newsActiveTab) {
      case 'news':
        return <NewsList />;
      case 'politics':
        return <Politics />;
      case 'southeastAsia':
        return <SoutheastAsia />;
      case 'society':
        return <Society />;
      case 'topic':
        return <Topic />;
      case 'promotion':
        return <Promotion />;
      case 'job':
        return <Job />;
      case 'company':
        return <Company />;
      case 'exposure':
        return <Exposure />;
      default:
        return <NewsList />;
    }
  };

  return (
    <>
      <div className="capsule-tabs-container">
        <CapsuleTabs activeKey={newsActiveTab} onChange={handleTabChange}>
          <CapsuleTabs.Tab title="曝光" key="exposure" />
          <CapsuleTabs.Tab title="查公司" key="company" />
          <CapsuleTabs.Tab title="东南亚" key="southeastAsia" />
          <CapsuleTabs.Tab title="社会瓜" key="society" />
          <CapsuleTabs.Tab title="政闻" key="politics" />
          <CapsuleTabs.Tab title="国内" key="news" />
          <CapsuleTabs.Tab title="话题" key="topic" />
        </CapsuleTabs>
      </div>

      <div
        className="news-content"
        ref={newsContentRef}
        onScroll={handleScroll}
        style={{
          opacity: isScrollReady ? 1 : 0,
          transition: 'opacity 120ms ease-in-out',
          height: '100%',
          overflowY: 'auto',
        }}
      >
        {renderActiveComponent()}
      </div>
    </>
  );
});

export default News;