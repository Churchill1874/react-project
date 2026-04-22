import { useState, useEffect, useRef } from "react";
import { useNavigate } from 'react-router-dom';
import { Card, Divider, PullToRefresh, Skeleton, Image, Steps, Ellipsis, Swiper } from 'antd-mobile';
import { LocationFill } from 'antd-mobile-icons';
import '@/components/company/Company.less'
import { Request_CompanyPage, CompanyPageType, CompanyPageReqType } from '@/components/company/api'
import dayjs from 'dayjs'
import useStore from '@/zustand/store';

const Company: React.FC = () => {
  const navigate = useNavigate();
  const { getNewsListCache, setNewsListCache, setNewsScrollPosition, getNewsScrollPosition, getLastReadItemId, setLastReadItemId } = useStore();

  const [companyList, setCompanyList] = useState<CompanyPageType[]>(() => {
    const cache = getNewsListCache('company');
    return cache ? cache.data : [];
  });
  const [companyHasMore, setCompanyHasMore] = useState<boolean>(() => {
    const cache = getNewsListCache('company');
    return cache ? cache.hasMore : false;
  });
  const [companyPage, setCompanyPage] = useState<number>(() => {
    const cache = getNewsListCache('company');
    return cache ? cache.page : 1;
  });
  const [initialLoading, setInitialLoading] = useState<boolean>(() => {
    const cache = getNewsListCache('company');
    return !cache || cache.data.length === 0;
  });

  const loadingRef = useRef<boolean>(false);
  const pageRef = useRef<number>(companyPage);
  const hasMoreRef = useRef<boolean>(companyHasMore);

  useEffect(() => { pageRef.current = companyPage; }, [companyPage]);
  useEffect(() => { hasMoreRef.current = companyHasMore; }, [companyHasMore]);

  const companyPageRequest = async (isReset: boolean) => {
    if (loadingRef.current) return;
    loadingRef.current = true;

    const pageNum = isReset ? 1 : pageRef.current;
    try {
      const param: CompanyPageReqType = { pageNum, pageSize: 20 };
      const list: CompanyPageType[] = (await Request_CompanyPage(param)).data.records || [];

      if (list.length > 0) {
        if (isReset) {
          pageRef.current = 2;
          setCompanyPage(2);
          setCompanyList(list);
          setCompanyHasMore(true);
          setNewsListCache('company', list, 2, true);
        } else {
          const newPage = pageNum + 1;
          pageRef.current = newPage;
          setCompanyPage(newPage);
          setCompanyList(prev => {
            const combined = [...prev, ...list];
            setNewsListCache('company', combined, newPage, true);
            return combined;
          });
          setCompanyHasMore(true);
        }
      } else {
        setCompanyHasMore(false);
        const cache = getNewsListCache('company');
        if (cache) setNewsListCache('company', cache.data, cache.page, false);
      }
    } finally {
      loadingRef.current = false;
      setInitialLoading(false);
    }
  };

  // 手动监听滚动容器
  useEffect(() => {
    const container = document.querySelector('.news-content');
    if (!container) return;
    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container as HTMLElement;
      if (scrollHeight - scrollTop - clientHeight < 50 && hasMoreRef.current && !loadingRef.current) {
        companyPageRequest(false);
      }
    };
    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, []);

  // 初始加载
  const hasRequestedRef = useRef(false);
  useEffect(() => {
    if (hasRequestedRef.current) return;
    hasRequestedRef.current = true;
    if (companyList.length === 0) companyPageRequest(true);
  }, []);

  // 从上次阅读位置恢复
  useEffect(() => {
    const lastId = getLastReadItemId('company');
    const container = document.querySelector('.news-content') as HTMLElement | null;

    if (container) {
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
        container.scrollTop = Math.max(0, el.offsetTop - 20);
        setLastReadItemId('company', null);
        return true;
      }
      return false;
    };

    if (!scrollToItem()) {
      let retries = 0;
      const interval = window.setInterval(() => {
        if (scrollToItem() || retries > 5) window.clearInterval(interval);
        retries += 1;
      }, 50);
      return () => window.clearInterval(interval);
    }
  }, [companyList, getNewsListCache, getLastReadItemId, getNewsScrollPosition, setLastReadItemId]);

  const click = (id: string) => {
    const container = document.querySelector('.news-content') as HTMLElement | null;
    if (container) {
      const maxScroll = container.scrollHeight - container.clientHeight;
      const scrollTop = container.scrollTop;
      const isNearBottom = maxScroll - scrollTop <= 400;
      setNewsScrollPosition('company', isNearBottom ? maxScroll : scrollTop);
      setLastReadItemId('company', isNearBottom ? null : id);
    } else {
      setLastReadItemId('company', id);
    }
    navigate('/company/' + id, { replace: true });
  };

  return (
    <>
      {initialLoading ? (
        <div className="dot-loading-custom">
          <Skeleton.Title animated />
          <Skeleton.Paragraph lineCount={8} animated />
        </div>
      ) : (
        <>
          <PullToRefresh onRefresh={() => companyPageRequest(true)}>
            <div className="card-container" style={{ padding: '0px 10px' }}>
              {companyList?.map((company, index) => (
                <Card className="company-custom-card" key={index} data-id={company.id}>
                  <div className="card-content">
                    <div className="company-line1">
                      <span className="company-name">
                        {company.name}
                        <span className="company-badge"><LocationFill className="area" /> {company.city}</span>
                      </span>
                    </div>
                    {company.image && (
                      <>
                        <Divider className='company-divider-line' />
                        <Swiper loop autoplay allowTouchMove>
                          {company.image.split('||').map((imagePath, index) => (
                            <Swiper.Item className="swiper-item" key={index}>
                              <Image className='company-image-container' fit='contain' src={imagePath} />
                            </Swiper.Item>
                          ))}
                        </Swiper>
                      </>
                    )}
                    <div className="text-area">
                      <Ellipsis direction='end' rows={3} content={company.description} />
                    </div>
                    <Divider className='company-divider-line' />
                    {company?.companyEventList && company.companyEventList.length > 0 && (
                      <Steps direction='vertical' className="custom-vertical-steps">
                        <Steps.Step
                          className='company-events'
                          title={company?.companyEventList[0].description}
                          status='finish'
                          description={'事件时间: ' + company?.companyEventList[0].eventDate}
                        />
                        {company?.companyEventList.length > 1 && (
                          <Steps.Step
                            className='company-events'
                            title={company?.companyEventList[1].description}
                            status='finish'
                            description={'事件时间: ' + company?.companyEventList[1].eventDate}
                          />
                        )}
                      </Steps>
                    )}
                    <span className='company-record-bottom'>
                      <span className='update-last-time'>信息更新时间: {dayjs(company.updateTime).format('YYYY-MM-DD HH:mm')}</span>
                      <span className="company-info" onClick={() => click(company.id)}>
                        <span className="company-click">点击详情</span>
                      </span>
                    </span>
                  </div>
                </Card>
              ))}
            </div>
          </PullToRefresh>
          {!companyHasMore && (
            <div className="infinite-scroll-footer">
              <span>---</span>
            </div>
          )}
        </>
      )}
    </>
  );
};

export default Company;