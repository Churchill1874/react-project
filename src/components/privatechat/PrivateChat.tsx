import { useState, useRef, useEffect } from "react";
import { PrivateChatType, Request_PrivateChatList, PrivateChatListType, PrivateChatRespType, PrivateChatPageRespType } from '@/components/privatechat/api'
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { Badge, Card, Avatar, Ellipsis, Popup, Input, Button } from 'antd-mobile'
import { LeftOutline } from 'antd-mobile-icons';
import avatars from '@/common/avatar';
import '@/components/privatechat/PrivateChat.less'
import ChatMessage from '@/components/privatechat/ChatMessage/ChatMessage'



const PrivateChat: React.FC = () => {

  interface PlayerBaseType {
    account: any;
    name: any;
    avatar: any;
    level: any;
  }

  const [loginPlayer, setLoginPlayer] = useState<PlayerBaseType>();
  //弹窗状态相关
  const [visiblePrivateChatCloseRight, setVisiblePrivateChatCloseRight] = useState(false)
  const [privateChatPopup, setPrivateChatPopup] = useState<PlayerBaseType>({ account: "", name: "", avatar: "", level: "" })
  const [chatMessageList, setChatMessageList] = useState<PrivateChatType[]>([]);
  const [chatMessagePageNum, setChatMessagePageNum] = useState<number>(1);

  // 输入框的内容
  const [input, setInput] = useState("");
  // 用于显示接收到的消息
  const [privateChatList, setPrivateChatList] = useState<PrivateChatListType[]>([]);
  //websocket实例
  const [stompClient, setStompClient] = useState<Client | null>(null);

  // 在 Input 上通过 value 绑定状态，并在 onChange 回调里更新状态
  const handleInputChange = (val: string) => {
    setInput(val)
  }

  // 获取聊天记录外层列表
  const privateChatListRequest = async () => {
    const privateChatListResp: PrivateChatPageRespType = (await Request_PrivateChatList()).data;
    setLoginPlayer({ 'account': privateChatListResp.loginAccount, 'name': privateChatListResp.loginName, 'level': privateChatListResp.loginLevel, 'avatar': privateChatListResp.loginAvatar })
    setPrivateChatList(privateChatListResp.list);
  }


  //打开私信弹窗
  const showPrivateChatPopup = (param: PrivateChatListType) => {
    setVisiblePrivateChatCloseRight(true)

    let account;
    let name;
    let avatar;
    let level;

    //如果当前弹窗记录 正好 发送人账号 是 登录人
    //整理获取聊天对方账号信息
    if (param.sendAccount === loginPlayer?.account) {
      account = param.receiveAccount;
      name = param.receiveName;
      avatar = param.receiveAvatarPath;
      level = param.receiveLevel;
    } else {
      account = param.sendAccount;
      name = param.sendName;
      avatar = param.sendAvatarPath;
      level = param.sendLevel;
    }

    if (privateChatPopup.account !== account) {
      //  清空子组件的聊天记录
      setChatMessageList([]);
      setChatMessagePageNum(1);
    }

    const target: PlayerBaseType = { account, name, avatar, level }
    setPrivateChatPopup(target)
  }

  //websocket连接
  const websocketClient = () => {
    //tokenId令牌
    const tokenId = localStorage.getItem('tokenId') || '';
    const socket = new SockJS(`http://localhost:8009/ws?token_id=${tokenId}`);

    const stompClient = new Client({
      brokerURL: "ws://localhost:8009/ws",
      connectHeaders: {},
      webSocketFactory: () => socket,
      reconnectDelay: 5000,
    });

    stompClient.onConnect = () => {
      /*       stompClient.subscribe("/topic/messages", (message) => {
              console.log(message.body)
              setMessages((prev) => [...prev, message.body]);
            }); */

      stompClient.subscribe("/user/queue/private", (message) => {

        const receiveMessage = JSON.parse(message.body);
        console.log(receiveMessage)

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
  }, []);




  return (<>

    {privateChatList?.map((chatInfo, index) => (

      <Card key={index}
        onClick={() => { showPrivateChatPopup(chatInfo) }}
        className="private-messgae-card"
        title={
          <div className="private-messgae-title">
            <Avatar src={avatars[chatInfo.sendAccount === loginPlayer?.account ? chatInfo.receiveAvatarPath : chatInfo.sendAvatarPath]} className="private-messgae-avatar" />
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

    <Popup
      // 让弹窗本身铺满手机可视区域
      bodyStyle={{
        width: '100%',
        height: '100%',        // 占满视口高度
        display: 'flex',
        flexDirection: 'column' // 弹性布局，方便上下分区
      }}
      position='right'
      closeOnSwipe={true}
      closeOnMaskClick
      visible={visiblePrivateChatCloseRight}
      onClose={() => { setVisiblePrivateChatCloseRight(false); console.log('chatlistpop', chatMessageList)/*  setPrivateChatPopup({ account: "", name: "", avatar: "", level: "" }) */ }}
    >

      <div className="private-icon-avatar-wrapper" onClick={() => { setVisiblePrivateChatCloseRight(false); console.log('chatlist', chatMessageList) }}>
        <LeftOutline className="icon" />
        <Avatar className="avatar" src={avatars[privateChatPopup.avatar]} />
        <span className="name"> {privateChatPopup.name} </span>
      </div>

      <ChatMessage
        accountA={privateChatPopup.account}
        avatar={privateChatPopup.avatar}
        level={privateChatPopup.level}
        currentPlayerAccount={loginPlayer?.account}
        currentPlayerAvatar={loginPlayer?.avatar}
        chatMessageList={chatMessageList}
        setChatMessageList={setChatMessageList}
        chatMessagePageNum={chatMessagePageNum}
        setChatMessagePageNum={setChatMessagePageNum}
      />

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