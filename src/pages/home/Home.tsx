import { useEffect, useRef, useState } from 'react';
import { Toast, Swiper, List, Badge, Tabs, Input, Button, NoticeBar, Avatar, Divider } from 'antd-mobile';
import { SoundOutlined } from '@ant-design/icons';
import { Request_HOME_NEWS } from '@/pages/home/api';
import '@/pages/home/Home.less'; // 引入Home.less

const Home = () => {
  const [topNews, setTopNews] = useState<JSX.Element | null>(null);
  const [hotNews, setHotNews] = useState<JSX.Element | null>(null);
  const [newsRank, setNewsRank] = useState<JSX.Element[] | []>([]);
  const chatRef = useRef<HTMLDivElement>(null);
  const newsListRef = useRef<HTMLDivElement>(null);
  const scrollContentRef = useRef<HTMLDivElement>(null);

  // 获取首页新闻数据
  const newsListReq = async () => {
    const newsListResponse = await Request_HOME_NEWS();

    const { topNews, newsList } = newsListResponse.data;

    // 置顶新闻
    if (topNews) {
      const { title } = topNews;
      const topNewsHtml = (
        <div className="top-news">
          {title ? (
            <div className="list-item">
              <span className="top">置顶：</span>
              {title}
            </div>
          ) : null}
          <div className="list-item">
            <span className="hot">头条：</span>
            头条临时测试数据
          </div>

        </div>
      );

      setTopNews(topNewsHtml);
    }

    // 新闻排名
    if (newsList) {
      const newsRankHtml = newsList.map((news, index) => (
        <List.Item key={news.id} extra={<Badge content="新闻" />}>
          <div className="news-item">
            <div className="news-title">{index + 1 + '.' + news.title}</div>
            <div className="news-info">
              <span className="date">{news.newsTime}</span>
              <span className="space"></span>
              <span className="views">{'浏览:' + news.viewCount}</span>
              <span className="space"></span>
              <span className="likes">{'赞:' + news.likesCount}</span>
              <span className="space"></span>
              <span className="dislikes">{'喷:' + news.badCount}</span>
              <span className="space"></span>
              <span className="comments">{'评:' + news.commentsCount}</span>
            </div>
          </div>
        </List.Item>
      ));

      setNewsRank(newsRankHtml);
    }
  };

  const setupScroll = () => {
    const scrollContent = scrollContentRef.current;
    const newsList = newsListRef.current;

    if (scrollContent && newsList) {
      const totalHeight = scrollContent.scrollHeight / 2;

      if (totalHeight === 0) {
        setTimeout(setupScroll, 100);
        return;
      }

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
            newsList.scrollTop = 0;
          } else {
            newsList.scrollTop += 1; // 调整步进值
          }
        }
      }, 100); // 控制滚动速度

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
  };

  useEffect(() => {
    newsListReq();
  }, []);

  useEffect(() => {
    if (newsRank.length > 0) {
      setupScroll();
    }

    // 聊天对话框直接显示最底部
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [newsRank]);

  const colors = ['#ace0ff', '#bcffbd', '#e4fabd', '#ffcfac'];

  const items = colors.map((color, index) => (
    <Swiper.Item key={index}>
      <div
        className="banner"
        style={{ background: color }}
        onClick={() => {
          Toast.show(`你点击了卡片 ${index + 1}`);
        }}
      >
        {index + 1}
      </div>
    </Swiper.Item>
  ));

  return (
    <div>
      <header className="header">
        <div className="logo">BIG NEWS</div>
        <div className="title">102人在线</div>
        <div className="player">level1 头像</div>
      </header>

      {topNews}


      <Swiper loop autoplay allowTouchMove>
        {items}
      </Swiper>

      <div className="news-list" ref={newsListRef}>
        <div className="scroll-content" ref={scrollContentRef}>
          {newsRank}
          {newsRank} {/* 复制一份内容以实现无缝滚动 */}
        </div>
      </div>

      {/**下注 */}
      <div className="event-container">
        <div className="event-info">
          <span className="event-title">事件: 美国大选</span>
          <span className="event-date">2024-12-01 浏览: 1200</span>
          <span className="event-views"></span>
          <span className="event-reward">奖池: 82402 usdt</span>
        </div>

        {/**信息内容 */}
        <div className="event-detail">
          <div className="candidates">
            <div className="candidate">
              <Avatar className='avatar' src="biden_image_url" />
              <span className="percentage blue">45%</span>
            </div>
            <div className="vs">VS</div>
            <div className="candidate">
              <Avatar className='avatar' src="trump_image_url" />
              <span className="percentage red">55%</span>
            </div>
          </div>

          <div className="odds">
            <div className="odd-blue">
              <div className="odd-value-left">1.7</div>
              <div className="odd-people">170人 <span className="event-reward">1001u</span></div>
            </div>
            <div className="official">VS</div>
            <div className="odd-red">
              <div className="odd-value-right">0.7</div>
              <div className="odd-people">800人 <span className="event-reward">20011u</span></div>
            </div>
          </div>

          {/**点击投注 */}
          <div className='bet-container'>
            <Button className="bet" color="primary">下注</Button>
          </div>
        </div>
      </div>


      <NoticeBar
        className="notice-bar"
        color="info"
        icon={<SoundOutlined style={{ color: '#1677ff' }} />}
        content="滚动文字，平台公告，系统通知~~~~~~~~~滚动文字，平台公告，系统通知~"
        speed={50}
      />

      <div className="chat-container"></div>
      <div className="chat" ref={chatRef}>
        <div>刘老六：介绍行了介绍就!</div>
        <span className="time">2024-09-08 10:05</span>
        <div>吴老二：我浑森发抖</div>
        <span className="time">2024-09-08 10:05</span>
        <div>宋大大：你们都认识我嘛 哈哈哈哈哈哈哈</div>
        <span className="time">2024-09-08 10:05</span>
        <div>张三白：你是喝多了吗</div>
        <span className="time">2024-09-08 10:05</span>
        <div>宋大大：今天郭德纲访日了</div>
        <span className="time">2024-09-08 10:05</span>
        <div>李大婉：访呀</div>
        <span className="time">2024-09-08 10:05</span>
        <div>宋大大：那是他该干的事嘛</div>
        <span className="time">2024-09-08 10:05</span>
        <div>主教练：中国队夺冠啦~~~~~~</div>
        <span className="time">2024-09-08 10:05</span>
        <div>刘老六：介绍行了介绍就！</div>
        <span className="time">2024-09-08 10:05</span>
        <div>吴老二：我浑森发抖</div>
        <span className="time">2024-09-08 10:05</span>
        <div>宋大大：你们都认识我嘛 哈哈哈哈哈哈哈</div>
        <span className="time">2024-09-08 10:05</span>
        <div>张三白：你是喝多了吗</div>
        <span className="time">2024-09-08 10:05</span>
        <div>宋大大：今天郭德纲访日了</div>
        <span className="time">2024-09-08 10:05</span>
        <div>李大婉：访呀</div>
        <span className="time">2024-09-08 10:05</span>
        <div>宋大大：那是他该干的事嘛</div>
        <span className="time">2024-10-08 10:05</span>
        <div>主教练：中国队夺冠啦~~~~~~</div>
        <span className="time">2024-09-08 10:05</span>
      </div>

      <div className="send-container">
        <Input className="input-field" placeholder="请输入" inputMode="search" />
        <Button className="send-button" color="primary">
          发送
        </Button>
      </div>

      <Tabs>
        <Tabs.Tab title="首页" key="home" />
        <Tabs.Tab title="新闻" key="news" />
        <Tabs.Tab title="市场" key="market" />
        <Tabs.Tab title="消息" key="hall" />
        <Tabs.Tab title="我" key="personal" />
      </Tabs>
    </div>
  );
};

export default Home;
