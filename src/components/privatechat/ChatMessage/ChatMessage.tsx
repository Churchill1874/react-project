import { useState, useEffect } from "react";
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
}) => {


  console.log('currentPlayerAvatar:', currentPlayerAvatar);

  useEffect(() => {
    chatMessagePageRequest();
  }, [accountA])

  // 获取聊天记录
  const chatMessagePageRequest = async () => {
    const param: ChatPageReqType = { accountA, pageNum: chatMessagePageNum, pageSize: 50 };
    const list: PrivateChatType[] = (await Request_PlayerPrivateChatPage(param)).data.records || [];

    if (list.length > 0) {
      setChatMessagePageNum(prev => prev + 1);
      setChatMessageList(prevList => [...list, ...(prevList ?? [])]);
    }
  };

  return (

    <PullToRefresh onRefresh={() => chatMessagePageRequest()}>

      <div className="private-chat-popup" style={{ flex: 1, overflowY: 'auto' }}>
        {chatMessageList.length === 0 && <div className="chat-loading"> 加载中... </div>}
        {chatMessageList.map((chatMessage, index) => {
          console.log('当前操作人是:', currentPlayerAccount, '聊天记录:', chatMessage)
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
      </div>

    </PullToRefresh>

  );
};

export default ChatMessage;
