import { useState, useRef, useEffect } from "react";
import {
  Tabs,
  Badge,
  Card,
  Image,
  Divider,
  Avatar,
  DotLoading,
  PullToRefresh,
  InfiniteScroll,
  Popup
} from 'antd-mobile'
import '@/pages/message/Message.less'
import avatars from '@/common/avatar';
import {
  Request_SystemMessagePage,
  SystemMessagePageReqType,
  SystemMessagePageType
} from '@/pages/message/api'
import dayjs from 'dayjs'
import PrivateChat from "@/components/privatechat/PrivateChat";
import NewsInfo from "@/components/news/newsinfo/NewsInfo";
import SoutheastAsiaInfo from "@/components/southeastasia/southeastasiainfo/SoutheastAsiaInfo";
import PoliticsInfo from "@/components/politics/politicsinfo/PoliticsInfo";
import SocietyInfo from "@/components/society/societyinfo/SocietyInfo";
import TopicInfo from "@/components/topic/topicinfo/TopicInfo";
import PromotionInfo from "@/components/promotion/promotioninfo/PromotionInfo";
import { NewsTypeEnum } from '@/common/NewsTypeEnum';
import OtherPeople from "@/pages/otherpeople/otherpeople";
import useStore from "@/zustand/store";
import { FcComments, FcMediumPriority, FcVoicePresentation } from "react-icons/fc";


