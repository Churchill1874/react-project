import { useState, useRef, useEffect } from "react";
import { PrivateChatType, PrivateChatRespType, Request_PrivateChatList } from '@/components/privatechat/api'
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import useStore from '@/zustand/store';
import { Tabs, Badge, Card, Image, Divider, Avatar, DotLoading, PullToRefresh, InfiniteScroll, Ellipsis, Popup, Input, Button, } from 'antd-mobile'
import { LeftOutline } from 'antd-mobile-icons';
import avatars from '@/common/avatar';
import '@/components/privatechat/PrivateChat.less'


const PrivateChat: React.FC = () => {

  interface PrivateChatTargetType {
    account: any;
    name: any;
    avatar: any;
  }

  const { playerInfo } = useStore();
  const localAccount = playerInfo?.account;

  const [visiblePrivateChatCloseRight, setVisiblePrivateChatCloseRight] = useState(false)
  const [privateChatPopup, setPrivateChatPopup] = useState<PrivateChatTargetType>({ account: "", name: "", avatar: "" })

  // 输入框的内容
  const [input, setInput] = useState("");
  // 用于显示接收到的消息
  const [privateChatList, setPrivateChatList] = useState<PrivateChatRespType[]>([]);
  //websocket实例
  const [stompClient, setStompClient] = useState<Client | null>(null);

  // 在 Input 上通过 value 绑定状态，并在 onChange 回调里更新状态
  const handleInputChange = (val: string) => {
    setInput(val)
  }

  // 获取聊天记录外层列表
  const privateChatListRequest = async () => {
    const privateChatList: PrivateChatRespType[] = (await Request_PrivateChatList()).data || [];
    console.log('privateChatList:', privateChatList)
    setPrivateChatList(privateChatList);
  }

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
        <div className={`private-chat-time ${isSender ? "right" : "left"}`}>
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


  //websocket连接
  const websocketClient = () => {
    //tokenId令牌
    const tokenId = localStorage.getItem('tokenId') || '';
    console.log("tokenId:", tokenId)
    const socket = new SockJS(`http://localhost:8009/ws?token_id=${tokenId}`);

    const stompClient = new Client({
      brokerURL: "ws://localhost:8009/ws",
      connectHeaders: {},
      webSocketFactory: () => socket,
      reconnectDelay: 5000,
    });

    stompClient.onConnect = () => {
      console.log("WebSocket 连接成功");
      /*       stompClient.subscribe("/topic/messages", (message) => {
              console.log(message.body)
              setMessages((prev) => [...prev, message.body]);
            }); */

      stompClient.subscribe("/user/queue/private", (message) => {
        console.log(message);
        const receiveMessage = JSON.parse(message.body);
        console.log(receiveMessage);
      });
    };

    stompClient.onStompError = (error) => {
      console.error("STOMP 连接失败:", error);
    };

    stompClient.activate();
    // 存到 state
    setStompClient(stompClient);
  }

  // 发送消息
  const sendMessage = () => {
    if (!stompClient || !stompClient.connected) {
      console.warn("STOMP 未连接，无法发送消息");
      return;
    }
    if (!input.trim()) return;

    // 这里前端指定要发给谁
    const message = {
      receiveAccount: 'test3',
      content: input,
    };

    // 直接用 stompClient.publish
    stompClient.publish({
      destination: "/app/chat/private",
      body: JSON.stringify(message),
    });

    setInput("");
  };


  useEffect(() => {

    //私信列表
    privateChatListRequest();

    //连接websocket
    websocketClient();

    return () => {
      stompClient?.deactivate();
    };
  }, [playerInfo, localAccount]);


  return (<>

    {privateChatList?.map((chatInfo, index) => (
      <Card key={index}
        onClick={() => { showPrivateChatPopup(chatInfo.sendAccount, chatInfo.sendName, chatInfo.sendAvatarPath) }}
        className="private-messgae-card"
        title={
          <div className="private-messgae-title">
            <Avatar src={avatars[chatInfo.sendAccount === playerInfo?.account ? chatInfo.receiveAvatarPath : chatInfo.sendAvatarPath]} className="private-messgae-avatar" />
            <div className="private-messgae-content">
              <span className="private-messgae-name">{chatInfo.sendName}</span>
              <Ellipsis
                className="private-message-chat"
                direction='end'
                rows={1}
                content={chatInfo.content}
              />
            </div>
          </div>
        }
      >
        <div className="private-message-time">
          <div className="left">{chatInfo.createTime}</div>
          {chatInfo.notRead &&
            <div className="right">
              <Badge content={Badge.dot} />
            </div>}
        </div>
      </Card>
    ))}



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
        </div>
      </div>

      <div className="private-send-container">
        <Input className="private-input-field" placeholder="请输入..." onChange={handleInputChange} />
        <Button className="private-send-button" color="primary" onClick={() => sendMessage()} >
          发送
        </Button>
      </div>

    </Popup>

  </>)
}

export default PrivateChat;