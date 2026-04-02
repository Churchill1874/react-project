import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { Card, Divider, PullToRefresh, Skeleton, InfiniteScroll, DotLoading, Image, Steps, Ellipsis, Swiper } from 'antd-mobile';
import { LocationFill } from 'antd-mobile-icons';
import '@/components/company/Company.less'
import { Request_CompanyPage, CompanyPageType, CompanyPageReqType } from '@/components/company/api'
import dayjs from 'dayjs'
import useStore from '@/zustand/store';


const Company: React.FC = () => {
  const navigate = useNavigate();
  const { getNewsListCache, setNewsListCache, setNewsScrollPosition, getNewsScrollPosition, getLastReadItemId, setLastReadItemId } = useStore();
  const [companyList, setCompanyList] = useState<CompanyPageType[]>(() => {
    // 从 zustand 缓存恢复数据
    const cache = getNewsListCache('company');
    return cache ? cache.data : [];
  });
  const [companyHasHore, setCompanyHasHore] = useState<boolean>(() => {
    // 从 zustand 缓存恢复加载状态
    const cache = getNewsListCache('company');
    return cache ? cache.hasMore : false;
  });
  const [companyPage, setCompanyPage] = useState<number>(() => {
    // 从 zustand 缓存恢复页码
    const cache = getNewsListCache('company');
    return cache ? cache.page : 1;
  });


  // 首次加载骨架图控制：无缓存时显示骨架图
  const [initialLoading, setInitialLoading] = useState<boolean>(() => {
    const cache = getNewsListCache('company');
    return !cache || cache.data.length === 0;
  });
  // 组件挂载时，如果没有缓存数据就加载第一页
  useEffect(() => {
    if (companyList.length === 0) {
      companyPageRequest(true);
    }
  }, []);

  // 组件数据加载或列表变化后，从上次阅读 id 恢复位置
  useEffect(() => {
    const lastId = getLastReadItemId('company');
    const container = document.querySelector('.news-content') as HTMLElement | null;

    if (container) {
      // 如果滚动位置已缓存并且在接近底部，直接恢复到底部，避免跳到条目上方不准的情况。
      const savedPosition = getNewsScrollPosition('company');
      const maxScroll = container.scrollHeight - container.clientHeight;
      if (savedPosition > 0 && maxScroll - savedPosition <= 400) {
        container.scrollTop = maxScroll;
        setLastReadItemId('company', null);
        return;
      }
    }

    if (!lastId) return;

    const scrollToItem = () => {
      const el = document.querySelector(`.company-item[data-id="${lastId}"]`) as HTMLElement | null;
      const container = document.querySelector('.news-content') as HTMLElement | null;
      if (el && container) {
        const target = Math.max(0, el.offsetTop - 20);
        container.scrollTop = target;
        setLastReadItemId('company', null);
        return true;
      }
      return false;
    };

    if (!scrollToItem()) {
      // 如果第一次未渲染到，就再尝试几次
      let retries = 0;
      const interval = window.setInterval(() => {
        if (scrollToItem() || retries > 5) {
          window.clearInterval(interval);
        }
        retries += 1;
      }, 50);

      return () => window.clearInterval(interval);
    }
  }, [companyList, getNewsListCache, getLastReadItemId, getNewsScrollPosition, setLastReadItemId]);

  const CompanyScrollContent = ({ hasMore }: { hasMore?: boolean }) => {
    return (
      <>
        {hasMore ? (
          <>
            <div className="dot-loading-custom" >
              <span >加载中</span>
              <DotLoading color='black' />
              <Skeleton.Title animated />
              <Skeleton.Paragraph lineCount={8} animated />
            </div>
          </>
        ) : (
          <div className="infinite-scroll-footer">
            <span >--- 我是有底线的 ---</span>
          </div>
        )}
      </>
    )
  }

  const click = (id: string) => {
    // 点击前立即记录当前位置，避免 return 时回得偏差
    const container = document.querySelector('.news-content') as HTMLElement | null;
    if (container) {
      const maxScroll = container.scrollHeight - container.clientHeight;
      const scrollTop = container.scrollTop;
      const isNearBottom = maxScroll - scrollTop <= 400; // 较宽的临界值，避免末尾条目回位不准
      const value = isNearBottom ? maxScroll : scrollTop;
      setNewsScrollPosition('company', value);

      if (isNearBottom) {
        // 末尾深位时直接恢复到底部，不再定位具体 element
        setLastReadItemId('company', null);
      } else {
        setLastReadItemId('company', id);
      }
    } else {
      setLastReadItemId('company', id);
    }

    navigate('/company/' + id, { replace: true });
  }

  //获取api东南亚新闻数据
  const companyPageRequest = async (isReset: boolean) => {
    const pageNum = isReset ? 1 : companyPage;
    const param: CompanyPageReqType = { pageNum: pageNum, pageSize: 20 };
    const list: CompanyPageType[] = (await Request_CompanyPage(param)).data.records || [];

    //循环便利
    if (list.length > 0) {
      if (isReset) {
        setCompanyPage(() => 2);
        setInitialLoading(false);
        setCompanyList(list);
        setCompanyHasHore(true);
        
        // 缓存数据到 zustand
        setNewsListCache('company', list, 2, true);
      } else {
        if (JSON.stringify(list) !== JSON.stringify(companyList.slice(-list.length))) {
          const newPage = pageNum + 1;
          const newList = [...companyList, ...list];
          setCompanyPage(newPage);
          setCompanyList(newList);
          setCompanyHasHore(true);
          
          // 缓存数据到 zustand
          setNewsListCache('company', newList, newPage, true);
        } else {
          setCompanyHasHore(false);
          // 更新缓存的hasMore状态
          const cache = getNewsListCache('company');
          if (cache) {
            setNewsListCache('company', cache.data, cache.page, false);
          }
        }
      }
    } else {
      setCompanyHasHore(false);
      // 更新缓存的hasMore状态
      const cache = getNewsListCache('company');
      if (cache) {
        setNewsListCache('company', cache.data, cache.page, false);
      }
    }

  }

  return (
    <>
      <InfiniteScroll
        loadMore={() => companyPageRequest(false)}
        hasMore={companyHasHore}
        threshold={50}
      >

        <div className="card-container" style={{ padding: '0px 10px' }}>
          <PullToRefresh onRefresh={() => companyPageRequest(true)}>
            {companyList?.map((company, index) => (
              <Card className="company-custom-card" key={index} data-id={company.id}>
                <div className="card-content">
                  <div className="company-line1">
                    <span className="company-name">
                      {company.name}
                      <span className="company-badge"><LocationFill className="area" /> {company.city}</span>
                    </span>

                  </div>
                  {company.image &&
                    <>
                      <Divider className='company-divider-line' />
                      <Swiper loop autoplay allowTouchMove>
                        {company.image.split('||').map((imagePath, index) => (
                          <Swiper.Item className="swiper-item" key={index} >
                            <Image className='company-image-container' fit='contain' src={imagePath} />
                          </Swiper.Item>
                        ))}
                      </Swiper>
                    </>

                  }

                  <div className="text-area">
                    <Ellipsis direction='end' rows={3} content={company.description} />
                  </div>
                  <Divider className='company-divider-line' />
                  {/*                 <div className="line-group">
                  <div className="line">{company.overtimeCompensation}</div>
                  <Divider className='blue-divider-line' direction="vertical" />
                  <div className="line">{company.holiday}</div>
                  <Divider className='blue-divider-line' direction="vertical" />
                  <div className="line">{company.teamScale}</div>
                  <Divider className='blue-divider-line' direction="vertical" />
                  <div className="line">{company.bonus}</div>
                </div>

                <Divider className='divider-line' />
                <div className="line-group">
                  <div className="line">{company.salaryRange}</div>
                  <Divider className='blue-divider-line' direction="vertical" />
                  <div className="line">{company.leadershipCharacter}</div>
                  <Divider className='blue-divider-line' direction="vertical" />
                  <div className="line">{company.live}</div>
                  <Divider className='blue-divider-line' direction="vertical" />
                  <div className="line">{company.officeEnvironment}</div>
                </div>
                <Divider className='divider-line' /> */}

                  {company?.companyEventList && company.companyEventList.length > 0 &&
                    <Steps direction='vertical' className="custom-vertical-steps">
                      <Steps.Step className='company-events'
                        title={company?.companyEventList[0].description}
                        status='finish'
                        description={'事件时间: ' + company?.companyEventList[0].eventDate} />
                      {company?.companyEventList.length > 1 &&

                        <Steps.Step className='company-events'
                          title={company?.companyEventList[1].description}
                          status='finish'
                          description={'事件时间: ' + company?.companyEventList[1].eventDate} />
                      }
                    </Steps>
                  }

                  <span className='company-record-bottom'>
                    <span className='update-last-time'>信息更新时间:  {dayjs(company.updateTime).format('YYYY-MM-DD HH:mm')}</span>
                    <span className="company-info" onClick={() => click(company.id)}> <span className="company-click">点击详情</span> </span>
                  </span>

                </div>
              </Card>
            ))}
          </PullToRefresh>


          <CompanyScrollContent hasMore={companyHasHore} />

        </div>
      </InfiniteScroll>
    </>
  );
      {/* 首次加载骨架图 */}
      {initialLoading && (
        <>
          <Skeleton.Title animated />
          <Skeleton.Paragraph lineCount={8} animated />
        </>
      )}

}

export default Company;