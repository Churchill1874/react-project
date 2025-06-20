import { useEffect, useRef, useState } from "react";
import avatars from '@/common/avatar';
import { PrivateChatType, Request_PlayerPrivateChatPage, ChatPageReqType } from '@/components/privatechat/api'
import { Avatar, PullToRefresh, DotLoading, Popup } from 'antd-mobile'
import '@/components/privatechat/ChatMessage/ChatMessage.less'

import '@/components/privatechat/PrivateChat.less'
import dayjs from "dayjs";

const ChatMessageScrollContent = ({ hasMore }: { hasMore?: boolean }) => {
  return (
    <>
      {hasMore ? (
        <>
          <div style={{ fontSize: '15px', color: 'gray', display: 'flex', justifyContent: 'center', alignItems: 'center' }} >
            <span >加载中</span>
            <DotLoading color='gray' />
          </div>
        </>
      ) : (

        <></>
      )}
    </>
  )
}

// 定义 props 类型
interface ChatMessageProps {
  targetId: number | null;
  avatar: string;
  level: number;
  currentPlayerId: number | null;
  currentPlayerAvatar: string;
  chatMessageList: PrivateChatType[];
  setChatMessageList: React.Dispatch<React.SetStateAction<PrivateChatType[]>>;
  chatMessagePageNum: number;
  setChatMessagePageNum: React.Dispatch<React.SetStateAction<number>>;
  visiblePrivateChatCloseRight;
}

const ChatMessage: React.FC<ChatMessageProps> = ({
  targetId,
  avatar,
  level,
  currentPlayerId,
  currentPlayerAvatar,
  chatMessageList,
  setChatMessageList,
  chatMessagePageNum,
  setChatMessagePageNum,
  visiblePrivateChatCloseRight
}) => {


  const [loading, setLoading] = useState(false)

  const bottomRef = useRef<HTMLDivElement | null>(null); // 用于滚动到底部

  // **防止 touchmove 事件阻塞滚动**
  /*   useEffect(() => {
      const handleTouchMove = (event: TouchEvent) => { };
  
      document.addEventListener("touchmove", handleTouchMove, { passive: true });
  
      return () => {
        document.removeEventListener("touchmove", handleTouchMove);
      };
    }, []); */


  useEffect(() => {
    chatMessagePageRequest();
  }, [targetId])

  //滚动到底部聊天最后一句
  useEffect(() => {
    if (visiblePrivateChatCloseRight) {
      bottomRef.current?.scrollIntoView({ behavior: "auto" }); // 直接滚动到底部
    }
  }, [chatMessageList, visiblePrivateChatCloseRight]); // 监听 `chatMessageList` 变化



  // 获取聊天记录
  const chatMessagePageRequest = async () => {
    if (loading) {
      return;
    }
    setLoading(true)
    const param: ChatPageReqType = { playerAId: targetId, pageNum: chatMessagePageNum, pageSize: 50 };
    const list: PrivateChatType[] = (await Request_PlayerPrivateChatPage(param)).data.records || [];

    if (list.length > 0) {
      setChatMessagePageNum(prev => prev + 1);
      setChatMessageList(prevList => [...list.reverse(), ...(prevList ?? [])]);
    }
    setLoading(false)
  };

  return (
    <div style={{ touchAction: "pan-y", overflowY: "auto", height: "100%" }}>

      <PullToRefresh onRefresh={() => chatMessagePageRequest()}>

        <div className="private-chat-popup" style={{ flex: 1, overflowY: 'auto' }}>
          <ChatMessageScrollContent hasMore={loading} />
          {chatMessageList?.map((chatMessage, index) => {
            return (
              <div key={index}>

                <div className={`private-chat-message ${chatMessage.isSender ? "right" : "left"}`}>
                  {/* 左侧头像 */}
                  {!chatMessage.isSender && (
                    <Avatar src={avatars[avatar]} className="private-chat-avatar" />
                  )}

                  {/* 内容区域 */}
                  <div className="private-chat-content">
                    <div className={`private-chat-bubble ${chatMessage.isSender ? "right" : "left"}`}>
                      {chatMessage.content}
                    </div>
                  </div>

                  {/* 右侧头像 */}
                  {chatMessage.isSender && (
                    <Avatar src={avatars[currentPlayerAvatar]} className="private-chat-avatar right" />
                  )}


                </div>

                {/* 时间 */}
                <div className={`private-chat-time ${chatMessage.isSender ? "right" : "left"}`}>
                  {dayjs(chatMessage.createTime).format("YYYY-MM-DD HH:mm")}
                </div>
              </div>

            );
          })}



          {/* 滚动到底部的占位符 */}
          <div ref={bottomRef}></div>
        </div>


      </PullToRefresh>


    </div>

  );
};

export default ChatMessage;
