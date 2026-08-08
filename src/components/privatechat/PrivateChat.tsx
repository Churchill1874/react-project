import { useState, useEffect } from "react";
import {
  Request_PrivateChatList,
  PrivateChatListType,
  PrivateChatPageRespType,
  Request_CleanUnreadStatus,
  Request_FindPlayerByAccount,
  Request_CleanByPlayerId,   // 新增
} from '@/components/privatechat/api';
import {
  Badge, Card, Avatar, Ellipsis, Popup, DotLoading,
  Skeleton, SearchBar, Toast, Dialog, SwipeAction   // 新增 Dialog, SwipeAction
} from 'antd-mobile';
import { LeftOutline, DeleteOutline } from 'antd-mobile-icons';   // 新增 DeleteOutline
import avatars from '@/common/avatar';
import '@/components/privatechat/PrivateChat.less';
import ChatMessage from '@/components/privatechat/ChatMessage/ChatMessage';
import OtherPeople from '@/pages/otherpeople/otherpeople';
import useStore from "@/zustand/store";
import dayjs from 'dayjs';

const PrivateMessageScrollContent = ({ hasMore }: { hasMore?: boolean }) => {
  return (
    <>
      {hasMore && (
        <div className="dot-loading-custom">
          <span>Loading</span>
          <DotLoading color='black' />
        </div>
      )}
    </>
  )
}

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
  const [loading, setLoading] = useState<boolean>(false);
  const [visibleCloseRight, setVisibleCloseRight] = useState(false);
  const [searchResult, setSearchResult] = useState<any>(null);
  const [searching, setSearching] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [searchPopupVisible, setSearchPopupVisible] = useState(false);

  // 新增：正在删除中的id集合（防止重复点击）
  const [deletingIds, setDeletingIds] = useState<Set<string>>(new Set());

  const privateChatListRequest = async () => {
    if (loading) return;
    setLoading(true);
    const privateChatListResp: PrivateChatPageRespType = (await Request_PrivateChatList()).data;
    setLoading(false);
    setPrivateChatList(privateChatListResp.list || []);
  };

  const cleanUnreadStatus = async (targetId: string) => {
    await Request_CleanUnreadStatus({ id: targetId });
  };

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
    console.log('privateChatPopup:', privateChatPopup);

    setPrivateChatPopup({ playerId, name, avatar, level });
    setPrivateChatList((prev: PrivateChatListType[]) =>
      prev.map((chat: PrivateChatListType) =>
        chat.id === param.id ? { ...chat, notRead: false } : chat
      )
    );
  };

  const openChatByPlayer = (player: { id: string; name: string; avatarPath: string; level: string }) => {
    if (player.id === String(playerInfo?.id)) {
      Toast.show({ content: '不能和自己聊天', position: 'bottom' });
      return;
    }
    setPrivateChatPopup({
      playerId: player.id,
      name: player.name,
      avatar: player.avatarPath,
      level: player.level,
    });
    setVisiblePrivateChatCloseRight(true);
  };

  const handleSearch = async (val: string) => {
    const trimmed = val.trim();
    if (!trimmed) {
      setSearchResult(null);
      return;
    }
    setSearching(true);
    setSearchPopupVisible(true);
    try {
      const resp = await Request_FindPlayerByAccount({ account: trimmed });
      if (resp.data && resp.data.length > 0) {
        setSearchResult(resp.data);
      } else {
        setSearchResult([]);
      }
    } catch {
      setSearchResult([]);
    } finally {
      setSearching(false);
    }
  };

  // ========== 新增：删除聊天记录 ==========
  const handleDeleteChat = (chatInfo: PrivateChatListType) => {
    // 判断对方id
    const targetId = chatInfo.sendId === playerInfo?.id ? chatInfo.receiveId : chatInfo.sendId;
    const targetName = chatInfo.sendId === playerInfo?.id ? chatInfo.receiveName : chatInfo.sendName;

    Dialog.confirm({
      title: '删除聊天记录',
      content: `确认删除与「${targetName}」的全部聊天记录？删除后无法恢复。`,
      confirmText: <span style={{ color: '#ff3141' }}>删除</span>,
      cancelText: '取消',
      onConfirm: async () => {
        if (deletingIds.has(chatInfo.id)) return;
        setDeletingIds(prev => new Set(prev).add(chatInfo.id));
        try {
          await Request_CleanByPlayerId({ playerAId: targetId });
          // 本地移除该条记录
          setPrivateChatList((prev: PrivateChatListType[]) =>
            prev.filter((c: PrivateChatListType) => c.id !== chatInfo.id)
          );
          Toast.show({ content: '已删除', position: 'bottom' });
        } catch {
          Toast.show({ content: '删除失败，请重试', position: 'bottom' });
        } finally {
          setDeletingIds(prev => {
            const next = new Set(prev);
            next.delete(chatInfo.id);
            return next;
          });
        }
      },
    });
  };
  // =========================================

  useEffect(() => {
    if (!visiblePrivateChatCloseRight && privateChatPopup.playerId) {
      cleanUnreadStatus(privateChatPopup.playerId);
      markNotReadFalseByReceiveId(privateChatPopup.playerId);
    }
  }, [visiblePrivateChatCloseRight]);

  useEffect(() => {
    if (!privateChatList || privateChatList.length === 0) {
      privateChatListRequest();
    }
  }, []);

  return (
    <>
      {/* 搜索框区域 */}
      <div style={{ padding: '8px 12px', background: '#ffffff6f', display: 'flex', gap: '8px', alignItems: 'center' }}>
        <div style={{ flex: 1 }}>
          <SearchBar
            placeholder="搜索账号或用户名"
            value={searchKeyword}
            onChange={(val) => setSearchKeyword(val)}
            onSearch={(val) => {
              setSearchKeyword(val);
              handleSearch(val);
            }}
            onClear={() => {
              setSearchKeyword('');
              setSearchResult(null);
            }}
            style={{ '--border-radius': '12px' }}
          />
        </div>
        <div
          onClick={() => {
            if (searchKeyword.trim()) handleSearch(searchKeyword);
          }}
          style={{
            flexShrink: 0,
            padding: '6px 14px',
            background: '#1890ff',
            color: '#fff',
            borderRadius: '20px',
            fontSize: '14px',
            cursor: 'pointer',
            whiteSpace: 'nowrap',
          }}
        >
          搜索
        </div>
      </div>

      {(!privateChatList || privateChatList.length === 0) && loading && (
        <>
          <Skeleton.Title animated />
          <Skeleton.Paragraph lineCount={8} animated />
        </>
      )}

      {/* 搜索结果弹窗 */}
      <Popup
        visible={searchPopupVisible}
        onMaskClick={() => {
          setSearchPopupVisible(false);
          setSearchResult(null);
        }}
        position='bottom'
        bodyStyle={{
          borderRadius: '16px 16px 0 0',
          minHeight: '40vh',
          maxHeight: '70vh',
          overflowY: 'auto',
          padding: '16px',
          boxSizing: 'border-box',
          width: '100%'
        }}
      >
        <div style={{ textAlign: 'center', fontWeight: 'bold', fontSize: '15px', marginBottom: '12px' }}>
          搜索结果
          <span
            onClick={() => { setSearchPopupVisible(false); setSearchResult(null); }}
            style={{ float: 'right', color: '#999', fontWeight: 'normal', fontSize: '14px' }}
          >
            关闭
          </span>
        </div>

        {searching && (
          <div style={{ padding: '20px 0', color: '#999', fontSize: '14px', textAlign: 'center' }}>搜索中...</div>
        )}

        {Array.isArray(searchResult) && searchResult.length === 0 && (
          <div style={{ padding: '20px 0', color: '#999', fontSize: '14px', textAlign: 'center' }}>未找到相关用户</div>
        )}

        {Array.isArray(searchResult) && searchResult.map((player: any, index: number) => (
          <Card
            key={index}
            className="private-messgae-card"
            onClick={() => {
              setSearchPopupVisible(false);
              setSearchResult(null);
              openChatByPlayer(player);
            }}
            title={
              <div className="private-messgae-title">
                <Avatar src={avatars[player.avatarPath]} className="private-messgae-avatar" />
                <div className="private-messgae-content">
                  <span className="private-messgae-name">{player.name}</span>
                  <span style={{ fontSize: '12px', color: '#999' }}>账号：{player.account}</span>
                </div>
              </div>
            }
          >
            <div style={{ color: '#1890ff', fontSize: '13px', textAlign: 'right' }}>发送私信 →</div>
          </Card>
        ))}
      </Popup>

      {/* ========== 聊天列表：SwipeAction 左滑删除 ========== */}
      {privateChatList?.map((chatInfo, index) => (
        <SwipeAction
          key={index}
          rightActions={[
            {
              key: 'delete',
              text: (
                <div className="swipe-delete-btn">
                  <DeleteOutline fontSize={20} />
                  <span>删除</span>
                </div>
              ),
              color: 'danger',
              onClick: () => handleDeleteChat(chatInfo),
            },
          ]}
        >
          <Card
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
        </SwipeAction>
      ))}
      {/* ===================================================== */}

      {(!privateChatList || privateChatList.length === 0) && <PrivateMessageScrollContent />}

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
          name={privateChatPopup.name}        
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