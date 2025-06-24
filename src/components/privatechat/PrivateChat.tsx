import { useState, useEffect } from "react";
import {
  Request_PrivateChatList,
  PrivateChatListType,
  PrivateChatPageRespType,
  Request_CleanUnreadStatus
} from '@/components/privatechat/api';
import { Badge, Card, Avatar, Ellipsis, Popup } from 'antd-mobile';
import { LeftOutline } from 'antd-mobile-icons';
import avatars from '@/common/avatar';
import '@/components/privatechat/PrivateChat.less';
import ChatMessage from '@/components/privatechat/ChatMessage/ChatMessage';
import OtherPeople from '@/pages/otherpeople/otherpeople';
import useStore from "@/zustand/store";
import dayjs from 'dayjs';


const PrivateChat: React.FC = () => {
  interface PlayerBaseType {
    playerId: string;
    name: any;
    avatar: any;
    level: any;
  }

  const {
    playerInfo,
    privateChatList,
    setPrivateChatList,
    markNotReadFalseByReceiveId
  } = useStore();


  const [visiblePrivateChatCloseRight, setVisiblePrivateChatCloseRight] = useState(false);
  const [privateChatPopup, setPrivateChatPopup] = useState<PlayerBaseType>({
    playerId: '',
    name: "",
    avatar: "",
    level: ""
  });

  const [visibleCloseRight, setVisibleCloseRight] = useState(false);


  const privateChatListRequest = async () => {
    const privateChatListResp: PrivateChatPageRespType = (await Request_PrivateChatList()).data;
    setPrivateChatList(privateChatListResp.list);
  };

  const cleanUnreadStatus = async (targetId: string) => {
    (await Request_CleanUnreadStatus({ id: targetId }))
  }

  const showPrivateChatPopup = (param: PrivateChatListType) => {
    setVisiblePrivateChatCloseRight(true);

    let playerId, name, avatar, level;
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

    setPrivateChatPopup({ playerId, name, avatar, level });

    setPrivateChatList((prev: PrivateChatListType[]) =>
      prev.map((chat: PrivateChatListType) =>
        chat.id === param.id ? { ...chat, notRead: false } : chat
      )
    );
  };

  useEffect(() => {
    if (!visiblePrivateChatCloseRight && privateChatPopup.playerId) {
      cleanUnreadStatus(privateChatPopup.playerId)
      markNotReadFalseByReceiveId(privateChatPopup.playerId)
    }
  }, [visiblePrivateChatCloseRight])

  useEffect(() => {
    console.log('list:', privateChatList)
    if (!privateChatList || privateChatList.length === 0) {
      console.log(1)
      privateChatListRequest();
    }

  }, []);

  return (
    <>
      {privateChatList?.map((chatInfo, index) => (
        <Card
          key={index}
          onClick={() => showPrivateChatPopup(chatInfo)}
          className="private-messgae-card"
          title={
            <div className="private-messgae-title">
              <Avatar
                src={avatars[chatInfo.sendId === playerInfo?.id ? chatInfo.receiveAvatarPath : chatInfo.sendAvatarPath]}
                className="private-messgae-avatar"
              />
              <div className="private-messgae-content">
                <span className="private-messgae-name">
                  {chatInfo.sendId === playerInfo?.id ? chatInfo.receiveName : chatInfo.sendName}
                </span>
                <Ellipsis className="private-message-chat" direction='end' rows={1} content={chatInfo.content} />
              </div>
            </div>
          }
        >
          <div className="private-message-time">
            <div className="left">{dayjs(chatInfo.createTime).format('YYYY-MM-DD HH:mm')}</div>
            {chatInfo.notRead && <div className="right"><Badge content={Badge.dot} /></div>}
          </div>
        </Card>
      ))}

      <Popup
        bodyStyle={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}
        position='right'
        closeOnSwipe
        closeOnMaskClick
        visible={visiblePrivateChatCloseRight}
        onClose={() => setVisiblePrivateChatCloseRight(false)}
        key={visiblePrivateChatCloseRight ? "open" : "close"}
      >
        <div className="private-icon-avatar-wrapper">
          <LeftOutline className="icon" onClick={() => setVisiblePrivateChatCloseRight(false)} />
          <Avatar className="avatar" src={avatars[privateChatPopup.avatar]} onClick={() => setVisibleCloseRight(true)} />
          <span className="name">{privateChatPopup.name}</span>
        </div>

        <ChatMessage
          targetId={privateChatPopup.playerId}
          avatar={privateChatPopup.avatar}
          level={privateChatPopup.level}
          currentPlayerId={playerInfo?.id}
          currentPlayerAvatar={playerInfo?.avatarPath}
          visiblePrivateChatCloseRight={visiblePrivateChatCloseRight}
        />

        <Popup
          className='news-record-popup'
          bodyStyle={{ display: 'flex', flexDirection: 'column', overflowY: 'auto', width: '100%', height: '100%' }}
          position='right'
          closeOnMaskClick
          visible={visibleCloseRight}
          onClose={() => setVisibleCloseRight(false)}
        >
          <OtherPeople setVisibleCloseRight={setVisibleCloseRight} otherPlayerId={privateChatPopup.playerId} />
        </Popup>
      </Popup>
    </>
  );
};

export default PrivateChat;
