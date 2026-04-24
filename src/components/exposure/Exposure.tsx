import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import '@/components/exposure/Exposure.less';
import { PullToRefresh, Skeleton, Image } from 'antd-mobile';
import { Request_ExposurePage, ExposurePageReqType, ExposureType } from '@/components/exposure/api'
import { getImgUrl } from '@/utils/commentUtils';
import dayjs from 'dayjs'
import useStore from '@/zustand/store';

const ExposureList: React.FC = () => {
  const navigate = useNavigate();
  const { getNewsListCache, setNewsListCache, setNewsScrollPosition, getNewsScrollPosition, getLastReadItemId, setLastReadItemId } = useStore();

  const [exposureList, setExposureList] = useState<ExposureType[]>(() => {
    const cache = getNewsListCache('exposure');
    return cache ? cache.data : [];
  });
  const [exposureHasMore, setExposureHasMore] = useState<boolean>(() => {
    const cache = getNewsListCache('exposure');
    return cache ? cache.hasMore : false;
  });
  const [exposurePage, setExposurePage] = useState<number>(() => {
    const cache = getNewsListCache('exposure');
    return cache ? cache.page : 1;
  });
  const [initialLoading, setInitialLoading] = useState<boolean>(() => {
    const cache = getNewsListCache('exposure');
    return !cache || cache.data.length === 0;
  });

  const loadingRef = useRef(false);
  const pageRef = useRef<number>(exposurePage);
  const hasMoreRef = useRef<boolean>(exposureHasMore);

  useEffect(() => { pageRef.current = exposurePage; }, [exposurePage]);
  useEffect(() => { hasMoreRef.current = exposureHasMore; }, [exposureHasMore]);

  const exposurePageRequest = async (isReset: boolean) => {
    if (loadingRef.current) return;
    loadingRef.current = true;

    const pageNum = isReset ? 1 : pageRef.current;
    try {
      const param: ExposurePageReqType = { pageNum, pageSize: 20 };
      const list: ExposureType[] = (await Request_ExposurePage(param)).data.records || [];

      if (list.length > 0) {
        if (isReset) {
          pageRef.current = 2;
          setExposurePage(2);
          setExposureList(list);
          setExposureHasMore(true);
          setNewsListCache('exposure', list, 2, true);
        } else {
          const newPage = pageNum + 1;
          pageRef.current = newPage;
          setExposurePage(newPage);
          setExposureList(prev => {
            const combined = [...prev, ...list];
            setNewsListCache('exposure', combined, newPage, true);
            return combined;
          });
          setExposureHasMore(true);
        }
      } else {
        setExposureHasMore(false);
        const cache = getNewsListCache('exposure');
        if (cache) setNewsListCache('exposure', cache.data, cache.page, false);
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
        exposurePageRequest(false);
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
    if (exposureList.length === 0) exposurePageRequest(true);
  }, []);

  // 从上次阅读位置恢复
  useEffect(() => {
    const lastId = getLastReadItemId('exposure');
    const container = document.querySelector('.news-content') as HTMLElement | null;

    if (container) {
      const savedPosition = getNewsScrollPosition('exposure');
      const maxScroll = container.scrollHeight - container.clientHeight;
      if (savedPosition > 0 && maxScroll - savedPosition <= 400) {
        container.scrollTop = maxScroll;
        setLastReadItemId('exposure', null);
        return;
      }
    }

    if (!lastId) return;

    const scrollToItem = () => {
      const el = document.querySelector(`.exposure-item[data-id="${lastId}"]`) as HTMLElement | null;
      const container = document.querySelector('.news-content') as HTMLElement | null;
      if (el && container) {
        container.scrollTop = Math.max(0, el.offsetTop - 20);
        setLastReadItemId('exposure', null);
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
  }, [exposureList, getNewsListCache, getLastReadItemId, getNewsScrollPosition, setLastReadItemId]);

  const click = (id: string) => {
    const container = document.querySelector('.news-content') as HTMLElement | null;
    if (container) {
      const maxScroll = container.scrollHeight - container.clientHeight;
      const scrollTop = container.scrollTop;
      const isNearBottom = maxScroll - scrollTop <= 400;
      setNewsScrollPosition('exposure', isNearBottom ? maxScroll : scrollTop);
      setLastReadItemId('exposure', isNearBottom ? null : id);
    } else {
      setLastReadItemId('exposure', id);
    }
    navigate('/exposure/' + id, { replace: true });
  };

  const getImages = (exposure: ExposureType) => {
    return [1, 2, 3, 4, 5, 6]
      .map(i => exposure[`image${i}` as keyof ExposureType] as string)
      .filter(Boolean);
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
          <PullToRefresh onRefresh={() => exposurePageRequest(true)}>
            <div className="exposure-list">
              {exposureList?.map((exposure) => {
                const images = getImages(exposure);
                return (
                  <div
                    className="exposure-item"
                    key={exposure.id}
                    data-id={exposure.id}
                    onClick={() => click(exposure.id)}
                  >
                    <div className="item-content">
                      <div className={`exposure-title${exposure.isTop ? '-red' : ''}`}>
                        {exposure.isTop && <span className="top-badge">置 顶</span>}
                        {exposure.title}
                      </div>
                      {images.length > 0 && (
                        images.length === 1 ? (
                          <div className="single-image">
                            <Image fit="contain" src={getImgUrl(images[0])} className="single-photo" />
                          </div>
                        ) : (
                          <div className="suspects-grid">
                            {images.map((img, index) => (
                              <div className="suspect-card" key={index}>
                                <Image fit="cover" src={getImgUrl(img)} className="suspect-photo" />
                              </div>
                            ))}
                          </div>
                        )
                      )}
                    </div>
                    <div className="item-footer">
                      <div className="report-date">举报时间:  {dayjs(exposure.createTime).format('YYYY-MM-DD HH:mm')}</div>
                      <div className="view-count">浏览: {exposure.viewsCount}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </PullToRefresh>


        </>
      )}
    </>
  );
};

export default ExposureList;