import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import '@/components/exposure/Exposure.less';
import { PullToRefresh, Skeleton, InfiniteScroll, DotLoading, Image } from 'antd-mobile';
import { Request_ExposurePage, ExposurePageReqType, ExposureType } from '@/components/exposure/api'
import { getImgUrl } from '@/utils/commentUtils';
import useStore from '@/zustand/store';

const ExposureList: React.FC = () => {
  const navigate = useNavigate();
  const { getNewsListCache, setNewsListCache, setNewsScrollPosition, getNewsScrollPosition, getLastReadItemId, setLastReadItemId } = useStore();

  const [exposureList, setExposureList] = useState<ExposureType[]>(() => {
    const cache = getNewsListCache('exposure');
    return cache ? cache.data : [];
  });
  const [exposureHasHore, setExposureHasHore] = useState<boolean>(() => {
    const cache = getNewsListCache('exposure');
    return cache ? cache.hasMore : true; // 无缓存时 true，InfiniteScroll 自动触发加载并显示骨架图
  });
  const [exposurePage, setExposurePage] = useState<number>(() => {
    const cache = getNewsListCache('exposure');
    return cache ? cache.page : 1;
  });

  // ✅ 与其他 state 平级，不能放在 useState 回调里
  const loadingRef = useRef(false);

  // 从上次阅读 id 恢复位置
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
        const target = Math.max(0, el.offsetTop - 20);
        container.scrollTop = target;
        setLastReadItemId('exposure', null);
        return true;
      }
      return false;
    };

    if (!scrollToItem()) {
      let retries = 0;
      const interval = window.setInterval(() => {
        if (scrollToItem() || retries > 5) {
          window.clearInterval(interval);
        }
        retries += 1;
      }, 50);
      return () => window.clearInterval(interval);
    }
  }, [exposureList, getNewsListCache, getLastReadItemId, getNewsScrollPosition, setLastReadItemId]);

  const exposurePageRequest = async (isReset: boolean) => {
    if (loadingRef.current) return;
    loadingRef.current = true;

    const pageNum = isReset ? 1 : exposurePage;
    const param: ExposurePageReqType = { pageNum: pageNum, pageSize: 20 };
    const list: ExposureType[] = (await Request_ExposurePage(param)).data.records || [];

    if (list.length > 0) {
      if (isReset) {
        setExposurePage(2);
        setExposureList(list);
        setExposureHasHore(true);
        setNewsListCache('exposure', list, 2, true);
      } else {
        const newPage = pageNum + 1;
        const newList = [...exposureList, ...list];
        setExposurePage(newPage);
        setExposureList(newList);
        setExposureHasHore(true);
        setNewsListCache('exposure', newList, newPage, true);
      }
    } else {
      setExposureHasHore(false);
      const cache = getNewsListCache('exposure');
      if (cache) {
        setNewsListCache('exposure', cache.data, cache.page, false);
      }
    }

    loadingRef.current = false;
  };

  const getImages = (exposure: ExposureType) => {
    return [1, 2, 3, 4, 5, 6]
      .map(i => exposure[`image${i}` as keyof ExposureType] as string)
      .filter(Boolean);
  };

  const ExposureScrollContent = ({ hasMore }: { hasMore?: boolean }) => {
    return (
      <>
        {hasMore ? (
          <div className="dot-loading-custom" style={{ width: '100%', padding: '0 5px', boxSizing: 'border-box' }}>
            
            
            <Skeleton.Title animated />
            <Skeleton.Paragraph lineCount={8} animated />
          </div>
        ) : (
          <div className="infinite-scroll-footer">
            <span>--- 我是有底线的 ---</span>
          </div>
        )}
      </>
    );
  };

  const click = (id: string) => {
    const container = document.querySelector('.news-content') as HTMLElement | null;
    if (container) {
      const maxScroll = container.scrollHeight - container.clientHeight;
      const scrollTop = container.scrollTop;
      const isNearBottom = maxScroll - scrollTop <= 400;
      const value = isNearBottom ? maxScroll : scrollTop;
      setNewsScrollPosition('exposure', value);
      if (isNearBottom) {
        setLastReadItemId('exposure', null);
      } else {
        setLastReadItemId('exposure', id);
      }
    } else {
      setLastReadItemId('exposure', id);
    }
    navigate('/exposure/' + id, { replace: true });
  };

  return (
    <>
      <div className="exposure-list">
        <PullToRefresh onRefresh={() => exposurePageRequest(true)}>
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
                  <div className="report-date">举报时间: {exposure.createTime}</div>
                  <div className="view-count">浏览: {exposure.viewsCount}</div>
                </div>
              </div>
            );
          })}

          <InfiniteScroll
            loadMore={() => exposurePageRequest(false)}
            hasMore={exposureHasHore}
            threshold={50}
          >
            <ExposureScrollContent hasMore={exposureHasHore} />
          </InfiniteScroll>
        </PullToRefresh>
      </div>
    </>
  );
};

export default ExposureList;