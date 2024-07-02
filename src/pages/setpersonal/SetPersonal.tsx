import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextArea, NavBar, Form, Button, Input, Card, Avatar } from 'antd-mobile';
import { Request_GetPlayerInfoPath } from '@/pages/personal/api';
import { PlayerInfoType } from '@/pages/personal/api';
import '@/pages/setpersonal/SetPersonal.less';

const SetPersonal: React.FC = () => {
  const [player, setPlayer] = useState<PlayerInfoType>();
  const [form] = Form.useForm();

  const navigate = useNavigate();

  //请求用户信息
  const playerReq = async () => {
    const playerInfo = (await Request_GetPlayerInfoPath()).data;
    form.setFieldsValue({
      name: playerInfo.name,
      selfIntroduction: playerInfo.selfIntroduction || '123',
    });

    setPlayer(playerInfo);
  };

  //变更头像选择框
  const changeAvatar = () => {
    alert(1);
  };

  //返回上一层
  const back = () => {
    navigate(-1);
  };

  //保存更新
  const update = () => {
    //请求后端更新用户编辑信息
  };

  //加载后执行钩子
  useEffect(() => {
    playerReq();
  }, []);

  return (
    <>
      <div className="set-personal">
        <NavBar className="edit" onBack={back}>
          {' '}
          编辑个人信息{' '}
        </NavBar>

        <Card className="card">
          <div className="avatar-container">
            <div className="avatar-with-text">
              <Avatar className="personal-avatar" src={player?.avatarPath} />
            </div>

            <div className="button-container">
              <Button className="change-avatar-button" block color="primary" type="submit" size="middle" onClick={changeAvatar}>
                替换
              </Button>
            </div>
          </div>
        </Card>

        <Form form={form} className="form" onFinish={update}
          footer={
            <Button block color="default" type="submit" size="middle">
              更新{' '}
            </Button>
          }
          layout="horizontal"
          requiredMarkStyle="asterisk"
          mode="card"
        >
          <Form.Item className="item" label="昵称:" name="name"
            rules={[
              { required: true, message: '昵称不能为空' },
              { max: 20, message: '昵称最大20位' },
              {
                pattern: /^(?!.*[._-]{2})(?!.*([._-]).*\1)[\u4e00-\u9fa5a-zA-Z0-9]+[._-]?[\u4e00-\u9fa5a-zA-Z0-9]*$/,
                message: '昵称仅支持一位.或_或-的特殊符号',
              },
            ]}
          >
            <Input placeholder="请输入" />
          </Form.Item>

          <Form.Item className="item" label="留言板:" name="selfIntroduction">
            <TextArea rows={4} maxLength={50} className="textArea" placeholder="请输入" showCount />
          </Form.Item>
        </Form>
      </div>
    </>
  );
};

export default SetPersonal;
