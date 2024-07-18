import  React from 'react';
import NewsRecord from '@/components/news/NewsRecord';
import { DotLoading, InfiniteScroll, PullToRefresh } from 'antd-mobile';
import { Request_NewsPage, NewsPageRequestType, NewsInfoType } from '@/pages/news/api';
import useStore from '@/zustand/store'



const NewsScrollContent = ({ hasMore }: { hasMore?: boolean }) => {
  return (
    <>
      {hasMore ? (
        <>
          <div className="dot-loading-custom" >
            <span >Loading</span>
            <DotLoading color='#fff' />
          </div>
        </>
      ) : (
        <span color='#fff'>--- 我是有底线的 ---</span>
      )}
    </>
  )
}



const NewsList: React.FC<any> = ({ newsTab }) => {
  //各种新闻类型全局状态数据
  const { newsList, setNewsList, newsHasMore, setNewsHasMore, newsPage, setNewsPage,
    sportList, setSportList,sportHasMore,setSportHasMore,sportPage,setSportPage,
    entertainmentList, setEntertainmentList,entertainmentHasMore,setEntertainmentHasMore,entertainmentPage,setEntertainmentPage,
    militaryList, setMilitaryList,militaryHasMore,setMilitaryHasMore,militaryPage,setMilitaryPage,
    scienceList, setScienceList,scienceHasMore,setScienceHasMore,sciencePage,setSciencePage,
    netFriendList, setNetFriendList ,netFriendHasMore,setNetFriendHasMore,netFriendPage,setNetFriendPage
  } = useStore();//新闻的全局变量

  //获取某种新闻类型当前页面是否还有新数据返回的状态
  const getPageHasMore = () => {
    if (newsTab === '1') return newsHasMore;
    if (newsTab === '2') return sportHasMore;
    if (newsTab === '3') return entertainmentHasMore;
    if (newsTab === '4') return militaryHasMore;
    if (newsTab === '5') return scienceHasMore;
    if (newsTab === '7') return netFriendHasMore;
    return false;
  }


  //根据新闻类型获取该新闻类型页面的当前分页号码
  const getTabPageNum = () => {
    if (newsTab === '1') return newsPage;
    if (newsTab === '2') return sportPage;
    if (newsTab === '3') return entertainmentPage;
    if (newsTab === '4') return militaryPage;
    if (newsTab === '5') return sciencePage;
    if (newsTab === '7') return netFriendPage;
  }


  // 模拟请求不同类型的新闻数据
  const reqNewsApi = async (categoryEnum: string, isReset: boolean) => {
    const pageNum = isReset ? 1 : getTabPageNum();//如果是刷新就从第一页开始

    console.log('请求页号:', pageNum,'是否是刷新', isReset)
    const pageReq: NewsPageRequestType = { pageNum: pageNum, pageSize: 20, categoryEnum: categoryEnum };
    const newsListResp: NewsInfoType[] = (await Request_NewsPage(pageReq)).data.records || [];
    console.log('返回结果:', newsListResp)

    //对比查询新闻的类型属于哪个类型数据 并且确认有新的数据返回才修改 全局的数据状态
    if (newsListResp.length > 0) {
      if (categoryEnum === '1') {//新闻
        if (isReset) {
          setNewsPage(()=>2)//下一页是
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
      }

      if (categoryEnum === '2') {//体育
        if (isReset) {
          setSportPage(()=>2)
          setSportList(newsListResp)
          setSportHasMore(true)
        } else {
          if (JSON.stringify(newsListResp) !== JSON.stringify(sportList)) {
            setSportPage((prev) => prev + 1)
            setSportList([...sportList, ...newsListResp])
            setSportHasMore(true)
          } else {
            setSportHasMore(false);
          }
        }
      }

      if (categoryEnum === '3') {//娱乐
        if (isReset) {
          setEntertainmentPage(()=>2)
          setEntertainmentList(newsListResp)
          setEntertainmentHasMore(true)
        } else {
          if (JSON.stringify(newsListResp) !== JSON.stringify(entertainmentList)) {
            setEntertainmentPage((prev) => prev + 1)
            setEntertainmentList([...entertainmentList, ...newsListResp])
            setEntertainmentHasMore(true)
          } else {
            setEntertainmentHasMore(false);
          }
        }
      }

      if (categoryEnum === '4') {//军事
        if (isReset) {
          setMilitaryPage(()=>2)
          setMilitaryList(newsListResp)
          setMilitaryHasMore(true)
        } else {
          if (JSON.stringify(newsListResp) !== JSON.stringify(militaryList)) {
            setMilitaryPage((prev) => prev + 1)
            setMilitaryList([...militaryList, ...newsListResp])
            setMilitaryHasMore(true)
          } else {
            setMilitaryHasMore(false);
          }
        }
      }


      if (categoryEnum === '5') {//科技
        if (isReset) {
          setSciencePage(()=>2)
          setScienceList(newsListResp)
          setScienceHasMore(true)
        } else {
          if (JSON.stringify(newsListResp) !== JSON.stringify(scienceList)) {
            setSciencePage((prev) => prev + 1)
            setScienceList([...scienceList, ...newsListResp])
            setScienceHasMore(true)
          } else {
            setScienceHasMore(false);
          }
        }
      }

      if (categoryEnum === '7') {//网友
        if (isReset) {
          setNetFriendPage(()=>2)
          setNetFriendList(newsListResp)
          setNetFriendHasMore(true)
        } else {
          if (JSON.stringify(newsListResp) !== JSON.stringify(netFriendList)) {
            setNetFriendPage((prev) => prev + 1)
            setNetFriendList([...netFriendList, ...newsListResp])
            setNetFriendHasMore(true)
          } else {
            setNetFriendHasMore(false);
          }
        }
      }

    } else {
      if (categoryEnum === '1') {//新闻
        setNewsHasMore(false)
      }
      if (categoryEnum === '2') {//体育
        setSportHasMore(false)
      }
      if (categoryEnum === '3') {//娱乐
        setEntertainmentHasMore(false)
      }
      if (categoryEnum === '4') {//军事
        setMilitaryHasMore(false)
      }
      if (categoryEnum === '5') {//科技
        setScienceHasMore(false)
      }
      if (categoryEnum === '7') {//网友
        setNetFriendHasMore(false)
      }
    }

  };


  //获取当前胶囊新闻类型所用的新闻数据状态
  const capsuleTabData = (): NewsInfoType[] => {
    if (newsTab === '1') {
      return newsList || [];
    }
    if (newsTab === '2') {
      return sportList || [];
    }
    if (newsTab === '3') {
      return entertainmentList || [];
    }
    if (newsTab === '4') {
      return militaryList || [];
    }
    if (newsTab === '5') {
      return scienceList || [];
    }
    if (newsTab === '7') {
      return netFriendList || [];
    }
    return [];
  }


  /*   useEffect(() => {
      reqNewsApi(newsTab);
    }, [newsTab])
   */

  return (
    <div className="outer-container">
      <PullToRefresh onRefresh={() => reqNewsApi(newsTab, true)}>
        {capsuleTabData()?.map((news, index) => (
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
          />
        ))}
      </PullToRefresh>

      <InfiniteScroll loadMore={() => reqNewsApi(newsTab, false)} hasMore={getPageHasMore()}>
        <NewsScrollContent hasMore={getPageHasMore()} />
      </InfiniteScroll>
    </div>

  );
};


export default NewsList;
