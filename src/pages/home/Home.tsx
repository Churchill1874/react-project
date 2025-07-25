import { useEffect, useRef } from 'react';
import { Toast, Swiper, List, Badge, Button, Avatar, Ellipsis, Image } from 'antd-mobile';
import { GlobalOutline } from 'antd-mobile-icons';
import { Request_HOME_NEWS } from '@/pages/home/api';
import '@/pages/home/Home.less'; // 引入Home.less
import { newsEnum } from '@/common/news'
import ChatRoom from '@/components/chatroom/ChatRoom';
import useStore from '@/zustand/store'
import { FcUp } from 'react-icons/fc';

const Home = () => {


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
            <div className="news-title">
              {index === 0 && <><span className='hot'>头条</span> {news.title}</>}
              {index === 1 && <><span style={{ color: '#FF0000' }}>1</span>  {news.title}</>}
              {index === 2 && <><span style={{ color: '#f5691fff' }}>2</span>  {news.title}</>}
              {index === 3 && <><span style={{ color: '#c17c04ff' }}>3</span>  {news.title}</>}
              {index !== 0 && index !== 1 && index !== 2 && index !== 3 && <><span >{index}</span>  {news.title}</>}
            </div>
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
              <Ellipsis className='end' direction='end' content={topTitle} expandText='展开' collapseText='收起' />
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
  }, [newsInfoList]);



  const images = [
    'https://static01.nyt.com/images/2019/08/27/opinion/27friedmanWeb/merlin_158742387_962f87f4-df06-455f-8e4f-4f71aa097842-master1050.jpg',
    'https://chinese.aljazeera.net/wp-content/uploads/2023/10/1-1697622972.png?resize=770%2C513&quality=80',
    'https://s.rfi.fr/media/display/ecc1406a-1386-11ed-b21c-005056bfa79e/w:980/p:16x9/phpRGkbgu.jpg',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTkHs85bsc_tw9Imd15TTlXdmhpZKlaDG7QwQ&s',
  ]

  return (
    <div className="home">
      <header className="header">
        <div className="logo">BIG NEWS</div>

        <div><GlobalOutline className='global-line' fontSize={14} /> <span className="online"> 在线 {onlinePlayerCount} 人 </span></div>
      </header>

      {topNewsTitleHtml}

      <Swiper className="news-swiper" loop autoplay allowTouchMove>
        {images.map((img, index) => (
          <Swiper.Item key={index}>
            <div className="news-swiper-item">
              <Image src={img} width="100%" height="100%" fit="cover" />
            </div>
          </Swiper.Item>
        ))}
      </Swiper>


      <div
        style={{
          fontSize: '15px',
          marginTop: '10px',
          marginBottom: '1px',
          fontWeight: '600',
          letterSpacing: '2px',
          marginLeft: '5px',
          display: 'flex',
          alignItems: 'center',

          color: '#024889'
        }}><FcUp fontSize={16} />今日热门 </div>

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
              <Avatar className="bet-avatar" src="biden_image_url" />
              <span className="percentage blue">45%</span>
            </div>
            <div className="vs">VS</div>
            <div className="candidate">
              <Avatar className="bet-avatar" src="trump_image_url" />
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
      <ChatRoom roomNumber={1} />

    </div>
  );
};

export default Home;
