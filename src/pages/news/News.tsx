import React, { useState, useEffect } from "react";
import { Tabs, CapsuleTabs } from "antd-mobile";
import '@/pages/news/News.less';
import NewsList from '@/components/news/NewsList';
import { useParams, useNavigate } from 'react-router-dom';


const News: React.FC = React.memo(() => {
  const [activeKey, setActiveKey] = useState<string>('news');
  const [chinaActiveTab, setChinaActiveTab] = useState<string>('1');
  const { typeId } = useParams();  // 获取路由参数
  const navigate = useNavigate();


  const handleTabChange = (key: string) => {
    setActiveKey(key);
    if (key === 'news') {
      console.log('handleTabChange', key)
      setChinaActiveTab('1');
      navigate(`/news/1`);
    }
  };

  const chinaCapsuleTabChange = ((key: string) => {
    console.log('chinaCapsuleTabChange', key)
    setChinaActiveTab(key);
    navigate(`/news/${key}`);  // 修改 URL 以反映当前选中的 tab
  });

  useEffect(() => {
    // 每当 typeId 变化时，更新 chinaActiveTab
    if (typeId) {
      setChinaActiveTab(typeId);
    }
  }, [typeId]);

  return (
    <>
      <div className="tabs-container">
        <Tabs activeKey={activeKey} onChange={handleTabChange}>
          <Tabs.Tab title='新闻' key='news' />
          <Tabs.Tab title='工作' key='job' />
          <Tabs.Tab title='人才' key='applyJob' />
          <Tabs.Tab title='聊妹' key='chatGirl' />
        </Tabs>
      </div>

      {activeKey === 'news' &&
        <div className="capsule-tabs-container">
          <CapsuleTabs activeKey={chinaActiveTab} onChange={chinaCapsuleTabChange}>
            <CapsuleTabs.Tab title="热门" key="1" />
            <CapsuleTabs.Tab title="东南亚" key="8" />
            <CapsuleTabs.Tab title="youtube" key="9" />
            <CapsuleTabs.Tab title="军事" key="4" />
            <CapsuleTabs.Tab title="体育" key="2" />
            <CapsuleTabs.Tab title="娱乐" key="3" />
            <CapsuleTabs.Tab title="科技" key="5" />
          </CapsuleTabs>
        </div>
      }

      <div className="news-content">
        {activeKey === 'news' && <NewsList newsTab={chinaActiveTab} />}
      </div>
    </>
  );
});

export default News;
