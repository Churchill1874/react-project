import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Avatar, TextArea, Tag, Toast } from 'antd-mobile';
import { FcSalesPerformance, FcImport, FcHeadset } from 'react-icons/fc';
import { EditSOutline, RightOutline, FlagOutline, SmileOutline, PhoneFill, MailOutline, TravelOutline, UserCircleOutline } from 'antd-mobile-icons';
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
                    (<Tag className="status-tag" color="success" fill="outline">正常</Tag>)
                    :
                    (<Tag className="status-tag" color="warning" fill="outline">禁用</Tag>)
                  }
                </span>

                {/* <span className="balance"> 余额: {playerInfo?.balance} U</span> */}
              </span>

              <span className='level'>
                等级: <span> {playerInfo?.level} 级 <span className='levelName'> ( {levelEnum(playerInfo?.level)} )</span>  </span>
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
                  <UserCircleOutline /> 性别:
                </span>
                <span className='right'> {playerInfo?.gender === 1 ? '男' : '女'} </span>
              </span>
              <span className="personal-info">
                <span className="left">
                  <FlagOutline /> 城市:
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
            {/*             <div className='fucation'>
              <div className='card-title'><FcBusinessman className='icon' fontSize={22} /> 代理</div> <RightOutline className="right-icon" />
            </div> */}

            <div className='fucation'>
              <div className='card-title'><FcSalesPerformance className='icon' fontSize={22} /> 钱包 {playerInfo?.balance} U </div> <RightOutline className="right-icon" />
            </div>
            {/* 
            <div className='fucation'>
              <div className='card-title'><FcReading className='icon' fontSize={22} /> 浏览</div> <RightOutline className="right-icon" />
            </div> */}

            <div className='fucation'>
              <div className='card-title'><FcHeadset className='icon' fontSize={22} /> 客服</div> <RightOutline className="right-icon" />
            </div>

            <div className='fucation'>
              <div className='card-title' onClick={logout}><FcImport className='icon' fontSize={22} /> 退出</div> <RightOutline className="right-icon" />
            </div>
          </Card>
        </div>

      </div>
    </>
  );
};

export default UserCenter;
