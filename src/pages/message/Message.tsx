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
import { FcReading } from "react-icons/fc";
import { MessageOutline, LeftOutline, MessageFill, ClockCircleOutline } from 'antd-mobile-icons';
import avatars from '@/common/avatar';
import {
  Request_SystemMessagePage,
  SystemMessagePageReqType,
  SystemMessagePageType,
  SystemMessagePageResponseType
} from '@/pages/message/api'
import dayjs from 'dayjs'
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import useStore from '@/zustand/store';


interface PrivateChatType {
  id: any;
  sendAccount: any;
  receiveAccount: any;
  content: any;
  status: any;
  createTime: any;
  createName: any;
}

interface PrivateChatTargetType {
  account: any;
  name: any;
  avatar: any;
}

const Message: React.FC = () => {
  const { playerInfo } = useStore();
  const [visiblePrivateChatCloseRight, setVisiblePrivateChatCloseRight] = useState(false)
  const [privateChatPopup, setPrivateChatPopup] = useState<PrivateChatTargetType>({ account: "", name: "", avatar: "" })

  //ws相关
  const [messages, setMessages] = useState<string[]>([]); // 用于显示接收到的消息
  const [input, setInput] = useState("");                 // 输入框的内容

  //评论相关
  const [commentList, setCommentList] = useState<SystemMessagePageType[]>();
  const [commentPageNum, setCommentPageNum] = useState<number>(1);
  const [commentHasMore, setCommentHasMore] = useState<boolean>(true);

  // 获取评论数据
  const commentPageRequest = async (isReset: boolean) => {
    const pageNum = isReset ? 1 : commentPageNum;
    const param: SystemMessagePageReqType = { pageNum: pageNum, pageSize: 5, messageType: 2 };
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

  // STOMP 客户端连接
  useEffect(() => {
    const stompClient = new Client({
      brokerURL: "ws://localhost:8009/ws",
      connectHeaders: {
        login: 'test',
        passcode: "password",
      },
      webSocketFactory: () => new SockJS("http://localhost:8009/ws"),
      reconnectDelay: 5000,
    });

    stompClient.onConnect = () => {
      console.log("WebSocket 连接成功");
      stompClient.subscribe("/topic/messages", (message) => {
        setMessages((prev) => [...prev, message.body]);
      });
    };

    stompClient.onStompError = (error) => {
      console.error("STOMP 连接失败:", error);
    };

    stompClient.activate();
    return () => {
      stompClient.deactivate();
    };
  }, [playerInfo]);

  // 发送消息
  const sendMessage = () => {
    if (input.trim()) {
      const message = {
        sender: playerInfo?.account,
        content: input,
        timestamp: new Date().toISOString(),
      };

      const stompClient = new Client({
        brokerURL: "ws://localhost:8009/ws",
        webSocketFactory: () => new SockJS("http://localhost:8009/ws"),
      });

      // 先激活再 publish
      stompClient.onConnect = () => {
        stompClient.publish({
          destination: "/app/chat",
          body: JSON.stringify(message),
        });
        stompClient.deactivate();
      };
      stompClient.activate();

      setInput(""); // 清空输入框
    }
  };


  const ChatMessage = ({ message, avatar, time, isSender }) => {
    return (
      <>
        <div className={`private-chat-message ${isSender ? "right" : "left"}`} >
          {/* 左侧头像 */}
          {!isSender && (
            <Avatar
              src={avatar}
              className="private-chat-avatar"
            />
          )}

          {/* 内容区域 */}
          <div className="private-chat-content">
            <div className={`private-chat-bubble ${isSender ? "right" : "left"}`} >
              {message}
            </div>
          </div>

          {/* 右侧头像 */}
          {isSender && (
            <Avatar
              src={avatar}
              className="private-chat-avatar right"
            />
          )}
        </div>

        {/* 时间 */}
        <div className={`private-message-time ${isSender ? "right" : "left"}`}>
          {time}
        </div>
      </>
    );
  };

  //打开私信弹窗
  const showPrivateChatPopup = (account, name, avatar) => {
    setVisiblePrivateChatCloseRight(true)
    setPrivateChatPopup({ account, name, avatar })
  }

  return (
    <>
      <Tabs className="message-tabs" activeLineMode='fixed'>
        <Tabs.Tab
          title={'1'
            ? <Badge content={1} style={{ '--right': '-10px', '--top': '8px' }}>私信</Badge>
            : '私信'
          }
          key='private-message'
        >
          <Card
            onClick={() => { showPrivateChatPopup('laodeng', '老登', '1') }}
            className="private-messgae-card"
            title={
              <div className="private-messgae-title">
                <Avatar src={avatars[1]} className="private-messgae-avatar" />
                <div className="private-messgae-content">
                  <span className="private-messgae-name">老登</span>
                  <Ellipsis
                    className="private-message-chat"
                    direction='end'
                    rows={1}
                    content='沙雕哈哈哈哈沙雕沙雕哈哈哈哈哈哈哈哈沙雕哈哈哈哈沙雕...'
                  />
                </div>
              </div>
            }
          >
            <span className="private-message-time"> 2021-10-01 14:10 </span>
          </Card>

          <Card
            className="private-messgae-card"
            title={
              <div className="private-messgae-title">
                <Avatar src={avatars[3]} className="private-messgae-avatar" />
                <div className="private-messgae-content">
                  <span className="private-messgae-name">老登</span>
                  <Ellipsis
                    className="private-message-chat"
                    direction='end'
                    rows={1}
                    content='沙雕哈哈哈哈沙雕沙雕哈哈哈哈...'
                  />
                </div>
              </div>
            }
          >
            <span className="private-message-time"> 2021-10-01 14:10 </span>
          </Card>

          <Card
            className="private-messgae-card"
            title={
              <div className="private-messgae-title">
                <Avatar src={avatars[2]} className="private-messgae-avatar" />
                <div className="private-messgae-content">
                  <span className="private-messgae-name">老登</span>
                  <Ellipsis
                    className="private-message-chat"
                    direction='end'
                    rows={1}
                    content='沙雕哈哈哈哈沙雕沙雕哈哈哈哈...'
                  />
                </div>
              </div>
            }
          >
            <span className="private-message-time"> 2021-10-01 14:10 </span>
          </Card>
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
            ? <Badge content={1} style={{ '--right': '-10px', '--top': '8px' }}>评论</Badge>
            : '评论'
          }
          key='comment-message'
        >
          <PullToRefresh onRefresh={() => commentPageRequest(true)}>
            {commentList && commentList.map((comment, index) => (
              <Card className="message-custom-card" key={index}>
                <div className="card-content">
                  <div className="message-title">
                    <span className="news-type">#{comment.sourceType === '1' ? '国内' : '东南亚'}</span>{" "}
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
                    <div className="find">查看详情</div>
                  </div>
                </div>
              </Card>
            ))}
          </PullToRefresh>

          <InfiniteScroll
            loadMore={() => commentPageRequest(false)}
            hasMore={commentHasMore}
          >
            <SystemMessageScrollContent hasMore={commentHasMore} />
          </InfiniteScroll>
        </Tabs.Tab>
      </Tabs>


      {/************ 聊天详情 ************/}
      <Popup
        // 让弹窗本身铺满手机可视区域
        bodyStyle={{
          width: '100%',
          //height: '100vh',        // 占满视口高度
          display: 'flex',
          flexDirection: 'column' // 弹性布局，方便上下分区
        }}
        position='right'
        closeOnSwipe={true}
        closeOnMaskClick
        visible={visiblePrivateChatCloseRight}
        onClose={() => { setVisiblePrivateChatCloseRight(false) }}
      >

        <div className="private-icon-avatar-wrapper" onClick={() => setVisiblePrivateChatCloseRight(false)}>
          <LeftOutline className="icon" />
          <Avatar className="avatar" src={avatars[1]} />
          <span className="name"> {privateChatPopup.name} </span>
        </div>

        <div style={{ flex: 1, overflowY: 'auto' }}>
          <div className="private-chat-popup">
            <ChatMessage
              message="这是一个聊天消息超过宽度自动换行这是一个聊天消息超过宽度自动换行这是一个聊天消息超过宽度自动换行这是一个聊天消息超过宽度自动换行"
              avatar={avatars[1]}
              time="2021-10-01 10:11"
              isSender={true}
            />
            <ChatMessage
              message="这是一个聊天消息超过宽度自动换行这是一个聊天消息超过宽度自动换行这是.一个聊天消息超过宽度自动换行这是一个聊天消息超过宽度自动换行"
              avatar={avatars[1]}
              time="2021-10-01 10:11"
              isSender={true}
            />
            <ChatMessage
              message="这是一个聊天消息超过宽度自动换行这是一个聊天消息超过宽度自动换行这是一个聊天消息超过宽度自动换行这是一个聊天消息超过宽度自动换行"
              avatar={avatars[1]}
              time="2021-10-01 10:11"
              isSender={false}
            />
            <ChatMessage
              message="这是一个聊天消息"
              avatar={avatars[1]}
              time="2021-10-01 10:11"
              isSender={false}
            />
            <ChatMessage
              message="这"
              avatar={avatars[1]}
              time="2021-10-01 10:11"
              isSender={true}
            />
            <ChatMessage
              message="这是一个聊天消息"
              avatar={avatars[1]}
              time="2021-10-01 10:11"
              isSender={true}
            />





            <ChatMessage
              message="这是一个聊天消息超过宽度自动换行这是一个聊天消息超过宽度自动换行这是一个聊天消息超过宽度自动换行这是一个聊天消息超过宽度自动换行"
              avatar={avatars[1]}
              time="2021-10-01 10:11"
              isSender={true}
            />
            <ChatMessage
              message="这是一个聊天消息超过宽度自动换行这是一个聊天消息超过宽度自动换行这是.一个聊天消息超过宽度自动换行这是一个聊天消息超过宽度自动换行"
              avatar={avatars[1]}
              time="2021-10-01 10:11"
              isSender={true}
            />
            <ChatMessage
              message="这是一个聊天消息超过宽度自动换行这是一个聊天消息超过宽度自动换行这是一个聊天消息超过宽度自动换行这是一个聊天消息超过宽度自动换行"
              avatar={avatars[1]}
              time="2021-10-01 10:11"
              isSender={false}
            />
            <ChatMessage
              message="这是一个聊天消息"
              avatar={avatars[1]}
              time="2021-10-01 10:11"
              isSender={false}
            />
            <ChatMessage
              message="这"
              avatar={avatars[1]}
              time="2021-10-01 10:11"
              isSender={true}
            />
            <ChatMessage
              message="这是一个聊天消息"
              avatar={avatars[1]}
              time="2021-10-01 10:11"
              isSender={true}
            />

          </div>
        </div>

        <div className="private-send-container">
          <Input className="private-input-field" placeholder="请输入..." />
          <Button className="private-send-button" color="primary">
            发送
          </Button>
        </div>

      </Popup>

    </>
  );
}

export default Message;
