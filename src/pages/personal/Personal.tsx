import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Avatar, TextArea, Tag, Toast, Modal } from 'antd-mobile';
import { FcBriefcase, FcImport, FcHeadset, FcCloseUpMode, FcSelfie, FcLike } from 'react-icons/fc';
import { EditSOutline, RightOutline, FlagOutline, SmileOutline, PhoneFill, MailOutline, TravelOutline, UserCircleOutline, CompassOutline } from 'antd-mobile-icons';
import { Request_GetPlayerInfo, Request_Logout } from '@/pages/personal/api'
import avatars from '@/common/avatar';
import '@/pages/personal/Personal.less';
import { levelEnum } from '@/common/level'
import CustomerContact from '@/components/tools/CustomerContact';
import useStore from '@/zustand/store';

const UserCenter: React.FC = () => {

  const navigate = useNavigate();
  const { playerInfo, setPlayerInfo } = useStore();

  const playerReq = async () => {
    const playerInfo = (await Request_GetPlayerInfo()).data;
    console.log("play:", playerInfo.campType)
    setPlayerInfo(playerInfo)
  }

  const showCustomerContact = () => {
    Modal.show({
      content: <CustomerContact text={'@FengXiao170'} />,
      closeOnMaskClick: true,
    })
  }

  useEffect(() => {
    playerReq();
  }, []);

  //请求退出
  const logout = async () => {
    await Request_Logout();

    Toast.show({
      icon: 'success',
      content: '已退出',
      duration: 2000,
    });

    setTimeout(() => {
      setPlayerInfo(null);

      navigate('/login');
    }, 2000); // 1秒后跳转到首页

  }

  const editPlayerInfo = () => {
    navigate('/setPersonal')
  }

  //跳到点赞记录
  const toLikes = (playerId) => {
    navigate(`/likes?id=${playerId}`)
  }
  //跳到关注好友
  const toCollect = (playerId) => {
    navigate(`/collect?playerId=${playerId}&flag=0`)
  }
  //跳到粉丝列表
  const toFollowers = (playerId) => {
    navigate(`/followers?playerId=${playerId}&flag=1`)
  }

  return (
    <>
      <div className="personal">
        <Card className="card">
          <div className="avatar-container">
            <div className="avatar-with-text">
              <Avatar className="personal-avatar" src={avatars[playerInfo?.avatarPath]} />
            </div>
            <div className="base-info">
              <span className="name"> 昵称: {playerInfo?.name} </span>
              <div className="account">
                ID: {playerInfo?.account}
                <span className="status">
                  {playerInfo?.status ?
                    (<Tag className="status-tag" round color="#87d068" >正常</Tag>)
                    :
                    (<Tag className="status-tag" round color="warning" >禁用</Tag>)
                  }
                </span>

                {/* <span className="balance"> 余额: {playerInfo?.balance} U</span> */}
              </div>

              <span className='level'>
                <span>lv.{playerInfo?.level}  <span className='levelName'>  {levelEnum(playerInfo?.level)} </span>  </span>
              </span>

            </div>
            <div className="right-info">
              <span onClick={editPlayerInfo}>
                <EditSOutline fontSize={20} />
              </span>
            </div>
          </div>
        </Card>

        <div className="personal-info-space">
          <span style={{ color: 'white', fontSize: '16px' }}>
            <div style={{ fontWeight: 'bold' }}> {playerInfo?.followersCount} </div>
            <div className="label" onClick={() => { toFollowers(playerInfo?.id) }} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ marginRight: '3px' }}><FcCloseUpMode fontSize={16} /> </div>
              <div> 粉丝</div>
            </div>
          </span>
          <span style={{ color: 'white', fontSize: '16px' }}>
            <div style={{ fontWeight: 'bold' }}> {playerInfo?.collectCount} </div>
            <div className="label" onClick={() => { toCollect(playerInfo?.id) }} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ marginRight: '3px' }}><FcSelfie fontSize={17} /> </div>
              <div>关注</div>
            </div>
          </span>
          <span style={{ color: 'white', fontSize: '16px' }}>
            <div style={{ fontWeight: 'bold' }}> {playerInfo?.likesReceivedCount} </div>
            <div className="label" onClick={() => { toLikes(playerInfo?.id) }} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }} >
              <div style={{ marginRight: '3px' }}><FcLike fontSize={16} /> </div>
              <div>收赞</div>
            </div>
          </span>
        </div>

        <div className="personal-info-container">
          <Card className="card-personal-info">
            <div className="card-personal-info-container">
              {/*
              <span className="personal-info">

                                 <span className="evaluate">
                  <AiOutlineTag /> 标签:
                  <span className="blue-tag">
                    美分
                  </span>
                  <span className="red-tag">
                    小粉红
                  </span>
                </span> 

              </span>
              */}
              <span className="personal-info">
                <span className="left">
                  <FlagOutline /> 支持:
                </span>
                {playerInfo?.campType === 0 &&
                  <span className='right'>
                    无
                  </span>
                }
                {playerInfo?.campType === 1 &&
                  <span className='right' style={{ display: 'flex', alignItems: 'center' }}>
                    <span style={{ fontSize: '10px' }}>🔴 </span>  共产主义阵营
                  </span>
                }
                {playerInfo?.campType === 2 &&
                  <span className='right' style={{ display: 'flex', alignItems: 'center' }}>
                    <span style={{ fontSize: '10px' }}>🔵 </span>  资本主义阵营
                  </span>
                }
              </span>

              <span className="personal-info">
                <span className="left">
                  <UserCircleOutline /> 性别:
                </span>
                <span className='right'> {playerInfo?.gender === 1 ? '男' : '女'} </span>
              </span>
              <span className="personal-info">
                <span className="left">
                  <CompassOutline /> 城市:
                </span>
                <span className='right'> {playerInfo?.city} </span>
              </span>
              <span className="personal-info">
                <span className="left">
                  <SmileOutline /> 生日:
                </span>
                <span className='right'> {playerInfo?.birth} </span>
              </span>
              <span className="personal-info">
                <span className="left">
                  <PhoneFill /> 手机:
                </span>
                <span className='right'> {playerInfo?.phone} </span>
              </span>
              <span className="personal-info">
                <span className="left">
                  <MailOutline /> 邮箱:
                </span>
                <span className='right'> {playerInfo?.email} </span>
              </span>
              <span className="personal-info">
                <span className="left">
                  <TravelOutline /> 电报:
                </span>
                <span className='right'> {playerInfo?.tg} </span>
              </span>
              <div>
                <span className="personal-info-desc">留言板:</span>
                <TextArea rows={3} maxLength={50} className="message-board" placeholder="请输入内容" value={playerInfo?.selfIntroduction ? playerInfo.selfIntroduction : ""} readOnly />
              </div>
            </div>
          </Card>
        </div>

        <div className="card-outer-container">
          <Card className="card-inner-container">

            <div className='fucation'>
              <div className='personal-card-title'><FcBriefcase className='icon' fontSize={22} /> 钱包 {playerInfo?.balance} U </div> <RightOutline className="right-icon" />
            </div>

            <div className='fucation' onClick={() => showCustomerContact()}>
              <div className='personal-card-title'><FcHeadset className='icon' fontSize={22} /> 客服</div> <RightOutline className="right-icon" />
            </div>

            <div className='fucation'>
              <div className='personal-card-title' onClick={logout}><FcImport className='icon' fontSize={22} /> 退出</div> <RightOutline className="right-icon" />
            </div>
          </Card>
        </div>

      </div>

    </>
  );
};

export default UserCenter;
