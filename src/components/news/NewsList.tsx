import { useState } from 'react';
import NewsRecord from '@/components/news/NewsRecord';
import { InfiniteScroll, PullToRefresh, Skeleton } from 'antd-mobile';
import { Request_NewsPage, NewsPageRequestType, NewsInfoType } from '@/pages/news/api';
import '@/components/news/NewsList.less'

const NewsList: React.FC<any> = () => {
  //各种新闻类型状态数据
  const [newsList, setNewsList] = useState<NewsInfoType[]>([])
  const [newsHasMore, setNewsHasMore] = useState<boolean>(true)
  const [newsPage, setNewsPage] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);


  // ✅ 完全模仿Politics组件的API请求逻辑
  const reqNewsApi = async (isReset: boolean) => {

    //return;
    if (loading) {
      return;
    }
    setLoading(true);

    const pageNum = isReset ? 1 : newsPage;
    const pageReq: NewsPageRequestType = { pageNum: pageNum, pageSize: 30 };
    const newsListResp: NewsInfoType[] = (await Request_NewsPage(pageReq)).data.records || [];
    setLoading(false);
    // 循环便利 (保持和Politics一样的注释)
    if (newsListResp.length > 0) {
      if (isReset) {
        setNewsPage(() => 2);
        setNewsList(newsListResp);
        setNewsHasMore(true);
      } else {
        setNewsPage(prev => (prev + 1));
        setNewsList([...newsList, ...newsListResp]);
        //setNewsHasMore(true);
      }
    } else {
      setNewsHasMore(false);
    }


  };

  return (
    <>

      <div className="card-container">
        <div>
          <PullToRefresh onRefresh={() => reqNewsApi(true)}>
            {newsList?.map((news, index) => (
              <NewsRecord
                key={index} // ✅ 和Politics一样使用index作为key
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
            ))}
          </PullToRefresh>
        </div>

        <InfiniteScroll
          loadMore={() => reqNewsApi(false)}
          hasMore={newsHasMore}
          threshold={50}
        />


        {loading ? (
          <div className="dot-loading-custom">
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