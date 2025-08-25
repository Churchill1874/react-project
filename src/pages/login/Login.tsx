import '@/pages/login/Login.less';
import { useState, useEffect, RefObject } from 'react';
import { useNavigate } from 'react-router-dom';
import { Image, Form, Tabs, ResultPage, Input, Footer, Button, Toast, Radio, Space, DatePicker, DatePickerRef, CenterPopup, SpinLoading, Picker } from 'antd-mobile';
import { AntOutline } from 'antd-mobile-icons';
import { Request_GetVerficationCode, Request_Register, Request_Login } from '@/pages/login/api';
import dayjs from 'dayjs';
import useStore from '@/zustand/store'
import NewsCard from '@/pages/groupchat/newscard/NewsCard'
interface RegisterType {
  account: string;
  name: string;
  password: string;
  gender: number;
  campType: number;
  birth: string;
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
  const { setTokenId, setPlayerInfo } = useStore();
  const [visible, setVisible] = useState<boolean>(false);
  const [campVisible, setCampVisible] = useState(false);
  const [brithVisible, setBrithVisible] = useState(false);
  const [form] = Form.useForm();   // 这里生成 form 实例

  //请求图片验证啊
  const captchaImageExchange = async () => {
    const verification = await Request_GetVerficationCode();
    const { data } = verification;
    const captchaImage = data.captchaImage;
    setCaptcha(captchaImage);
  };

  const login = (values: LoginType) => {
    setVisible(true)
    loginReq(values);
  }

  //登录
  const loginReq = async (values: LoginType) => {
    const setCommentMessageUnread = useStore.getState().setCommentMessageUnread;
    const setSystemMessageUnread = useStore.getState().setSystemMessageUnread;
    const setPrivateMessageUnread = useStore.getState().setPrivateMessageUnread;

    try {
      const { code, data, msg } = await Request_Login(values);
      if (code === 0) {
        const tokenId = data.tokenId;
        setTokenId(tokenId);
        setVisible(false)
        setPlayerInfo({
          account: data.account,
          name: data.name,
          avatarPath: data.avatarPath,
          level: data.level,
          status: data.status,
          id: data.id,
          campType: data.campType
        })

        setCommentMessageUnread(data.commentMessageUnread)
        setSystemMessageUnread(data.systemMessageUnread)
        setPrivateMessageUnread(data.privateMessageUnread)

        Toast.show({
          icon: 'success',
          content: '登录成功',
          duration: 2000,
        });

        setTimeout(() => {
          // 跳转到 /home 页面
          navigate('/');
        }, 1000); // 2秒后跳转到首页
      }
    } finally {
      setVisible(false); // 始终关闭 loading
      captchaImageExchange(); // 刷新验证码
    }
  };

  //请求注册
  const registerReq = async (values: RegisterType) => {
    //请求
    const { code, data, msg } = await Request_Register(values);
    if (code === 0) {
      const tokenId = data.tokenId;
      //localStorage.setItem('tokenId', tokenId);
      setTokenId(tokenId); // 让 WebSocket 建立连接

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

  // 新增一个通用格式化函数，去除空格
  const trimSpace = (value: string) => value.replace(/\s/g, '');

  const campColumns = [[
    { label: '🔴 共产主义阵营', value: 1 },
    { label: '🔵 资本主义阵营', value: 2 },
    { label: '无', value: 0 },
  ]];


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

        <CenterPopup
          visible={visible}
          onMaskClick={() => setVisible(false)}
          bodyStyle={{
            width: 'auto',
            minWidth: 60,
            maxWidth: '60vw',
            padding: '20px',
            background: '#fff',
            borderRadius: 8,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <SpinLoading style={{ '--size': '48px' }} color="primary" />
          <div style={{ marginTop: 12, fontSize: 18, color: '#999' }}>正在登录中...</div>
        </CenterPopup>



        <Tabs activeLineMode="fixed" className="tabs">

          <Tabs.Tab title="登陆" key="login">
            <Form
              form={form}   // ✅ 这里绑定
              className="form"
              onFinish={login}
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
                normalize={trimSpace} // 过滤空格

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
                normalize={trimSpace} // 过滤空格
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
                normalize={trimSpace} // 过滤空格
                rules={[
                  { required: true, message: '验证码不能为空' },
                  { max: 5, message: '验证码最大5位' },
                ]}
                extra={<Image onClick={captchaImageExchange} src={captcha} alt="验证码" width={80} height={40} />}
              >
                <Input placeholder="请输入" autoComplete="off" />
              </Form.Item>
            </Form>
          </Tabs.Tab>

          <Tabs.Tab title="注册" key="register">
            <Form
              form={form}
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
                normalize={trimSpace} // 过滤空格
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
                normalize={trimSpace} // 过滤空格
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
                normalize={trimSpace} // 过滤空格
                rules={[
                  { required: true, message: '密码不能为空' },
                  { min: 8, message: '密码最少8位' },
                  { max: 20, message: '密码最大20位' },
                  { pattern: /^[a-zA-Z0-9]+$/, message: '密码只能包含字母和数字' },
                ]}
              >
                <Input placeholder="请输入" />
              </Form.Item>

              <Form.Item name="birth" label="生日:" rules={[{ required: true }]}>
                <div onClick={() => setBrithVisible(true)}>
                  <DatePicker
                    visible={brithVisible}
                    onClose={() => setBrithVisible(false)}
                    onCancel={() => setBrithVisible(false)}
                    onConfirm={(val) => {
                      form.setFieldValue("birth", val);   // ✅ 回填表单
                      setBrithVisible(false);
                    }}
                    min={new Date(1900, 0, 1)}
                    max={new Date()}
                  >
                    {value => (value ? dayjs(value).format("YYYY-MM-DD") : "请选择日期")}
                  </DatePicker>
                </div>
              </Form.Item>

              <Form.Item className="item" label="性别:" name="gender" rules={[{ required: true, message: '请选择性别' }]}>
                <Radio.Group>
                  <Space>
                    <Radio value={1} style={{ '--icon-size': '20px', '--font-size': '18px', '--gap': '10px' }}>
                      男
                    </Radio>
                    <Radio value={0} style={{ '--icon-size': '20px', '--font-size': '18px', '--gap': '10px' }}>
                      女
                    </Radio>
                  </Space>
                </Radio.Group>
              </Form.Item>


              <Form.Item name="campType" label="阵营:" rules={[{ required: true, message: '请选择支持阵营' }]}>
                <div onClick={() => setCampVisible(true)}>
                  <Picker
                    visible={campVisible}
                    columns={campColumns}
                    onClose={() => setCampVisible(false)}
                    onCancel={() => setCampVisible(false)}
                    onConfirm={(val) => {
                      form.setFieldValue('campType', val[0]) // ✅ 写回表单
                      setCampVisible(false)
                    }}
                  >
                    {(items) => {
                      const text = items.every(i => i == null)
                        ? '请选择支持的阵营'
                        : items.map(i => i?.label).join('')
                      return <span style={{ fontSize: 16 }}>{text}</span>
                    }}
                  </Picker>
                </div>
              </Form.Item>

              <Form.Item
                className="item"
                label="验证码:"
                name="verificationCode"
                normalize={trimSpace} // 过滤空格
                rules={[
                  { required: true, message: '验证码不能为空' },
                  { max: 5, message: '验证码最大5位' },
                ]}
                extra={<Image onClick={captchaImageExchange} src={captcha} alt="验证码" width={80} height={40} />}
              >
                <Input placeholder="请输入" autoComplete="off" />
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
