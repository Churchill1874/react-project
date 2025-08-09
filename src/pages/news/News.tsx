import React, { useState, useRef, useEffect } from "react";
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
import { useParams } from 'react-router-dom';

const News: React.FC = React.memo(() => {
  const [newsActiveTab, setNewsActiveTab] = useState<string>('news');
  const newsContentRef = useRef<HTMLDivElement>(null);
  const { typeId } = useParams();
  useEffect(() => {
    console.log('news:' + typeId)
    if (typeId) {
      setNewsActiveTab(typeId);
    }
  }, [])

  // 切换菜单时，重置主容器的滚动位置
  useEffect(() => {
    console.log('Tab changed to:', newsActiveTab);
    if (newsContentRef.current) {
      newsContentRef.current.scrollTop = 0;
    }
  }, [newsActiveTab]);

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
      default:
        return <NewsList />;
    }
  };

  return (
    <>
      {/* 固定顶部的菜单 */}
      <div className="capsule-tabs-container">
        <CapsuleTabs activeKey={newsActiveTab} onChange={setNewsActiveTab}>
          <CapsuleTabs.Tab title="国内" key="news" />
          <CapsuleTabs.Tab title="政闻" key="politics" />
          <CapsuleTabs.Tab title="东南亚" key="southeastAsia" />
          <CapsuleTabs.Tab title="社会瓜" key="society" />
          <CapsuleTabs.Tab title="话题" key="topic" />
          <CapsuleTabs.Tab title="帮推广" key="promotion" />
          <CapsuleTabs.Tab title="工作" key="job" />
          <CapsuleTabs.Tab title="查公司" key="company" />
        </CapsuleTabs>
      </div>

      {/* ✅ 统一的滚动容器 - 只渲染当前激活的组件 */}
      <div className="news-content" ref={newsContentRef}>
        {renderActiveComponent()}
      </div>
    </>
  );
});

export default News;