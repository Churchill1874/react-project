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
import { Request_ScrollingText, Request_OnlineCount} from '@/pages/groupchat/api';

const GroupChat: React.FC = ({ }) => {
  const [showEmojiPicker, setShowEmojiPicker] = useState<boolean>(false);
  const emojiButtonRef = useRef<HTMLButtonElement>(null);
  const handleEmojiSelect = (emoji: string) => {
    setMessageInput(prev => prev + emoji);
  };
  const navigate = useNavigate();

  const { roomNumber } = useParams<{ roomNumber: string }>();
  const roomNum = roomNumber ? parseInt(roomNumber, 10) : 1;

  const [messageInput, setMessageInput] = useState('');
  const { chatRoom1List, setChatRoom1List, playerInfo, onlineCount, setOnlineCount } = useStore();
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

  const onlintCountRequest = async () => {
      const onlineCount = (await Request_OnlineCount()).data;
      setOnlineCount(onlineCount);
  }

  const sendMessage = async () => {
    console.log(':::' + messageInput)
    if (!messageInput.trim()) return;
    const message: SendType = {
      roomNumber: 1,
      targetPlayerId: null,
      content: messageInput.trim(),
      replyContent: null,
      type: 1
    };
    try {
      const resp = await Request_Send(message);
      console.log('发送评论返回:', resp);
      setMessageInput('');
    } catch (error) {
      console.error('发送消息失败:', error);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  useLayoutEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = 0;
    }
  }, []);

  useEffect(() => {
    if (!chatRoom1List || chatRoom1List.length === 0) {
      chatMessagePageRequest();
    }
    onlintCountRequest();
  }, []);

  useEffect(() => {
    let attemptCount = 0;
    const maxAttempts = 20;
    const interval = setInterval(() => {
      const el = chatRef.current;
      if (!el) return;
      const isAtBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 5;
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

  useEffect(() => {
    if (chatRef.current && messageInput === '') {
      setTimeout(() => {
        if (chatRef.current) {
          chatRef.current.scrollTop = chatRef.current.scrollHeight;
          userScrolledRef.current = false;
        }
      }, 100);
    }
  }, [messageInput]);

  const [scrollTitles, setScrollTitles] = useState<string[]>([]);

  useEffect(() => {
    const fetchScrollTitles = async () => {
      try {
        const resp = await Request_ScrollingText();
        if (resp.code === 0 && resp.data?.length > 0) {
          setScrollTitles(resp.data);
        }
      } catch (e) {
        // 接口失败不影响聊天功能
      }
    };
    fetchScrollTitles();
  }, []);

  const groupName = "聊天大厅";

  return (
    <div className="chat-room">
      <header className="chat-header">
        <div className="chat-title">
          <div className="group-avatar" style={{ width: '40px', height: '40px' }}>🎪</div>
          <div className="group-info">
            <div className="group-name">{groupName}</div>
            <div className="online-count">{onlineCount.toLocaleString()}在线</div>
          </div>
        </div>

        {scrollTitles.length > 0 && (
          <div className="chat-scroll-news">
            <span className="chat-scroll-news-label">快讯</span>
            <div className="chat-scroll-news-track">
              <div className="chat-scroll-news-content">
                {[...scrollTitles, ...scrollTitles].map((title, index) => (
                  <span key={index} className="chat-scroll-news-item">
                    {title}
                    <span className="chat-scroll-news-sep">★</span>
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

{/*         <div onClick={() => navigate(-1)} ><span style={{ paddingRight: '5px', color: 'gray', fontSize: '16px' }} >
          退出 <RightOutline fontSize={18} />  </span>
        </div> */}

      </header>

      <div className="chat-messages" ref={chatRef}>

        {loading && (
          <div className="chat-loading-toast">
            <span className="chat-loading-dot" />
            <span className="chat-loading-dot" />
            <span className="chat-loading-dot" />
            <span className="chat-loading-label">消息加载中</span>
          </div>
        )}

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
                        <span className="username">{message.name}</span>
                      </div>
                      <div className="message-text">{message.content}</div>
                    </div>
                  </>
                )}
              </div>
            </>
          );
        })}
      </div>

      <div className="chat-input-area">
        <div className="input-container">
          <button className="emoji-btn" onClick={() => setShowEmojiPicker(!showEmojiPicker)} ref={emojiButtonRef}>😊</button>
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
            onKeyPress={handleKeyPress}
            style={{ height: 'auto', resize: 'none', overflow: 'hidden' }}
          />
          <button
            className="send-btn"
            onClick={sendMessage}
            disabled={!messageInput.trim() || loading}
          >
            发 送
          </button>
        </div>
      </div>
    </div>
  );
};

export default GroupChat;