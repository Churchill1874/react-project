import { useState } from 'react'
import { Card, Avatar, TextArea, Badge, Tag, Form } from 'antd-mobile'
import { EditSOutline, RightOutline, FlagOutline, SmileOutline, PhoneFill, MailOutline, HistogramOutline, UserCircleOutline } from 'antd-mobile-icons'
import avatar from '../../../public/assets/avatars/1.jpg'
import '@/pages/personal/Personal.less'

const UserCenter: React.FC = () => {

  const [value, setValue] = useState('一二三四五六七八九十一二三四五六七八九十一二三四五六七八九十一二三四五六七八九十一二三四五六七八九十')

  return (
    <>
      <div className="personal">
        <Card className="card">
          <div className="avatar-container">
            <div className="avatar-with-text">
              <Avatar className="personal-avatar" src={avatar} />
            </div>
            <div className="base-info">
              <span className='name'> 昵称: 莫哈莫哈 </span>
              <span className='account'> 账号: 12311231 <span className='status'> <Tag className='tag' color='success' fill='outline'> 正常  </Tag> </span></span>
              <span className='balance'> 余额: 2312 USDT</span>
            </div>
            <div className="right-info">
              <span><EditSOutline fontSize={24} /></span>
            </div>
          </div>
        </Card>

        <div className="personal-info-space">
          <span style={{ color: 'white', fontSize: '15px' }}>
            <div>200</div>
            <div className='label'>粉丝</div>
          </span>
          <span style={{ color: 'white', fontSize: '15px' }}>
            <div>100</div>
            <div className='label'>关注</div>
          </span>
          <span style={{ color: 'white', fontSize: '15px' }}>
            <div>30</div>
            <div className='label'>收藏</div>
          </span>
        </div>


        <div className="personal-info-container">
          <Card className="card-personal-info">
            <div className="card-personal-info-container">
              <span className='personal-info'>
                <span className='left'><HistogramOutline /> 等级: </span>
                <span> 0级 ( 暗中观察 )</span>
              </span>
              <span className='personal-info'>
                <span className='left'><UserCircleOutline /> 性别: </span>
                <span> 女 </span>
              </span>
              <span className='personal-info'>
                <span className='left'><FlagOutline /> 城市: </span>
                <span>北京</span>
              </span>
              <span className='personal-info'>
                <span className='left'><SmileOutline /> 生日: </span>
                <span>2001-10-11</span>
              </span>
              <span className='personal-info'>
                <span className='left'><PhoneFill /> 手机: </span>
                <span>13222222222</span>
              </span>
              <span className='personal-info'>
                <span className='left'><MailOutline /> 邮箱: </span>
                <span>joy1111@gmail.com</span>
              </span>
              <span className='personal-info-desc'>
                 留言板:           
              </span>
              <TextArea maxLength={50} className='textArea' placeholder='请输入内容' value={'你们都认识我吗'} readOnly />
            </div>



          </Card>
        </div>

        <Card className='guessing-competition' title='竞猜' extra={<RightOutline />} />
        <Card className='recharge-withdraw' title='钱包' extra={<RightOutline />} />
        <Card className='customer-service' title='客服' extra={<RightOutline />} />
        <Card className='signout' title='退出' extra={<RightOutline />} />
      </div>
    </>
  )
}

export default UserCenter
