import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import '@/pages/groupchat/GroupChat.less';
import useStore from '@/zustand/store';
import { useParams, useNavigate } from 'react-router-dom';
import { Avatar } from 'antd-mobile';
import { ChatRoomPageReqType, SendType, ChatRoomType, Request_ChatRoomPage, Request_Send } from '@/components/chatroom/api'
import avatars from '@/common/avatar';
import EmojiPickerModal from '@/common/Emoji';
import dayjs from 'dayjs'
import { RightOutline } from 'antd-mobile-icons';

const GroupChat: React.FC = ({ }) => {
  //表情工具
  const [showEmojiPicker, setShowEmojiPicker] = useState<boolean>(false);
  const emojiButtonRef = useRef<HTMLButtonElement>(null);
  const handleEmojiSelect = (emoji: string) => {
    setMessageInput(prev => prev + emoji);
  };
  const navigate = useNavigate();


  const { roomNumber } = useParams<{ roomNumber: string }>();
  const roomNum = roomNumber ? parseInt(roomNumber, 10) : 1;

  const [messageInput, setMessageInput] = useState('');
  const { chatRoom1List, setChatRoom1List, playerInfo } = useStore();
  const [loading, setLoading] = useState(false);

  const chatRef = useRef<HTMLDivElement>(null);
  const userScrolledRef = useRef(false);

  const chatMessagePageRequest = async () => {
    if (loading) return;
    setLoading(true);

    const param: ChatRoomPageReqType = { id: roomNum, pageNum: 1, pageSize: 200 };
    const list: ChatRoomType[] = (await Request_ChatRoomPage(param)).data.records || [];

    setChatRoom1List(list)
    setLoading(false);
  };

  // 🔥 修复发送消息逻辑
  const sendMessage = async () => {
    console.log(':::' + messageInput)
    if (!messageInput.trim()) return;

    const message: SendType = {
      roomNumber: 1,
      targetPlayerId: null,
      content: messageInput.trim(), // 🔥 使用 messageInput 而不是 chat
      replyContent: null,
      type: 1
    };

    try {
      const resp = await Request_Send(message);
      console.log('发送评论返回:', resp);

      // 🔥 清空输入框
      setMessageInput('');

      // 可选：立即添加到本地列表（如果API不会立即返回新消息）
      // const newMessage = {
      //   ...message,
      //   id: Date.now(),
      //   playerId: playerInfo?.id,
      //   avatarPath: playerInfo?.avatarPath,
      //   name: playerInfo?.name,
      //   createTime: new Date().toLocaleTimeString()
      // };
      // setChatRoom1List(prev => [...prev, newMessage]);

    } catch (error) {
      console.error('发送消息失败:', error);
    }
  };

  // 🔥 处理回车发送
  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // 组件挂载时重置滚动位置
  useLayoutEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = 0;
    }
  }, []);

  // 初始化数据
  useEffect(() => {
    if (!chatRoom1List || chatRoom1List.length === 0) {
      chatMessagePageRequest();
    }
  }, []);

  // 自动滚动到底部的逻辑
  useEffect(() => {
    let attemptCount = 0;
    const maxAttempts = 20;
    const interval = setInterval(() => {
      const el = chatRef.current;
      if (!el) return;

      const isAtBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 5;

      // 首次加载或用户未手动上滑时滚到底部
      if (!userScrolledRef.current) {
        el.scrollTop = el.scrollHeight;
      }

      attemptCount++;
      if (isAtBottom || attemptCount >= maxAttempts) {
        clearInterval(interval);
      }
    }, 50);

    return () => clearInterval(interval);
  }, [chatRoom1List]);

  // 监听用户滚动行为
  useEffect(() => {
    const el = chatRef.current;
    if (!el) return;

    const onScroll = () => {
      const threshold = 60;
      const isNearBottom = el.scrollHeight - el.scrollTop - el.clientHeight < threshold;
      userScrolledRef.current = !isNearBottom;
    };

    el.addEventListener('scroll', onScroll);
    return () => el.removeEventListener('scroll', onScroll);
  }, []);

  // 发送消息后自动滚动到底部
  useEffect(() => {
    if (chatRef.current && messageInput === '') {
      // 当输入框被清空时（发送消息后），滚动到底部
      setTimeout(() => {
        if (chatRef.current) {
          chatRef.current.scrollTop = chatRef.current.scrollHeight;
          userScrolledRef.current = false; // 重置用户滚动状态
        }
      }, 100);
    }
  }, [messageInput]);

  // 组件内部配置
  const groupName = "聊天大厅";
  const onlineCount = 3847;


  return (
    <div className="chat-room">
      {/* 聊天头部 */}
      <header className="chat-header">


        <div className="chat-title">
          <div className="group-avatar" style={{ width: '40px', height: '40px' }}>🎪</div>
          <div className="group-info">
            <div className="group-name">{groupName}</div>
            <div className="online-count">{onlineCount.toLocaleString()}人在线</div>
          </div>
        </div>

{/*         <div onClick={() => navigate(-1)} ><span style={{ paddingRight: '5px', color: 'gray', fontSize: '16px' }} >
          退出 <RightOutline fontSize={18} />  </span>
        </div> */}

      </header>


      {/* 聊天消息区域 - 唯一的滚动容器 */}
      <div className="chat-messages" ref={chatRef}>
        {chatRoom1List.map((message, index) => {
          const prevMessage = chatRoom1List[index - 1]
          const showTime = index === 0
            || (prevMessage && (dayjs(message.createTime).diff(prevMessage.createTime, 'minute') > 60
              || !dayjs(message.createTime).isSame(prevMessage.createTime, 'day')))

          return (
            <>
              {showTime && (
                <div className="home-message-time">{dayjs(message.createTime).format("YYYY-MM-DD HH:mm")}</div>
              )}

              <div key={message.id} className={`message-item ${message.playerId === playerInfo?.id ? 'my-message' : 'other-message'}`}>

                {message.playerId === playerInfo?.id ? (
                  <>
                    <div className="message-bubble">
                      {/*                   <div className="message-header">
                    <span className="message-time">{message.createTime}</span>
                  </div> */}
                      <div className="message-text">{message.content}</div>
                    </div>
                    <div className="message-avatar">
                      <Avatar className="avatar" src={avatars[message.avatarPath]} />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="message-avatar">
                      <Avatar className="avatar" src={avatars[message.avatarPath]} />
                    </div>
                    <div className="message-bubble">
                      <div className="message-header">
                        <span className="username">{message.name} lv.{message.level}</span>
                        {/* <span className="message-time">lv.{message.level}</span> */}
                      </div>
                      <div className="message-text">{message.content}</div>
                    </div>
                  </>
                )}
              </div>
            </>


          );
        }
        )}
      </div>

      {/* 🔥 输入区域 - 修复后的版本 */}
      <div className="chat-input-area">
        <div className="input-container">
          <button className="emoji-btn" onClick={() => setShowEmojiPicker(!showEmojiPicker)} ref={emojiButtonRef}>😊</button>
          {/* 🔥 表情选择器弹窗 */}
          <EmojiPickerModal
            isVisible={showEmojiPicker}
            onClose={() => setShowEmojiPicker(false)}
            onEmojiSelect={handleEmojiSelect}
            triggerRef={emojiButtonRef}
          />


          <textarea
            className="message-input"
            placeholder="说点什么吧..."
            rows={1}
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            onKeyPress={handleKeyPress} // 🔥 添加回车发送
            style={{
              height: 'auto',
              resize: 'none',
              overflow: 'hidden' // 防止滚动条
            }}
          />
          <button
            className="send-btn"
            onClick={sendMessage}
            disabled={!messageInput.trim() || loading} // 🔥 添加禁用状态
          >
            {/* {loading ? '发送中...' : '发送'} */}
            发 送
          </button>
        </div>
      </div>
    </div>
  );
};

export default GroupChat;