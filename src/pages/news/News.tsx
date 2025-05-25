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

const News: React.FC = React.memo(() => {
  const [newsActiveTab, setNewsActiveTab] = useState<string>('news');

  // 为每个菜单创建独立的滚动容器
  const sectionRefs = {
    news: useRef<HTMLDivElement>(null),
    southeastAsia: useRef<HTMLDivElement>(null),
    job: useRef<HTMLDivElement>(null),
    company: useRef<HTMLDivElement>(null),
    politics: useRef<HTMLDivElement>(null),
    society: useRef<HTMLDivElement>(null),
    promotion: useRef<HTMLDivElement>(null),
    topic: useRef<HTMLDivElement>(null)
  };

  // 切换菜单时，重置滚动位置
  useEffect(() => {
    if (sectionRefs[newsActiveTab]?.current) {
      sectionRefs[newsActiveTab].current.scrollTop = 0;
    }
  }, [newsActiveTab]);

  return (
    <>
      {/* 固定顶部的菜单 */}
      <div className="capsule-tabs-container">
        <CapsuleTabs activeKey={newsActiveTab} onChange={setNewsActiveTab}>
          <CapsuleTabs.Tab title="国内" key="news" />
          <CapsuleTabs.Tab title="政治" key="politics" />
          <CapsuleTabs.Tab title="东南亚" key="southeastAsia" />
          <CapsuleTabs.Tab title="社会瓜" key="society" />
          <CapsuleTabs.Tab title="话题" key="topic" />
          <CapsuleTabs.Tab title="帮推广" key="promotion" />
          <CapsuleTabs.Tab title="工作" key="job" />
          <CapsuleTabs.Tab title="查公司" key="company" />
        </CapsuleTabs>
      </div>

      {/* 每个菜单的内容都有独立的滚动容器 */}
      <div className="news-content">
        <div ref={sectionRefs.news} className={`tab-content ${newsActiveTab === 'news' ? 'active' : ''}`}>
          <NewsList />
        </div>

        <div ref={sectionRefs.politics} className={`tab-content ${newsActiveTab === 'politics' ? 'active' : ''}`}>
          <Politics />
        </div>

        <div ref={sectionRefs.southeastAsia} className={`tab-content ${newsActiveTab === 'southeastAsia' ? 'active' : ''}`}>
          <SoutheastAsia />
        </div>

        <div ref={sectionRefs.society} className={`tab-content ${newsActiveTab === 'society' ? 'active' : ''}`}>
          <Society />
        </div>

        <div ref={sectionRefs.topic} className={`tab-content ${newsActiveTab === 'topic' ? 'active' : ''}`}>
          <Topic />
        </div>

        <div ref={sectionRefs.promotion} className={`tab-content ${newsActiveTab === 'promotion' ? 'active' : ''}`}>
          <Promotion />
        </div>

        <div ref={sectionRefs.job} className={`tab-content ${newsActiveTab === 'job' ? 'active' : ''}`}>
          <Job />
        </div>

        <div ref={sectionRefs.company} className={`tab-content ${newsActiveTab === 'company' ? 'active' : ''}`}>
          <Company />
        </div>
      </div>
    </>
  );
});

export default News;
