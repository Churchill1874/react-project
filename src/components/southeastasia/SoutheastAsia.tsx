import { useState, useEffect, useRef } from "react";
import { useNavigate } from 'react-router-dom';
import { Card, Divider, Tag, Ellipsis, Image, PullToRefresh, Skeleton } from 'antd-mobile';
import { getImgUrl } from "@/utils/commentUtils";
import { FcReading } from "react-icons/fc";
import { MessageOutline, LocationFill } from 'antd-mobile-icons';
import '@/components/southeastasia/SoutheastAsia.less'
import { SoutheastAsiaNewsPageReqType, SoutheastAsiaNewsType, SoutheastAsiaNewsPage_Request } from '@/components/southeastasia/api'
import dayjs from 'dayjs'
import useStore from '@/zustand/store';

const SoutheastAsia: React.FC = () => {
  const navigate = useNavigate();
  const { getNewsListCache, setNewsListCache, setNewsScrollPosition, getNewsScrollPosition } = useStore();

  const [southeastAsiaNewsList, setSoutheastAsiaNewsList] = useState<SoutheastAsiaNewsType[]>(() => {
    const cache = getNewsListCache('southeastAsia');
    return cache ? cache.data : [];
  });
  const [southeastAsiaNewsHasMore, setSoutheastAsiaNewsHasMore] = useState<boolean>(() => {
    const cache = getNewsListCache('southeastAsia');
    return cache ? cache.hasMore : false;
  });
  const [southeastAsiaNewsPage, setSoutheastAsiaNewsPage] = useState<number>(() => {
    const cache = getNewsListCache('southeastAsia');
    return cache ? cache.page : 1;
  });
  const [initialLoading, setInitialLoading] = useState<boolean>(() => {
    const cache = getNewsListCache('southeastAsia');
    return !cache || cache.data.length === 0;
  });

  const loadingRef = useRef(false);
  const pageRef = useRef<number>(southeastAsiaNewsPage);
  const hasMoreRef = useRef<boolean>(southeastAsiaNewsHasMore);

  useEffect(() => {
    pageRef.current = southeastAsiaNewsPage;
  }, [southeastAsiaNewsPage]);

  useEffect(() => {
    hasMoreRef.current = southeastAsiaNewsHasMore;
  }, [southeastAsiaNewsHasMore]);

  const southeastAsiaNewsPageRequest = async (isReset: boolean) => {
    if (loadingRef.current) return;
    loadingRef.current = true;

    const pageNum = isReset ? 1 : pageRef.current;
    try {
      const param: SoutheastAsiaNewsPageReqType = { pageNum, pageSize: 20 };
      const list: SoutheastAsiaNewsType[] = (await SoutheastAsiaNewsPage_Request(param)).data.records || [];

      if (list.length > 0) {
        if (isReset) {
          pageRef.current = 2;
          setSoutheastAsiaNewsPage(2);
          setSoutheastAsiaNewsList(list);
          setSoutheastAsiaNewsHasMore(true);
          setNewsListCache('southeastAsia', list, 2, true);
        } else {
          const newPage = pageNum + 1;
          pageRef.current = newPage;
          setSoutheastAsiaNewsPage(newPage);
          setSoutheastAsiaNewsList(prev => {
            const combined = [...prev, ...list];
            setNewsListCache('southeastAsia', combined, newPage, true);
            return combined;
          });
          setSoutheastAsiaNewsHasMore(true);
        }
      } else {
        setSoutheastAsiaNewsHasMore(false);
        const cache = getNewsListCache('southeastAsia');
        if (cache) setNewsListCache('southeastAsia', cache.data, cache.page, false);
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
        southeastAsiaNewsPageRequest(false);
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
    if (southeastAsiaNewsList.length === 0) {
      southeastAsiaNewsPageRequest(true);
    } else {
      restoreScrollPosition();
    }
  }, []);

  const restoreScrollPosition = () => {
    const savedPosition = getNewsScrollPosition('southeastAsia');
    if (savedPosition <= 0) return;
    let retries = 0;
    const tryRestore = () => {
      const container = document.querySelector('.news-content') as HTMLElement | null;
      if (!container) return;
      const maxScroll = container.scrollHeight - container.clientHeight;
      if (maxScroll >= savedPosition - 100 || retries > 10) {
        container.scrollTop = savedPosition;
        return;
      }
      retries++;
      requestAnimationFrame(tryRestore);
    };
    requestAnimationFrame(tryRestore);
  };

  const click = (id: string) => {
    const container = document.querySelector('.news-content') as HTMLElement | null;
    if (container) {
      const maxScroll = container.scrollHeight - container.clientHeight;
      const scrollTop = container.scrollTop;
      setNewsScrollPosition('southeastAsia', maxScroll - scrollTop <= 400 ? maxScroll : scrollTop);
    }
    navigate('/southeastAsia/' + id, { replace: true });
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
          <PullToRefresh onRefresh={() => southeastAsiaNewsPageRequest(true)}>
            <div className="card-container">
              {southeastAsiaNewsList?.map((southeastAsiaNews, index) => (
                <Card className="southeastasia-custom-card" key={index} data-id={southeastAsiaNews.id}>
                  <div className="southeastasia-card-content">
                    {southeastAsiaNews.title && (
                      <div className="southeast-asia-title">
                        <Ellipsis direction='end' rows={2} content={southeastAsiaNews.title} />
                      </div>
                    )}
                    {southeastAsiaNews.imagePath && (
                      <div className="southeastasia-news-image-container">
                        <Image
                          className="southeastasia-news-image"
                          src={getImgUrl(southeastAsiaNews.imagePath?.split('||').filter(Boolean)[0] || '')}
                          alt="Example"
                          fit="contain"
                        />
                      </div>
                    )}
                    {southeastAsiaNews.imagePath && <Divider className='divider-line' />}
                    <Ellipsis
                      direction='end'
                      rows={2}
                      content={southeastAsiaNews.content}
                      style={{ fontSize: "15px", letterSpacing: "1px", textIndent: "2em" }}
                    />
                    <span className="southeastasia-time">
                      {southeastAsiaNews.isTop && <Tag className="southeastasia-tag" color='#a05d29'>置顶</Tag>}
                      {southeastAsiaNews.isHot && <Tag className="southeastasia-tag" color='red' fill='outline'>热门</Tag>}
                      {southeastAsiaNews.source && (
                        <span className="southeastasia-tag">来源: <span className="source"> {southeastAsiaNews.source} </span></span>
                      )}
                      {southeastAsiaNews.createTime && dayjs(southeastAsiaNews.createTime).format('YYYY-MM-DD HH:mm')}
                    </span>
                    <div className="button-info">
                      <span className="tracking"><LocationFill className="area" />{southeastAsiaNews.area}</span>
                      <span className="icon-and-text">
                        <FcReading fontSize={17} />
                        <span className="number"> {southeastAsiaNews.viewCount} </span>
                      </span>
                      <span className="tracking">
                        <span className="icon-and-text">
                          <MessageOutline fontSize={17} />
                          <span className="message-number"> {southeastAsiaNews.commentsCount} </span>
                          <span className="click" onClick={() => click(String(southeastAsiaNews.id))}>点击查看</span>
                        </span>
                      </span>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </PullToRefresh>

          {!southeastAsiaNewsHasMore && (
            <div className="infinite-scroll-footer">
              <span>---</span>
            </div>
          )}
        </>
      )}
    </>
  );
};

export default SoutheastAsia;