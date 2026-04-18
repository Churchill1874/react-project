import { useState, useEffect, useRef } from 'react';
import useStore from '@/zustand/store';
import NewsRecord from '@/components/news/NewsRecord';
import { PullToRefresh, Skeleton } from 'antd-mobile';
import { Request_NewsPage, NewsPageRequestType, NewsInfoType } from '@/pages/news/api';
import '@/components/news/NewsList.less'

const NewsList: React.FC<any> = () => {
  const { getNewsListCache, setNewsListCache } = useStore();

  const [newsList, setNewsList] = useState<NewsInfoType[]>(() => {
    const cache = getNewsListCache('news');
    return cache ? cache.data : [];
  });
  const [newsHasMore, setNewsHasMore] = useState<boolean>(() => {
    const cache = getNewsListCache('news');
    return cache ? cache.hasMore : true;
  });
  const [newsPage, setNewsPage] = useState<number>(() => {
    const cache = getNewsListCache('news');
    return cache ? cache.page : 1;
  });
  const newsPageRef = useRef<number>(newsPage);
  const loadingRef = useRef<boolean>(false);
  const [initialLoading, setInitialLoading] = useState<boolean>(() => {
    const cache = getNewsListCache('news');
    return !cache || cache.data.length === 0;
  });



  useEffect(() => {
    newsPageRef.current = newsPage;
  }, [newsPage]);

  const reqNewsApi = async (isReset: boolean): Promise<void> => {
    if (loadingRef.current) return new Promise(() => { });

    loadingRef.current = true;
    const pageNum = isReset ? 1 : newsPageRef.current;

    try {
      const pageReq: NewsPageRequestType = { pageNum, pageSize: 20 };
      const newsListResp: NewsInfoType[] = (await Request_NewsPage(pageReq)).data.records || [];

      if (newsListResp.length > 0) {
        if (isReset) {
          newsPageRef.current = 2;
          setNewsPage(2);
          setNewsList(newsListResp);
          setNewsHasMore(true);
          setNewsListCache('news', newsListResp, 2, true);
        } else {
          const nextPage = pageNum + 1;
          newsPageRef.current = nextPage;
          setNewsPage(nextPage);
          setNewsList(prev => {
            const combined = [...prev, ...newsListResp];
            setNewsListCache('news', combined, nextPage, true);
            return combined;
          });
        }
      } else {
        setNewsHasMore(false);
        const cache = getNewsListCache('news');
        if (cache) {
          setNewsListCache('news', cache.data, cache.page, false);
        }
      }
    } finally {
      loadingRef.current = false;
      setInitialLoading(false);
    }
  };

  // 替换掉 InfiniteScroll，改用手动监听
  useEffect(() => {
    const container = document.querySelector('.news-content');
    if (!container) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container as HTMLElement;
      if (scrollHeight - scrollTop - clientHeight < 50 && newsHasMore && !loadingRef.current) {
        reqNewsApi(false);
      }
    };

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, [newsHasMore]); // newsHasMore 变化时重新绑定

  const hasRequestedRef = useRef(false);

  useEffect(() => {
    if (hasRequestedRef.current) return;
    hasRequestedRef.current = true;
    if (!newsList || newsList.length === 0) {
      reqNewsApi(true);
    }
  }, []);

  return (
    <>
      {initialLoading ? (
        <div className="dot-loading-custom">
          <Skeleton.Title animated />
          <Skeleton.Paragraph lineCount={8} animated />
        </div>
      ) : (
        <>
          <PullToRefresh onRefresh={() => reqNewsApi(true)}>
            {newsList?.map((news) => (
              <div key={news.id} style={{ minHeight: '100px' }}>
                <NewsRecord
                  id={news.id}
                  title={news.title}
                  content={news.filterContent}
                  photoPath={news.photoPath}
                  contentImagePath={news.contentImagePath}
                  likesCount={news.likesCount}
                  commentsCount={news.commentsCount}
                  viewCount={news.viewCount}
                  createTime={news.createTime}
                  category={news.category}
                  source={news.source}
                  newsList={newsList}
                  setNewsList={setNewsList}
                />
              </div>
            ))}
          </PullToRefresh>


          {!newsHasMore && (
            <div className="infinite-scroll-footer">
              <span>--- 我是有底线的 ---</span>
            </div>
          )}
        </>
      )}
    </>
  );
};

export default NewsList;