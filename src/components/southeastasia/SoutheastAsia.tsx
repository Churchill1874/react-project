import { useState } from "react";
import { Card, Divider, Tag, Ellipsis, Image, Popup, PullToRefresh, InfiniteScroll, DotLoading } from 'antd-mobile';

import { FcReading } from "react-icons/fc";
import { MessageOutline, LocationFill } from 'antd-mobile-icons';
import '@/components/southeastasia/SoutheastAsia.less'
import { SoutheastAsiaNewsPageReqType, SoutheastAsiaNewsType, SoutheastAsiaNewsPage_Request } from '@/components/southeastasia/api'
import SoutheastAsiaInfo from "@/components/southeastasia/southeastasiainfo/SoutheastAsiaInfo";
import dayjs from 'dayjs'

type PopupInfo = {
  id: any | null;
  imagePath: any | null; //图片路径
  viewCount: any | null; // 读取次数
  commentsCount: any | null; //评论数量
  area: any | null; //地区
  content: any | null; //新闻内容
  createTime: any | null;
  isHot: any | null;//热门
  isTop: any | null;//置顶
  source: any | null;
  title: any | null;
}

type CommentAttribute = {
  needCommentPoint?: boolean;
  commentPointId?: string | null;
}

type SoutheastAsiaType = PopupInfo & CommentAttribute;


const Company: React.FC<SoutheastAsiaType & { commentRef: any }> = (props) => {
  const [visibleCloseRight, setVisibleCloseRight] = useState(false)
  const [popupInfo, setPopupInfo] = useState<PopupInfo>({ id: null, area: "", content: "", viewCount: 0, commentsCount: 0, imagePath: '', createTime: '', isHot: false, isTop: false, source: "", title: "" });

  const [southeastAsiaNewsList, setSoutheastAsiaNewsList] = useState<SoutheastAsiaNewsType[]>([]);
  const [southeastAsiaNewsHasHore, setSoutheastAsiaNewsHasHore] = useState<boolean>(true);
  const [southeastAsiaNewsPage, setSoutheastAsiaNewsPage] = useState<number>(1);


  const showPopupInfo = (id, area, content, viewCount, commentsCount, imagePath, createTime, isHot, isTop, source, title) => {
    setVisibleCloseRight(true)
    setPopupInfo({ id, area, content, viewCount, commentsCount, imagePath, createTime, isHot, isTop, source, title })
  }


  //获取api东南亚新闻数据
  const southeastAsiaNewsPageRequest = async (isReset: boolean) => {
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

  }

  const SoutheastAsiaNewsScrollContent = ({ hasMore }: { hasMore?: boolean }) => {
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

  return (
    <>
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
                      src={southeastAsiaNews.imagePath}
                      alt="Example"
                      fit="contain"
                    />
                  </div>
                }

                {southeastAsiaNews.imagePath &&
                  <Divider className='divider-line' />
                }


                <Ellipsis direction='end' rows={2} content={southeastAsiaNews.content} style={{ fontSize: "14px", letterSpacing: "1px", textIndent: "2em" }} />

                <span className="southeastasia-time">

                  {southeastAsiaNews.isTop && <Tag className="southeastasia-tag" color='#a05d29'>置顶</Tag>}
                  {southeastAsiaNews.isHot && <Tag className="southeastasia-tag" color='red' fill='outline'>热门</Tag>}
                  {southeastAsiaNews.source && <span className="southeastasia-tag" >来源: <span className="source"> {southeastAsiaNews.source} </span></span>}
                  {southeastAsiaNews.createTime && dayjs(southeastAsiaNews.createTime).format('YYYY-MM-DD HH:mm')}

                </span>

                <Divider className='divider-line' />

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
                        onClick={() => {
                          showPopupInfo(southeastAsiaNews.id, southeastAsiaNews.area, southeastAsiaNews.content,
                            southeastAsiaNews.viewCount, southeastAsiaNews.commentsCount, southeastAsiaNews.imagePath,
                            southeastAsiaNews.createTime, southeastAsiaNews.isHot, southeastAsiaNews.isTop,
                            southeastAsiaNews.source, southeastAsiaNews.title)
                        }}>点击查看</span>
                    </span>
                  </span>
                </div>
              </div>
            </Card>
          ))}
        </PullToRefresh>

        <InfiniteScroll loadMore={() => southeastAsiaNewsPageRequest(false)} hasMore={southeastAsiaNewsHasHore}>
          <SoutheastAsiaNewsScrollContent hasMore={southeastAsiaNewsHasHore} />
        </InfiniteScroll>
      </div>


      {/********************新闻点击弹窗详情********************/}
      <Popup className='news-record-popup' bodyStyle={{ display: 'flex', flexDirection: 'column', overflowY: 'auto', width: '100%', height: '100%' }}
        position='right'
        closeOnSwipe={true}
        closeOnMaskClick
        visible={visibleCloseRight}
        onClose={() => { setVisibleCloseRight(false) }}>

        <div className="popup-scrollable-content" >
          <SoutheastAsiaInfo commentRef={null} id={popupInfo.id} setVisibleCloseRight={setVisibleCloseRight} needCommentPoint={false} commentPointId={null} />
        </div>

      </Popup>
    </>
  );
}



export default Company;