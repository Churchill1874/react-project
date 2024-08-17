import React, { useState } from "react";
import { Tabs, CapsuleTabs } from "antd-mobile";
import '@/pages/news/News.less';
import NewsList from '@/components/news/NewsList';
import Job from '@/components/job/Job';
import Company from '@/components/company/Company'


const News: React.FC = React.memo(() => {
  const [activeKey, setActiveKey] = useState<string>('news');
  const [newsActiveTab, setNewsActiveTab] = useState<string>('news');

  // 处理 Tabs 的切换
  const handleTabChange = (key: string) => {
    setActiveKey(key);
    if (key === 'news') {
      setNewsActiveTab('news');
    }
  };

  // 处理 CapsuleTabs 的切换
  const chinaCapsuleTabChange = ((key: string) => {
    setNewsActiveTab(key);
  });

  return (
    <>
      <div className="tabs-container">
        <Tabs activeKey={activeKey} onChange={handleTabChange}>
          <Tabs.Tab title='报纸' key='news' />
          <Tabs.Tab title='youtube' key='youtube' />
          <Tabs.Tab title='聊妹' key='chatGirl' />
        </Tabs>
      </div>

      {activeKey === 'news' &&
        <div className="capsule-tabs-container">
          <CapsuleTabs activeKey={newsActiveTab} onChange={chinaCapsuleTabChange}>
            <CapsuleTabs.Tab title="新闻" key="news" />
            <CapsuleTabs.Tab title="东南亚" key="southeastAsia" />
            <CapsuleTabs.Tab title="工作" key="job" />
            <CapsuleTabs.Tab title="公司" key="company" />
          </CapsuleTabs>
        </div>
      }

      <div className="news-content">
        {activeKey === 'news' && newsActiveTab==='news' && <NewsList />}
        {activeKey === 'news' && newsActiveTab==='southeastAsia' && 'southeastAsia'}
        {activeKey === 'news' && newsActiveTab==='job' && <Job />}
        {activeKey === 'news' && newsActiveTab==='company' && <Company />}
      </div>
    </>
  );
});

export default News;
