import { useEffect, useRef } from 'react';
import { Toast, Swiper, Card, List, SearchBar, Badge, Tabs, Input, Button, NoticeBar } from 'antd-mobile';
import { SoundOutlined } from '@ant-design/icons';
import '@/pages/home/Home.less';  // 引入Home.less


const Home = () => {
  const newsListRef = useRef<HTMLDivElement>(null);
  const scrollContentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scrollContent = scrollContentRef.current;
    const newsList = newsListRef.current;

    if (scrollContent && newsList) {
      const totalHeight = scrollContent.scrollHeight / 2; // 将总高度设置为克隆列表的一半高度

      let isDragging = false;
      let startY: number, scrollTop: number;

      const startDragging = (e: MouseEvent | TouchEvent) => {
        e.stopPropagation();
        isDragging = true;
        startY = 'touches' in e ? e.touches[0].clientY : e.clientY;
        scrollTop = newsList.scrollTop;
      };

      const stopDragging = () => {
        isDragging = false;
      };

      const onDragging = (e: MouseEvent | TouchEvent) => {
        if (!isDragging) return;
        e.stopPropagation();
        const y = 'touches' in e ? e.touches[0].clientY : e.clientY;
        const walk = y - startY;
        newsList.scrollTop = scrollTop - walk;
      };

      newsList.addEventListener('mousedown', startDragging);
      newsList.addEventListener('mousemove', onDragging);
      newsList.addEventListener('mouseup', stopDragging);
      newsList.addEventListener('mouseleave', stopDragging);
      newsList.addEventListener('touchstart', startDragging);
      newsList.addEventListener('touchmove', onDragging);
      newsList.addEventListener('touchend', stopDragging);
      newsList.addEventListener('touchcancel', stopDragging);

      const intervalId = setInterval(() => {
        if (!isDragging) {
          if (newsList.scrollTop >= totalHeight) {
            newsList.scrollTop = 0; // 无缝重置到顶部
          } else {
            newsList.scrollTop += 1; // 控制滚动速度
          }
        }
      }, 50); // 控制滚动速度，值越小滚动越快

      return () => {
        clearInterval(intervalId);
        newsList.removeEventListener('mousedown', startDragging);
        newsList.removeEventListener('mousemove', onDragging);
        newsList.removeEventListener('mouseup', stopDragging);
        newsList.removeEventListener('mouseleave', stopDragging);
        newsList.removeEventListener('touchstart', startDragging);
        newsList.removeEventListener('touchmove', onDragging);
        newsList.removeEventListener('touchend', stopDragging);
        newsList.removeEventListener('touchcancel', stopDragging);
      };
    }
  }, []);


  const colors = ['#ace0ff', '#bcffbd', '#e4fabd', '#ffcfac']

  const items = colors.map((color, index) => (
    <Swiper.Item key={index}>
      <div
        className='banner'
        style={{ background: color }}
        onClick={() => {
          Toast.show(`你点击了卡片 ${index + 1}`)
        }}
      >
        {index + 1}
      </div>
    </Swiper.Item>
  ))

  const newsItems = (
    <>
      <List.Item
        extra={<Badge content="新闻" />}
        description="2023-09-10 浏览: 1001 赞: 99 喷: 3 评: 20"
      >
        1.郭德纲将前往日本访问
      </List.Item>
      <List.Item
        extra={<Badge content="话题" />}
        description="2023-09-09 浏览: 99999 赞: 1 喷: 7685 评: 309"
      >
        2.热烈庆祝中国男足战胜西班牙夺得世界杯冠军
      </List.Item>
      <List.Item
        extra={<Badge content="新闻" />}
        description="2023-09-08 浏览: 9 赞: 2 喷: 7685 评: 3"
      >
        3.已全民实现小康家庭
      </List.Item>
      <List.Item
        extra={<Badge content="出售" />}
        description="2023-09-08 浏览: 78 赞: 21 喷: 1 评: 20"
      >
        4.家中闲置母老虎一只，急售!!!
      </List.Item>
      <List.Item
        extra={<Badge content="新闻" />}
        description="2023-09-10 浏览: 1001 赞: 99 喷: 3 评: 20"
      >
        5.郭德纲将前往日本访问
      </List.Item>
      <List.Item
        extra={<Badge content="话题" />}
        description="2023-09-09 浏览: 99999 赞: 1 喷: 7685 评: 309"
      >
        6.热烈庆祝中国男足战胜西班牙夺得世界杯冠军
      </List.Item>
      <List.Item
        extra={<Badge content="新闻" />}
        description="2023-09-08 浏览: 9 赞: 2 喷: 7685 评: 3"
      >
        7.已全民实现小康家庭
      </List.Item>
      <List.Item
        extra={<Badge content="出售" />}
        description="2023-09-08 浏览: 78 赞: 21 喷: 1 评: 20"
      >
        8.家中闲置母老虎一只，急售!!!
      </List.Item>
    </>
  );

  return (
    <div>
      <header className='header'>
        <div className='logo'>logo</div>
        <SearchBar className='search-bar' placeholder="搜索框…"/>
        <div className='avatar'>头像</div>
      </header>

      <div className="top-news">
        <div className="list-item">
          <span className='top'>置顶：国家主席习近平今日召开重要会议</span>
        </div>
      </div>

      <Swiper loop autoplay allowTouchMove>
        {items}
      </Swiper>

      <div className="news-list" ref={newsListRef}>
        <div className="scroll-content" ref={scrollContentRef}>
          {newsItems}
          {newsItems} {/* 复制一份内容以实现无缝滚动 */}
        </div>
      </div>

      <NoticeBar className='notice-bar' color='info'
        icon={<SoundOutlined style={{ color: '#1677ff' }} />}
        content="滚动文字，平台公告，系统通知~~~~~~~~~滚动文字，平台公告，系统通知~"
        speed={50}
      />

      <div className='chat'>
        <div>刘老六：介绍行了介绍就!</div>
        <span className='time'>2024-09-08 10:05</span>
        <div>吴老二：我浑森发抖</div>
        <span className='time'>2024-09-08 10:05</span>
        <div>宋大大：你们都认识我嘛 哈哈哈哈哈哈哈</div>
        <span className='time'>2024-09-08 10:05</span>
        <div>张三白：你是喝多了吗</div>
        <span className='time'>2024-09-08 10:05</span>
        <div>宋大大：今天郭德纲访日了</div>
        <span className='time'>2024-09-08 10:05</span>
        <div>李大婉：访呀</div>
        <span className='time'>2024-09-08 10:05</span>
        <div>宋大大：那是他该干的事嘛</div>
        <span className='time'>2024-09-08 10:05</span>
        <div>主教练：中国队夺冠啦~~~~~~</div>
        <span className='time'>2024-09-08 10:05</span>
        <div>刘老六：介绍行了介绍就！</div>
        <span className='time'>2024-09-08 10:05</span>
        <div>吴老二：我浑森发抖</div>
        <span className='time'>2024-09-08 10:05</span>
        <div>宋大大：你们都认识我嘛 哈哈哈哈哈哈哈</div>
        <span className='time'>2024-09-08 10:05</span>
        <div>张三白：你是喝多了吗</div>
        <span className='time'>2024-09-08 10:05</span>
        <div>宋大大：今天郭德纲访日了</div>
        <span className='time'>2024-09-08 10:05</span>
        <div>李大婉：访呀</div>
        <span className='time'>2024-09-08 10:05</span>
        <div>宋大大：那是他该干的事嘛</div>
        <div className='time'>2024-10-08 10:05</div>
        <div>主教练：中国队夺冠啦~~~~~~</div>
        <span className='time'>2024-09-08 10:05</span>
      </div>

      <div className='send'>
        <Input placeholder="请输入" style={{ flex: 1 }} />
        <Button color="primary">发送</Button>
      </div>

      <Tabs>
        <Tabs.Tab title="首页" key="home" />
        <Tabs.Tab title="新闻" key="news" />
        <Tabs.Tab title="市场" key="market" />
        <Tabs.Tab title="消息" key="hall" />
        <Tabs.Tab title="个人" key="personal" />
      </Tabs>
    </div>
  );
}

export default Home;
