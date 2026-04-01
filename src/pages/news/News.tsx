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
import { useParams } from 'react-router-dom';
import useStore from '@/zustand/store';

const News: React.FC = React.memo(() => {
  const [newsActiveTab, setNewsActiveTab] = useState<string>(() => {
    return localStorage.getItem('newsActiveTab') || 'exposure';
  });
  const [isScrollReady, setIsScrollReady] = useState(false);
  const newsContentRef = useRef<HTMLDivElement>(null);
  const { typeId } = useParams();
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
    if (typeId) {
      setNewsActiveTab(typeId);
    }
  }, [typeId]);

  // 保存滚动位置，当 tab 改变时
  const handleTabChange = (key: string) => {
    if (newsContentRef.current) {
      setNewsScrollPosition(newsActiveTab, newsContentRef.current.scrollTop);
    }
    setIsScrollReady(false);
    setNewsActiveTab(key);
  };

  // 通过newsActiveTab恢复滚动位置，并避免闪烁（先隐藏内容，再统一恢复）
  useLayoutEffect(() => {
    if (!newsContentRef.current) {
      return;
    }

    // 先立刻应用缓存位置（如果有）
    const savedPosition = getNewsScrollPosition(newsActiveTab);
    if (savedPosition > 0) {
      newsContentRef.current.scrollTop = savedPosition;
    }

    // 显示容器
    const visibleTimer = window.setTimeout(() => {
      setIsScrollReady(true);
    }, 20);

    return () => {
      window.clearTimeout(visibleTimer);
    };
  }, [newsActiveTab, getNewsScrollPosition]);

  // URL 参数改变时切换tab
  useEffect(() => {
    if (typeId) {
      setIsScrollReady(false);
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
    }, 100); // 100ms防抖
  };

  // ✅ 条件渲染：只渲染当前激活的组件
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
      {/* 固定顶部的菜单 */}
      <div className="capsule-tabs-container">
        <CapsuleTabs activeKey={newsActiveTab} onChange={handleTabChange}>
          <CapsuleTabs.Tab title="曝光" key="exposure" />
          <CapsuleTabs.Tab title="查公司" key="company" />
          <CapsuleTabs.Tab title="东南亚" key="southeastAsia" />
          <CapsuleTabs.Tab title="社会瓜" key="society" />
          <CapsuleTabs.Tab title="政闻" key="politics" />
          <CapsuleTabs.Tab title="国内" key="news" />
          <CapsuleTabs.Tab title="话题" key="topic" />
          {/* <CapsuleTabs.Tab title="帮推广" key="promotion" />
          <CapsuleTabs.Tab title="工作" key="job" /> */}
        </CapsuleTabs>
      </div>

      {/* ✅ 统一的滚动容器 - 只渲染当前激活的组件 */}
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