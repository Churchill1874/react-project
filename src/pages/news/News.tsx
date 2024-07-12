import React, { useState } from "react";
import { Tabs, CapsuleTabs } from "antd-mobile";
import '@/pages/news/News.less';
import NewsList from '@/components/news/NewsList';

const News: React.FC = React.memo(() => {
  const [activeKey, setActiveKey] = useState<string>('news');
  const [activeTab, setActiveTab] = useState<string>('1');

  const handleTabChange = (key: string) => {
    setActiveKey(key);
    if (key === 'news') {
      setActiveTab('1');
    }
  };

  const handleCapsuleTabChange = ((key: string) => {
    setActiveTab(key);
  });

  return (
    <>
      <div className="tabs-container">
        <Tabs activeKey={activeKey} onChange={handleTabChange}>
          <Tabs.Tab title='新闻' key='news' />
          <Tabs.Tab title='境外' key='abroad' />
          <Tabs.Tab title='曝光' key='exposure' />
          <Tabs.Tab title='公司' key='political' />
          <Tabs.Tab title='油管' key='youtube' />
        </Tabs>
      </div>

      {activeKey === 'news' &&
        <div className="capsule-tabs-container">
          <CapsuleTabs activeKey={activeTab} onChange={handleCapsuleTabChange}>
            <CapsuleTabs.Tab title="新闻" key="1" />
            <CapsuleTabs.Tab title="体育" key="2" />
            <CapsuleTabs.Tab title="娱乐" key="3" />
            <CapsuleTabs.Tab title="军事" key="4" />
            <CapsuleTabs.Tab title="科技" key="5" />
            <CapsuleTabs.Tab title="网友" key="7" />
          </CapsuleTabs>
        </div>
      }

      <div className="news-content">
        {activeKey === 'news' && <NewsList newsTab={activeTab} />}
      </div>
    </>
  );
});

export default News;
