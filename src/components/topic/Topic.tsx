import { useState, useEffect, useRef } from "react";
import { useNavigate } from 'react-router-dom';
import { Card, Divider, Tag, Ellipsis, Image, PullToRefresh, Skeleton } from 'antd-mobile';
import { FcReading } from "react-icons/fc";
import { MessageOutline } from 'antd-mobile-icons';
import '@/components/topic/Topic.less'
import { TopicPageReqType, TopicType, TopicPage_Request } from '@/components/topic/api'
import dayjs from 'dayjs'
import { getImgUrl } from "@/utils/commentUtils";
import useStore from '@/zustand/store';

const Topic: React.FC = () => {
  const navigate = useNavigate();
  const { getNewsListCache, setNewsListCache, setNewsScrollPosition, getNewsScrollPosition } = useStore();

  const [topicList, setTopicList] = useState<TopicType[]>(() => {
    const cache = getNewsListCache('topic');
    return cache ? cache.data : [];
  });
  const [topicHasMore, setTopicHasMore] = useState<boolean>(() => {
    const cache = getNewsListCache('topic');
    return cache ? cache.hasMore : false;
  });
  const [topicPage, setTopicPage] = useState<number>(() => {
    const cache = getNewsListCache('topic');
    return cache ? cache.page : 1;
  });
  const [initialLoading, setInitialLoading] = useState<boolean>(() => {
    const cache = getNewsListCache('topic');
    return !cache || cache.data.length === 0;
  });

  const loadingRef = useRef(false);
  const topicPageRef = useRef<number>(topicPage);
  const topicHasMoreRef = useRef<boolean>(topicHasMore);

  useEffect(() => {
    topicPageRef.current = topicPage;
  }, [topicPage]);

  useEffect(() => {
    topicHasMoreRef.current = topicHasMore;
  }, [topicHasMore]);

  const topicPageRequest = async (isReset: boolean) => {
    if (loadingRef.current) return;
    loadingRef.current = true;

    const pageNum = isReset ? 1 : topicPageRef.current;
    try {
      const param: TopicPageReqType = { pageNum, pageSize: 20 };
      const list: TopicType[] = (await TopicPage_Request(param)).data.records || [];

      if (list.length > 0) {
        if (isReset) {
          topicPageRef.current = 2;
          setTopicPage(2);
          setTopicList(list);
          setTopicHasMore(true);
          setNewsListCache('topic', list, 2, true);
        } else {
          const newPage = pageNum + 1;
          topicPageRef.current = newPage;
          setTopicPage(newPage);
          setTopicList(prev => {
            const combined = [...prev, ...list];
            setNewsListCache('topic', combined, newPage, true);
            return combined;
          });
          setTopicHasMore(true);
        }
      } else {
        setTopicHasMore(false);
        const cache = getNewsListCache('topic');
        if (cache) setNewsListCache('topic', cache.data, cache.page, false);
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
      if (scrollHeight - scrollTop - clientHeight < 50 && topicHasMoreRef.current && !loadingRef.current) {
        topicPageRequest(false);
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
    if (topicList.length === 0) {
      topicPageRequest(true);
    } else {
      restoreScrollPosition();
    }
  }, []);

  const restoreScrollPosition = () => {
    const savedPosition = getNewsScrollPosition('topic');
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

  const handleClick = (id: number) => {
    const container = document.querySelector('.news-content') as HTMLElement | null;
    if (container) {
      const maxScroll = container.scrollHeight - container.clientHeight;
      const scrollTop = container.scrollTop;
      setNewsScrollPosition('topic', maxScroll - scrollTop <= 400 ? maxScroll : scrollTop);
    }
    navigate('/topic/' + id);
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
          <PullToRefresh onRefresh={() => topicPageRequest(true)}>
            <div className="card-container">
              {topicList?.map((topic, index) => (
                <Card
                  className="topic-custom-card"
                  key={index}
                  onClick={() => handleClick(topic.id)}
                >
                  <div className="topic-card-content">
                    {topic.title && (
                      <div className="topic-title">
                        <Ellipsis direction='end' rows={2} content={topic.title} />
                      </div>
                    )}
                    {topic.videoCover && (
                      <div className="topic-news-image-container">
                        <video className="topic-news-video" src={topic.videoPath} controls poster={getImgUrl(topic.videoCover)} />
                      </div>
                    )}
                    {!topic.videoCover && topic.imagePath && (
                      <div className="topic-news-image-container">
                        <Image
                          className="topic-news-image"
                          src={getImgUrl(topic.imagePath)}
                          alt="图片"
                          fit="contain"
                        />
                      </div>
                    )}
                    <span className="topic-time">
                      {topic.isTop && <Tag className="topic-tag" color='#a05d29'>置顶</Tag>}
                      {topic.isHot && <Tag className="topic-tag" color='red' fill='outline'>热门</Tag>}
                      <span className="topic-tag">类型: <span className="source">{topic.type}</span></span>
                      {topic.createTime && dayjs(topic.createTime).format('YYYY-MM-DD HH:mm')}
                    </span>
                    <div className="topic-button-info">
                      <span className="icon-and-text">
                        <FcReading fontSize={17} />
                        <span className="number">{topic.viewCount}</span>
                      </span>
                      <span className="icon-and-text">
                        <MessageOutline fontSize={17} />
                        <span className="message-number">{topic.commentsCount}</span>
                      </span>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </PullToRefresh>

          {!topicHasMore && (
            <div className="infinite-scroll-footer">
              <span>---</span>
            </div>
          )}
        </>
      )}
    </>
  );
};

export default Topic;