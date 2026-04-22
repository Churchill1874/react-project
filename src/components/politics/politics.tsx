import { useState, useEffect, useRef } from "react";
import { useNavigate } from 'react-router-dom';
import { Card, Divider, Tag, Ellipsis, Image, Toast, PullToRefresh, Skeleton, Swiper } from 'antd-mobile';
import { FcReading, FcLike } from "react-icons/fc";
import { MessageOutline, HeartOutline } from 'antd-mobile-icons';
import '@/components/politics/politics.less'
import { PoliticsPage_Request, PoliticsPageReqType, PoliticsType } from '@/components/politics/api'
import dayjs from 'dayjs'
import { Request_IncreaseLikesCount } from '@/components/news/newsinfo/api';
import { getImgUrls } from "@/utils/commentUtils";
import useStore from '@/zustand/store';

const Politics: React.FC = () => {
  const navigate = useNavigate();
  const { getNewsListCache, setNewsListCache, setNewsScrollPosition, getNewsScrollPosition, getLastReadItemId, setLastReadItemId } = useStore();

  const [politicsList, setPoliticsList] = useState<PoliticsType[]>(() => {
    const cache = getNewsListCache('politics');
    return cache ? cache.data : [];
  });
  const [politicsHasMore, setPoliticsHasMore] = useState<boolean>(() => {
    const cache = getNewsListCache('politics');
    return cache ? cache.hasMore : false;
  });
  const [politicsPage, setPoliticsPage] = useState<number>(() => {
    const cache = getNewsListCache('politics');
    return cache ? cache.page : 1;
  });
  const [initialLoading, setInitialLoading] = useState<boolean>(() => {
    const cache = getNewsListCache('politics');
    return !cache || cache.data.length === 0;
  });
  const [likesIdList, setLikesIdList] = useState<number[]>([]);

  const loadingRef = useRef<boolean>(false);
  const politicsPageRef = useRef<number>(politicsPage);
  const politicsHasMoreRef = useRef<boolean>(politicsHasMore);

  useEffect(() => {
    politicsPageRef.current = politicsPage;
  }, [politicsPage]);

  useEffect(() => {
    politicsHasMoreRef.current = politicsHasMore;
  }, [politicsHasMore]);

  const clickLikes = async (id) => {
    if (likesIdList.includes(id)) {
      Toast.show({ content: '已点赞', duration: 600 });
      return;
    }
    setLikesIdList((prev) => [...prev, id]);
    const param = { id: id, infoType: 1 };
    const resp = await Request_IncreaseLikesCount(param);
    if (resp.code === 0) {
      if (resp.data.value) {
        Toast.show({ icon: <HeartOutline />, content: '点赞 +1', duration: 600 });
      } else {
        Toast.show({ content: '已点赞', duration: 600 });
      }
    } else {
      Toast.show({ content: '网络异常,请稍后重试', duration: 600 });
    }
  };

  const politicsPageRequest = async (isReset: boolean) => {
    if (loadingRef.current) return;
    loadingRef.current = true;

    const pageNum = isReset ? 1 : politicsPageRef.current;
    try {
      const param: PoliticsPageReqType = { pageNum, pageSize: 20 };
      const list: PoliticsType[] = (await PoliticsPage_Request(param)).data.records || [];

      if (list.length > 0) {
        if (isReset) {
          politicsPageRef.current = 2;
          setPoliticsPage(2);
          setPoliticsList(list);
          setPoliticsHasMore(true);
          setNewsListCache('politics', list, 2, true);
        } else {
          const newPage = pageNum + 1;
          politicsPageRef.current = newPage;
          setPoliticsPage(newPage);
          setPoliticsList(prev => {
            const combined = [...prev, ...list];
            setNewsListCache('politics', combined, newPage, true);
            return combined;
          });
          setPoliticsHasMore(true);
        }
      } else {
        setPoliticsHasMore(false);
        const cache = getNewsListCache('politics');
        if (cache) setNewsListCache('politics', cache.data, cache.page, false);
      }
    } finally {
      loadingRef.current = false;
      setInitialLoading(false);
    }
  };

  useEffect(() => {
    const container = document.querySelector('.news-content');
    if (!container) return;
    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container as HTMLElement;
      if (scrollHeight - scrollTop - clientHeight < 50 && politicsHasMoreRef.current && !loadingRef.current) {
        politicsPageRequest(false);
      }
    };
    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, []);

  const hasRequestedRef = useRef(false);
  useEffect(() => {
    if (hasRequestedRef.current) return;
    hasRequestedRef.current = true;
    if (politicsList.length === 0) {
      politicsPageRequest(true);
    }
  }, []);

  useEffect(() => {
    const lastId = getLastReadItemId('politics');
    const container = document.querySelector('.news-content') as HTMLElement | null;

    if (container) {
      const savedPosition = getNewsScrollPosition('politics');
      const maxScroll = container.scrollHeight - container.clientHeight;
      if (savedPosition > 0 && maxScroll - savedPosition <= 400) {
        container.scrollTop = maxScroll;
        setLastReadItemId('politics', null);
        return;
      }
    }

    if (!lastId) return;

    const scrollToItem = () => {
      const el = document.querySelector(`.politics-item[data-id="${lastId}"]`) as HTMLElement | null;
      const container = document.querySelector('.news-content') as HTMLElement | null;
      if (el && container) {
        container.scrollTop = Math.max(0, el.offsetTop - 20);
        setLastReadItemId('politics', null);
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
  }, [politicsList, getNewsListCache, getLastReadItemId, getNewsScrollPosition, setLastReadItemId]);

  const click = (id: string) => {
    const container = document.querySelector('.news-content') as HTMLElement | null;
    if (container) {
      const maxScroll = container.scrollHeight - container.clientHeight;
      const scrollTop = container.scrollTop;
      const isNearBottom = maxScroll - scrollTop <= 400;
      setNewsScrollPosition('politics', isNearBottom ? maxScroll : scrollTop);
      setLastReadItemId('politics', isNearBottom ? null : id);
    } else {
      setLastReadItemId('politics', id);
    }
    navigate('/politics/' + id, { replace: true });
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
          <PullToRefresh onRefresh={() => politicsPageRequest(true)}>
            <div className="card-container">
              {politicsList?.map((politics, index) => {
                const imgs = getImgUrls(politics.imagePath);
                return (
                  <div key={index}>
                    <Card
                      className="politics-custom-card politics-item"
                      data-id={politics.id}
                      style={{ marginTop: '0px' }}
                      onClick={() => click(String(politics.id))}
                    >
                      <div className="politics-card-content">
                        {politics.title && (
                          <div className="politics-title" style={{marginTop:'5px'}}>
                            <Ellipsis direction='end' rows={2} content={politics.title} />
                          </div>
                        )}
                        {imgs.length > 0 && (
                          <div className="politics-image-container" onClick={(e) => e.stopPropagation()}>
                            <Swiper>
                              {imgs.map((imgUrl, i) => (
                                <Swiper.Item key={i}>
                                  <Image src={imgUrl} fit="cover" width="100%" height="200px" />
                                </Swiper.Item>
                              ))}
                            </Swiper>
                          </div>
                        )}
                        <Ellipsis className="politics-synopsis" direction='end' rows={3} content={politics.content} style={{ fontSize: "15px", textIndent: "2em" }} />
                        <div style={{ marginTop: '5px', marginBottom: '10px', padding: '0px', textIndent: '0px' }}>
                          <span className="icon-and-text" style={{ color: 'gray', marginRight: '3px' }}>
                            来源: {politics.country}
                          </span>
                          <span className="source" style={{ marginRight: '10px' }}>{politics.source}</span>
                          <span className="politics-time">
                            {politics.createTime && dayjs(politics.createTime).format('YYYY-MM-DD HH:mm')}
                          </span>
                        </div>
                        <div className="politics-meta" style={{ marginBottom: '10px' }}>
                          {politics.newsStatus == 2 && <Tag className="tag-size" color='#a05d29'>置顶</Tag>}
                          {politics.newsStatus == 3 && <Tag className="tag-size" color='red' fill='outline'>热门</Tag>}
                          <span className="icon-and-text">
                            <FcReading fontSize={17} />
                            <span className="number"> {politics.viewCount} </span>
                          </span>
                          <span className="icon-and-text">
                            <FcLike className='attribute-icon' fontSize={15} onClick={(e) => { e.stopPropagation(); clickLikes(politics.id); }} />
                            <span className="number"> {politics?.likesCount || 0} </span>
                          </span>
                          <span className="icon-and-text">
                            <MessageOutline fontSize={17} />
                            <span className="number"> {politics.commentsCount} </span>
                          </span>
                        </div>
                      </div>
                    </Card>
                    <Divider className="politics-divider-line" />
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

export default Politics;