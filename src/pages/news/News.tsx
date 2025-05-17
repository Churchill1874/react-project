import React, { useState, useRef, useEffect } from "react";
import { CapsuleTabs } from "antd-mobile";
import '@/pages/news/News.less';
import NewsList from '@/components/news/NewsList';
import Job from '@/components/job/Job';
import Company from '@/components/company/Company';
import SoutheastAsia from '@/components/southeastasia/SoutheastAsia';

const News: React.FC = React.memo(() => {
  const [newsActiveTab, setNewsActiveTab] = useState<string>('news');

  // 为每个菜单创建独立的滚动容器
  const sectionRefs = {
    news: useRef<HTMLDivElement>(null),
    southeastAsia: useRef<HTMLDivElement>(null),
    job: useRef<HTMLDivElement>(null),
    company: useRef<HTMLDivElement>(null),
    second: useRef<HTMLDivElement>(null)
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
          <CapsuleTabs.Tab title="东南亚" key="southeastAsia" />
          <CapsuleTabs.Tab title="工作" key="job" />
          <CapsuleTabs.Tab title="公司" key="company" />
          <CapsuleTabs.Tab title="二手" key="second" />
        </CapsuleTabs>
      </div>

      {/* 每个菜单的内容都有独立的滚动容器 */}
      <div className="news-content">
        <div ref={sectionRefs.news} className={`tab-content ${newsActiveTab === 'news' ? 'active' : ''}`}>
          <NewsList />
        </div>
        <div ref={sectionRefs.southeastAsia} className={`tab-content ${newsActiveTab === 'southeastAsia' ? 'active' : ''}`}>
          <SoutheastAsia />
        </div>
        <div ref={sectionRefs.job} className={`tab-content ${newsActiveTab === 'job' ? 'active' : ''}`}>
          <Job />
        </div>
        <div ref={sectionRefs.company} className={`tab-content ${newsActiveTab === 'company' ? 'active' : ''}`}>
          <Company />
        </div>
        <div ref={sectionRefs.second} className={`tab-content ${newsActiveTab === 'second' ? 'active' : ''}`}>
          <Company />
        </div>
      </div>
    </>
  );
});

export default News;
