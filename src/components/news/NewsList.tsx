import { useState, useEffect } from 'react';
import NewsRecord from '@/components/news/NewsRecord';
import { DotLoading, InfiniteScroll, PullToRefresh } from 'antd-mobile';
import { Request_NewsPage, NewsPageRequestType, NewsInfoType } from '@/pages/news/api';

const NewsScrollContent = ({ hasMore }: { hasMore?: boolean }) => {
  return (
    <>
      {hasMore ? (
        <>
          <div className="dot-loading-custom" >
            <span >加载中</span>
            <DotLoading color='#fff' />
          </div>
        </>
      ) : (
        <span color='#fff'>--- 我是有底线的 ---</span>
      )}
    </>
  )
}



const NewsList: React.FC<any> = () => {

  useEffect(() => {
  }, []);


  //各种新闻类型状态数据
  const [newsList, setNewsList] = useState<NewsInfoType[]>([])
  const [newsHasMore, setNewsHasMore] = useState<boolean>(true)
  const [newsPage, setNewsPage] = useState<number>(1);


  // 模拟请求不同类型的新闻数据
  const reqNewsApi = async (isReset: boolean) => {
    const pageNum = isReset ? 1 : newsPage;//如果是刷新就从第一页开始

    const pageReq: NewsPageRequestType = { pageNum: pageNum, pageSize: 50 };
    const newsListResp: NewsInfoType[] = (await Request_NewsPage(pageReq)).data.records || [];

    //对比查询新闻的类型属于哪个类型数据 并且确认有新的数据返回才修改 全局的数据状态
    if (newsListResp.length > 0) {
      if (isReset) {
        setNewsPage(() => 2)//下一页是
        setNewsList(newsListResp);
        setNewsHasMore(true)
      } else {
        if (JSON.stringify(newsListResp) !== JSON.stringify(newsList)) {
          setNewsPage((prev) => prev + 1);//新闻页面当前页号
          setNewsList([...newsList, ...newsListResp]);
          setNewsHasMore(true)
        } else {
          setNewsHasMore(false);
        }
      }
    } else {
      setNewsHasMore(false)
    }

  };


  return (
    <div className="outer-container" >
      <PullToRefresh onRefresh={() => reqNewsApi(true)} >
        {newsList?.map((news, index) => (
          <NewsRecord
            key={`${news.id}-${index}`}
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
            data-id={news.id} // 为每个新闻条目添加唯一标识符
            newsList={newsList}
            setNewsList={setNewsList}
            needCommentPoint={false}
          />
        ))}
      </PullToRefresh>

      <InfiniteScroll loadMore={() => reqNewsApi(false)} hasMore={newsHasMore} >
        <NewsScrollContent hasMore={newsHasMore} />
      </InfiniteScroll>
    </div>

  );
};


export default NewsList;
