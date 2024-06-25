import { useState } from 'react'
import { Card, Avatar, TextArea } from 'antd-mobile'
import { EditSOutline } from 'antd-mobile-icons'
import avatar from '../../../public/assets/avatars/1.jpg'
import '@/pages/personal/Personal.less'

const UserCenter: React.FC = () => {

  const [value, setValue] = useState('你们都认识我吗，上海魔哈哈哈哈哈哈')


  return (
    <>
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
              <span><EditSOutline fontSize={22} /></span>
            </div>
          </div>
        </Card>

        <Card className="card-personal-desc">
          <TextArea className='personal-desc' placeholder='自我介绍' value={value} readOnly onChange={val => { setValue(val) }} />
        </Card>

        <div className="personal-info-container">

          <Card className="card-personal-info">
            <div className="card-personal-info-container">
              <span className='personal-info'>1</span><span className='personal-info'>|</span><span className='personal-info'>2</span>
            </div>
          </Card>

          <Card className="card-personal-info">
            <div className="card-personal-info-container">
              <span className='personal-info'>3</span><span className='personal-info'>|</span><span className='personal-info'>4</span>
            </div>
          </Card>

        </div>





      </div>

    </>
  )
}

export default UserCenter