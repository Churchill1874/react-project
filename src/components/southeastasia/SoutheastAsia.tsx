import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';  // ← 加这一行
import { Card, Divider, Tag, Ellipsis, Image, PullToRefresh, InfiniteScroll, DotLoading, Skeleton } from 'antd-mobile';
import { getImgUrl } from "@/utils/commentUtils";
import { FcReading } from "react-icons/fc";
import { MessageOutline, LocationFill } from 'antd-mobile-icons';
import '@/components/southeastasia/SoutheastAsia.less'
import { SoutheastAsiaNewsPageReqType, SoutheastAsiaNewsType, SoutheastAsiaNewsPage_Request } from '@/components/southeastasia/api'
import dayjs from 'dayjs'
import useStore from '@/zustand/store';


const SoutheastAsia: React.FC = () => {
  const navigate = useNavigate();
  const { getNewsListCache, setNewsListCache, setNewsScrollPosition, getNewsScrollPosition, getLastReadItemId, setLastReadItemId } = useStore();
  const [southeastAsiaNewsList, setSoutheastAsiaNewsList] = useState<SoutheastAsiaNewsType[]>(() => {
    // 从 zustand 缓存恢复数据
    const cache = getNewsListCache('southeastAsia');
    return cache ? cache.data : [];
  });
  const [southeastAsiaNewsHasHore, setSoutheastAsiaNewsHasHore] = useState<boolean>(() => {
    // 从 zustand 缓存恢复加载状态
    const cache = getNewsListCache('southeastAsia');
    return cache ? cache.hasMore : true;
  });
  const [southeastAsiaNewsPage, setSoutheastAsiaNewsPage] = useState<number>(() => {
    // 从 zustand 缓存恢复页码
    const cache = getNewsListCache('southeastAsia');
    return cache ? cache.page : 1;
  });
  const [loading, setLoading] = useState<boolean>(false);

  // 组件挂载时，如果没有缓存数据就加载第一页
  useEffect(() => {
    if (southeastAsiaNewsList.length === 0) {
      southeastAsiaNewsPageRequest(true);
    }
  }, []);

  // 组件数据加载或列表变化后，从上次阅读 id 恢复位置
  useEffect(() => {
    const lastId = getLastReadItemId('southeastAsia');
    const container = document.querySelector('.news-content') as HTMLElement | null;

    if (container) {
      // 如果滚动位置已缓存并且在接近底部，直接恢复到底部，避免跳到条目上方不准的情况。
      const savedPosition = getNewsScrollPosition('southeastAsia');
      const maxScroll = container.scrollHeight - container.clientHeight;
      if (savedPosition > 0 && maxScroll - savedPosition <= 400) {
        container.scrollTop = maxScroll;
        setLastReadItemId('southeastAsia', null);
        return;
      }
    }

    if (!lastId) return;

    const scrollToItem = () => {
      const el = document.querySelector(`.southeastasia-item[data-id="${lastId}"]`) as HTMLElement | null;
      const container = document.querySelector('.news-content') as HTMLElement | null;
      if (el && container) {
        const target = Math.max(0, el.offsetTop - 20);
        container.scrollTop = target;
        setLastReadItemId('southeastAsia', null);
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
  }, [southeastAsiaNewsList, getNewsListCache, getLastReadItemId, getNewsScrollPosition, setLastReadItemId]);



  //获取api东南亚新闻数据
  const southeastAsiaNewsPageRequest = async (isReset: boolean) => {
    if (loading) {
      return;
    }
    setLoading(true)

    const pageNum = isReset ? 1 : southeastAsiaNewsPage;
    const param: SoutheastAsiaNewsPageReqType = { pageNum: pageNum, pageSize: 20 };
    const list: SoutheastAsiaNewsType[] = (await SoutheastAsiaNewsPage_Request(param)).data.records || [];

    //循环便利
    if (list.length > 0) {
      if (isReset) {
        setSoutheastAsiaNewsPage(() => 2);
        setSoutheastAsiaNewsList(list);
        setSoutheastAsiaNewsHasHore(true);
        
        // 缓存数据到 zustand
        setNewsListCache('southeastAsia', list, 2, true);
      } else {
        if (JSON.stringify(list) !== JSON.stringify(southeastAsiaNewsList.slice(-list.length))) {
          const newPage = pageNum + 1;
          const newList = [...southeastAsiaNewsList, ...list];
          setSoutheastAsiaNewsPage(newPage);
          setSoutheastAsiaNewsList(newList);
          setSoutheastAsiaNewsHasHore(true);
          
          // 缓存数据到 zustand
          setNewsListCache('southeastAsia', newList, newPage, true);
        } else {
          setSoutheastAsiaNewsHasHore(false);
          // 更新缓存的hasMore状态
          const cache = getNewsListCache('southeastAsia');
          if (cache) {
            setNewsListCache('southeastAsia', cache.data, cache.page, false);
          }
        }
      }
    } else {
      setSoutheastAsiaNewsHasHore(false);
      // 更新缓存的hasMore状态
      const cache = getNewsListCache('southeastAsia');
      if (cache) {
        setNewsListCache('southeastAsia', cache.data, cache.page, false);
      }
    }
    setLoading(false)
  }

  const SoutheastAsiaNewsScrollContent = ({ hasMore }: { hasMore?: boolean }) => {
    return (
      <>
        {hasMore ? (
          <>
            <div className="dot-loading-custom" >
              <span >加载中</span>
              <DotLoading color='black' />
              <Skeleton.Title animated />
              <Skeleton.Paragraph lineCount={8} animated />

            </div>
          </>
        ) : (
          <div className="infinite-scroll-footer">
            <span >--- 我是有底线的 ---</span>
          </div>
        )}
      </>
    )
  }

  const click = (id: string) => {
    // 点击前立即记录当前位置，避免 return 时回得偏差
    const container = document.querySelector('.news-content') as HTMLElement | null;
    if (container) {
      const maxScroll = container.scrollHeight - container.clientHeight;
      const scrollTop = container.scrollTop;
      const isNearBottom = maxScroll - scrollTop <= 400; // 较宽的临界值，避免末尾条目回位不准
      const value = isNearBottom ? maxScroll : scrollTop;
      setNewsScrollPosition('southeastAsia', value);

      if (isNearBottom) {
        // 末尾深位时直接恢复到底部，不再定位具体 element
        setLastReadItemId('southeastAsia', null);
      } else {
        setLastReadItemId('southeastAsia', id);
      }
    } else {
      setLastReadItemId('southeastAsia', id);
    }

    navigate('/southeastAsia/' + id, { replace: true });
  }

  return (
    <>
      {/* 将 InfiniteScroll 包裹整个容器 */}
      <InfiniteScroll
        loadMore={() => southeastAsiaNewsPageRequest(false)}
        hasMore={southeastAsiaNewsHasHore}
        threshold={50}
      >
        <div className="card-container" >
          <PullToRefresh onRefresh={() => southeastAsiaNewsPageRequest(true)}>
            {southeastAsiaNewsList?.map((southeastAsiaNews, index) => (
              <Card className="southeastasia-custom-card" key={index} data-id={southeastAsiaNews.id}>
                <div className="southeastasia-card-content">

                  {southeastAsiaNews.title &&
                    <div className="southeast-asia-title">
                      <Ellipsis direction='end' rows={2} content={southeastAsiaNews.title} />
                    </div>
                  }

                  {southeastAsiaNews.imagePath &&
                    <div className="southeastasia-news-image-container">
                      <Image
                        className="southeastasia-news-image"
                        src={getImgUrl(southeastAsiaNews.imagePath?.split('||').filter(Boolean)[0] || '')}
                        alt="Example"
                        fit="contain"
                      />
                    </div>
                  }

                  {southeastAsiaNews.imagePath &&
                    <Divider className='divider-line' />
                  }

                  <Ellipsis
                    direction='end'
                    rows={2}
                    content={southeastAsiaNews.content}
                    style={{ fontSize: "15px", letterSpacing: "1px", textIndent: "2em" }} />

                  <span className="southeastasia-time">

                    {southeastAsiaNews.isTop && <Tag className="southeastasia-tag" color='#a05d29'>置顶</Tag>}
                    {southeastAsiaNews.isHot && <Tag className="southeastasia-tag" color='red' fill='outline'>热门</Tag>}
                    {southeastAsiaNews.source && <span className="southeastasia-tag" >来源: <span className="source"> {southeastAsiaNews.source} </span></span>}
                    {southeastAsiaNews.createTime && dayjs(southeastAsiaNews.createTime).format('YYYY-MM-DD HH:mm')}

                  </span>



                  <div className="button-info">
                    <span className="tracking"><LocationFill className="area" />{southeastAsiaNews.area}</span>
                    <span className="icon-and-text">
                      <FcReading fontSize={17} />
                      <span className="number"> {southeastAsiaNews.viewCount} </span>
                    </span>

                    <span className="tracking">
                      <span className="icon-and-text">
                        <MessageOutline fontSize={17} />
                        <span className="message-number"> {southeastAsiaNews.commentsCount} </span>
                        <span className="click"
                          onClick={() => click(String(southeastAsiaNews.id))}
                        >点击查看</span>
                      </span>
                    </span>
                  </div>
                </div>
                <Divider className='divider-line' />
              </Card>

            ))}
          </PullToRefresh>

          {/* 加载状态显示在这里 */}
          <SoutheastAsiaNewsScrollContent hasMore={southeastAsiaNewsHasHore} />
        </div>
      </InfiniteScroll>

    </>
  );
}

export default SoutheastAsia;