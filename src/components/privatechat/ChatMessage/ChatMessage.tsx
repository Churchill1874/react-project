import { useEffect, useRef, useState, useContext } from "react";
import avatars from '@/common/avatar';
import { PrivateChatType, Request_PlayerPrivateChatPage, ChatPageReqType } from '@/components/privatechat/api'
import { Avatar, PullToRefresh, DotLoading, TextArea, Button, Toast } from 'antd-mobile'
import '@/components/privatechat/ChatMessage/ChatMessage.less'
import '@/components/privatechat/PrivateChat.less'
import dayjs from "dayjs";
import useStore from "@/zustand/store";
import { StompContext } from '@/utils/StompContext';
import { useNavigate } from "react-router-dom";


const ChatMessageScrollContent = ({ hasMore }: { hasMore?: boolean }) => {
  return (
    <>
      {hasMore ? (
        <div style={{ fontSize: '15px', color: 'gray', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <span>加载中</span>
          <DotLoading color='gray' />
        </div>
      ) : null}
    </>
  );
};

interface ChatMessageProps {
  targetId?: string;
  avatar?: string;
  level?: number;
  currentPlayerId?: string;
  currentPlayerAvatar?: string;
  visiblePrivateChatCloseRight?: boolean;
}

const ChatMessage: React.FC<ChatMessageProps> = ({
  targetId,
  avatar,
  level,
  currentPlayerId,
  currentPlayerAvatar,
  visiblePrivateChatCloseRight
}) => {
  const [chatMessagePageNum, setChatMessagePageNum] = useState<number>(1);
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const { chatMessageMap, pushChatMessageToMap, updatePrivateChatList, } = useStore();
  const currentMessageList = targetId ? chatMessageMap.get(targetId) || [] : [];
  const { client, connected } = useContext(StompContext)!;
  const [input, setInput] = useState("");

  console.log('target,', targetId)
  const handleInputChange = (val: string) => {
    setInput(val);
  };



  useEffect(() => {
    chatMessagePageRequest();
    setChatMessagePageNum(1);
  }, [targetId]);

  useEffect(() => {
    if (visiblePrivateChatCloseRight) {
      bottomRef.current?.scrollIntoView({ behavior: "auto" });
    }
  }, [currentMessageList, visiblePrivateChatCloseRight]);

  const chatMessagePageRequest = async () => {
    if (loading || !targetId) return;
    setLoading(true);

    const param: ChatPageReqType = { playerAId: targetId, pageNum: chatMessagePageNum, pageSize: 50 };
    const list: PrivateChatType[] = (await Request_PlayerPrivateChatPage(param)).data.records || [];

    if (list.length > 0) {
      setChatMessagePageNum(prev => prev + 1);
      for (const msg of list.reverse()) {
        pushChatMessageToMap({ ...msg, isSender: msg.sendId === currentPlayerId });
      }
    }

    setLoading(false);
  };

  const sendMessage = () => {
    if (!input.trim()) return;

    if (!currentPlayerId) {
      //当前用户id获取不到直接跳转登录页面
      const navigate = useNavigate();
      navigate('/logo');
      return;
    }
    if (!targetId) {
      Toast.show({ content: '未获取到聊天对象', icon: 'fail' })
      return;
    }

    const message: PrivateChatType = {
      id: '',
      status: false,
      createTime: dayjs().format('YYYY-MM-DD HH:mm'),
      createName: '',
      sendId: currentPlayerId,
      receiveId: targetId,
      content: input,
      type: 1,
      isSender: true,
      notRead: true
    };

    pushChatMessageToMap(message);
    updatePrivateChatList(message);

    if (connected && client) {
      client.publish({
        destination: '/app/chat/private',
        body: JSON.stringify(message),
      });
    } else {
      Toast.show({ content: '连接未建立，无法发送消息', icon: 'fail' });
    }

    setInput("");
  };

  return (
    <>
      <div style={{ touchAction: "pan-y", overflowY: "auto", height: "100%" }}>
        <PullToRefresh onRefresh={chatMessagePageRequest}>
          <div className="private-chat-popup" style={{ flex: 1, overflowY: 'auto' }}>
            <ChatMessageScrollContent hasMore={loading} />
            {currentMessageList.map((chatMessage, index) => {
              const prevMessage = currentMessageList[index - 1];
              const showTime =
                index === 0 ||
                (prevMessage &&
                  (dayjs(chatMessage.createTime).diff(prevMessage.createTime, 'minute') > 5 ||
                    !dayjs(chatMessage.createTime).isSame(prevMessage.createTime, 'day')));

              return (
                <div key={index}>
                  {showTime && (
                    <div className='private-chat-time'>
                      {dayjs(chatMessage.createTime).format("YYYY-MM-DD HH:mm")}
                    </div>
                  )}

                  <div className={`private-chat-message ${chatMessage.isSender ? "right" : "left"}`}>
                    {(!chatMessage.isSender && avatar) && (
                      <Avatar src={avatars[avatar]} className="private-chat-avatar" />
                    )}

                    <div className="private-chat-content">
                      <div className={`private-chat-bubble ${chatMessage.isSender ? "right" : "left"}`}>
                        {chatMessage.content}
                      </div>
                    </div>

                    {(chatMessage.isSender && currentPlayerAvatar) && (
                      <Avatar src={avatars[currentPlayerAvatar]} className="private-chat-avatar right" />
                    )}
                  </div>

                  <div style={{ marginBottom: '15px' }}></div>
                </div>
              );
            })}
            <div ref={bottomRef}></div>
          </div>
        </PullToRefresh>
      </div>

      <div className="private-send-container">
        <TextArea
          className="private-chat-textArea"
          maxLength={255}
          rows={1}
          autoSize={{ minRows: 1, maxRows: 5 }}
          placeholder="请输入..."
          onChange={handleInputChange}
          value={input}
        />
        <Button className="private-send-button" color="primary" onClick={sendMessage}>发送</Button>
      </div>
    </>

  );
};

export default ChatMessage;
