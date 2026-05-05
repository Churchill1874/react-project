import { useState, useEffect, useRef } from "react";
import { Link } from 'react-router-dom';
import { Card , Tag, Ellipsis, Image, PullToRefresh, Skeleton } from 'antd-mobile';
import { FcReading } from "react-icons/fc";
import { MessageOutline, LocationFill } from 'antd-mobile-icons';
import '@/components/society/Society.less'
import { SocietyPageReqType, SocietyType, SocietyPage_Request } from '@/components/society/api'
import dayjs from 'dayjs'
import { getImgUrl } from "@/utils/commentUtils";
import useStore from '@/zustand/store';

const Society: React.FC = () => {
  const { getNewsListCache, setNewsListCache, setNewsScrollPosition, getNewsScrollPosition, getLastReadItemId, setLastReadItemId } = useStore();

  const [societyList, setSocietyList] = useState<SocietyType[]>(() => {
    const cache = getNewsListCache('society');
    return cache ? cache.data : [];
  });
  const [societyHasMore, setSocietyHasMore] = useState<boolean>(() => {
    const cache = getNewsListCache('society');
    return cache ? cache.hasMore : false;
  });
  const [societyPage, setSocietyPage] = useState<number>(() => {
    const cache = getNewsListCache('society');
    return cache ? cache.page : 1;
  });
  const [initialLoading, setInitialLoading] = useState<boolean>(() => {
    const cache = getNewsListCache('society'); // ← 修复：原来错误读取了 'company'
    return !cache || cache.data.length === 0;
  });

  const loadingRef = useRef<boolean>(false);
  const pageRef = useRef<number>(societyPage);
  const hasMoreRef = useRef<boolean>(societyHasMore);

  useEffect(() => {
    pageRef.current = societyPage;
  }, [societyPage]);

  useEffect(() => {
    hasMoreRef.current = societyHasMore;
  }, [societyHasMore]);

  const societyPageRequest = async (isReset: boolean) => {
    if (loadingRef.current) return;
    loadingRef.current = true;

    const pageNum = isReset ? 1 : pageRef.current;
    try {
      const param: SocietyPageReqType = { pageNum, pageSize: 20 };
      const list: SocietyType[] = (await SocietyPage_Request(param)).data.records || [];

      if (list.length > 0) {
        if (isReset) {
          pageRef.current = 2;
          setSocietyPage(2);
          setSocietyList(list);
          setSocietyHasMore(true);
          setNewsListCache('society', list, 2, true);
        } else {
          const newPage = pageNum + 1;
          pageRef.current = newPage;
          setSocietyPage(newPage);
          setSocietyList(prev => {
            const combined = [...prev, ...list];
            setNewsListCache('society', combined, newPage, true);
            return combined;
          });
          setSocietyHasMore(true);
        }
      } else {
        setSocietyHasMore(false);
        const cache = getNewsListCache('society');
        if (cache) setNewsListCache('society', cache.data, cache.page, false);
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
        societyPageRequest(false);
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
    if (societyList.length === 0) {
      societyPageRequest(true);
    }
  }, []);

  // 从上次阅读位置恢复
  useEffect(() => {
    const lastId = getLastReadItemId('society');
    const container = document.querySelector('.news-content') as HTMLElement | null;

    if (container) {
      const savedPosition = getNewsScrollPosition('society');
      const maxScroll = container.scrollHeight - container.clientHeight;
      if (savedPosition > 0 && maxScroll - savedPosition <= 400) {
        container.scrollTop = maxScroll;
        setLastReadItemId('society', null);
        return;
      }
    }

    if (!lastId) return;

    const scrollToItem = () => {
      const el = document.querySelector(`.society-item[data-id="${lastId}"]`) as HTMLElement | null;
      const container = document.querySelector('.news-content') as HTMLElement | null;
      if (el && container) {
        container.scrollTop = Math.max(0, el.offsetTop - 20);
        setLastReadItemId('society', null);
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
  }, [societyList, getNewsListCache, getLastReadItemId, getNewsScrollPosition, setLastReadItemId]);


  const saveScrollAndItem = (id: string) => {
    const container = document.querySelector('.news-content') as HTMLElement | null;
    if (container) {
      const maxScroll = container.scrollHeight - container.clientHeight;
      const scrollTop = container.scrollTop;
      const isNearBottom = maxScroll - scrollTop <= 400;
      setNewsScrollPosition('society', isNearBottom ? maxScroll : scrollTop);
      setLastReadItemId('society', isNearBottom ? null : id);
    } else {
      setLastReadItemId('society', id);
    }
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
          <PullToRefresh onRefresh={() => societyPageRequest(true)}>
            <div className="card-container">
              {societyList?.map((society, index) => (
                <Link
                  key={society.id || index}
                  to={`/society/${society.id}`}
                  style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}
                  onClick={() => saveScrollAndItem(String(society.id))}
                >
                  <Card className="society-custom-card society-item" data-id={society.id}>
                    <div className="society-card-content">
                      {society.title && (
                        <div className="society-title">
                          <Ellipsis direction='end' rows={2} content={society.title} />
                        </div>
                      )}
                      {(society.videoCover || society.videoPath) && (
                        <div className="society-news-image-container">
                          <video
                            className="society-news-video"
                            src={getImgUrl(society.videoPath)}
                            controls
                            poster={society.videoCover ? getImgUrl(society.videoCover) : undefined}
                            preload="none"
                          />
                        </div>
                      )}
                      {!society.videoPath && !society.videoCover && society.imagePath && (
                        <div className="society-news-image-container">
                          <Image
                            className="society-news-image"
                            src={getImgUrl(society.imagePath)}
                            alt="Example"
                            fit="contain"
                          />
                        </div>
                      )}
                      <span className="society-time">
                        {society.isTop && <Tag className="society-tag" color='#a05d29'>置顶</Tag>}
                        {society.isHot && <Tag className="society-tag" color='red' fill='outline'>热门</Tag>}
                        <span className="society-tag">类型: <span className="source">{society?.videoCover ? '视频' : '图片'}</span></span>
                        {society.createTime && dayjs(society.createTime).format('YYYY-MM-DD HH:mm')}
                      </span>
                      <div className="society-button-info">
                        <span className="tracking"><LocationFill className="area" />{society.area}</span>
                        <span className="icon-and-text">
                          <FcReading fontSize={17} />
                          <span className="number"> {society.viewCount} </span>
                        </span>
                        <span className="tracking">
                          <span className="icon-and-text">
                            <MessageOutline fontSize={17} />
                            <span className="message-number"> {society.commentsCount} </span>
                            <span className="click">点击查看</span>
                          </span>
                        </span>
                      </div>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          </PullToRefresh>
        </>
      )}
    </>
  );
};

export default Society;