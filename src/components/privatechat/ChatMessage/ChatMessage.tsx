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
  name?: string;
  currentPlayerId?: string;
  currentPlayerAvatar?: string;
  visiblePrivateChatCloseRight?: boolean;
}

const ChatMessage: React.FC<ChatMessageProps> = ({
  targetId,
  avatar,
  level,
  name,
  currentPlayerId,
  currentPlayerAvatar,
  visiblePrivateChatCloseRight
}) => {
  const [chatMessagePageNum, setChatMessagePageNum] = useState<number>(1);
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const { chatMessageMap, pushChatMessageToMap, updatePrivateChatList, playerInfo } = useStore();
  const currentMessageList = targetId ? chatMessageMap.get(targetId) || [] : [];
  const { client, connected } = useContext(StompContext)!;
  console.log('当前connected状态:', connected);  // ← 加这行

  const [input, setInput] = useState("");
  const navigate = useNavigate();  // ← 放这里

  const handleInputChange = (val: string) => {
    setInput(val);
  };

  useEffect(() => {
    if (!targetId) return;
    // 先清空这个会话的缓存，再重新拉第一页
    const newMap = new Map(useStore.getState().chatMessageMap);
    newMap.delete(targetId);
    useStore.getState().setChatMessageMap(newMap);
    setChatMessagePageNum(1);
    chatMessagePageRequest(1);  // 直接传1，不依赖state
  }, [targetId]);

  useEffect(() => {
    if (visiblePrivateChatCloseRight) {
      bottomRef.current?.scrollIntoView({ behavior: "auto" });
    }
  }, [currentMessageList, visiblePrivateChatCloseRight]);

  const chatMessagePageRequest = async (pageNum: number) => {
    if (loading || !targetId) return;
    setLoading(true);
    const param: ChatPageReqType = { playerAId: targetId, pageNum: pageNum, pageSize: 50 };
    const list: PrivateChatType[] = (await Request_PlayerPrivateChatPage(param)).data.records || [];
    if (list.length > 0) {
      setChatMessagePageNum(pageNum + 1);
      for (const msg of list.reverse()) {
        pushChatMessageToMap({ ...msg, isSender: msg.sendId === currentPlayerId });
      }
    }
    setLoading(false);
  };

  const sendMessage = () => {
    if (!input.trim()) return;
    console.log('发送时name值:', name, 'playerInfo:', playerInfo?.name);  // ← 加这行

    if (!currentPlayerId) {
      //当前用户id获取不到直接跳转登录页面
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
      notRead: true,
      sendAvatarPath: currentPlayerAvatar,
      sendName: playerInfo?.name,
      receiveName: name,
      receiveAvatarPath: avatar,
    };

    pushChatMessageToMap(message);
    updatePrivateChatList(message);

    if (client?.connected) {
      client.publish({
        destination: '/app/chat/private',
        body: JSON.stringify(message),
      });
    } else {
      Toast.show({ content: '连接已断开，请稍候重试', icon: 'fail' });
    }

    setInput("");
  };

  return (
    <>
      <div style={{ touchAction: "pan-y", overflowY: "auto", height: "100%" }}>
        <PullToRefresh onRefresh={() => chatMessagePageRequest(chatMessagePageNum)}>
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
        <Button
          className="private-send-button"
          color="primary"
          onClick={sendMessage}
          disabled={!connected}
        >
          {connected ? '发送' : '重连中'}
        </Button>
      </div>
    </>

  );
};

export default ChatMessage;
