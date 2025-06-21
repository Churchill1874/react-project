import { useState, useEffect } from "react";
import { PrivateChatType, Request_PrivateChatList, PrivateChatListType, PrivateChatPageRespType } from '@/components/privatechat/api'
import { Badge, Card, Avatar, Ellipsis, Popup, Button, Toast, TextArea } from 'antd-mobile'
import { LeftOutline } from 'antd-mobile-icons';
import avatars from '@/common/avatar';
import '@/components/privatechat/PrivateChat.less'
import ChatMessage from '@/components/privatechat/ChatMessage/ChatMessage'
import OtherPeople from '@/pages/otherpeople/otherpeople'
import useStore from "@/zustand/store";
import { getStompClient } from "@/utils/Stomp";
import dayjs from 'dayjs';


const PrivateChat: React.FC = () => {

  interface PlayerBaseType {
    playerId: number | null;
    //account: any;
    name: any;
    avatar: any;
    level: any;
  }
  const { playerInfo, setHasUnreadMessage } = useStore();

  //弹窗状态相关
  const [visiblePrivateChatCloseRight, setVisiblePrivateChatCloseRight] = useState(false)
  const [privateChatPopup, setPrivateChatPopup] = useState<PlayerBaseType>({ playerId: null, name: "", avatar: "", level: "" })
  const [chatMessageList, setChatMessageList] = useState<PrivateChatType[]>([]);
  const [chatMessagePageNum, setChatMessagePageNum] = useState<number>(1);
  const [visibleCloseRight, setVisibleCloseRight] = useState(false)
  // 输入框的内容
  const [input, setInput] = useState("");
  // 用于显示接收到的消息
  const [privateChatList, setPrivateChatList] = useState<PrivateChatListType[]>([]);
  //websocket实例

  // 在 Input 上通过 value 绑定状态，并在 onChange 回调里更新状态
  const handleInputChange = (val: string) => {
    setInput(val)
  }

  // 获取聊天记录外层列表
  const privateChatListRequest = async () => {
    const privateChatListResp: PrivateChatPageRespType = (await Request_PrivateChatList()).data;
    setPrivateChatList(privateChatListResp.list);
  }


  //打开私信弹窗
  const showPrivateChatPopup = (param: PrivateChatListType) => {
    setVisiblePrivateChatCloseRight(true)
    setChatMessagePageNum(1)

    let playerId;
    let name;
    let avatar;
    let level;

    //如果当前弹窗记录 正好 发送人账号 是 登录人
    //整理获取聊天对方账号信息
    if (param.sendId === playerInfo?.id) {
      playerId = param.receiveId;
      name = param.receiveName;
      avatar = param.receiveAvatarPath;
      level = param.receiveLevel;
    } else {
      playerId = param.sendId;
      name = param.sendName;
      avatar = param.sendAvatarPath;
      level = param.sendLevel;
    }

    if (privateChatPopup.playerId !== playerId) {
      //  清空子组件的聊天记录
      setChatMessagePageNum(1);
    }

    const target: PlayerBaseType = { playerId, name, avatar, level }
    setPrivateChatPopup(target)
    updatePrivateChatList(param.id)
  }

  // 发送消息
  const sendMessage = () => {
    if (!input.trim()) return;

    const message = {
      id: '',
      status: false,
      createTime: dayjs().format('YYYY-MM-DD HH:mm'), // ✅ 格式化为你要的格式
      createName: '',
      sendId: null,
      receiveId: privateChatPopup.playerId,
      content: input,
      type: 1,
      isSender: true
    };

    //setHasUnreadMessage(message);
    setChatMessageList(prevList => [...(prevList ?? []), message]);

    //更新聊天列表的最后一条消息内容和时间（UI上的外层卡片）
    setPrivateChatList(prev => {
      const updated = prev.map(chat => {
        const matchId =
          (chat.sendId === playerInfo?.id && chat.receiveId === privateChatPopup.playerId)
          ||
          (chat.receiveId === playerInfo?.id && chat.sendId === privateChatPopup.playerId);
        if (matchId) {
          return {
            ...chat,
            content: input,
            createTime: message.createTime
          };
        }
        return chat;
      });

      // 重新排序，createTime 字符串可以直接比较（因格式是 YYYY-MM-DD HH:mm）
      return updated.sort((a, b) => (dayjs(b.createTime).isAfter(dayjs(a.createTime)) ? 1 : -1));
    });


    const client = getStompClient();
    if (client) {
      client.publish({ destination: '/app/chat/private', body: JSON.stringify(message) });
    } else {
      Toast.show({ content: '连接尚未建立', icon: 'fail' });
    }

    setInput("");
  };

  const updatePrivateChatList = (chatId: any) => {
    setPrivateChatList(
      prev =>
        prev.map(
          chat => {
            if (chat.id === chatId) {
              return { ...chat, notRead: false }
            }
            return chat
          }
        )
    )
  }


  useEffect(() => {
    privateChatListRequest();
  }, []); // 组件挂载时执行

  return (<>

    {privateChatList?.map((chatInfo, index) => (

      <Card key={index}
        onClick={() => { showPrivateChatPopup(chatInfo) }}
        className="private-messgae-card"
        title={
          <div className="private-messgae-title">
            <Avatar src={avatars[chatInfo.sendId === playerInfo?.id ? chatInfo.receiveAvatarPath : chatInfo.sendAvatarPath]} className="private-messgae-avatar" />
            <div className="private-messgae-content">
              <span className="private-messgae-name">{chatInfo.sendId === playerInfo?.id ? chatInfo.receiveName : chatInfo.sendName}</span>
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
          <div className="left">{dayjs(chatInfo.createTime).format('YYYY-MM-DD HH:mm')}</div>
          {chatInfo.notRead &&
            <div className="right">
              <Badge content={Badge.dot} />
            </div>
          }
        </div>

      </Card>
    ))}

    <Popup
      // 让弹窗本身铺满手机可视区域
      bodyStyle={{
        width: '100%',
        height: '100%',        // 占满视口高度
        display: 'flex',
        flexDirection: 'column', // 弹性布局，方便上下分区

      }}
      position='right'
      closeOnSwipe={true}
      closeOnMaskClick
      visible={visiblePrivateChatCloseRight}
      onClose={() => { setVisiblePrivateChatCloseRight(false) }}
      key={visiblePrivateChatCloseRight ? "open" : "close"}
    >

      <div className="private-icon-avatar-wrapper" >
        <LeftOutline className="icon" onClick={() => { setVisiblePrivateChatCloseRight(false); }} />
        <Avatar className="avatar" src={avatars[privateChatPopup.avatar]} onClick={() => setVisibleCloseRight(true)} />
        <span className="name"> {privateChatPopup.name} </span>
      </div>

      <ChatMessage
        targetId={privateChatPopup.playerId}
        avatar={privateChatPopup.avatar}
        level={privateChatPopup.level}
        currentPlayerId={playerInfo?.id}
        currentPlayerAvatar={playerInfo?.avatarPath}
        chatMessageList={chatMessageList}
        setChatMessageList={setChatMessageList}
        chatMessagePageNum={chatMessagePageNum}
        setChatMessagePageNum={setChatMessagePageNum}
        visiblePrivateChatCloseRight={visiblePrivateChatCloseRight}
      />

      <div className="private-send-container">
        <TextArea className="private-chat-textArea" maxLength={255} rows={1} autoSize={{ minRows: 1, maxRows: 5 }} placeholder="请输入..." onChange={handleInputChange} value={input} />
        <Button className="private-send-button" color="primary" onClick={() => sendMessage()} >
          发送
        </Button>
      </div>

      <Popup className='news-record-popup' bodyStyle={{ display: 'flex', flexDirection: 'column', overflowY: 'auto', width: '100%', height: '100%' }}
        position='right'
        closeOnMaskClick
        visible={visibleCloseRight}
        onClose={() => { setVisibleCloseRight(false) }}>
        <OtherPeople setVisibleCloseRight={setVisibleCloseRight} otherPlayerId={privateChatPopup.playerId} />
      </Popup>

    </Popup>


  </>)
}

export default PrivateChat;