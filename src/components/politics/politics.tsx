import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { Card, Divider, Tag, Ellipsis, Image, Toast, PullToRefresh, InfiniteScroll, DotLoading, Skeleton } from 'antd-mobile';
import { FcReading, FcLike } from "react-icons/fc";
import { MessageOutline, HeartOutline, LocationFill } from 'antd-mobile-icons';
import '@/components/politics/politics.less'
import { PoliticsPage_Request, PoliticsPageReqType, PoliticsType } from '@/components/politics/api'
import dayjs from 'dayjs'

import { Request_IncreaseLikesCount } from '@/components/news/newsinfo/api';
import { getImgUrl } from "@/utils/commentUtils";
import useStore from '@/zustand/store';



const Politics: React.FC = () => {
  const navigate = useNavigate();
  const { getNewsListCache, setNewsListCache, setNewsScrollPosition, getNewsScrollPosition, getLastReadItemId, setLastReadItemId } = useStore();
  const [politicsList, setPoliticsList] = useState<PoliticsType[]>(() => {
    // 从 zustand 缓存恢复数据
    const cache = getNewsListCache('politics');
    return cache ? cache.data : [];
  });
  const [politicsHasHore, setPoliticsHasHore] = useState<boolean>(() => {
    // 从 zustand 缓存恢复加载状态
    const cache = getNewsListCache('politics');
    return cache ? cache.hasMore : false;
  });
  const [politicsPage, setPoliticsPage] = useState<number>(() => {
    // 从 zustand 缓存恢复页码
    const cache = getNewsListCache('politics');
    return cache ? cache.page : 1;
  });
  const [likesIdList, setLikesIdList] = useState<number[]>([]);
  const [loading, setLoading] = useState<boolean>(false);


  //点赞
  const clickLikes = async (id) => {
    if (likesIdList.includes(id)) {
      Toast.show({
        content: '已点赞',
        duration: 600,
      })
      return;
    } else {
      setLikesIdList((prev) => [...prev, id])
    }

    const param = { id: id, infoType: 1 }
    const resp = await Request_IncreaseLikesCount(param);

    if (resp.code === 0) {
      if (resp.data.value) {
        Toast.show({
          icon: <HeartOutline />,
          content: '点赞 +1',
          duration: 600,
        })
      } else {
        Toast.show({
          content: '已点赞',
          duration: 600,
        })
        return;
      }
      // 不再更新 popup，直接导航时重新获取
    } else {
      Toast.show({
        content: '网络异常,请稍后重试',
        duration: 600,
      })
    }
  }

  //获取api政闻新闻数据
  const politicsPageRequest = async (isReset: boolean) => {
    if (loading) {
      return;
    }
    setLoading(true)
    const pageNum = isReset ? 1 : politicsPage;
    const param: PoliticsPageReqType = { pageNum: pageNum, pageSize: 20 };
    const list: PoliticsType[] = (await PoliticsPage_Request(param)).data.records || [];
    //循环便利
    if (list.length > 0) {
      if (isReset) {
        setPoliticsPage(() => 2);
        setPoliticsList(list);
        setPoliticsHasHore(true);
        
        // 缓存数据到 zustand
        setNewsListCache('politics', list, 2, true);
      } else {
        if (JSON.stringify(list) !== JSON.stringify(politicsList)) {
          const newPage = pageNum + 1;
          const newList = [...politicsList, ...list];
          setPoliticsPage(newPage);
          setPoliticsList(newList);
          setPoliticsHasHore(true);
          
          // 缓存数据到 zustand
          setNewsListCache('politics', newList, newPage, true);
        } else {
          setPoliticsHasHore(false);
          // 更新缓存的hasMore状态
          const cache = getNewsListCache('politics');
          if (cache) {
            setNewsListCache('politics', cache.data, cache.page, false);
          }
        }
      }
    } else {
      setPoliticsHasHore(false);
      // 更新缓存的hasMore状态
      const cache = getNewsListCache('politics');
      if (cache) {
        setNewsListCache('politics', cache.data, cache.page, false);
      }
    }

    setLoading(false)
  }

  // 组件挂载时，如果没有缓存数据就加载第一页
  useEffect(() => {
    if (politicsList.length === 0) {
      politicsPageRequest(true);
    }
  }, []);

  // 组件数据加载或列表变化后，从上次阅读 id 恢复位置
  useEffect(() => {
    const lastId = getLastReadItemId('politics');
    const container = document.querySelector('.news-content') as HTMLElement | null;

    if (container) {
      // 如果滚动位置已缓存并且在接近底部，直接恢复到底部，避免跳到条目上方不准的情况。
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
        const target = Math.max(0, el.offsetTop - 20);
        container.scrollTop = target;
        setLastReadItemId('politics', null);
        return true;
      }
      return false;
    };

    if (!scrollToItem()) {
      // 如果第一次未渲染到，就再尝试几次
      let retries = 0;
      const interval = window.setInterval(() => {
        if (scrollToItem() || retries > 5) {
          window.clearInterval(interval);
        }
        retries += 1;
      }, 50);

      return () => window.clearInterval(interval);
    }
  }, [politicsList, getNewsListCache, getLastReadItemId, getNewsScrollPosition, setLastReadItemId]);

  const click = (id: string) => {
    // 点击前立即记录当前位置，避免 return 时回得偏差
    const container = document.querySelector('.news-content') as HTMLElement | null;
    if (container) {
      const maxScroll = container.scrollHeight - container.clientHeight;
      const scrollTop = container.scrollTop;
      const isNearBottom = maxScroll - scrollTop <= 400; // 较宽的临界值，避免末尾条目回位不准
      const value = isNearBottom ? maxScroll : scrollTop;
      setNewsScrollPosition('politics', value);

      if (isNearBottom) {
        // 末尾深位时直接恢复到底部，不再定位具体 element
        setLastReadItemId('politics', null);
      } else {
        setLastReadItemId('politics', id);
      }
    } else {
      setLastReadItemId('politics', id);
    }

    navigate('/politics/' + id, { replace: true });
  }

  const PoliticsScrollContent = ({ hasMore }: { hasMore?: boolean }) => {
    return (
      <>
        {hasMore ? (
          <>
            <div className="dot-loading-custom" >
              <span >加载中</span>
              <DotLoading color='black' />
            </div>
          </>
        ) : (
          <span color='#fff'>--- 我是有底线的 ---</span>
        )}
      </>
    )
  }


  return (
    <>
      <InfiniteScroll
        loadMore={() => politicsPageRequest(false)}
        hasMore={politicsHasHore}
        threshold={50}
      >
        <div className="card-container" >
          <PullToRefresh onRefresh={() => politicsPageRequest(true)}>
            {politicsList?.map((politics, index) => (
              <>
                <Card className="politics-custom-card politics-item" key={index} data-id={politics.id} style={{ marginTop: '0px' }}
                  onClick={() => click(String(politics.id))}
                >
                  <div className="politics-card-content">

                    {politics.title &&
                      <div className="politics-title">
                        <Ellipsis direction='end' rows={2} content={politics.title} />
                      </div>
                    }
                    {politics.imagePath &&
                      <div className="politics-image-container">
                        <Image
                          className="politics-image"
                          src={getImgUrl(politics.imagePath)}
                          alt="Example"
                          fit="contain"
                        />
                      </div>
                    }

                    <Ellipsis className="politics-synopsis" direction='end' rows={3} content={politics.content} style={{ fontSize: "15px", textIndent: "2em" }} />

                    <div style={{ marginTop: '5px', marginBottom: '10px', padding: '0px', textIndent: '0px' }}>
                      <span className="icon-and-text" style={{ color: 'gray', marginRight: '3px' }}>
                        来源: {politics.country}
                      </span>
                      <span className="source" style={{ marginRight: '10px' }}>
                        {politics.source}
                      </span>
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
                        <FcLike className='attribute-icon' fontSize={15} onClick={clickLikes} />
                        <span className="number"> {politics?.likesCount || 0} </span>
                      </span>

                      <span className="icon-and-text">
                        <MessageOutline fontSize={17} />
                        <span className="number"> {politics.commentsCount} </span>
                      </span>


                    </div>
                  </div>
                </Card >

                <Divider className="politics-divider-line" />
              </>


            ))}
          </PullToRefresh>


          {/* <PoliticsScrollContent hasMore={politicsHasHore} /> */}
          {loading ? (
            <>
              <div className="dot-loading-custom" >
                <Skeleton.Title animated />
                <Skeleton.Paragraph lineCount={8} animated />
              </div>
            </>
          ) : (
            <div className="infinite-scroll-footer">
              <span >--- 我是有底线的 ---</span>
            </div>
          )}

        </div>
      </InfiniteScroll >
    </>
  );
}



export default Politics;