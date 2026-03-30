import { useState } from "react";
import { useNavigate } from 'react-router-dom';  // ← 加这一行
import { Card, Divider, Tag, Ellipsis, Image, Popup, PullToRefresh, InfiniteScroll, DotLoading, Skeleton } from 'antd-mobile';
import { getImgUrl } from "@/utils/commentUtils";
import { FcReading } from "react-icons/fc";
import { MessageOutline, LocationFill } from 'antd-mobile-icons';
import '@/components/southeastasia/SoutheastAsia.less'
import { SoutheastAsiaNewsPageReqType, SoutheastAsiaNewsType, SoutheastAsiaNewsPage_Request } from '@/components/southeastasia/api'
import dayjs from 'dayjs'


const SoutheastAsia: React.FC = () => {
  const navigate = useNavigate();
  const [southeastAsiaNewsList, setSoutheastAsiaNewsList] = useState<SoutheastAsiaNewsType[]>([]);
  const [southeastAsiaNewsHasHore, setSoutheastAsiaNewsHasHore] = useState<boolean>(true);
  const [southeastAsiaNewsPage, setSoutheastAsiaNewsPage] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);



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
      } else {
        if (JSON.stringify(list) !== JSON.stringify(southeastAsiaNewsList)) {
          setSoutheastAsiaNewsPage(prev => (prev + 1))
          setSoutheastAsiaNewsList([...southeastAsiaNewsList, ...list])
          setSoutheastAsiaNewsHasHore(true)
        } else {
          setSoutheastAsiaNewsHasHore(false)
        }
      }
    } else {
      setSoutheastAsiaNewsHasHore(false)
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
              <DotLoading color='#fff' />
              <Skeleton.Title animated />
              <Skeleton.Paragraph lineCount={8} animated />

            </div>
          </>
        ) : (
          <div className="infinite-scroll-footer" style={{ backgroundColor: 'white' }}>
            <span >--- 我是有底线的 ---</span>
          </div>
        )}
      </>
    )
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
              <Card className="southeastasia-custom-card" key={index}>
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
                          onClick={() => navigate('/southeastAsia/' + southeastAsiaNews.id)}
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