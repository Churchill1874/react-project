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

  // 处理 Tabs 的切换
  const handleTabChange = (key: string) => {
    setActiveKey(key);
    if (key === 'news') {
      setChinaActiveTab('1');
      navigate(`/news/1`);  // 导航到默认的新闻类型
    }
  };

  // 处理 CapsuleTabs 的切换
  const chinaCapsuleTabChange = ((key: string) => {
    setChinaActiveTab(key);
    navigate(`/news/${key}`);  // 修改 URL 以反映当前选中的 tab
  });

  // 当组件首次加载时，如果 typeId 不存在，则导航到默认类型
  useEffect(() => {
    if (!typeId) {
      navigate(`/news/1`, { replace: true });  // 使用 replace 以避免返回到重定向前的页面
    } else {
      setChinaActiveTab(typeId);
    }
  }, [typeId, navigate]);

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
