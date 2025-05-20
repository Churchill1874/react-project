import { useState } from "react";
import { Card, Divider, Tag, Ellipsis, Image, Popup, Toast, PullToRefresh, InfiniteScroll, DotLoading } from 'antd-mobile';
import { FcReading, FcLike } from "react-icons/fc";
import { MessageOutline, LeftOutline, HeartOutline, LocationFill } from 'antd-mobile-icons';
import '@/components/politics/politics.less'
import { PoliticsPage_Request, PoliticsPageReqType, PoliticsType } from '@/components/politics/api'
import dayjs from 'dayjs'
import PoliticsInfo from '@/components/politics/politicsinfo/PoliticsInfo'

import { Request_IncreaseLikesCount } from '@/components/news/newsinfo/api';



const Politics: React.FC = () => {
  const [visibleCloseRight, setVisibleCloseRight] = useState(false)
  const [popupInfo, setPopupInfo] = useState<Politics>({ id: null, imagePath: '', viewCount: 0, likesCount: 0, commentsCount: 0, country: "", content: "", createTime: '', newsStatus: '', source: "", title: "" });
  const [politicsList, setPoliticsList] = useState<PoliticsType[]>([]);
  const [politicsHasHore, setPoliticsHasHore] = useState<boolean>(true);
  const [politicsPage, setPoliticsPage] = useState<number>(1);
  const [likesIdList, setLikesIdList] = useState<number[]>([]);

  interface Politics {
    id: any | null;
    imagePath: any | null; //图片路径
    viewCount: any | null; // 读取次数
    likesCount: any | null;
    commentsCount: any | null; //评论数量
    country: any | null; //地区
    content: any | null; //新闻内容
    createTime: any | null;
    newsStatus: any | null;//新闻状态
    source: any | null;
    title: any | null;
  }


  const showPopupInfo = (id, imagePath, viewCount, likesCount, commentsCount, country, content, createTime, newsStatus, source, title) => {
    setVisibleCloseRight(true)
    setPopupInfo({ id, imagePath, viewCount, likesCount, commentsCount, country, content, createTime, newsStatus, source, title })
  }


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
      if (resp.data.value) {
        setPopupInfo((prev) => {
          if (!prev) return prev;
          return { ...prev, likesCount: (prev.likesCount || 0) + 1 }
        })
      }
    } else {
      Toast.show({
        content: '网络异常,请稍后重试',
        duration: 600,
      })
    }
  }

  //获取api东南亚新闻数据
  const politicsPageRequest = async (isReset: boolean) => {
    const pageNum = isReset ? 1 : politicsPage;
    const param: PoliticsPageReqType = { pageNum: pageNum, pageSize: 20 };
    const list: PoliticsType[] = (await PoliticsPage_Request(param)).data.records || [];
    //循环便利
    if (list.length > 0) {
      if (isReset) {
        setPoliticsPage(() => 2);
        setPoliticsList(list);
        setPoliticsHasHore(true);
      } else {
        if (JSON.stringify(list) !== JSON.stringify(politicsList)) {
          setPoliticsPage(prev => (prev + 1))
          setPoliticsList([...politicsList, ...list])
          setPoliticsHasHore(true)
        } else {
          setPoliticsHasHore(false)
        }
      }
    } else {
      setPoliticsHasHore(false)
    }

  }

  const PoliticsScrollContent = ({ hasMore }: { hasMore?: boolean }) => {
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
        <PullToRefresh onRefresh={() => politicsPageRequest(true)}>
          {politicsList?.map((politics, index) => (
            <Card className="politics-custom-card" key={index}>
              <div className="politics-card-content">

                {politics.title &&
                  <div className="politics-title">
                    <Ellipsis direction='end' rows={2} content={politics.title} />
                  </div>
                }
                <Divider className='divider-line' />
                {politics.imagePath &&
                  <div className="politics-image-container">
                    <Image
                      className="politics-image"
                      src={politics.imagePath}
                      alt="Example"
                      fit="contain"
                    />
                  </div>
                }

                <Ellipsis direction='end' rows={2} content={politics.content} style={{ fontSize: "14px", textIndent: "2em" }} />

                <div className="politics-meta">
                  <span className="politics-tag">
                    {politics.newsStatus == 2 && <Tag className="tag-size" color='#a05d29'>置顶</Tag>}
                    {politics.newsStatus == 3 && <Tag className="tag-size" color='red' fill='outline'>热门</Tag>}
                  </span>

                  {politics.source &&
                    <span className="politics-tag" > 来源:
                      <span className="source">
                        <span className="tracking">
                          <LocationFill className="area" /> {politics.country}
                        </span>
                        <span className="source-inner">
                          {politics.source}
                        </span>

                      </span>
                      <span className="politics-time">
                        {politics.createTime && dayjs(politics.createTime).format('YYYY-MM-DD HH:mm')}
                      </span>

                    </span>
                  }
                </div>


                <Divider className='divider-line' />

                <div className="button-info">

                  <span className="tracking">
                    <span className="icon-and-text">
                      <FcReading fontSize={17} />
                      <span className="number"> {politics.viewCount} </span>
                    </span>
                  </span>


                  <span className="tracking">
                    <span className="icon-and-text">
                      <FcLike className='attribute-icon' fontSize={15} onClick={clickLikes} />
                      <span className="number"> {politics?.likesCount || 0} </span>
                    </span>
                  </span>


                  <span className="tracking">
                    <span className="icon-and-text">
                      <MessageOutline fontSize={17} />
                      <span className="message-number"> {politics.commentsCount} </span>
                      <span className="click"
                        onClick={() => {
                          showPopupInfo(
                            politics.id,
                            politics.imagePath,
                            politics.viewCount,
                            politics.likesCount,
                            politics.commentsCount,
                            politics.country,
                            politics.content,
                            politics.createTime,
                            politics.newsStatus,
                            politics.source,
                            politics.title)
                        }}>点击查看</span>
                    </span>
                  </span>
                </div>
              </div>
            </Card>
          ))}
        </PullToRefresh>

        <InfiniteScroll loadMore={() => politicsPageRequest(false)} hasMore={politicsHasHore}>
          <PoliticsScrollContent hasMore={politicsHasHore} />
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
          <PoliticsInfo commentRef={null} id={popupInfo.id} setVisibleCloseRight={setVisibleCloseRight} needCommentPoint={false} commentPointId={null} />
        </div >
      </Popup >
    </>
  );
}



export default Politics;