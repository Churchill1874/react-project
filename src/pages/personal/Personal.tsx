import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Avatar, TextArea, Tag } from 'antd-mobile';
import { FcOnlineSupport, FcBusinessman, FcSalesPerformance, FcCopyright, FcImport, FcHeadset } from 'react-icons/fc';
import { EditSOutline, RightOutline, FlagOutline, SmileOutline, PhoneFill, MailOutline, HistogramOutline, UserCircleOutline } from 'antd-mobile-icons';
import { Request_GetPlayerInfo, Request_Logout } from '@/pages/personal/api'
import avatars from '@/common/avatar';
import '@/pages/personal/Personal.less';
import { levelEnum } from '@/common/level'
//全局状态管理
import useStore from '@/zustand/store';

const UserCenter: React.FC = () => {
  const { playerInfo, setPlayerInfo } = useStore();

  const playerReq = async () => {
    const playerInfo = (await Request_GetPlayerInfo()).data;
    setPlayerInfo(playerInfo)
  }

  useEffect(() => {
    if (!playerInfo) {
      playerReq();
    }

  }, [playerInfo]);

  //请求退出
  const logout = async () => {
    await Request_Logout();
    setPlayerInfo(null);
  }

  const navigate = useNavigate();
  const editPlayerInfo = () => {
    navigate('/setPersonal')
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
              <span className="account">
                账号: {playerInfo?.account}
                <span className="status">
                  {playerInfo?.status ?
                    (<Tag className="tag" color="success" fill="outline">正常</Tag>)
                    :
                    (<Tag className="tag" color="warning" fill="outline">禁用</Tag>)
                  }
                </span>
              </span>
              <span className="balance"> 余额: {playerInfo?.balance} U</span>
            </div>
            <div className="right-info">
              <span onClick={editPlayerInfo}>
                <EditSOutline fontSize={20} />
              </span>
            </div>
          </div>
        </Card>

        <div className="personal-info-space">
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
            <div className="label">收藏</div>
          </span>
        </div>

        <div className="personal-info-container">
          <Card className="card-personal-info">
            <div className="card-personal-info-container">
              <span className="personal-info">
                <span className="left">
                  <HistogramOutline /> 等级:
                </span>
                <span> {playerInfo?.level}级 ( {levelEnum(playerInfo?.level)} ) </span>
                <RightOutline className="right-icon" />
              </span>
              <span className="personal-info">
                <span className="left">
                  <UserCircleOutline /> 性别:
                </span>
                <span> {playerInfo?.gender === 1 ? '男' : '女'} </span>
              </span>
              <span className="personal-info">
                <span className="left">
                  <FlagOutline /> 城市:
                </span>
                <span> {playerInfo?.city} </span>
              </span>
              <span className="personal-info">
                <span className="left">
                  <SmileOutline /> 生日:
                </span>
                <span> {playerInfo?.birth} </span>
              </span>
              <span className="personal-info">
                <span className="left">
                  <PhoneFill /> 手机:
                </span>
                <span> {playerInfo?.phone} </span>
              </span>
              <span className="personal-info">
                <span className="left">
                  <MailOutline /> 邮箱:
                </span>
                <span> {playerInfo?.email} </span>
              </span>

              <div>
                <span className="personal-info-desc">留言板:</span>
                <TextArea rows={3} maxLength={50} className="message-board" placeholder="请输入内容" value={playerInfo?.selfIntroduction ? playerInfo.selfIntroduction : ""} readOnly />
              </div>
            </div>
          </Card>
        </div>

        <div className="card-outer-container">
          <div className="card-inner-container">
            <Card title={<div className="card-title"><FcSalesPerformance fontSize={18} /><span> 钱包</span> </div>} extra={<RightOutline />} />

            <Card
              title={
                <div className="card-title">
                  <FcCopyright fontSize={18} />
                  <span> 竞猜</span>
                </div>
              }
              extra={<RightOutline />}
            />
          </div>

          <div className="card-inner-container">
            <Card
              title={
                <div className="card-title">
                  <FcHeadset fontSize={18} />
                  <span> 客服</span>
                </div>
              }
              extra={<RightOutline />}
            />

            <Card
              title={
                <div className="card-title">
                  <FcBusinessman fontSize={18} />
                  <span> 代理</span>
                </div>
              }
              extra={<RightOutline />}
            />
          </div>
        </div>

        <Card className="signout" onClick={logout}
          title={
            <div className="card-title">
              <FcImport fontSize={18} />
              <span>退出</span>
            </div>
          }
          extra={<RightOutline />}
        />
      </div>
    </>
  );
};

export default UserCenter;
