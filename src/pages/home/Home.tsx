import React, { useState, useEffect } from 'react';
import '@/pages/home/Home.less';
import { Divider, Popup } from 'antd-mobile'
import { Request_HOME, NewsRankType, CompanyRankType, HotLotteryType, SoutheastAsiaNewsRankType, BannerType } from '@/pages/home/api';
import dayjs from 'dayjs';
import { Link, useNavigate } from 'react-router-dom'; // 添加这个导入
import NewsInfo from '@/components/news/newsinfo/NewsInfo';


const Home: React.FC = () => {
  // 轮播图状态管理
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(true);
  const [onlineCount, setOnlineCount] = useState<number>(0);
  const [bannerList, setBannerList] = useState<BannerType[]>([]);
  const [newsRank, setNewsRank] = useState<NewsRankType>();
  const [company, setCompany] = useState<CompanyRankType>();
  const [hotLottery, setHotLottery] = useState<HotLotteryType>();
  const [southeastAsiaNews, setSoutheastAsiaNews] = useState<SoutheastAsiaNewsRankType>();


  const [newsId, setNewsId] = useState<string>();
  const [newsVisible, setNewsVisible] = useState(false)

  const navigate = useNavigate();
  // 创建扩展的幻灯片数组（前后各复制一份实现无缝循环）
  const extendedSlides = [
    bannerList[bannerList.length - 1], // 最后一张的副本
    ...bannerList,
    bannerList[0] // 第一张的副本
  ];

  const toTodayNews = (newsId) => {
    setNewsId(newsId);
    setNewsVisible(true)
  }

  const toBanner = (imageType, newsType, newsId) => {
    //1 首页轮播图
    if (imageType === 1) {
      if (newsType === 1) {
        setNewsId(newsId)
        setNewsVisible(true)
        //navigate('/news')
      }
      /*       if (newsType === 2) {
              navigate('/news/southeastAsia')
            }
            if (newsType === 3) {
              navigate('/news/politics')
            }
            if (newsType === 4) {
              navigate('/news/society')
            }
            if (newsType === 5) {
              navigate('/news/promotion')
            }
            if (newsType === 6) {
              navigate('/news/topic')
            }
            if (newsType === 7) {
              navigate('/news/job')
            }
            if (newsType === 8) {
              navigate('/news/company')
            } */
    }
    //2 评论页面广告
    if (imageType === 2) {

    }

    //3 首页广告
    if (imageType === 3) {

    }

    //4 消息页面广告
    if (imageType === 4) {

    }

  }

  // 获取首页新闻数据
  const homeReq = async () => {
    const data = (await Request_HOME()).data;
    setOnlineCount(data.onlineCount)
    setBannerList(data.bannerList || [])
    setNewsRank(data.newsRank)
    setCompany(data.company)
    setHotLottery(data.hotLottery)
    setSoutheastAsiaNews(data.southeastAsiaNewsRank)
  };

  useEffect(() => {
    homeReq();
  }, [])

  // 自动轮播效果
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide(prev => prev + 1);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  // 处理无缝循环
  useEffect(() => {
    if (currentSlide === extendedSlides.length - 1) {
      // 如果到了最后一张（第一张的副本），无动画跳回真正的第一张
      setTimeout(() => {
        setIsTransitioning(false);
        setCurrentSlide(1);
      }, 500);
    } else if (currentSlide === 0) {
      // 如果到了第一张（最后一张的副本），无动画跳回真正的最后一张
      setTimeout(() => {
        setIsTransitioning(false);
        setCurrentSlide(extendedSlides.length - 2);
      }, 500);
    }

    // 重新启用动画
    if (!isTransitioning) {
      setTimeout(() => {
        setIsTransitioning(true);
      }, 50);
    }
  }, [currentSlide, isTransitioning, extendedSlides.length]);

  // 手动切换到指定幻灯片
  const goToSlide = (index: number) => {
    setIsTransitioning(true);
    setCurrentSlide(index + 1); // +1 因为扩展数组的偏移
  };

  // 获取当前真实的幻灯片索引（用于指示器）
  const getRealIndex = () => {
    if (currentSlide === 0) return bannerList.length - 1;
    if (currentSlide === extendedSlides.length - 1) return 0;
    return currentSlide - 1;
  };

  return (
    <div className="container">
      {/* 头部 */}
      <div className="header">
        <div className="header-content">
          <div className="logo">📰 新闻中心</div>
          <div className="online-users">
            <span className="online-dot"></span>
            {onlineCount} 在线
          </div>
        </div>
      </div>

      <div className="content">
        {/* 热门新闻 */}
        <div className="section">
          {/* 菜单图标 */}
          <div className="menu-icons">
            <Link to={'/bet'} className="menu-icon">
              <div className="menu-icon-image">🗳️</div>
              <div className="menu-icon-text">政治盘口</div>
            </Link>
            <Link to={'/'} className="menu-icon">
              <div className="menu-icon-image">🎮</div>
              <div className="menu-icon-text">多人游戏</div>
            </Link>
            <Link to={'/news/company'} className="menu-icon">
              <div className="menu-icon-image">🔍</div>
              <div className="menu-icon-text">追查公司</div>
            </Link>
            <Link to={'/'} className="menu-icon">
              <div className="menu-icon-image">ℹ️</div>
              <div className="menu-icon-text">了解我们</div>
            </Link>
            <Link to={'/news/politics'} className="menu-icon">
              <div className="menu-icon-image">📰</div>
              <div className="menu-icon-text">政治新闻</div>
            </Link>
          </div>
          <Divider style={{ padding: '0px', margin: '0px' }} />

          {/* 热门新闻 */}
          <div className="section-title">🔥 今日中国热点</div>

          {/* <div className="news-item pinned"> */}
          <div className="news-item" onClick={() => toTodayNews(newsRank?.newsTopId)}>
            <div className="news-number">📌</div>
            <div className="news-title">{newsRank?.newsTitleTop}</div>
          </div>

          <div className="news-item" onClick={() => toTodayNews(newsRank?.news1Id)}>
            <div className="news-number">1</div>
            <div className="news-title">{newsRank?.newsTitle1}</div>
          </div>

          <div className="news-item" onClick={() => toTodayNews(newsRank?.news2Id)}>
            <div className="news-number">2</div>
            <div className="news-title">{newsRank?.newsTitle2}</div>
          </div>

          <div className="news-item" onClick={() => toTodayNews(newsRank?.news3Id)}>
            <div className="news-number">3</div>
            <div className="news-title">{newsRank?.newsTitle3}</div>
          </div>


          {/* 轮播图 - 无缝滑动效果 */}
          <div className="section-title">📸 焦点图片</div>

          <div className="carousel-container">
            {extendedSlides.length > 0 && extendedSlides?.map((slide, index) => (

              <div
                key={`slide-${index}`}
                className="carousel-slide"
                style={{
                  position: 'absolute',
                  width: '100%',
                  height: '100%',
                  transform: `translateX(${(index - currentSlide) * 100}%)`,
                  transition: isTransitioning ? 'transform 0.5s ease-in-out' : 'none',
                  opacity: 1
                }}
              >
                {slide?.imagePath && (
                  <>
                    <img src={slide.imagePath} alt={`轮播图 ${index + 1}`} onClick={() => toBanner(slide.imageType, slide.newsType, slide.newsId)} />
                    {slide.title && (
                      <div className="carousel-caption">{slide.title}</div>
                    )}
                  </>
                )}
              </div>
            ))}

            <div className="carousel-indicators">
              {bannerList.map((_, index) => (
                <div
                  key={index}
                  className={`carousel-indicator ${index === getRealIndex() ? 'active' : ''}`}
                  onClick={() => goToSlide(index)}
                />
              ))}
            </div>
          </div>


        </div>

        {/* 政治博彩 */}
        <div className="section">

          <div className="betting-card" onClick={() => navigate('/bet')}>
            <div className="betting-header">
              <div className="betting-title">🗳️ {hotLottery?.lotteryTitle}</div>
            </div>

            <div className="betting-options">
              <div className="betting-option">
                <img
                  src={hotLottery?.betIcon1}
                  alt={hotLottery?.description1}
                  className="option-avatar"
                />
                <div className="option-info">
                  <div className="option-name">{hotLottery?.betName1}</div>
                  <div className="option-details">
                    <div className="option-odds"> {hotLottery?.odds1}x</div>
                    {/* <div className="option-bets">{hotLottery?.betAmount1} 总下注额</div> */}
                  </div>
                </div>
              </div>
              <div
                style={{
                  width: '20px',
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '18px',
                  //color: 'gray',

                }}>
                vs
              </div>
              <div className="betting-option">
                <img
                  src={hotLottery?.betIcon2}
                  alt={hotLottery?.description2}
                  className="option-avatar"
                />
                <div className="option-info">
                  <div className="option-name">{hotLottery?.betName2}</div>
                  <div className="option-details">
                    <div className="option-odds">{hotLottery?.odds2}x</div>
                    {/* <div className="option-bets">{hotLottery?.betAmount2} 总下注额</div> */}
                  </div>
                </div>
              </div>
            </div>

            <div className="betting-footer">
              <span className="betting-pool">总奖池:
                <span className="pool-amount">{hotLottery?.prizePool}
                  <span style={{ color: 'gray', fontSize: '12px', fontWeight: '500' }}> USDT</span>
                </span>
              </span>

              <span className="betting-time">开奖时间:{dayjs(hotLottery?.drawTime).format("YYYY-MM-DD")}</span>
            </div>
          </div>
        </div>

        <Divider style={{ padding: '0px', margin: '0px' }} />

        {/* 公司信息 */}
        <div className="company-card" onClick={() => navigate('/news/company')}>
          <div className="company-header">
            <div className="company-name">🏢追踪公司： {company?.companyName}</div>
            <div className="company-location">{company?.companyAddress}</div>
          </div>

          <div className="company-business">
            主营业务：{company?.companyDescription}
          </div>

          {company?.eventContent1 &&
            <div className="company-events">
              <div className="event good">
                <div className="event-date">{dayjs(company?.eventTime1).format("YYYY-MM-DD")}</div>
                <div className="event-text">{company?.eventContent1}</div>
              </div>

              {company?.eventContent2 &&
                <div className="event bad">
                  <div className="event-date">{dayjs(company?.eventTime2).format("YYYY-MM-DD")}</div>
                  <div className="event-text">{company?.eventContent2}</div>
                </div>
              }
            </div>
          }

          {company?.companyNameList &&
            <div className="other-companies">
              <div className="other-companies-title">我们还在追踪以下公司：</div>
              <div className="company-tags">
                {company.companyNameList.map((c, index) => {
                  return (
                    <div key={index} className="company-tag">{c}</div>
                  );
                })}
              </div>
            </div>
          }

        </div>

        {/* 东南亚新闻 */}
        <div className="section">
          <Divider style={{ padding: '0px', margin: '0px' }} />
          <div className="section-title">🌏 东南亚资讯</div>
          <div className="sea-news-item" onClick={() => navigate('/news/southeastAsia')}>
            <div className="sea-news-flag">{southeastAsiaNews?.southeastAsiaCountry1}</div>
            <div className="sea-news-content">
              <div className="sea-news-title">{southeastAsiaNews?.southeastAsiaTitle1}</div>
              <div className="sea-news-meta">
                <div className="sea-news-date">{dayjs(southeastAsiaNews?.southeastAsiaTime1).format("YYYY-MM-DD")}</div>
                <div className="sea-news-stats">
                  <div className="stat views">{southeastAsiaNews?.southeastAsiaView1}</div>
                  <div className="stat comments">{southeastAsiaNews?.southeastAsiaCount1}</div>
                </div>
              </div>
            </div>
          </div>

          <div className="sea-news-item">
            <div className="sea-news-flag">{southeastAsiaNews?.southeastAsiaCountry2}</div>
            <div className="sea-news-content">
              <div className="sea-news-title">{southeastAsiaNews?.southeastAsiaTitle2}</div>
              <div className="sea-news-meta">
                <div className="sea-news-date">{dayjs(southeastAsiaNews?.southeastAsiaTime2).format("YYYY-MM-DD")}</div>
                <div className="sea-news-stats">
                  <div className="stat views">{southeastAsiaNews?.southeastAsiaView2}</div>
                  <div className="stat comments">{southeastAsiaNews?.southeastAsiaCount2}</div>
                </div>
              </div>
            </div>
          </div>

          <div className="sea-news-item">
            <div className="sea-news-flag">{southeastAsiaNews?.southeastAsiaCountry3}</div>
            <div className="sea-news-content">
              <div className="sea-news-title">{southeastAsiaNews?.southeastAsiaTitle3}</div>
              <div className="sea-news-meta">
                <div className="sea-news-date">{dayjs(southeastAsiaNews?.southeastAsiaTime3).format("YYYY-MM-DD")}</div>
                <div className="sea-news-stats">
                  <div className="stat views">{southeastAsiaNews?.southeastAsiaView3}</div>
                  <div className="stat comments">{southeastAsiaNews?.southeastAsiaCount3}</div>
                </div>
              </div>
            </div>
          </div>
        </div>


        {newsId &&
          <Popup className='news-record-popup' bodyStyle={{ display: 'flex', flexDirection: 'column', overflowY: 'auto', width: '100%', height: '100%' }}
            position='right'
            // closeOnSwipe={true}
            closeOnMaskClick
            visible={newsVisible}
            onClose={() => { setNewsVisible(false) }}>


            <div className="popup-scrollable-content" >
              {
                newsVisible
                &&
                <NewsInfo
                  setVisibleCloseRight={setNewsVisible}
                  id={newsId}
                  needCommentPoint={false}
                  commentPointId={null}
                  commentRef={null}
                />
              }
            </div>

          </Popup>
        }

      </div>
    </div>
  );
};

export default Home;