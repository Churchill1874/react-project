import { useState, useEffect, useRef } from 'react';
import useStore from '@/zustand/store';
import NewsRecord from '@/components/news/NewsRecord';
import { InfiniteScroll, PullToRefresh, Skeleton } from 'antd-mobile';
import { Request_NewsPage, NewsPageRequestType, NewsInfoType } from '@/pages/news/api';
import '@/components/news/NewsList.less'

const NewsList: React.FC<any> = () => {
  const { getNewsListCache, setNewsListCache, getNewsScrollPosition } = useStore();
  //各种新闻类型状态数据
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
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    newsPageRef.current = newsPage;
  }, [newsPage]);


  // ✅ 完全模仿Politics组件的API请求逻辑
  const reqNewsApi = async (isReset: boolean) => {
    if (loadingRef.current) {
      return;
    }

    loadingRef.current = true;
    setLoading(true);

    const pageNum = isReset ? 1 : newsPageRef.current;

    try {
      const pageReq: NewsPageRequestType = { pageNum: pageNum, pageSize: 10 };
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
      setLoading(false);
    }
  };

  const hasRequestedRef = useRef(false);

  // 初次进入或回到列表时：优先使用缓存；如果没缓存则请求一次。
  useEffect(() => {
    if (hasRequestedRef.current) {
      return;
    }
    hasRequestedRef.current = true;

    if (!newsList || newsList.length === 0) {
      reqNewsApi(true);
    }
  }, []);

  return (
    <>

      <div >
        <div>
          <PullToRefresh onRefresh={() => reqNewsApi(true)}>
            {newsList?.map((news, _index) => (
              <div key={news.id} style={{ minHeight: '100px' }}>
                <NewsRecord
                  key={news.id} // ✅ 和Politics一样使用index作为key
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
                  data-id={news.id}
                  newsList={newsList}
                  setNewsList={setNewsList}
                />
              </div>
            ))}
          </PullToRefresh>
        </div>

        <InfiniteScroll
          loadMore={() => reqNewsApi(false)}
          hasMore={newsHasMore}
          threshold={50}
        />


        {loading ? (
          <div >
            {/* <span>加载中</span> */}
            {/* <DotLoading color='#fff' /> */}
            <Skeleton.Title animated />
            <Skeleton.Paragraph lineCount={8} animated />
          </div>
        ) : (
          <div className="infinite-scroll-footer">
            <span>--- 我是有底线的 ---</span>
          </div>
        )}

      </div>


    </>
  );
};

export default NewsList;