const Message: React.FC = () => {
  //点击头像
  const [otherInfoCloseRight, setOtherInfoCloseRight] = useState(false)
  const [otherPlayerId, setOtherPlayerId] = useState<string>()

  //系统消息
  const [systemMessageList, setSystemMessageList] = useState<SystemMessagePageType[]>([]);
  const [systemMessagePageNum, setSystemMessagePageNum] = useState<number>(1);
  const [systemMessageHasMore, setSystemMessageHasMore] = useState<boolean>(true);

  //评论相关
  const [commentList, setCommentList] = useState<SystemMessagePageType[]>();
  const [commentPageNum, setCommentPageNum] = useState<number>(1);
  const [commentHasMore, setCommentHasMore] = useState<boolean>(true);
  const [visibleCloseRight, setVisibleCloseRight] = useState(false);
  const [newsType, setNewsType] = useState<number>();
  const [commentId, setCommentId] = useState<string>();
  const [newsId, setNewsId] = useState<string>('0');
  const commentRef = useRef<any>(null);
  const [popupKey, setPopupKey] = useState(0);
  const [loadingSystemMessage, setLoadingSystemMessage] = useState<boolean>(false);
  const [loadingCommentMessage, setLoadingCommentMessage] = useState<boolean>(false);

  //菜单key
  const {
    messageTabKey,
    setMessageTabKey,
    privateMessageUnread,
    setPrivateMessageUnread,
    systemMessageUnread,
    setSystemMessageUnread,
    commentMessageUnread,
    setCommentMessageUnread
  } = useStore();

  // 获取评论数据
  const commentPageRequest = async (isReset: boolean) => {
    if (loadingCommentMessage) {
      return;
    }
    setLoadingCommentMessage(true)
    const pageNum = isReset ? 1 : commentPageNum;
    const param: SystemMessagePageReqType = { pageNum: pageNum, pageSize: 20, messageType: 2 };
    const list: SystemMessagePageType[] = (await Request_SystemMessagePage(param)).data.records || [];
    if (list.length > 0) {
      if (isReset) {
        setCommentPageNum(() => 2);
        setCommentList(list);
        setCommentHasMore(true);
      } else {
        if (JSON.stringify(list) !== JSON.stringify(commentList)) {
          setCommentPageNum(prev => (prev ?? 1) + 1)
          setCommentList([...(commentList ?? []), ...list])
          setCommentHasMore(true)
        } else {
          setCommentHasMore(false)
        }
      }
    } else {
      setCommentHasMore(false)
    }
    setLoadingCommentMessage(false)
  }

  // 获取系统信息数据
  const systemMessagePageRequest = async (isReset: boolean) => {
    if (loadingSystemMessage) {
      return;
    }
    setLoadingSystemMessage(true);
    const pageNum = isReset ? 1 : systemMessagePageNum;
    const param: SystemMessagePageReqType = { pageNum: pageNum, pageSize: 20, messageType: 1 };
    const list: SystemMessagePageType[] = (await Request_SystemMessagePage(param)).data.records || [];
    if (list.length > 0) {
      if (isReset) {
        setSystemMessagePageNum(() => 2);
        setSystemMessageList(list);
        setSystemMessageHasMore(true);
      } else {
        if (JSON.stringify(list) !== JSON.stringify(systemMessageList)) {
          setSystemMessagePageNum(prev => (prev ?? 1) + 1)
          setSystemMessageList([...(systemMessageList ?? []), ...list])
          setSystemMessageHasMore(true)
        } else {
          setSystemMessageHasMore(false)
        }
      }
    } else {
      setSystemMessageHasMore(false)
    }
    setLoadingSystemMessage(false);
  }

  const changeTabKey = (key: string) => {
    setMessageTabKey(key)

    if (key === 'system-message') {
      systemMessagePageRequest(true);
    }
    if (key === 'comment-message') {
      commentPageRequest(true);
    }
  }

  const SystemMessageScrollContent = ({ hasMore }: { hasMore?: boolean }) => {
    return (
      <>
        {hasMore ? (
          <div className="dot-loading-custom">
            <span>Loading</span>
            <DotLoading color='#fff' />
          </div>
        ) : (
          <span color='#fff'>--- 我是有底线的 ---</span>
        )}
      </>
    )
  }

  useEffect(() => {
    if (messageTabKey === 'private-message') {
      setPrivateMessageUnread(false)
    }
    if (messageTabKey === 'system-message') {
      setSystemMessageUnread(false)
    }
    if (messageTabKey === 'comment-message') {
      setCommentMessageUnread(false)
    }
  }, [messageTabKey])

  return (
    <>
      <Tabs className="message-tabs" activeLineMode='fixed' activeKey={messageTabKey} onChange={(key) => { changeTabKey(key) }}>
        {/*****************************************私信内容 *****************************************************/}
        <Tabs.Tab title={
          <div style={{ display: 'flex', justifyItems: 'center', alignItems: 'center' }}>
            {privateMessageUnread && <Badge content={Badge.dot} style={{ '--right': '-10px', '--top': '8px' }}></Badge>}
            私信 <span style={{ fontSize: '12px' }}>💬</span>
          </div>}
          key='private-message'>
          <PrivateChat />
        </Tabs.Tab>




        {/*****************************************系统消息内容 *****************************************************/}
        <Tabs.Tab
          title={
            <div style={{ display: 'flex', justifyItems: 'center' }}>
              {systemMessageUnread && <Badge content={Badge.dot} style={{ '--right': '-10px', '--top': '8px' }}></Badge>}
              系统消息<span style={{ fontSize: '12px' }}>📨</span>
            </div>
          }
          key='system-message'
        >
          {systemMessageList && systemMessageList.map((systemMessage, index) => (
            <Card className="message-custom-card" key={index}>
              <div className="card-content">
                {systemMessage.imagePath &&
                  <div className="message-news-image-container">
                    <Image
                      className="message-news-image"
                      //src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRrZq5wFJ_FtNWQQGdRkmXonQOEuMVpWuWm3w&s"
                      src={systemMessage.imagePath}
                      alt="Example"
                      fit="contain"
                    />
                  </div>
                }
                {systemMessage.title &&
                  <div className="message-text-title">
                    {systemMessage.title}
                  </div>
                }
                {systemMessage.content &&
                  <div className="message-text-area">
                    {systemMessage.avatar &&
                      <Avatar onClick={() => { setOtherInfoCloseRight(true); setOtherPlayerId(systemMessage.senderId) }} className="message-avatar" src={avatars[systemMessage.avatar]} />
                    }
                    {systemMessage.content}
                  </div>
                }
                <Divider className='message-line' />
                <div className="message-time">
                  {systemMessage.createTime}
                </div>
              </div>
            </Card>
          ))
          }

          <Popup className='news-record-popup' bodyStyle={{ display: 'flex', flexDirection: 'column', overflowY: 'auto', width: '100%', height: '100%' }}
            position='right'
            closeOnMaskClick
            visible={otherInfoCloseRight}
            onClose={() => { setOtherInfoCloseRight(false) }}>
            <OtherPeople setVisibleCloseRight={setOtherInfoCloseRight} otherPlayerId={otherPlayerId} />
          </Popup>

          <InfiniteScroll
            loadMore={() => systemMessagePageRequest(false)}
            hasMore={systemMessageHasMore}
          >
            <SystemMessageScrollContent hasMore={systemMessageHasMore} />
          </InfiniteScroll>

        </Tabs.Tab>




        {/*****************************************评论内 *****************************************************/}
        <Tabs.Tab
          title={<div style={{ display: 'flex', justifyItems: 'center' }}>
            {commentMessageUnread && <Badge content={Badge.dot} style={{ '--right': '-10px', '--top': '8px' }}></Badge>}
            评论
            <FcVoicePresentation style={{ marginLeft: '3px' }} fontSize={18} />
          </div>
          }
          key='comment-message'
        >
          <PullToRefresh onRefresh={() => commentPageRequest(true)}>
            {commentList && commentList.map((comment, index) => (

              <Card className="message-custom-card" key={index}>
                <div className="card-content">
                  <div className="message-title">
                    <span className="news-type">#{NewsTypeEnum(comment.infoType)}</span>{" "}
                    {comment.title}
                  </div>
                  <div className="message-text-area">
                    <span className="message-chat-item">
                      <Avatar className="avatar" src={avatars[comment.avatar]} />
                      <span className="message-content">
                        <span>
                          {comment.createName}
                          <span className="reply"> 回复了你的评论: </span>
                        </span>
                        <span className="comment">{comment.comment}</span>
                      </span>
                    </span>
                    <span className="reply-content">
                      <span className="reply"> 回复内容:</span> {comment.content}
                    </span>
                  </div>
                  <Divider className='message-line' />
                  <div className="message-bottom">
                    <div className="message-time">
                      {dayjs(comment.createTime).format('YYYY-MM-DD HH:mm')}
                    </div>
                    <div className="find" onClick={() => {
                      setCommentId(comment.commentId);
                      setNewsType(comment.infoType);
                      setNewsId(comment.newsId);
                      setVisibleCloseRight(true);
                      setPopupKey(prev => prev + 1); // ⭐️ 强制 popup 内容刷新
                      console.log('正在点击的newsId是：', comment.newsId, 'newsType是:', comment.infoType, "popupKey:", popupKey)
                    }}>查看详情</div>
                  </div>
                </div>
              </Card>
            ))}

            <Popup className='news-record-popup' bodyStyle={{ display: 'flex', flexDirection: 'column', overflowY: 'auto', width: '100%', height: '100%' }}
              key={popupKey}
              position='right'
              // closeOnSwipe={true} 
              closeOnMaskClick
              visible={visibleCloseRight}
              onClose={() => { setVisibleCloseRight(false); commentRef.current?.cleanState?.(); }}>

              <div className="popup-scrollable-content" >
                {
                  newsType === 1 &&
                  <NewsInfo
                    setVisibleCloseRight={setVisibleCloseRight}
                    id={newsId}
                    needCommentPoint={true}
                    commentPointId={commentId}
                    commentRef={commentRef}
                  />
                }
                {
                  newsType === 2 &&
                  <SoutheastAsiaInfo
                    setVisibleCloseRight={setVisibleCloseRight}
                    id={newsId}
                    needCommentPoint={true}
                    commentPointId={commentId}
                    commentRef={commentRef}
                  />
                }
                {
                  newsType === 3 &&
                  <PoliticsInfo
                    setVisibleCloseRight={setVisibleCloseRight}
                    id={newsId}
                    needCommentPoint={true}
                    commentPointId={commentId}
                    commentRef={commentRef}
                  />
                }
                {
                  newsType === 4 &&
                  <SocietyInfo
                    setVisibleCloseRight={setVisibleCloseRight}
                    id={newsId}
                    needCommentPoint={true}
                    commentPointId={commentId}
                    commentRef={commentRef}
                  />
                }
                {
                  newsType === 5 &&
                  <PromotionInfo
                    setVisibleCloseRight={setVisibleCloseRight}
                    id={newsId}
                    needCommentPoint={true}
                    commentPointId={commentId}
                    commentRef={commentRef}
                  />
                }
                {
                  newsType === 6 &&
                  <TopicInfo
                    setVisibleCloseRight={setVisibleCloseRight}
                    id={newsId}
                    needCommentPoint={true}
                    commentPointId={commentId}
                    commentRef={commentRef}
                  />
                }
              </div>
            </Popup>

          </PullToRefresh>

          <InfiniteScroll
            loadMore={() => commentPageRequest(false)}
            hasMore={commentHasMore}
          >
            <SystemMessageScrollContent hasMore={commentHasMore} />
          </InfiniteScroll>
        </Tabs.Tab>
      </Tabs>
    </>
  );
}

export default Message;
