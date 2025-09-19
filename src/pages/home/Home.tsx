import React, { useState, useEffect } from 'react';
import '@/pages/home/Home.less';
import {
  Divider, Popup, Skeleton, Ellipsis, Steps, TextArea, Card, Image, Tag,
  Swiper
} from 'antd-mobile'
import { Request_HOME, NewsRankType, CompanyRankType, PoliticsType, SoutheastAsiaNewsRankType, BannerType, BetRecord, PromotionType } from '@/pages/home/api';
import dayjs from 'dayjs';
import { Link, useNavigate } from 'react-router-dom'; // 添加这个导入
import NewsInfo from '@/components/news/newsinfo/NewsInfo';
import HomeBetOrder from '@/components/homebetorder/HomeBetOrder';
import { FcReading } from "react-icons/fc";
import { LocationFill } from 'antd-mobile-icons';

const Home: React.FC = () => {
  // 轮播图状态管理
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(true);
  const [onlineCount, setOnlineCount] = useState<number>(0);
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

  const navigate = useNavigate();
  // 创建扩展的幻灯片数组（前后各复制一份实现无缝循环）
  const extendedSlides = [
    bannerList[bannerList.length - 1], // 最后一张的副本
    ...bannerList,
    bannerList[0] // 第一张的副本
  ];


  // 获取首页新闻数据
  const homeReq = async () => {
    const data = (await Request_HOME()).data;
    setOnlineCount(data.onlineCount)
    setNewsRank(data.newsRank)
    setCompany(data.company)
    //setHotLottery(data.hotLottery)
    setSoutheastAsiaNews(data.southeastAsiaNewsRank)
    setBetRecords(data.betOrderList)
    setPoliticsList(data.politicsList)
    setHomeAdvertise(data.bannerList.find(item => item.imageType === 3)?.imagePath || null)
    setBannerList(data.bannerList.filter(item => item.imageType === 1))
    setPromotion(data.promotion);
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



  return (
    <div className="container">
      {/* 头部 */}
      <div className="header" >
        <div className="header-content">
          <div className="logo">📰 新闻中心</div>
          <div className="online-users">
            <span className="online-dot"></span>
            {onlineCount} 在线
          </div>
        </div>
      </div>

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
            <div className="section" style={{ marginTop: '0px' }}>
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

              {/* 曝光台 */}
              <div className="v2-section-title" style={{ marginTop: '10px', marginBottom: '2px', fontWeight: 'bold' }}>🔥 曝光台</div>
              <div className="home-news-grid">
                <div className="home-grid">
                  <div className="home-news-item">
                    <div className="home-news-content">
                      <div className="home-news-title">科技前沿：AI技术新突破引发行业关注</div>
                    </div>
                    <div className="home-news-image">
                      <Image fit='fill'  // 大屏120px，小屏100px
                        src='https://img0.baidu.com/it/u=432699738,3690338511&fm=253&fmt=auto&app=138&f=JPEG?w=826&h=467'
                        onClick={() => { }} />
                    </div>

                  </div>
                  <div className="home-news-item">
                    <div className="home-news-content">
                      <div className="home-news-title">国际要闻：全球气候峰会达成重要共识</div>
                    </div>
                    <div className="home-news-image">
                      <Image fit='fill' // 大屏120px，小屏100px
                        src='https://img2.baidu.com/it/u=1262186181,542144633&fm=253&fmt=auto&app=120&f=JPEG?w=1080&h=546'
                        onClick={() => { }} />

                    </div>

                  </div>
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

                  <span style={{ marginRight: '10px', letterSpacing: '1px', fontWeight: '600' }}>🕵️ 追踪公司 ➡︎</span>

                  <span className="home-company-name">
                    {company?.companyName}
                  </span>
                  <span className="company-location">
                    {company?.companyAddress}
                  </span>
                </div>

                <div className="company-business">

                  <Ellipsis
                    rows={2}
                    style={{ fontSize: "15px", textIndent: "2em", marginTop: '5px', letterSpacing: '1px' }}
                    direction='end' content={company?.companyDescription} />
                </div>

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
            <div className="v2-section-title" style={{ margin: '5px', padding: '2px 5px', fontWeight: '600' }}>🌏 东南亚资讯</div>
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

            <div className="sea-news-item">
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
            </div>

            <div className="sea-news-item">
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



            {(betRecords && betRecords.length > 0) &&
              <div className='section' onClick={() => navigate('/bet')}>
                <div className="v2-section-title" style={{ padding: '2px 5px', fontWeight: '600' }}>🎯 最新下注记录</div>
                <HomeBetOrder betOrderList={betRecords} />
              </div>

            }

            {newsId &&
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
            }
          </>
        }


        {/**国际政治 */}
        {politicsList &&
          <>

            <div className='section' onClick={() => navigate('/news/politics')} >
              <div className="v2-section-title" style={{ margin: '0', padding: '2px 5px', fontWeight: '600' }}>🗳️ 国际政治</div>
              {
                politicsList.map((politics, index) => (
                  <>
                    <Card className="politics-custom-card" style={{ borderRadius: '0', marginTop: '5px', marginBottom: '15px' }} key={index}>
                      <div className="home-politics-card-content">

                        {politics.title &&
                          <div className="politics-title" style={{ fontSize: '16px', fontWeight: '600', fontFamily: 'inherit', letterSpacing: '1px' }}>
                            <Ellipsis direction='end' rows={2} content={politics.title} />
                          </div>
                        }
                        {politics.imagePath &&
                          <div className="politics-image-container" style={{ marginTop: '5px' }}>
                            <Image
                              className="politics-image"
                              src={politics.imagePath}
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
                            <div className="politics-tag" style={{ display: 'flex', alignItems: 'center', marginTop: '0' }} > 新闻来源:
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

                    <Divider style={{ padding: '0px', margin: '0px' }} />
                  </>
                ))
              }

            </div>
          </>
        }

        {homeAdvertise &&
          <div className='section'>
            <div style={{ fontFamily: 'unset', color: 'gray', marginBottom: '3px' }}>广而告之</div>
            <Image style={{ padding: '0px' }} fit='contain' src={homeAdvertise} />
          </div>

        }



      </div>



      <div style={{ textAlign: 'center', marginTop: '30px' }}>
        <span >--- 我是有底线的 ---</span>
      </div>
    </div >
  );
};

export default Home;