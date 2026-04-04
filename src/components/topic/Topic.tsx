import { useState, useEffect, useRef } from "react";
import { useNavigate } from 'react-router-dom';
import { Card, Divider, Tag, Ellipsis, Image, PullToRefresh, InfiniteScroll, DotLoading, Skeleton } from 'antd-mobile';
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
    return cache ? false : false;
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

  useEffect(() => {
    const cache = getNewsListCache('topic');
    if (!cache || cache.data.length === 0) {
      topicPageRequest(true);
    } else {
      setTopicHasMore(cache.hasMore);
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

  const topicPageRequest = async (isReset: boolean) => {
    if (loadingRef.current) return;
    loadingRef.current = true;

    const pageNum = isReset ? 1 : topicPage;
    const param: TopicPageReqType = { pageNum, pageSize: 20 };
    const list: TopicType[] = (await TopicPage_Request(param)).data.records || [];

    if (list.length > 0) {
      if (isReset) {
        setTopicPage(2);
        setTopicList(list);
        setTopicHasMore(true);
        setNewsListCache('topic', list, 2, true);
      } else {
        const newPage = pageNum + 1;
        const newList = [...topicList, ...list];
        setTopicPage(newPage);
        setTopicList(newList);
        setTopicHasMore(true);
        setNewsListCache('topic', newList, newPage, true);
      }
    } else {
      setTopicHasMore(false);
      const cache = getNewsListCache('topic');
      if (cache) setNewsListCache('topic', cache.data, cache.page, false);
    }

    setInitialLoading(false);
    loadingRef.current = false;
  };

  const handleRefresh = async () => {
    setTopicHasMore(false);
    await topicPageRequest(true);
  };

  const handleClick = (id: number) => {
    const container = document.querySelector('.news-content') as HTMLElement | null;
    if (container) {
      const maxScroll = container.scrollHeight - container.clientHeight;
      const scrollTop = container.scrollTop;
      const value = maxScroll - scrollTop <= 400 ? maxScroll : scrollTop;
      setNewsScrollPosition('topic', value);
    }
    navigate('/topic/' + id);
  };

  const TopicScrollContent = ({ hasMore }: { hasMore?: boolean }) => (
    <>
      {hasMore ? (
        <div className="dot-loading-custom">
          <span>加载中</span>
          <DotLoading color='black' />
        </div>
      ) : (
        <div className="infinite-scroll-footer">
          <span>--- 我是有底线的 ---</span>
        </div>
      )}
    </>
  );

  return (
    <InfiniteScroll
      loadMore={() => topicPageRequest(false)}
      hasMore={topicHasMore}
      threshold={50}
    >
      <div className="card-container">
        <PullToRefresh onRefresh={handleRefresh}>
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
                  {<span className="topic-tag">类型: <span className="source">{topic.type}</span></span>}
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
              <Divider className='divider-line' />
            </Card>
          ))}
        </PullToRefresh>

        {initialLoading && (
          <div className="dot-loading-custom">
            <Skeleton.Title animated />
            <Skeleton.Paragraph lineCount={8} animated />
          </div>
        )}

        {!initialLoading && <TopicScrollContent hasMore={topicHasMore} />}
      </div>
    </InfiniteScroll>
  );
};

export default Topic;