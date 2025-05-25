import { useState } from "react";
import { Card, Divider, Tag, Ellipsis, Image, Popup, PullToRefresh, InfiniteScroll, DotLoading } from 'antd-mobile';

import { FcReading } from "react-icons/fc";
import { MessageOutline, LocationFill } from 'antd-mobile-icons';
import '@/components/topic/Topic.less'
import { TopicPageReqType, TopicType, TopicPage_Request } from '@/components/topic/api'
import TopicInfo from "@/components/topic/topicinfo/TopicInfo";
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
  type: any | null;
  title: any | null;
}

const Topic: React.FC = () => {
  const [visibleCloseRight, setVisibleCloseRight] = useState(false)
  const [popupInfo, setPopupInfo] = useState<PopupInfo>({ id: null, area: "", content: "", viewCount: 0, commentsCount: 0, imagePath: '', videoPath: '', createTime: '', isHot: false, isTop: false, type: "", title: "" });

  const [topicList, setTopicList] = useState<TopicType[]>([]);
  const [topicHasHore, setTopicHasHore] = useState<boolean>(true);
  const [topicPage, setTopicPage] = useState<number>(1);

  const showPopupInfo = (id, area, content, viewCount, commentsCount, imagePath, videoPath, createTime, isHot, isTop, type, title) => {
    setVisibleCloseRight(true)
    setPopupInfo({ id, area, content, viewCount, commentsCount, imagePath, videoPath, createTime, isHot, isTop, type, title })
  }


  //获取api东南亚新闻数据
  const topicPageRequest = async (isReset: boolean) => {
    const pageNum = isReset ? 1 : topicPage;
    const param: TopicPageReqType = { pageNum: pageNum, pageSize: 20 };
    const list: TopicType[] = (await TopicPage_Request(param)).data.records || [];


    //循环便利
    if (list.length > 0) {
      if (isReset) {
        setTopicPage(() => 2);
        setTopicList(list);
        setTopicHasHore(true);
      } else {
        if (JSON.stringify(list) !== JSON.stringify(topicList)) {
          setTopicPage(prev => (prev + 1))
          setTopicList([...topicList, ...list])
          setTopicHasHore(true)
        } else {
          setTopicHasHore(false)
        }
      }
    } else {
      setTopicHasHore(false)
    }

  }

  const TopicScrollContent = ({ hasMore }: { hasMore?: boolean }) => {
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
        <PullToRefresh onRefresh={() => topicPageRequest(true)}>
          {topicList?.map((topic, index) => (
            <Card className="topic-custom-card"
              key={index}
              onClick={() => {
                showPopupInfo(
                  topic.id, topic.area, topic.content, topic.viewCount,
                  topic.commentsCount, topic.imagePath, topic.videoPath,
                  topic.createTime, topic.isHot, topic.isTop, topic.type, topic.title
                )
              }}>
              <div className="topic-card-content">

                {topic.title &&
                  <div className="topic-title">
                    <Ellipsis direction='end' rows={2} content={topic.title} />
                  </div>
                }

                {topic.videoCover &&
                  <div className="topic-news-image-container">
                    <video className="topic-news-video" src="/1.mp4" controls poster={topic.videoCover} />
                  </div>
                }
                {!topic.videoCover && topic.imagePath &&
                  <div className="topic-news-image-container">
                    <Image
                      className="topic-news-image"
                      src={topic.imagePath}
                      alt="Example"
                      fit="contain"
                    />
                  </div>
                }

                <span className="topic-time">

                  {topic.isTop && <Tag className="topic-tag" color='#a05d29'>置顶</Tag>}
                  {topic.isHot && <Tag className="topic-tag" color='red' fill='outline'>热门</Tag>}
                  {/* {topic.source && <span className="topic-tag" >来源: <span className="source"> {topic.source} </span></span>} */}
                  {<span className="topic-tag" > 类型: <span className="source">  {topic.type} </span></span>}
                  {topic.createTime && dayjs(topic.createTime).format('YYYY-MM-DD HH:mm')}

                </span>

                <Divider className='divider-line' />

                <div className="topic-button-info">
                  <span className="icon-and-text">
                    <FcReading fontSize={17} />
                    <span className="number"> {topic.viewCount} </span>
                  </span>

                  <span className="icon-and-text">
                    <MessageOutline fontSize={17} />
                    <span className="message-number"> {topic.commentsCount} </span>
                  </span>


                </div>
              </div>
            </Card>
          ))}
        </PullToRefresh>

        <InfiniteScroll loadMore={() => topicPageRequest(false)} hasMore={topicHasHore}>
          <TopicScrollContent hasMore={topicHasHore} />
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
          <TopicInfo commentRef={null} id={popupInfo.id} setVisibleCloseRight={setVisibleCloseRight} needCommentPoint={false} commentPointId={null} />
        </div>

      </Popup>
    </>
  );
}



export default Topic;