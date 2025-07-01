import dayjs from 'dayjs'
import { useEffect, useState, forwardRef, useRef, useImperativeHandle, useContext } from 'react'
import { ChatRoomPageReqType, SendType, ChatRoomType, Request_ChatRoomPage, Request_Send } from '@/components/chatroom/api'
import { Avatar, Popup, Button, FloatingBubble, TextAreaRef, TextArea, Toast, Skeleton } from 'antd-mobile';
import { MessageFill } from 'antd-mobile-icons';
import avatars from '@/common/avatar';
import '@/components/chatroom/ChatRoom.less';
import useStore from '@/zustand/store';

const CustomTextArea = forwardRef<TextAreaRef, any>((props, ref) => {
  const innerRef = useRef<TextAreaRef>(null);

  useImperativeHandle(ref, () => ({
    focus: () => {
      if (innerRef.current) {
        innerRef.current.focus();
      }
    },
    clear: () => {
      if (innerRef.current) {
        innerRef.current.clear();
      }
    },
    blur: () => {
      if (innerRef.current) {
        innerRef.current.blur();
      }
    },
    get nativeElement() {
      return innerRef.current ? innerRef.current.nativeElement : null;
    }
  }));

  return <TextArea {...props} placeholder='请输入评论内容' ref={innerRef} />;
});

const ChatRoom: React.FC<{ roomNumber: number }> = ({
  roomNumber
}) => {
  const textAreaRef = useRef<TextAreaRef>(null);
  const { chatRoom1List, setChatRoom1List } = useStore();
  const [loading, setLoading] = useState(false);
  const [showsCommentInput, setShowCommentInput] = useState(false);
  const [chat, setChat] = useState<string>('');
  const [timer, setTimer] = useState<boolean>(true)
  const chatRef = useRef<HTMLDivElement>(null);

  const isDesktop = window.innerWidth >= 768;

  const bubbleStyle: React.CSSProperties = {
    '--size': isDesktop ? '60px' : '40px',
    '--initial-position-bottom': isDesktop ? '400px' : '100px',
    '--initial-position-right': isDesktop ? '900px' : '24px',
    '--edge-distance': '24px',
    zIndex: 1000,
  } as React.CSSProperties;

  const size = isDesktop ? 40 : 30;
  //点击输入框时候 让文本域获取到焦点
  const inputCommentClick = () => {
    setShowCommentInput(true);
    setTimeout(() => {
      if (textAreaRef.current) {
        textAreaRef.current.focus();
      }
    }, 0);
  }


  //输入文本域的内容存入状态
  const inputCommentChange = (value: string) => {
    setChat(value);
  }

  const cleanComment = () => {
    setChat('');
  }


  const chatMessagePageRequest = async () => {
    if (loading) return;
    setLoading(true);

    const param: ChatRoomPageReqType = { id: roomNumber, pageNum: 1, pageSize: 200 };
    const list: ChatRoomType[] = (await Request_ChatRoomPage(param)).data.records || [];

    setChatRoom1List(list)
    setLoading(false);
    setTimer(false)
  };

  const sendMessage = async () => {
    if (!chat.trim()) return;

    const message: SendType = {
      roomNumber: 1,
      targetPlayerId: null,
      content: chat,
      replyContent: null,
      type: 1
    };

    const resp = await (Request_Send(message));

    console.log('发送评论返回:', resp)


    if (textAreaRef.current) {
      textAreaRef.current.clear();
    }

    setChat('');
    setShowCommentInput(false)

    /*     const chatInfo = message as ChatRoomType;
        chatInfo.avatarPath = playerInfo?.avatarPath;
        chatInfo.name = playerInfo?.name;
    
        setChatRoom1List(prev => {
          return [...prev, chatInfo]
        }) */

  };



  useEffect(() => {
    if (!chatRoom1List || chatRoom1List.length === 0) {
      chatMessagePageRequest();

    }

  }, []);

  useEffect(() => {
    let attemptCount = 0;
    const maxAttempts = 20;
    const interval = setInterval(() => {
      const el = chatRef.current;
      if (!el) return;

      const isAtBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 5;

      // ✅ 首次加载仍然滚到底部
      // ✅ 用户未手动上滑时也滚到底部
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
    if (showsCommentInput) {
      requestAnimationFrame(() => {
        const el = chatRef.current;
        if (el) {
          el.scrollTop = el.scrollHeight;
        }
      });
    }
  }, [showsCommentInput]);

  const userScrolledRef = useRef(false);

  // 监听用户滚动
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


  return (
    <>

      <div className="chat" key={1} ref={chatRef}>

        {
          chatRoom1List?.map((chat, index) => {
            const prevMessage = chatRoom1List[index - 1];
            const showTime =
              index === 0 ||
              (prevMessage &&
                (dayjs(chat.createTime).diff(prevMessage.createTime, 'minute') > 60 ||
                  !dayjs(chat.createTime).isSame(prevMessage.createTime, 'day')));

            return (
              (
                <div key={index}>
                  {showTime && (
                    <span className="home-message-time">{dayjs(chat.createTime).format("YYYY-MM-DD HH:mm")}</span>
                  )}

                  <div className="chat-item">
                    <Avatar className="avatar" src={avatars[chat.avatarPath]} />
                    <div className="home-message-content">
                      <div><span style={{ color: '#0e467a', fontWeight: 'bold' }}>{chat.name}</span>: {chat.content}</div>
                    </div>
                  </div>
                </div>

              )
            )
          })
        }

        {

          (chatRoom1List.length <= 0 && timer) && (
            <>
              <Skeleton.Title animated />
              <Skeleton.Paragraph lineCount={3} animated />
            </>
          )
        }
        <Popup className='comments-popup'
          visible={showsCommentInput}
          onMaskClick={() => { setShowCommentInput(false) }}
          onClose={() => { setShowCommentInput(false) }}
          bodyStyle={{ height: '60vh', backgroundColor: 'transparent !important', boxShadow: 'none !important' }}
          maskStyle={{ backgroundColor: 'rgba(0, 0, 0, 0.5) !important' }}
        >
          <div className="comment-container">
            <div className="comment-area-container">
              <CustomTextArea className='comment-area' autoSize defaultValue={''} showCount maxLength={200} ref={textAreaRef} onChange={inputCommentChange} value={chat} />
            </div>
            <div className="comment-button-container">
              <Button className="clean-comment-button" color='primary' fill='outline' onClick={cleanComment}>清空</Button>
              <Button className="send-comment-button" color="primary" onClick={sendMessage}> 发送 </Button>
            </div>
          </div>
        </Popup>
      </div>

      <FloatingBubble
        style={bubbleStyle}
        axis="xy"
        onClick={inputCommentClick}
      >
        <MessageFill fontSize={size} />
      </FloatingBubble>


    </>
  );
}

export default ChatRoom;