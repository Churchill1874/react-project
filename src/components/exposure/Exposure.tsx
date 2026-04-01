import { useState, useEffect } from 'react';
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
    // 从 zustand 缓存恢复数据
    const cache = getNewsListCache('exposure');
    return cache ? cache.data : [];
  });
  const [exposureHasHore, setExposureHasHore] = useState<boolean>(() => {
    // 从 zustand 缓存恢复加载状态
    const cache = getNewsListCache('exposure');
    return cache ? cache.hasMore : true;
  });
  const [exposurePage, setExposurePage] = useState<number>(() => {
    // 从 zustand 缓存恢复页码
    const cache = getNewsListCache('exposure');
    return cache ? cache.page : 1;
  });
  const [loadingMore, setLoadingMore] = useState(false);

  // 组件挂载时，如果没有缓存数据就加载第一页
  useEffect(() => {
    if (exposureList.length === 0) {
      exposurePageRequest(true);
    }
  }, []);

  // 组件数据加载或列表变化后，从上次阅读 id 恢复位置
  useEffect(() => {
    const lastId = getLastReadItemId('exposure');
    const container = document.querySelector('.news-content') as HTMLElement | null;

    if (container) {
      // 如果滚动位置已缓存并且在接近底部，直接恢复到底部，避免跳到条目上方不准的情况。
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
  }, [exposureList, getNewsListCache, getLastReadItemId, getNewsScrollPosition, setLastReadItemId]);

  //获取api东南亚新闻数据
  const exposurePageRequest = async (isReset: boolean) => {
    if (loadingMore) return;
    setLoadingMore(true);

    const pageNum = isReset ? 1 : exposurePage;
    const param: ExposurePageReqType = { pageNum: pageNum, pageSize: 20 };
    const list: ExposureType[] = (await Request_ExposurePage(param)).data.records || [];

    //循环便利
    if (list.length > 0) {
      if (isReset) {
        setExposurePage(() => 2);
        setExposureList(list);
        setExposureHasHore(true);
        
        // 缓存数据到 zustand
        setNewsListCache('exposure', list, 2, true);
      } else {
        //if (JSON.stringify(list) !== JSON.stringify(exposureList)) {
        if (list.length > 0) {
          const newPage = pageNum + 1;
          const newList = [...exposureList, ...list];
          setExposurePage(newPage);
          setExposureList(newList);
          setExposureHasHore(true);
          
          // 缓存数据到 zustand
          setNewsListCache('exposure', newList, newPage, true);
        } else {
          setExposureHasHore(false);
          // 更新缓存的hasMore状态
          const cache = getNewsListCache('exposure');
          if (cache) {
            setNewsListCache('exposure', cache.data, cache.page, false);
          }
        }
      }
    } else {
      setExposureHasHore(false);
      // 更新缓存的hasMore状态
      const cache = getNewsListCache('exposure');
      if (cache) {
        setNewsListCache('exposure', cache.data, cache.page, false);
      }
    }

    setLoadingMore(false);
  }

  const getImages = (exposure: ExposureType) => {
    return [1, 2, 3, 4, 5, 6]
      .map(i => exposure[`image${i}` as keyof ExposureType] as string)
      .filter(Boolean);
  };

  const ExposureScrollContent = ({ hasMore }: { hasMore?: boolean }) => {
    return (
      <>
        {hasMore ? (
          <>
            <div className="dot-loading-custom" >
              <span >加载中</span>
              <DotLoading color='gray' />
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
      setNewsScrollPosition('exposure', value);

      if (isNearBottom) {
        // 末尾深位时直接恢复到底部，不再定位具体 element
        setLastReadItemId('exposure', null);
      } else {
        setLastReadItemId('exposure', id);
      }
    } else {
      setLastReadItemId('exposure', id);
    }

    navigate('/exposure/' + id, { replace: true });
  }

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

                  {/* 图片 */}
                  {images.length > 0 && (
                    images.length === 1 ? (
                      // ✅ 单图：完全不用 grid
                      <div className="single-image">
                        <Image
                          fit="contain"
                          src={getImgUrl(images[0])}
                          className="single-photo"
                        />
                      </div>
                    ) : (
                      // ✅ 多图：正常 grid
                      <div className="suspects-grid">
                        {images.map((img, index) => (
                          <div className="suspect-card" key={index}>
                            <Image
                              fit="cover"
                              src={getImgUrl(img)}
                              className="suspect-photo"
                            />
                          </div>
                        ))}
                      </div>
                    )
                  )}

                </div>

                <div className="item-footer">
                  <div className="report-date">
                    举报时间: {exposure.createTime}
                  </div>
                  <div className="view-count">
                    浏览: {exposure.viewsCount}
                  </div>
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

      {exposureHasHore &&
        <>
          <Skeleton.Title animated />
          <Skeleton.Paragraph lineCount={8} animated />
        </>

      }

    </>
  );
};

export default ExposureList;