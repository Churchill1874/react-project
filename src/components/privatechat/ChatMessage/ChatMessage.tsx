import { useEffect, useRef, useLayoutEffect } from "react";
import avatars from '@/common/avatar';
import { PrivateChatType, Request_PlayerPrivateChatPage, ChatPageReqType } from '@/components/privatechat/api'
import { Avatar, PullToRefresh } from 'antd-mobile'
import '@/components/privatechat/ChatMessage/ChatMessage.less'
import dayjs from "dayjs";

// 定义 props 类型
interface ChatMessageProps {
  accountA: string;
  avatar: string;
  level: number;
  currentPlayerAccount: string;
  currentPlayerAvatar: string;
  chatMessageList: PrivateChatType[];
  setChatMessageList: React.Dispatch<React.SetStateAction<PrivateChatType[]>>;
  chatMessagePageNum: number;
  setChatMessagePageNum: React.Dispatch<React.SetStateAction<number>>;
  visiblePrivateChatCloseRight;
}


const ChatMessage: React.FC<ChatMessageProps> = ({
  accountA,
  avatar,
  level,
  currentPlayerAccount,
  currentPlayerAvatar,
  chatMessageList,
  setChatMessageList,
  chatMessagePageNum,
  setChatMessagePageNum,
  visiblePrivateChatCloseRight
}) => {

  const loadCountRef = useRef(0);
  const bottomRef = useRef<HTMLDivElement | null>(null); // 用于滚动到底部

  useEffect(() => {
    chatMessagePageRequest();
  }, [accountA])

  //滚动到底部聊天最后一句
  useEffect(() => {
    console.log(loadCountRef.current)
    if (loadCountRef.current <= 1) {
      loadCountRef.current++;
      bottomRef.current?.scrollIntoView({ behavior: "auto" });
    }
  }, [chatMessageList]); // 仅在 `Popup` 组件打开时执行


  // 获取聊天记录
  const chatMessagePageRequest = async () => {
    const param: ChatPageReqType = { accountA, pageNum: chatMessagePageNum, pageSize: 10 };
    const list: PrivateChatType[] = (await Request_PlayerPrivateChatPage(param)).data.records || [];

    if (list.length > 0) {
      setChatMessagePageNum(prev => prev + 1);
      setChatMessageList(prevList => [...list.reverse(), ...(prevList ?? [])]);
    }
  };

  return (

    <PullToRefresh onRefresh={() => chatMessagePageRequest()}>

      <div className="private-chat-popup" style={{ flex: 1, overflowY: 'auto' }}>
        {chatMessageList.length === 0 && <div className="chat-loading"> 加载中... </div>}
        {chatMessageList.map((chatMessage, index) => {
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

  );
};

export default ChatMessage;
