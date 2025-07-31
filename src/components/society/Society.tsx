import { useState } from "react";
import { Card, Divider, Tag, Ellipsis, Image, Popup, PullToRefresh, InfiniteScroll, DotLoading, Skeleton } from 'antd-mobile';

import { FcReading } from "react-icons/fc";
import { MessageOutline, LocationFill } from 'antd-mobile-icons';
import '@/components/society/Society.less'
import { SocietyPageReqType, SocietyType, SocietyPage_Request } from '@/components/society/api'
import SocietyInfo from "@/components/society/societyinfo/SocietyInfo";
import dayjs from 'dayjs'

type PopupInfo = {
  id: any | null;
  imagePath: any | null; //图片路径
  videoPath: any | null;
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

const Society: React.FC = () => {
  const [visibleCloseRight, setVisibleCloseRight] = useState(false)
  const [popupInfo, setPopupInfo] = useState<PopupInfo>({ id: null, area: "", content: "", viewCount: 0, commentsCount: 0, imagePath: '', videoPath: '', createTime: '', isHot: false, isTop: false, source: "", title: "" });

  const [societyList, setSocietyList] = useState<SocietyType[]>([]);
  const [societyHasHore, setSocietyHasHore] = useState<boolean>(true);
  const [societyPage, setSocietyPage] = useState<number>(1);

  const showPopupInfo = (id, area, content, viewCount, commentsCount, imagePath, videoPath, createTime, isHot, isTop, source, title) => {
    setVisibleCloseRight(true)
    setPopupInfo({ id, area, content, viewCount, commentsCount, imagePath, videoPath, createTime, isHot, isTop, source, title })
  }


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
      } else {
        if (JSON.stringify(list) !== JSON.stringify(societyList)) {
          setSocietyPage(prev => (prev + 1))
          setSocietyList([...societyList, ...list])
          setSocietyHasHore(true)
        } else {
          setSocietyHasHore(false)
        }
      }
    } else {
      setSocietyHasHore(false)
    }

  }

  const SocietyScrollContent = ({ hasMore }: { hasMore?: boolean }) => {
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
          <div className="infinite-scroll-footer">
            <span >--- 我是有底线的 ---</span>
          </div>
        )}
      </>
    )
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
              <Card className="society-custom-card" key={index}>
                <div className="society-card-content">

                  {society.title &&
                    <div className="society-title">
                      <Ellipsis direction='end' rows={2} content={society.title} />
                    </div>
                  }

                  {society.videoCover &&
                    <div className="society-news-image-container">
                      <video className="society-news-video" src="/1.mp4" controls poster={society.videoCover} />
                    </div>
                  }
                  {!society.videoCover && society.imagePath &&
                    <div className="society-news-image-container">
                      <Image
                        className="society-news-image"
                        src={society.imagePath}
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

                  <Divider className='divider-line' />

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
                          onClick={() => {
                            showPopupInfo(
                              society.id, society.area, society.content, society.viewCount,
                              society.commentsCount, society.imagePath, society.videoPath,
                              society.createTime, society.isHot, society.isTop, society.source, society.title
                            )
                          }}>点击查看</span>
                      </span>
                    </span>
                  </div>
                </div>
              </Card>
            ))}
          </PullToRefresh>


          <SocietyScrollContent hasMore={societyHasHore} />

        </div>
      </InfiniteScroll>

      {/********************新闻点击弹窗详情********************/}
      <Popup className='news-record-popup' bodyStyle={{ display: 'flex', flexDirection: 'column', overflowY: 'auto', width: '100%', height: '100%' }}
        position='right'
        closeOnSwipe={true}
        closeOnMaskClick
        visible={visibleCloseRight}
        onClose={() => { setVisibleCloseRight(false) }}>

        <div className="popup-scrollable-content" >
          <SocietyInfo commentRef={null} id={popupInfo.id} setVisibleCloseRight={setVisibleCloseRight} needCommentPoint={false} commentPointId={null} />
        </div>

      </Popup>
    </>
  );
}



export default Society;