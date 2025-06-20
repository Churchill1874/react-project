import { useState, useRef } from "react";
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


const Message: React.FC = () => {
  // ws相关
  const [messages, setMessages] = useState<string[]>([]);

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


  // 获取评论数据
  const commentPageRequest = async (isReset: boolean) => {
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
  return (
    <>
      <Tabs className="message-tabs" activeLineMode='fixed'>
        <Tabs.Tab title={'2' ? <Badge content={'~'} style={{ '--right': '-10px', '--top': '8px' }}>私信</Badge> : '私信'} key='private-message'>
          <PrivateChat />
        </Tabs.Tab>

        <Tabs.Tab
          title={'`' ? <Badge content={1} style={{ '--right': '-10px', '--top': '8px' }}>系统消息</Badge> : '系统消息'}
          key='system-message'
        >
          <Card className="message-custom-card">
            <div className="card-content">
              <div className="message-news-image-container">
                <Image
                  className="message-news-image"
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRrZq5wFJ_FtNWQQGdRkmXonQOEuMVpWuWm3w&s"
                  alt="Example"
                  fit="contain"
                />
              </div>
              <div className="message-text-area">
                标题
              </div>
              <div className="message-text-area">
                内容内容内容内容内容内容内容内容内容内容内容内容
              </div>
              <Divider className='message-line' />
              <div className="message-time">
                2025-01-01 10:15
              </div>
            </div>
          </Card>

          <Card className="message-custom-card">
            <div className="card-content">
              <div className="message-text-area">
                内容内容内容内容内容内容内容内容内容内容内容内容
              </div>
              <Divider className='message-line' />
              <div className="message-time">
                2025-01-01 10:15
              </div>
            </div>
          </Card>

          <Card className="message-custom-card">
            <div className="card-content">
              <div className="message-text-area">
                内容内容内容内容内容内容内容内容内容内容内容内容
              </div>
              <Divider className='message-line' />
              <div className="message-time">
                2025-01-01 10:15
              </div>
            </div>
          </Card>
        </Tabs.Tab>


        <Tabs.Tab
          title={'1'
            ? <Badge content={1} style={{ '--right': '-10px', '--top': '8px' }}>收到的评论</Badge>
            : '评论'
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
                      <Avatar className="avatar" src={avatars[1]} />
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
