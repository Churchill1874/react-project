import React, { useState, useEffect } from 'react';
import '@/pages/home/Home.less';
import {
  Divider, Popup, Skeleton, Ellipsis, Steps, TextArea, Card, Image, Tag,
  Swiper
} from 'antd-mobile'
import {
  ExposureType,
  Request_HOME,
  NewsRankType,
  CompanyRankType,
  PoliticsType,
  SoutheastAsiaNewsRankType,
  BannerType,
  BetRecord,
  PromotionType,
} from '@/pages/home/api';
import dayjs from 'dayjs';
import { Link, useNavigate } from 'react-router-dom'; // 添加这个导入
import NewsInfo from '@/components/news/newsinfo/NewsInfo';
import HomeBetOrder from '@/components/homebetorder/HomeBetOrder';
import { FcReading } from "react-icons/fc";
import { LocationFill } from 'antd-mobile-icons';
import { getImgUrl } from '@/utils/commentUtils';
import useStore from '@/zustand/store';
import { Request_OnlineCount} from '@/pages/groupchat/api';

const Home: React.FC = () => {
  // 轮播图状态管理
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(true);
  const [bannerList, setBannerList] = useState<BannerType[]>([]);
  const [newsRank, setNewsRank] = useState<NewsRankType>();
  const [company, setCompany] = useState<CompanyRankType>();
  const [promotion, setPromotion] = useState<PromotionType>();
  //const [hotLottery, setHotLottery] = useState<HotLotteryType>();
  const [southeastAsiaNews, setSoutheastAsiaNews] = useState<SoutheastAsiaNewsRankType>();
  const [betRecords, setBetRecords] = useState<BetRecord[]>();
  const [politicsList, setPoliticsList] = useState<PoliticsType[]>()
  const [homeAdvertise, setHomeAdvertise] = useState<string>();

  const [newsId, setNewsId] = useState<string>();
  const [newsVisible, setNewsVisible] = useState(false)
  const [exposureList, setExposureList] = useState<ExposureType[]>([]);
  const [noticeBoard, setNoticeBoard] = useState<string[]>([])
  const navigate = useNavigate();
  const { onlineCount, setOnlineCount } = useStore();

  // 创建扩展的幻灯片数组（前后各复制一份实现无缝循环）
  const extendedSlides = [
    bannerList[bannerList.length - 1], // 最后一张的副本
    ...bannerList,
    bannerList[0] // 第一张的副本
  ];

  const onlintCountRequest = async () => {
    const onlineCount = (await Request_OnlineCount()).data;
    setOnlineCount(onlineCount);
  }
  
  // 获取首页新闻数据
  const homeReq = async () => {
    const data = (await Request_HOME()).data;
    setNewsRank(data.newsRank)
    setCompany(data.company)
    //setHotLottery(data.hotLottery)
    setSoutheastAsiaNews(data.southeastAsiaNewsRank)
    setBetRecords(data.betOrderList)
    setPoliticsList(data.politicsList)
    setHomeAdvertise(data.bannerList.find(item => item.imageType === 3)?.imagePath || null)
    setBannerList(data.bannerList.filter(item => item.imageType === 1))
    setPromotion(data.promotion);
    setExposureList(data.exposureList);
    setNoticeBoard(data.noticeList);

    console.log('首页数据：', data.noticeList);
  };

  useEffect(() => {
    homeReq();
    onlintCountRequest();
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



  return (
    <div className="container">
      {/* 头部 */}
      <div className="header" >
        <div className="header-content">
          {/* 第一行：logo + 在线人数 */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div className="logo">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div className="logo">
                  <img
                    src="/assets/logo/logo1.png"
                    alt="logo"
                    style={{ width: '36px', height: '36px', verticalAlign: 'middle', marginRight: '6px', backgroundColor: 'transparent' }}
                  />
                  <div style={{ display: 'inline-flex', flexDirection: 'column', verticalAlign: 'middle', lineHeight: 1.1, marginLeft: '0px' }}>
                    <span style={{ fontSize: '18px' }}> 灰亚新闻</span>
                    <span style={{ fontSize: '11px', fontWeight: 400, color: 'white' }}>www.grayasia.com</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="online-users">
              <span className="online-dot"></span>
              {onlineCount} 在线
            </div>
          </div>


        </div>
      </div>

      {/* 第二行：滚动公告 */}
      {noticeBoard && noticeBoard.length > 0 &&
        <div className="notice-marquee-bar">
          <span className="notice-label">公 告:</span>
          <div className="notice-marquee-track">
            <div className="notice-marquee-inner">
              {[...noticeBoard, ...noticeBoard].map((item, i) => (
                <span key={i} className="notice-marquee-item">{item}</span>
              ))}
            </div>
          </div>
        </div>
      }


      <div className="content">
        {
          !newsRank &&
          <>
            <Skeleton.Title animated />
            <Skeleton.Paragraph lineCount={24} animated />
          </>
        }

        {
          newsRank &&
          <>
            {/* 热门新闻 */}
            <div className="section" >
              {/* 菜单图标 */}
              <div className="menu-icons">
                {/*                 <Link to={'/bet'} className="menu-icon">
                  <div className="menu-icon-image">🗳️</div>
                  <div className="menu-icon-text">政治盘口</div>
                </Link> */}
                <Link to={'/news/company'} className="menu-icon">
                  <div className="menu-icon-image">
                    <img src="/assets/icons/company.png" alt="追查公司" style={{ width: '32px', height: '32px', objectFit: 'contain' }} />
                  </div>
                  <div className="menu-icon-text">追查公司</div>
                </Link>
                <Link to={'/news/southeastAsia'} className="menu-icon">
                  <div className="menu-icon-image">
                    <img src="/assets/icons/southeast-asia.png" alt="东南亚" style={{ width: '32px', height: '32px', objectFit: 'contain' }} />
                  </div>
                  <div className="menu-icon-text">东南亚</div>
                </Link>
                <Link to={'/news/politics'} className="menu-icon">
                  <div className="menu-icon-image">
                    <img src="/assets/icons/politics.png" alt="国际政治" style={{ width: '32px', height: '32px', objectFit: 'contain' }} />
                  </div>
                  <div className="menu-icon-text">国际政治</div>
                </Link>
                <Link to={'/news/society'} className="menu-icon">
                  <div className="menu-icon-image">
                    <img src="/assets/icons/society.png" alt="社会瓜" style={{ width: '32px', height: '32px', objectFit: 'contain' }} />
                  </div>
                  <div className="menu-icon-text">社会瓜</div>
                </Link>
                <div className="menu-icon" onClick={() => { window.location.href = '/pages/about-us.html' }}>
                  <div className="menu-icon-image">
                    <img src="/assets/icons/weare.png" alt="了解我们" style={{ width: '32px', height: '32px', objectFit: 'contain' }} />
                  </div>
                  <div className="menu-icon-text" >了解我们</div>
                </div>
              </div>

              {/* 曝光台 */}
              <div className="v2-section-title" style={{ fontWeight: 'bold', padding: '2px 5px' }}><span> 🔥 曝光台</span></div>
              <div className="home-news-grid">
                <div className="home-grid" onClick={() => navigate('/news/exposure')}>

                  {exposureList && exposureList.map((exposure, index) => (
                    <>
                      <div className="home-news-item" key={index}>
                        <div className="home-news-content">
                          <Ellipsis className="home-news-title" style={{ fontSize: '14px', fontWeight: '500' }} content={exposure.title} direction='end' rows={1} />
                        </div>
                        <div className="home-news-image">
                          <Image fit='cover'//fit='contain'  // 大屏120px，小屏100px
                            src={getImgUrl(exposure.image1)}
                            onClick={() => { }} />
                        </div>
                      </div>
                    </>
                  ))}
                </div>
              </div>

              {/*               <div className="news-item" onClick={() => toTodayNews(newsRank?.newsTopId)}>
                <div className="news-title">
                  <span style={{ marginLeft: '7px', marginRight: '7px', color: 'gray' }}>1</span>
                  <Ellipsis direction='end' content={newsRank?.newsTitleTop} />
                </div>
              </div>

              <div className="news-item" onClick={() => toTodayNews(newsRank?.news1Id)}>
                <div className="news-title">
                  <span style={{ marginLeft: '7px', marginRight: '7px', color: 'gray' }}>2</span>
                  <Ellipsis direction='end' content={newsRank?.newsTitle1} />
                </div>
              </div>

              <div className="news-item" onClick={() => toTodayNews(newsRank?.news2Id)}>
                <div className="news-title">
                  <span style={{ marginLeft: '7px', marginRight: '7px', color: 'gray' }}>3</span>
                  <Ellipsis direction='end' content={newsRank?.newsTitle2} />
                </div>
              </div>
 */}
              {/*               <div className="news-item" onClick={() => toTodayNews(newsRank?.news3Id)}>

                <div className="news-title">
                  <span style={{ marginLeft: '7px', marginRight: '7px', color: 'gray' }}>4</span>
                  <Ellipsis direction='end' content={newsRank?.newsTitle3} />
                </div>
              </div> */}

              {/* 政治博彩 */}



              {/* 公司信息 */}
              <div className="company-card" onClick={() => navigate('/news/company')}>
                <div className="v2-section-title" style={{ marginTop: '0px', padding: '2px 5px' }}>
                  <img src="/assets/icons/company.png" alt="追查公司" style={{ width: '22px', height: '22px', objectFit: 'contain' }} />

                  <span style={{ marginLeft: '3px', fontWeight: '600' }}>
                    追踪公司 ➡︎
                  </span>
                  <span className="home-company-name">
                    {company?.companyName}
                  </span>
                  <span className="company-location">
                    {company?.companyAddress}
                  </span>
                </div>

                {/*                 <div className="company-business">
                  <Ellipsis
                    rows={2}
                    style={{ fontSize: "15px", textIndent: "2em", marginTop: '5px', letterSpacing: '1px' }}
                    direction='end' content={company?.companyDescription} />
                </div> */}

                {company?.eventContent1 &&
                  <Steps direction='vertical' className="custom-vertical-steps">
                    <Steps.Step className='company-events'
                      title={company?.eventContent1}
                      status='finish'
                      description={'事件时间: ' + dayjs(company?.eventTime1).format("YYYY-MM-DD")} />
                    {company?.eventContent2 &&

                      <Steps.Step className='company-events'
                        title={company?.eventContent2}
                        status='finish'
                        description={'事件时间: ' + dayjs(company?.eventTime2).format("YYYY-MM-DD")} />
                    }
                  </Steps>

                }

                {company?.companyNameList &&
                  <div className="other-companies">
                    <div className="other-companies-title">我们还在追踪以下公司：
                      {company.companyNameList.map((c, index) => {
                        return (
                          <span key={index} className="company-tag">{c}</span>
                        );
                      })}
                    </div>
                  </div>
                }
              </div>



            </div>

            {/* 东南亚新闻 */}
            <div className="v2-section-title" style={{ margin: '0px 5px', padding: '2px 5px', fontWeight: '600' }}>
              <img src="/assets/icons/southeast-asia.png" alt="东南亚" style={{ width: '22px', height: '22px', objectFit: 'contain' }} />
              <span style={{ marginLeft: 3 }}>
                东南亚资讯
              </span>
            </div>

            <div className="sea-news-item" onClick={() => navigate('/news/southeastAsia')}>
              <div className="sea-news-flag"   >{southeastAsiaNews?.southeastAsiaCountry1}</div>
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

            {/*             <div className="sea-news-item">
              <div className="sea-news-flag">{southeastAsiaNews?.southeastAsiaCountry4}</div>
              <div className="sea-news-content">
                <div className="sea-news-title">{southeastAsiaNews?.southeastAsiaTitle4}</div>
                <div className="sea-news-meta">
                  <div className="sea-news-date">{dayjs(southeastAsiaNews?.southeastAsiaTime4).format("YYYY-MM-DD")}</div>
                  <div className="sea-news-stats">
                    <div className="stat views">{southeastAsiaNews?.southeastAsiaView4}</div>
                    <div className="stat comments">{southeastAsiaNews?.southeastAsiaCount4}</div>
                  </div>
                </div>
              </div>
            </div> */}

            {/*             <div className="sea-news-item">
              <div className="sea-news-flag">{southeastAsiaNews?.southeastAsiaCountry5}</div>
              <div className="sea-news-content">
                <div className="sea-news-title">{southeastAsiaNews?.southeastAsiaTitle5}</div>
                <div className="sea-news-meta">
                  <div className="sea-news-date">{dayjs(southeastAsiaNews?.southeastAsiaTime5).format("YYYY-MM-DD")}</div>
                  <div className="sea-news-stats">
                    <div className="stat views">{southeastAsiaNews?.southeastAsiaView5}</div>
                    <div className="stat comments">{southeastAsiaNews?.southeastAsiaCount5}</div>
                  </div>
                </div>
              </div>
            </div>
 */}
            {/* 
            {(betRecords && betRecords.length > 0) &&
              <div className='section' onClick={() => navigate('/bet')}>
                <div className="v2-section-title" style={{ padding: '2px 5px', fontWeight: '600' }}>🎯 最新下注记录</div>
                <HomeBetOrder betOrderList={betRecords} />
              </div>

            } */}

            {/*             {newsId &&
              <Popup className='news-record-popup' bodyStyle={{ display: 'flex', flexDirection: 'column', overflowY: 'auto', width: '100%', height: '100%' }}
                position='right'
                // closeOnSwipe={true}
                closeOnMaskClicknews-grid
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
            } */}
          </>
        }


        {/**国际政治 */}
        {politicsList &&
          <>

            <div className='section' onClick={() => navigate('/news/politics')} >
              <div className="v2-section-title" style={{ margin: '0', padding: '2px 5px', fontWeight: '600' }}>
                <img src="/assets/icons/politics.png" alt="国际政治" style={{ width: '22px', height: '22px', objectFit: 'contain' }} />
                <span style={{ marginLeft: 3 }}>国际政治</span>
              </div>
              {
                politicsList.map((politics, index) => (
                  <>
                    <Card className="politics-custom-card" style={{ borderRadius: '0', marginTop: '5px', marginBottom: '15px' }} key={index}>
                      <div className="home-politics-card-content">

                        {politics.title &&
                          <div className="politics-title" style={{ fontSize: '15px', fontWeight: '600', fontFamily: 'inherit', letterSpacing: '0.1px' }}>
                            <Ellipsis direction='end' rows={2} content={politics.title} />
                          </div>
                        }
                        {politics.imagePath &&
                          <div className="politics-image-container" style={{ marginTop: '5px' }}>
                            <Image
                              className="politics-image"
                              src={getImgUrl(politics.imagePath)}
                              alt="Example"
                              fit="contain"
                            />
                          </div>
                        }

                        <Ellipsis
                          className="politics-synopsis"
                          direction='end'
                          rows={politics.imagePath ? 3 : 8}
                          content={politics?.content}
                          style={{ fontSize: "15px", textIndent: "2em", marginTop: '5px', letterSpacing: '1px' }} />

                        <div className="politics-meta" style={{ marginTop: '10px' }}>
                          {/*                           {
                            (politics.newsStatus == 2 || politics.newsStatus == 3) &&
                            <div className="politics-tag" style={{ marginTop: '0' }}>
                              {politics.newsStatus == 2 && <Tag className="tag-size" color='#a05d29'>置顶</Tag>}
                              {politics.newsStatus == 3 && <Tag className="tag-size" color='red' fill='outline'>热门</Tag>}
                            </div>
                          } */}



                          {politics.source &&
                            <div className="politics-tag" style={{ display: 'flex', alignItems: 'center', marginTop: '0' }} > 来源:
                              <div >
                                <LocationFill className="area" />
                                {politics.country}
                              </div>
                              <div className="source-inner" style={{ color: '#0e5aa1ff' }}>
                                {politics.source}
                              </div>
                            </div>
                          }

                          <div style={{ display: 'flex', alignItems: 'center' }} >
                            <FcReading fontSize={17} />
                            <span className="number" > {politics.viewCount} </span>
                          </div>

                          <div className="politics-time">
                            {politics.createTime && dayjs(politics.createTime).format('YYYY-MM-DD')}
                          </div>



                        </div>
                      </div>


                    </Card>

                    <Divider style={{ padding: '0px', margin: '0px', borderColor: '#f1ecec' }} />
                  </>
                ))
              }

            </div>
          </>
        }

        {/*         {homeAdvertise &&
          <div className='section'>
            <div style={{ fontFamily: 'unset', color: 'gray', marginBottom: '3px' }}>广而告之</div>
            <Image style={{ padding: '0px' }} fit='contain' src={homeAdvertise} />
          </div>

        }
 */}

        <div className='section'>
          <div style={{ fontFamily: 'unset', color: 'gray', marginBottom: '5px', marginTop: '10px' }}>广而告之</div>
          <Image style={{ padding: '0px' }} fit='contain' src='/advertise/home.jpg' />
        </div>


      </div>



      <div style={{ textAlign: 'center', marginTop: '30px' }}>
        <span >--- 我是有底线的 ---</span>
      </div>
    </div >
  );
};

export default Home;