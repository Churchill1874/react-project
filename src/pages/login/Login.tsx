import '@/pages/login/Login.less';
import { useState, useEffect, RefObject } from 'react';
import { useNavigate } from 'react-router-dom';
import { Image, Form, Tabs, ResultPage, Input, Footer, Button, Toast, Radio, Space, DatePicker, DatePickerRef } from 'antd-mobile';
import { AntOutline } from 'antd-mobile-icons';
import { Request_GetVerficationCode, Request_Register, Request_Login } from '@/pages/login/api';
import dayjs from 'dayjs';

interface RegisterType {
  account: string;
  name: string;
  password: string;
  gender: number;
  verificationCode: string;
}
interface LoginType {
  account: string;
  password: string;
  verificationCode: string;
}

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [captcha, setCaptcha] = useState('');

  //请求图片验证啊
  const captchaImageExchange = async () => {
    const verification = await Request_GetVerficationCode();
    const { data } = verification;
    const captchaImage = data.captchaImage;
    setCaptcha(captchaImage);
  };

  //登录
  const loginReq = async (values: LoginType) => {
    const { code, data, msg } = await Request_Login(values);
    if (code === 0) {
      const tokenId = data.tokenId;
      localStorage.setItem('tokenId', tokenId);
      Toast.show({
        icon: 'success',
        content: '登录成功',
        duration: 2000,
      });

      setTimeout(() => {
        // 跳转到 /home 页面
        navigate('/');
      }, 1000); // 2秒后跳转到首页



    } else {
      Toast.show({
        icon: 'fail',
        content: msg,
        position: 'top',
        duration: 2000,
      });

      captchaImageExchange();
    }
  };

  //请求注册
  const registerReq = async (values: RegisterType) => {
    //请求
    const { code, data, msg } = await Request_Register(values);
    if (code === 0) {
      const tokenId = data.tokenId;
      localStorage.setItem('tokenId', tokenId);

      Toast.show({
        icon: 'success',
        content: '注册成功',
        duration: 2000,
      });

      setTimeout(() => {
        // 跳转到 /home 页面
        navigate('/');
      }, 1000); // 2秒后跳转到首页
    } else {
      Toast.show({
        icon: 'fail',
        content: msg,
        position: 'top',
        duration: 2000,
      });

      captchaImageExchange();
    }
  };

  useEffect(() => {
    captchaImageExchange();
  }, []);

  return (
    <>
      <ResultPage
        status="success"
        title={
          <div>
            <span>让我们一起搞点</span>
            <hr />
            <span>大 新 闻 ~</span>
          </div>
        }
        icon={<AntOutline fontSize={80} />}
      >
        <Tabs activeLineMode="fixed" className="tabs">
          <Tabs.Tab title="登陆" key="login">
            <Form
              className="form"
              onFinish={loginReq}
              footer={
                <Button block color="primary" type="submit" size="middle">
                  提交
                </Button>
              }
              layout="horizontal"
              requiredMarkStyle="asterisk"
              mode="card"
            >
              <Form.Item
                className="item"
                label="账号:"
                name="account"
                rules={[
                  { required: true, message: '账号不能为空' },
                  { min: 4, message: '账号最少4位' },
                  { max: 20, message: '账号最大20位' },
                  { pattern: /^[a-zA-Z0-9]+$/, message: '用户名只能包含字母和数字' },
                ]}
              >
                <Input placeholder="请输入" />
              </Form.Item>

              <Form.Item
                className="item"
                label="密码:"
                name="password"
                rules={[
                  { required: true, message: '密码不能为空' },
                  { min: 8, message: '密码最少8位' },
                  { max: 20, message: '密码最大20位' },
                  { pattern: /^[a-zA-Z0-9]+$/, message: '密码只能包含字母和数字' },
                ]}
              >
                <Input placeholder="请输入" />
              </Form.Item>

              <Form.Item
                className="item"
                label="验证码:"
                name="verificationCode"
                rules={[
                  { required: true, message: '验证码不能为空' },
                  { max: 5, message: '验证码最大5位' },
                ]}
                extra={<Image onClick={captchaImageExchange} src={captcha} alt="验证码" width={80} height={40} />}
              >
                <Input placeholder="请输入" />
              </Form.Item>
            </Form>
          </Tabs.Tab>

          <Tabs.Tab title="注册" key="register">
            <Form
              className="form"
              onFinish={registerReq}
              footer={
                <Button block color="primary" type="submit" size="middle">
                  提交
                </Button>
              }
              layout="horizontal"
              requiredMarkStyle="asterisk"
              mode="card"
            >
              <Form.Item
                className="item"
                label="账号:"
                name="account"
                rules={[
                  { required: true, message: '账号不能为空' },
                  { min: 4, message: '账号最少4位' },
                  { max: 20, message: '账号最大20位' },
                  { pattern: /^[a-zA-Z0-9]+$/, message: '用户名只能包含字母和数字' },
                ]}
              >
                <Input placeholder="请输入" />
              </Form.Item>

              <Form.Item
                className="item"
                label="昵称:"
                name="name"
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

              <Form.Item
                className="item"
                label="密码:"
                name="password"
                rules={[
                  { required: true, message: '密码不能为空' },
                  { min: 8, message: '密码最少8位' },
                  { max: 20, message: '密码最大20位' },
                  { pattern: /^[a-zA-Z0-9]+$/, message: '密码只能包含字母和数字' },
                ]}
              >
                <Input placeholder="请输入" />
              </Form.Item>

              <Form.Item
                name="birth"
                label="生日:"
                trigger="onConfirm"
                onClick={(_e, datePickerRef: RefObject<DatePickerRef>) => {
                  datePickerRef.current?.open();
                }}
                rules={[{ required: true }]}
              >
                <DatePicker min={new Date(1900, 0, 1)} max={new Date()}>
                  {value => (value ? dayjs(value).format('YYYY-MM-DD') : '请选择日期')}
                </DatePicker>
              </Form.Item>

              <Form.Item className="item" label="性别" name="gender" rules={[{ required: true, message: '请输入性别' }]}>
                <Radio.Group>
                  <Space>
                    <Radio value="1" style={{ '--icon-size': '20px', '--font-size': '18px', '--gap': '10px' }}>
                      男
                    </Radio>
                    <Radio value="0" style={{ '--icon-size': '20px', '--font-size': '18px', '--gap': '10px' }}>
                      女
                    </Radio>
                  </Space>
                </Radio.Group>
              </Form.Item>

              <Form.Item
                className="item"
                label="验证码:"
                name="verificationCode"
                rules={[
                  { required: true, message: '验证码不能为空' },
                  { max: 5, message: '验证码最大5位' },
                ]}
                extra={<Image onClick={captchaImageExchange} src={captcha} alt="验证码" width={80} height={40} />}
              >
                <Input placeholder="请输入" />
              </Form.Item>
            </Form>
          </Tabs.Tab>
        </Tabs>

        <Footer className="footer" label={<>www.daxinwen.com (大新闻)</>} />
      </ResultPage>
    </>
  );
};

export default Login;
