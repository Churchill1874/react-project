import React, { useState } from "react";
import { Tabs, CapsuleTabs } from "antd-mobile";
import '@/pages/news/News.less';
import NewsList from '@/components/news/NewsList';

const News: React.FC = React.memo(() => {
  const [activeKey, setActiveKey] = useState<string>('news');
  const [chinaActiveTab, setChinaActiveTab] = useState<string>('1');
  const [abroadActiveTab, setAbroadChinaActiveTab] = useState<string>('1');

  const handleTabChange = (key: string) => {
    setActiveKey(key);
    if (key === 'news') {
      console.log('handleTabChange', key)
      setChinaActiveTab('1');
    }
  };

  const chinaCapsuleTabChange = ((key: string) => {
    console.log('chinaCapsuleTabChange', key)
    setChinaActiveTab(key);
  });

  const abroadHandleCapsuleTabChange = ((key: string)=>{
    console.log('abroadHandleCapsuleTabChange', key)
    setAbroadChinaActiveTab(key);
  })

  return (
    <>
      <div className="tabs-container">
        <Tabs activeKey={activeKey} onChange={handleTabChange}>
          <Tabs.Tab title='新闻' key='news' />
          <Tabs.Tab title='境外' key='abroad' />
          <Tabs.Tab title='油管' key='youtube' />
          <Tabs.Tab title='聊妹' key='chatgirl' />
        </Tabs>
      </div>

      {activeKey === 'news' &&
        <div className="capsule-tabs-container">
          <CapsuleTabs activeKey={chinaActiveTab} onChange={chinaCapsuleTabChange}>
            <CapsuleTabs.Tab title="新闻" key="1" />
            <CapsuleTabs.Tab title="体育" key="2" />
            <CapsuleTabs.Tab title="娱乐" key="3" />
            <CapsuleTabs.Tab title="军事" key="4" />
            <CapsuleTabs.Tab title="科技" key="5" />
            <CapsuleTabs.Tab title="网友" key="7" />
          </CapsuleTabs>
        </div>
      }

      {activeKey === 'abroad' &&
              <div className="capsule-tabs-container">
              <CapsuleTabs activeKey={abroadActiveTab} onChange={abroadHandleCapsuleTabChange}>
                <CapsuleTabs.Tab title="曝光" key="1" />
                <CapsuleTabs.Tab title="公司" key="2" />
              </CapsuleTabs>
            </div>
      }

      <div className="news-content">
        {activeKey === 'news' && <NewsList newsTab={chinaActiveTab} />}
        {activeKey === 'abroad' && <NewsList abroadTab={abroadActiveTab} />}
      </div>
    </>
  );
});

export default News;
