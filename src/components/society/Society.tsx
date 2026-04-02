import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { Card, Divider, Tag, Ellipsis, Image, PullToRefresh, InfiniteScroll, DotLoading, Skeleton } from 'antd-mobile';

import { FcReading } from "react-icons/fc";
import { MessageOutline, LocationFill } from 'antd-mobile-icons';
import '@/components/society/Society.less'
import { SocietyPageReqType, SocietyType, SocietyPage_Request } from '@/components/society/api'
import dayjs from 'dayjs'
import { getImgUrl } from "@/utils/commentUtils";
import useStore from '@/zustand/store';

const Society: React.FC = () => {
  const navigate = useNavigate();
  const { getNewsListCache, setNewsListCache, setNewsScrollPosition, getNewsScrollPosition, getLastReadItemId, setLastReadItemId } = useStore();
  const [societyList, setSocietyList] = useState<SocietyType[]>(() => {
    // 从 zustand 缓存恢复数据
    const cache = getNewsListCache('society');
    return cache ? cache.data : [];
  });
  const [societyHasHore, setSocietyHasHore] = useState<boolean>(() => {
    // 从 zustand 缓存恢复加载状态
    const cache = getNewsListCache('society');
    return cache ? cache.hasMore : false;
  });
  const [societyPage, setSocietyPage] = useState<number>(() => {
    // 从 zustand 缓存恢复页码
    const cache = getNewsListCache('society');
    return cache ? cache.page : 1;
  });

  // 组件挂载时，如果没有缓存数据就加载第一页
  useEffect(() => {
    if (societyList.length === 0) {
      societyPageRequest(true);
    }
  }, []);

  // 组件数据加载或列表变化后，从上次阅读 id 恢复位置
  useEffect(() => {
    const lastId = getLastReadItemId('society');
    const container = document.querySelector('.news-content') as HTMLElement | null;

    if (container) {
      // 如果滚动位置已缓存并且在接近底部，直接恢复到底部，避免跳到条目上方不准的情况。
      const savedPosition = getNewsScrollPosition('society');
      const maxScroll = container.scrollHeight - container.clientHeight;
      if (savedPosition > 0 && maxScroll - savedPosition <= 400) {
        container.scrollTop = maxScroll;
        setLastReadItemId('society', null);
        return;
      }
    }

    if (!lastId) return;

    const scrollToItem = () => {
      const el = document.querySelector(`.society-item[data-id="${lastId}"]`) as HTMLElement | null;
      const container = document.querySelector('.news-content') as HTMLElement | null;
      if (el && container) {
        const target = Math.max(0, el.offsetTop - 20);
        container.scrollTop = target;
        setLastReadItemId('society', null);
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
  }, [societyList, getNewsListCache, getLastReadItemId, getNewsScrollPosition, setLastReadItemId]);


  //获取api东南亚新闻数据
  const societyPageRequest = async (isReset: boolean) => {
    const pageNum = isReset ? 1 : societyPage;
    const param: SocietyPageReqType = { pageNum: pageNum, pageSize: 20 };
    const list: SocietyType[] = (await SocietyPage_Request(param)).data.records || [];


    //循环便利
    if (list.length > 0) {
      if (isReset) {
        setSocietyPage(() => 2);
        setSocietyList(list);
        setSocietyHasHore(true);
        
        // 缓存数据到 zustand
        setNewsListCache('society', list, 2, true);
      } else {
        if (JSON.stringify(list) !== JSON.stringify(societyList.slice(-list.length))) {
          const newPage = pageNum + 1;
          const newList = [...societyList, ...list];
          setSocietyPage(newPage);
          setSocietyList(newList);
          setSocietyHasHore(true);
          
          // 缓存数据到 zustand
          setNewsListCache('society', newList, newPage, true);
        } else {
          setSocietyHasHore(false);
          // 更新缓存的hasMore状态
          const cache = getNewsListCache('society');
          if (cache) {
            setNewsListCache('society', cache.data, cache.page, false);
          }
        }
      }
    } else {
      setSocietyHasHore(false);
      // 更新缓存的hasMore状态
      const cache = getNewsListCache('society');
      if (cache) {
        setNewsListCache('society', cache.data, cache.page, false);
      }
    }

  }

  const SocietyScrollContent = ({ hasMore }: { hasMore?: boolean }) => {
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
      setNewsScrollPosition('society', value);

      if (isNearBottom) {
        // 末尾深位时直接恢复到底部，不再定位具体 element
        setLastReadItemId('society', null);
      } else {
        setLastReadItemId('society', id);
      }
    } else {
      setLastReadItemId('society', id);
    }

    navigate('/society/' + id, { replace: true });
  }

  return (
    <>
      <InfiniteScroll
        loadMore={() => societyPageRequest(false)}
        hasMore={societyHasHore}
        threshold={50}
      >
        <div className="card-container" >
          <PullToRefresh onRefresh={() => societyPageRequest(true)}>
            {societyList?.map((society, index) => (
              <Card className="society-custom-card" key={index} data-id={society.id}>
                <div className="society-card-content">

                  {society.title &&
                    <div className="society-title">
                      <Ellipsis direction='end' rows={2} content={society.title} />
                    </div>
                  }

                  {society.videoCover &&
                    <div className="society-news-image-container">
                      <video className="society-news-video" src={getImgUrl(society.videoPath)} controls poster={getImgUrl(society.videoCover)} />
                    </div>
                  }
                  {!society.videoCover && society.imagePath &&
                    <div className="society-news-image-container">
                      <Image
                        className="society-news-image"
                        src={getImgUrl(society.imagePath)}
                        alt="Example"
                        fit="contain"
                      />
                    </div>
                  }

                  {/*                 {(society.imagePath || society.videoCover) &&
                  <Divider className='divider-line' />
                } */}

                  {/* <Ellipsis direction='end' rows={2} content={society.content} style={{ fontSize: "14px", letterSpacing: "1px", textIndent: "2em" }} />
 */}
                  <span className="society-time">

                    {society.isTop && <Tag className="society-tag" color='#a05d29'>置顶</Tag>}
                    {society.isHot && <Tag className="society-tag" color='red' fill='outline'>热门</Tag>}
                    {/* {society.source && <span className="society-tag" >来源: <span className="source"> {society.source} </span></span>} */}
                    {<span className="society-tag" > 类型: <span className="source">  {society?.videoCover ? '视频' : '图片'} </span></span>}
                    {society.createTime && dayjs(society.createTime).format('YYYY-MM-DD HH:mm')}

                  </span>



                  <div className="society-button-info">
                    <span className="tracking"><LocationFill className="area" />{society.area}</span>
                    <span className="icon-and-text">
                      <FcReading fontSize={17} />
                      <span className="number"> {society.viewCount} </span>
                    </span>

                    <span className="tracking">
                      <span className="icon-and-text">
                        <MessageOutline fontSize={17} />
                        <span className="message-number"> {society.commentsCount} </span>
                        <span className="click"
                          onClick={() => click(String(society.id))}>点击查看</span>
                      </span>
                    </span>
                  </div>
                </div>
                <Divider className='divider-line' />
              </Card>
            ))}
          </PullToRefresh>


          <SocietyScrollContent hasMore={societyHasHore} />

        </div>
      </InfiniteScroll>
    </>
  );
}

export default Society;