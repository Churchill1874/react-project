import { useEffect, useRef } from 'react';
import { Card, List, SearchBar, Badge, Tabs, Input, Button } from 'antd-mobile';
//import 'antd-mobile/es/global';
//import '../../global.less';  // 确认路径正确
import '@/pages/home/Home.less';  // 引入Home.less

const App = () => {
  const newsListRef = useRef<HTMLDivElement>(null);
  const scrollContentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scrollContent = scrollContentRef.current;
    const newsList = newsListRef.current;
    console.log(newsList)

    if (scrollContent && newsList) {
      const totalHeight = scrollContent.scrollHeight / 2; // 将总高度设置为克隆列表的一半高度

      const intervalId = setInterval(() => {
        if (newsList.scrollTop >= totalHeight) {
          newsList.scrollTop = 0; // 无缝重置到顶部
        } else {
          newsList.scrollTop += 1; // 控制滚动速度
        }
      }, 50);  // 控制滚动速度，值越小滚动越快

      return () => clearInterval(intervalId);
    }
  }, []);

  const newsItems = (
    <>
      <List.Item
        extra={<Badge content="新闻" />}
        description="2023-09-10 浏览: 1001 赞: 99 喷: 3 评: 20"
      >
        郭德纲将前往日本访问
      </List.Item>
      <List.Item
        extra={<Badge content="话题" />}
        description="2023-09-09 浏览: 99999 赞: 1 喷: 7685 评: 309"
      >
        热烈庆祝中国男足战胜西班牙夺得世界杯冠军
      </List.Item>
      <List.Item
        extra={<Badge content="新闻" />}
        description="2023-09-08 浏览: 9 赞: 2 喷: 7685 评: 3"
      >
        已全民实现小康家庭
      </List.Item>
      <List.Item
        extra={<Badge content="出售" />}
        description="2023-09-08 浏览: 78 赞: 21 喷: 1 评: 20"
      >
        家中闲置母老虎一只，急售!!!
      </List.Item>
      <List.Item
        extra={<Badge content="新闻" />}
        description="2023-09-10 浏览: 1001 赞: 99 喷: 3 评: 20"
      >
        郭德纲将前往日本访问
      </List.Item>
      <List.Item
        extra={<Badge content="话题" />}
        description="2023-09-09 浏览: 99999 赞: 1 喷: 7685 评: 309"
      >
        热烈庆祝中国男足战胜西班牙夺得世界杯冠军
      </List.Item>
      <List.Item
        extra={<Badge content="新闻" />}
        description="2023-09-08 浏览: 9 赞: 2 喷: 7685 评: 3"
      >
        已全民实现小康家庭
      </List.Item>
      <List.Item
        extra={<Badge content="出售" />}
        description="2023-09-08 浏览: 78 赞: 21 喷: 1 评: 20"
      >
        家中闲置母老虎一只，急售!!!
      </List.Item>
    </>
  );

  return (
    <div>
      <header className='header'>
        <div className='logo'>logo</div>
        <SearchBar className='search-bar' placeholder="搜索框…" style={{ flex: 1, margin: '0 10px', height: '30px', padding: '0' }} />
        <div className='avatar'>头像</div>
      </header>

      <div className="top-news">
        <div className="list-item">
          <span style={{ color: 'red' }}>置顶：国家主席习近平今日召开重要会议</span>
        </div>
        <div className="list-item">
          头条1：村东头王寡妇跟人跑了
        </div>
      </div>

      <Card className='carousel-card'>
        <div className='carousel-container'>
          轮播图
        </div>
      </Card>

      <div style={{ padding: '10px', backgroundColor: '#f5f5f5', margin: '10px 0' }}>
        滚动文字、平台公告、系统通知~
      </div>

      <div className="news-list" ref={newsListRef}>
        <div className="scroll-content" ref={scrollContentRef}>
          {newsItems}
          {newsItems} {/* 复制一份内容以实现无缝滚动 */}
        </div>
      </div>

      <Card style={{ margin: '10px' }}>
        <div style={{ padding: '10px' }}>
          <div>刘老六：介绍行了介绍就！</div>
          <div>吴老二：我浑森发抖</div>
          <div>宋大大：你们都认识我嘛 哈哈哈哈哈哈哈</div>
          <div>张三白：你是喝多了吗</div>
          <div>宋大大：今天郭德纲访日了</div>
          <div>李大婉：访呀</div>
          <div>宋大大：那是他该干的事嘛</div>
          <div>09-08 10:05</div>
          <div>主教练：中国队夺冠啦~~~~~~</div>
        </div>
      </Card>

      <div style={{ display: 'flex', padding: '10px', borderTop: '1px solid #ccc' }}>
        <Input placeholder="请输入" style={{ flex: 1 }} />
        <Button color="primary">发送</Button>
      </div>

      <Tabs style={{ marginTop: '10px' }}>
        <Tabs.Tab title="首页" key="home" />
        <Tabs.Tab title="新闻" key="news" />
        <Tabs.Tab title="市场" key="market" />
        <Tabs.Tab title="大厅" key="hall" />
        <Tabs.Tab title="个人" key="personal" />
      </Tabs>
    </div>
  );
}

export default App;
