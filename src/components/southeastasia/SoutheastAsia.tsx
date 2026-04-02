import { useState, useEffect, useRef } from "react";
import { useNavigate } from 'react-router-dom';
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
  const { getNewsListCache, setNewsListCache, setNewsScrollPosition, getNewsScrollPosition } = useStore();

  const [southeastAsiaNewsList, setSoutheastAsiaNewsList] = useState<SoutheastAsiaNewsType[]>(() => {
    const cache = getNewsListCache('southeastAsia');
    return cache ? cache.data : [];
  });
  const [southeastAsiaNewsHasMore, setSoutheastAsiaNewsHasMore] = useState<boolean>(() => {
    const cache = getNewsListCache('southeastAsia');
    // 有缓存数据时，InfiniteScroll 不需要自动触发加载
    return cache ? cache.hasMore : false; // ← 初始 false，避免挂载时自动触发
  });
  const [southeastAsiaNewsPage, setSoutheastAsiaNewsPage] = useState<number>(() => {
    const cache = getNewsListCache('southeastAsia');
    return cache ? cache.page : 1;
  });
  const loadingRef = useRef(false);

  // 挂载时处理两件事：
  // 1. 没有缓存数据 → 发起第一页请求，请求完再开启 hasMore
  // 2. 有缓存数据 → 直接恢复滚动位置
  useEffect(() => {
    const cache = getNewsListCache('southeastAsia');
    if (!cache || cache.data.length === 0) {
      // 没缓存，手动请求第一页，请求完毕后由 southeastAsiaNewsPageRequest 设置 hasMore=true
      southeastAsiaNewsPageRequest(true);
    } else {
      // 有缓存，恢复滚动位置，等内容渲染后再设 scrollTop
      // 开启 hasMore 让 InfiniteScroll 可以继续加载后续页
      setSoutheastAsiaNewsHasMore(cache.hasMore);
      restoreScrollPosition();
    }
  }, []);

  // 恢复滚动位置，等 DOM 渲染完再执行
  const restoreScrollPosition = () => {
    const savedPosition = getNewsScrollPosition('southeastAsia');
    if (savedPosition <= 0) return;

    // 重试机制：等列表 DOM 渲染完毕后再设 scrollTop
    let retries = 0;
    const tryRestore = () => {
      const container = document.querySelector('.news-content') as HTMLElement | null;
      if (!container) return;
      const maxScroll = container.scrollHeight - container.clientHeight;
      // 容器高度撑开后才设，否则设了也没用
      if (maxScroll >= savedPosition - 100 || retries > 10) {
        container.scrollTop = savedPosition;
        return;
      }
      retries++;
      requestAnimationFrame(tryRestore);
    };
    requestAnimationFrame(tryRestore);
  };

  const southeastAsiaNewsPageRequest = async (isReset: boolean) => {
    if (loadingRef.current) return;
    loadingRef.current = true;

    const pageNum = isReset ? 1 : southeastAsiaNewsPage;
    const param: SoutheastAsiaNewsPageReqType = { pageNum: pageNum, pageSize: 20 };
    const list: SoutheastAsiaNewsType[] = (await SoutheastAsiaNewsPage_Request(param)).data.records || [];

    if (list.length > 0) {
      if (isReset) {
        setSoutheastAsiaNewsPage(2);
        setSoutheastAsiaNewsList(list);
        setSoutheastAsiaNewsHasMore(true); // ← 请求完毕再开启，避免重复触发
        setNewsListCache('southeastAsia', list, 2, true);
      } else {
        const newPage = pageNum + 1;
        const newList = [...southeastAsiaNewsList, ...list];
        setSoutheastAsiaNewsPage(newPage);
        setSoutheastAsiaNewsList(newList);
        setSoutheastAsiaNewsHasMore(true);
        setNewsListCache('southeastAsia', newList, newPage, true);
      }
    } else {
      setSoutheastAsiaNewsHasMore(false);
      const cache = getNewsListCache('southeastAsia');
      if (cache) {
        setNewsListCache('southeastAsia', cache.data, cache.page, false);
      }
    }

    loadingRef.current = false;
  };

  const handleRefresh = async () => {
    setSoutheastAsiaNewsHasMore(false); // 先关闭，刷新完再由请求结果决定
    await southeastAsiaNewsPageRequest(true);
  };

  const SoutheastAsiaNewsScrollContent = ({ hasMore }: { hasMore?: boolean }) => {
    return (
      <>
        {hasMore ? (
          <div className="dot-loading-custom">
            <span>加载中</span>
            <DotLoading color='black' />
            <Skeleton.Title animated />
            <Skeleton.Paragraph lineCount={8} animated />
          </div>
        ) : (
          <div className="infinite-scroll-footer">
            <span>--- 我是有底线的 ---</span>
          </div>
        )}
      </>
    );
  };

  const click = (id: string) => {
    const container = document.querySelector('.news-content') as HTMLElement | null;
    if (container) {
      const maxScroll = container.scrollHeight - container.clientHeight;
      const scrollTop = container.scrollTop;
      const value = maxScroll - scrollTop <= 400 ? maxScroll : scrollTop;
      setNewsScrollPosition('southeastAsia', value);
    }
    navigate('/southeastAsia/' + id, { replace: true });
  };

  return (
    <>
      <InfiniteScroll
        loadMore={() => southeastAsiaNewsPageRequest(false)}
        hasMore={southeastAsiaNewsHasMore}
        threshold={50}
      >
        <div className="card-container">
          <PullToRefresh onRefresh={handleRefresh}>
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
                    {southeastAsiaNews.source && <span className="southeastasia-tag">来源: <span className="source"> {southeastAsiaNews.source} </span></span>}
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

          <SoutheastAsiaNewsScrollContent hasMore={southeastAsiaNewsHasMore} />
        </div>
      </InfiniteScroll>
    </>
  );
};

export default SoutheastAsia;