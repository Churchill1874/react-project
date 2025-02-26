import { useEffect, useRef } from 'react';
import { Toast, Swiper, List, Badge, Input, Button, Avatar, Ellipsis } from 'antd-mobile';
import { GlobalOutline } from 'antd-mobile-icons';
import { Request_HOME_NEWS } from '@/pages/home/api';
import '@/pages/home/Home.less'; // 引入Home.less
import { newsEnum } from '@/common/news'
import useStore from '@/zustand/store'


const Home = () => {
  const Jiang = '/assets/avatars/1.jpg'

  const chatRef = useRef<HTMLDivElement>(null);
  const newsListRef = useRef<HTMLDivElement>(null);
  const scrollContentRef = useRef<HTMLDivElement>(null);
  const { newsInfoList, setNewsInfoList, topNewsTitleHtml, setTopNewsTitleHtml, onlinePlayerCount, setOnlinePlayerCount } = useStore();

  //新闻html数据
  const newsRankHtml = () => {
    return (
      newsInfoList?.map((news, index) => (
        <List.Item key={news.id}
          extra={<Badge className="badge" color={newsEnum(news.category).color} content={newsEnum(news.category).name} />}
        >
          <div className="news-item">
            <div className="news-title">{((index + 1) === 1 ? <span className='hot'>头条</span> : <span >{(index + 1) + '.'}</span>)} {news.title}</div>
            <div className="news-info">
              <span className="date"> {news.createTime.split(' ')[0]} </span>
            </div>
          </div>
        </List.Item>
      )))
  }


  // 获取首页新闻数据
  const newsListReq = async () => {
    const newsListResponse = await Request_HOME_NEWS();
    const { topNews, newsList, onlinePlayerCount } = newsListResponse.data;

    //在线人数
    setOnlinePlayerCount(onlinePlayerCount);

    // 置顶新闻
    if (topNews) {
      const topTitle = topNews && topNews.title;

      const topNewsHtml = (
        <div className="top-news">
          {topTitle ? (
            <div className="list-item">
              <span className="top">置顶：</span>
              <Ellipsis direction='end' content={topTitle} expandText='展开' collapseText='收起' />
            </div>
          ) : null}
        </div>
      );

      setTopNewsTitleHtml(topNewsHtml);
    }

    // 新闻排名
    if (JSON.stringify(newsList) !== JSON.stringify(newsInfoList)) {
      setNewsInfoList(newsList)
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

      newsList.addEventListener('mousedown', startDragging, { passive: true });
      newsList.addEventListener('mousemove', onDragging, { passive: true });
      newsList.addEventListener('mouseup', stopDragging, { passive: true });
      newsList.addEventListener('mouseleave', stopDragging, { passive: true });
      newsList.addEventListener('touchstart', startDragging, { passive: true });
      newsList.addEventListener('touchmove', onDragging, { passive: true });
      newsList.addEventListener('touchend', stopDragging, { passive: true });
      newsList.addEventListener('touchcancel', stopDragging, { passive: true });

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
    if (newsInfoList && newsInfoList?.length > 0) {
      setupScroll();
    }

    // 聊天对话框直接显示最底部
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [newsInfoList]);




  const colors = ['#ace0ff', '#bcffbd', '#e4fabd', '#ffcfac'];

  const items = colors.map((color, index) => (
    <Swiper.Item key={index}>
      <div className="banner" style={{ background: color }} onClick={() => { Toast.show(`你点击了卡片 ${index + 1}`) }}>
        {index + 1}
      </div>
    </Swiper.Item>
  ));

  return (
    <div className="home">
      <header className="header">
        <div className="logo">BIG NEWS</div>

        <div><GlobalOutline className='global-line' fontSize={14} /> <span className="online"> 在线 {onlinePlayerCount} 人 </span></div>
      </header>

      {topNewsTitleHtml}

      <Swiper loop autoplay allowTouchMove>
        {items}
      </Swiper>

      <div className="news-list" ref={newsListRef}>
        <div className="scroll-content" ref={scrollContentRef}>
          {newsRankHtml()}
          {newsRankHtml()} {/* 复制一份内容以实现无缝滚动 */}
        </div>
      </div>

      {/**下注 */}
      <div className="event-container">
        <div className="event-info">
          <span className="event-title">事件: 美国大选</span>
          <span className="event-date">2024-12-01 浏览: 1200</span>
          <span className="event-reward">奖池: 82402 usdt</span>
        </div>

        {/**信息内容 */}
        <div className="event-detail">
          <div className="candidates">
            <div className="candidate">
              <Avatar className="avatar" src="biden_image_url" />
              <span className="percentage blue">45%</span>
            </div>
            <div className="vs">VS</div>
            <div className="candidate">
              <Avatar className="avatar" src="trump_image_url" />
              <span className="percentage red">55%</span>
            </div>
          </div>

          <div className="odds">
            <div className="odd-blue">
              <div className="odd-value-left">1.7</div>
              <div className="odd-people">170人</div>
            </div>
            <div className="official">VS</div>
            <div className="odd-red">
              <div className="odd-value-right">0.7</div>
              <div className="odd-people">800人</div>
            </div>
          </div>

          {/**点击投注 */}
          <div className="bet-container">
            <Button className="bet" color="primary">
              下注
            </Button>
          </div>
        </div>
      </div>

      <div className="chat" ref={chatRef}>
        <div className="chat-item">
          <Avatar className="avatar" src={Jiang} />
          <div className="message-content">
            <div>刘老六：我们是机器人这是假的聊天!</div>
            <span className="time">2024-09-08 10:05</span>
          </div>
        </div>
        <div className="chat-item">
          <Avatar className="avatar" src={Jiang} />
          <div className="message-content">
            <div>刘老六：看上去像真有人在用的东南亚灰色产业圈APP吗!</div>
            <span className="time">2024-09-08 10:05</span>
          </div>
        </div>
        <div className="chat-item">
          <Avatar className="avatar" src={Jiang} />
          <div className="message-content">
            <div>刘老六：这里有言论自由!</div>
            <span className="time">2024-09-08 10:05</span>
          </div>
        </div>
        <div className="chat-item">
          <Avatar className="avatar" src={Jiang} />
          <div className="message-content">
            <div>刘老六：这里可以对政治事件结果下赌注!</div>
            <span className="time">2024-09-08 10:05</span>
          </div>
        </div>
        <div className="chat-item">
          <Avatar className="avatar" src={Jiang} />
          <div className="message-content">
            <div>刘老六：这里可以对足球赛事下赌注!</div>
            <span className="time">2024-09-08 10:05</span>
          </div>
        </div>
        <div className="chat-item">
          <Avatar className="avatar" src={Jiang} />
          <div className="message-content">
            <div>刘老六：用户可以对某个新闻或者足球事件开盘让别人下注!</div>
            <span className="time">2024-09-08 10:05</span>
          </div>
        </div>
        <div className="chat-item">
          <Avatar className="avatar" src={Jiang} />
          <div className="message-content">
            <div>刘老六：还可以在聊妹模块 选择剧情和妹妹照片下单陪你1对1聊天哦!</div>
            <span className="time">2024-09-08 10:05</span>
          </div>
        </div>
        <div className="chat-item">
          <Avatar className="avatar" src={Jiang} />
          <div className="message-content">
            <div>刘老六：我们对行业公司的动态也有追踪可以避坑哦!</div>
            <span className="time">2024-09-08 10:05</span>
          </div>
        </div>
        <div className="chat-item">
          <Avatar className="avatar" src={Jiang} />
          <div className="message-content">
            <div>刘老六：国内社会 以及 东南亚灰产圈的新闻也会实时更新哦!</div>
            <span className="time">2024-09-08 10:05</span>
          </div>
        </div>
      </div>

      <div className="send-container">
        <Input className="input-field" placeholder="请输入" />
        <Button className="send-button" color="primary">
          发送
        </Button>
      </div>

    </div>
  );
};

export default Home;
