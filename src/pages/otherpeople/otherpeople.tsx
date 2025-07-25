import { useState, useEffect } from 'react';
import { Card, Avatar, TextArea, Tag, NavBar, Toast, Popup, Button } from 'antd-mobile';
import { FlagOutline, MailOutline, UserCircleOutline, TravelOutline, SmileOutline, LeftOutline } from 'antd-mobile-icons';
import avatars from '@/common/avatar';
import '@/pages/otherpeople/otherpeople.less';
import { levelEnum } from '@/common/level';
import { getBirthRange } from '@/common/birth';
import { PlayerInfoType, } from '@/pages/personal/api';
import { Request_FindPlayerById } from '@/pages/otherpeople/api';
import { Req_Add, Req_Delete } from '@/components/relation/api';
import ChatMessage from '@/components/privatechat/ChatMessage/ChatMessage';
import useStore from '@/zustand/store';

const OtherPeople: React.FC<any> = ({ setVisibleCloseRight, otherPlayerId }) => {
  const [visiblePrivateChatCloseRight, setVisiblePrivateChatCloseRight] = useState(false);
  const [requesting, setRequesting] = useState<boolean>(false);
  const [otherPeople, setOtherPeople] = useState<PlayerInfoType>();
  const { playerInfo } = useStore();

  const isMe = otherPlayerId == playerInfo?.id;

  const playerReq = async () => {
    const otherPlayerInfo = (await Request_FindPlayerById({ id: otherPlayerId })).data;
    setOtherPeople(otherPlayerInfo)
  }

  //添加关注
  const addCollectReq = async () => {
    if (requesting) {
      return;
    }
    setRequesting(true)

    const addCollectResp = (await Req_Add({ targetPlayerId: otherPeople?.id }))
    if (addCollectResp.code === 0) {
      Toast.show({
        icon: 'success',
        content: '关注成功',
        duration: 1000,
      });
      setOtherPeople(prev => prev ? { ...prev, collected: !prev.collected } : prev)
    }
    setRequesting(false)
  }

  //取消关注
  const cancelCollectReq = async () => {
    if (requesting) {
      return;
    }
    setRequesting(true)

    const cancelCollectResp = (await Req_Delete({ targetPlayerId: otherPeople?.id }))
    if (cancelCollectResp.code === 0) {
      Toast.show({
        icon: 'success',
        content: '已取消',
        duration: 1000,
      });
      setOtherPeople(prev => prev ? { ...prev, collected: !prev.collected } : prev)
    }
    setRequesting(false)
  }

  const reqCollect = () => {
    if (otherPeople?.collected) {
      cancelCollectReq();
    } else {
      addCollectReq();
    }
  }

  useEffect(() => {
    playerReq();
  }, [otherPlayerId]);

  //返回上一层
  const back = () => {
    setVisibleCloseRight?.(false)
  };


  return (
    <>
      <NavBar className="other-people-info" onBack={back}>
        昵称: {otherPeople?.name}
      </NavBar>
      <div className="personal">

        <Card className="card">
          <div className="avatar-container">
            <div className="avatar-with-text">
              <Avatar className="personal-avatar" src={avatars[otherPeople?.avatarPath]} />
            </div>
            <div className="other-base-info">
              {/* <span className="name"> 昵称: {otherPlayerInfo?.name} </span> */}
              <span className="account">
                ID: {otherPeople?.account}

                {/*                 <span className="balance"> 余额: {otherPlayerInfo?.balance} U</span> */}
              </span>

              <span className='level'>
                <span> lv.{otherPeople?.level}  <span className='levelName'> ( {levelEnum(otherPeople?.level)} )</span>  </span>
              </span>

              <span className="status">
                状态:
                {/*                 {otherPlayerInfo?.status ?
                  (<Tag className="status-tag" color="success" fill="outline">正常</Tag>)
                  :
                  (<Tag className="status-tag" color="warning" fill="outline">禁用</Tag>)
                } */}

                {otherPeople?.status ?
                  <span style={{ color: 'gray', marginLeft: '3px' }}>正常</span>
                  :
                  <span style={{ color: 'red', marginLeft: '3px' }}>禁用</span>
                }
              </span>
            </div>
            {!isMe &&
              <div className="right-info">
                <span >
                  <Tag onClick={reqCollect} className="collect" color={otherPeople?.collected ? 'gray' : 'rgba(243, 6, 6, 0.7)'} > {otherPeople?.collected ? '已关注' : '关注'} </Tag>
                  <Tag onClick={() => setVisiblePrivateChatCloseRight(true)} className="message" color="primary" > 私信 </Tag>
                </span>
              </div>
            }

          </div>
        </Card>

        <div className="other-personal-info-space">
          <span style={{ color: 'white', fontSize: '15px' }}>
            <div> 0 </div>
            <div className="label">粉丝</div>
          </span>
          <span style={{ color: 'white', fontSize: '15px' }}>
            <div> 0 </div>
            <div className="label">关注</div>
          </span>
          <span style={{ color: 'white', fontSize: '15px' }}>
            <div> 0 </div>
            <div className="label">被赞</div>
          </span>
        </div>

        <div className="other-personal-info-container">
          <Card className="other-card-personal-info">
            <div className="card-personal-info-container">
              <span className="other-personal-info">
                <span className="left">
                  <UserCircleOutline /> 性别:
                </span>
                <span className='right'> {otherPeople?.gender === 1 ? '男' : '女'} </span>
              </span>
              <span className="personal-info">
                <span className="left">
                  <SmileOutline /> 年龄:
                </span>
                <span className='right'> {getBirthRange(otherPeople?.birth)} </span>
              </span>
              <span className="other-personal-info">
                <span className="left">
                  <FlagOutline /> 城市:
                </span>
                <span className='right'> {otherPeople?.city} </span>
              </span>
              <span className="other-personal-info">
                <span className="left">
                  <MailOutline /> 邮箱:
                </span>
                <span className='right'> {otherPeople?.email} </span>
              </span>
              <span className="other-personal-info">
                <span className="left">
                  <TravelOutline /> 电报:
                </span>
                <span className='right'> {otherPeople?.tg} </span>
              </span>
              <div>
                <span className="personal-info-desc">留言板:</span>
                <TextArea rows={3} maxLength={50} className="message-board" placeholder="请输入内容" value={otherPeople?.selfIntroduction ? otherPeople.selfIntroduction : ""} readOnly />
              </div>
            </div>
          </Card>
        </div>

      </div>

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
          <Avatar className="avatar" src={avatars[otherPeople?.avatarPath]} onClick={() => setVisibleCloseRight(true)} />
          <span className="name">{otherPeople?.name}</span>
        </div>

        <ChatMessage
          targetId={otherPeople?.id}
          avatar={otherPeople?.avatarPath}
          level={otherPeople?.level}
          currentPlayerId={playerInfo?.id}
          currentPlayerAvatar={playerInfo?.avatarPath}
          visiblePrivateChatCloseRight={visiblePrivateChatCloseRight}
        />
      </Popup>
    </>
  );
};

export default OtherPeople;
