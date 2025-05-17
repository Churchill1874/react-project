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
  Ellipsis,
  Popup,
  Input,
  Button,
} from 'antd-mobile'
import '@/pages/message/Message.less'
import avatars from '@/common/avatar';
import {
  Request_SystemMessagePage,
  SystemMessagePageReqType,
  SystemMessagePageType,
  SystemMessagePageResponseType
} from '@/pages/message/api'
import dayjs from 'dayjs'
import PrivateChat from "@/components/privatechat/PrivateChat";
import NewsInfo from "@/components/news/newsinfo/NewsInfo";


const Message: React.FC = () => {
  // ws相关
  const [messages, setMessages] = useState<string[]>([]);

  //评论相关
  const [commentList, setCommentList] = useState<SystemMessagePageType[]>();
  const [commentPageNum, setCommentPageNum] = useState<number>(1);
  const [commentHasMore, setCommentHasMore] = useState<boolean>(true);
  const [visibleCloseRight, setVisibleCloseRight] = useState(false);
  const [commentId, setCommentId] = useState<string>();
  const [newsId, setNewsId] = useState<string>();
  const commentRef = useRef<any>(null);


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
        <Tabs.Tab title={'1' ? <Badge content={1} style={{ '--right': '-10px', '--top': '8px' }}>私信</Badge> : '私信'} key='private-message'>
          <PrivateChat />
        </Tabs.Tab>


        <Tabs.Tab
          title={'1'
            ? <Badge content={1} style={{ '--right': '-10px', '--top': '8px' }}>系统消息</Badge>
            : '系统消息'
          }
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
                    <span className="news-type">#{comment.sourceType === 1 ? '国内' : '东南亚'}</span>{" "}
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
                    <div className="find" onClick={() => { setCommentId(comment.commentId); setNewsId(comment.newsId); setVisibleCloseRight(true); console.log('正在点击的newsId是：', comment.newsId) }}>查看详情</div>
                  </div>
                </div>
              </Card>
            ))}

            <Popup className='news-record-popup' bodyStyle={{ display: 'flex', flexDirection: 'column', overflowY: 'auto', width: '100%', height: '100%' }}
              position='right'
              // closeOnSwipe={true} 
              closeOnMaskClick
              visible={visibleCloseRight}
              onClose={() => { setVisibleCloseRight(false); commentRef.current?.cleanState?.(); }}>

              <div className="popup-scrollable-content" >
                <NewsInfo
                  setVisibleCloseRight={setVisibleCloseRight}
                  id={newsId}
                  needCommentPoint={true}
                  commentPointId={commentId}
                  title={""}
                  content={""}
                  contentImagePath={""}
                  photoPath={""}
                  likesCount={0}
                  viewCount={0}
                  commentsCount={0}
                  createTime={null}
                  source={""}
                  commentRef={commentRef}
                />
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
