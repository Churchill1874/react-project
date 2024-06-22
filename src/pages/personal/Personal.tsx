import React from 'react'
import { Card, Avatar } from 'antd-mobile'
import {EditSOutline} from 'antd-mobile-icons'
import avatar from '../../../public/assets/avatars/1.jpg'
import '@/pages/personal/Personal.less'

const UserCenter: React.FC = () => {
  return (
    <div className="personal">
      <Card className="card">
        <div className="avatar-container">
          <div className="avatar-with-text">
            <Avatar className="personal-avatar" src={avatar} />
          </div>
          <div className="base-info">
            <span className='name'>昵称: 莫哈</span>
            <span className='account'>账号: 1231</span>
            <span className='level'>等级: 0级 (暗中观察)</span>
          </div>
          <div className="right-info">
            {/* 你可以在这里添加任何需要的内容 */}
            <span><EditSOutline fontSize={22}/></span>
          </div>
        </div>
        
      </Card>
    </div>
  )
}

export default UserCenter