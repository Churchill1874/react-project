import { useState } from "react";
import { Tabs, Badge, Card, Image, Divider, Avatar, DotLoading, PullToRefresh, InfiniteScroll, Ellipsis } from 'antd-mobile'
import '@/pages/message/Message.less'
import { FcReading, } from "react-icons/fc";
import { MessageOutline, LeftOutline, MessageFill, ClockCircleOutline } from 'antd-mobile-icons';
import avatars from '@/common/avatar';
import { Request_SystemMessagePage, SystemMessagePageReqType, SystemMessagePageType, SystemMessagePageResponseType } from '@/pages/message/api'
import dayjs from 'dayjs'



const Message: React.FC = () => {

  const [commentList, setCommentList] = useState<SystemMessagePageType[]>();
  const [commentPageNum, setCommentPageNum] = useState<number>(1);
  const [commentHasMore, setCommentHasMore] = useState<boolean>(true);


  //获取api东南亚新闻数据
  const commentPageRequest = async (isReset: boolean) => {
    const pageNum = isReset ? 1 : commentPageNum;
    const param: SystemMessagePageReqType = { pageNum: pageNum, pageSize: 5, messageType: 2 };
    const list: SystemMessagePageType[] = (await Request_SystemMessagePage(param)).data.records || [];

    console.log(JSON.stringify(list))

    //循环便利
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
          <>
            <div className="dot-loading-custom" >
              <span >Loading</span>
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
      <Tabs className="message-tabs" activeLineMode='fixed'>
        <Tabs.Tab title={'1' ? <Badge content={1} style={{ '--right': '-10px', '--top': '8px' }}>私信</Badge> : '私信'} key='private-message'>

          <Card className="private-messgae-card" title={
            <div className="private-messgae-title">
              {/* 头像 */}
              <Avatar src={avatars[1]} className="private-messgae-avatar" />

              {/* 右侧内容：玩家名称 + 聊天内容 */}
              <div className="private-messgae-content">
                <span className="private-messgae-name">老登</span>
                <Ellipsis className="private-message-chat" direction='end' rows={1} content='沙雕哈哈哈哈沙雕沙雕哈哈哈哈哈哈哈哈沙雕哈哈哈哈沙雕 哈哈哈哈哈哈哈哈沙雕哈哈哈哈沙雕沙雕哈哈哈哈哈哈哈哈沙雕哈哈哈哈沙雕 哈哈哈哈哈哈哈哈沙雕哈哈哈哈沙雕沙雕哈哈哈哈哈哈哈哈沙雕哈哈哈哈沙雕 哈哈哈哈' />
              </div>
            </div>
          }>
            <span className="private-message-time"> 2021-10-01 14:10 </span>
          </Card>

          <Card className="private-messgae-card" title={
            <div className="private-messgae-title">
              {/* 头像 */}
              <Avatar src={avatars[3]} className="private-messgae-avatar" />

              {/* 右侧内容：玩家名称 + 聊天内容 */}
              <div className="private-messgae-content">
                <span className="private-messgae-name">老登</span>
                <Ellipsis className="private-message-chat" direction='end' rows={1} content='沙雕哈哈哈哈沙雕沙雕哈哈哈哈哈哈哈哈沙雕哈哈哈哈沙雕 哈哈哈哈哈哈哈哈沙雕哈哈哈哈沙雕沙雕哈哈哈哈哈哈哈哈沙雕哈哈哈哈沙雕 哈哈哈哈哈哈哈哈沙雕哈哈哈哈沙雕沙雕哈哈哈哈哈哈哈哈沙雕哈哈哈哈沙雕 哈哈哈哈' />
              </div>
            </div>
          }>
            <span className="private-message-time"> 2021-10-01 14:10 </span>
          </Card>

          <Card className="private-messgae-card" title={
            <div className="private-messgae-title">
              {/* 头像 */}
              <Avatar src={avatars[2]} className="private-messgae-avatar" />

              {/* 右侧内容：玩家名称 + 聊天内容 */}
              <div className="private-messgae-content">
                <span className="private-messgae-name">老登</span>
                <Ellipsis className="private-message-chat" direction='end' rows={1} content='沙雕哈哈哈哈沙雕沙雕哈哈哈哈哈哈哈哈沙雕哈哈哈哈沙雕 哈哈哈哈哈哈哈哈沙雕哈哈哈哈沙雕沙雕哈哈哈哈哈哈哈哈沙雕哈哈哈哈沙雕 哈哈哈哈哈哈哈哈沙雕哈哈哈哈沙雕沙雕哈哈哈哈哈哈哈哈沙雕哈哈哈哈沙雕 哈哈哈哈' />
              </div>
            </div>
          }>
            <span className="private-message-time"> 2021-10-01 14:10 </span>
          </Card>


        </Tabs.Tab>



        <Tabs.Tab title={'1' ? <Badge content={1} style={{ '--right': '-10px', '--top': '8px' }}>系统消息</Badge> : '系统消息'} key='system-message'>
          <Card className="message-custom-card">
            <div className="card-content">

              <div className="message-news-image-container">
                <Image className="message-news-image" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRrZq5wFJ_FtNWQQGdRkmXonQOEuMVpWuWm3w&s" alt="Example" fit="contain" />
              </div>


              <div className="message-text-area">
                内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容
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
                内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容
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
                内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容
              </div>

              <Divider className='message-line' />

              <div className="message-time">
                2025-01-01 10:15
              </div>
            </div>
          </Card>
        </Tabs.Tab>



        <Tabs.Tab title={'1' ? <Badge content={1} style={{ '--right': '-10px', '--top': '8px' }}>评论</Badge> : '评论'} key='comment-message'>

          <PullToRefresh onRefresh={() => commentPageRequest(true)}>
            {commentList && commentList.map((comment, index) => (
              <Card className="message-custom-card">
                <div className="card-content">
                  <div className="message-title"><span className="news-type">#{comment.sourceType === '1' ? '国内' : '东南亚'}</span> {comment.title} </div>

                  {/*                   {comment.imagePath &&
                    (<div className="message-news-image-container">
                      <Image className="message-news-image" src={comment.imagePath} alt="Example" fit="contain" />
                    </div>)} */}

                  <div className="message-text-area">
                    <span className="message-chat-item">
                      <Avatar className="avatar" src={avatars[1]} />
                      <span className="message-content">
                        <span > {comment.createName} <span className="reply"> 回复了你的评论: </span></span>
                        <span className="comment">{comment.comment}</span>

                      </span>
                    </span>

                    <span className="reply-content">
                      <span className="reply"> 回复内容:</span> {comment.content}
                    </span>
                  </div>

                  <Divider className='message-line' />
                  <div className="message-bottom">

                    <div className="message-time">{dayjs(comment.createTime).format('YYYY-MM-DD HH:mm')}</div>
                    <div className="find">查看详情</div>
                  </div>
                </div>
              </Card>
            ))}

          </PullToRefresh>

          <InfiniteScroll loadMore={() => commentPageRequest(false)} hasMore={commentHasMore}>
            <SystemMessageScrollContent hasMore={commentHasMore} />
          </InfiniteScroll>
        </Tabs.Tab>
      </Tabs>
    </>
  )
}

export default Message;
