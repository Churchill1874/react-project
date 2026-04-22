import './Login.less';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Form,
  Input,
  Button,
  Toast,
  Radio,
  Space,
  CenterPopup,
  SpinLoading,
  Image,
} from 'antd-mobile';
import { Request_GetVerficationCode, Request_Register, Request_Login } from '@/pages/login/api';
import dayjs from 'dayjs';
import useStore from '@/zustand/store';
import logo from '@/assets/logo/logo1.png'
// 解决中文输入法重复问题：拼音上屏前不向 Form 提交值
interface ImeInputProps {
  value?: string;
  onChange?: (val: string) => void;
  placeholder?: string;
  type?: string;
  autoComplete?: string;
  className?: string;
}
const ImeInput: React.FC<ImeInputProps> = ({ value = '', onChange, placeholder, type = 'text', autoComplete, className }) => {
  const composing = React.useRef(false);
  const [inner, setInner] = React.useState(value);
  if (value !== inner && !composing.current) setInner(value);
  return (
    <input
      className={`login-native-input ${className ?? ''}`}
      type={type}
      value={inner}
      placeholder={placeholder}
      autoComplete={autoComplete}
      onCompositionStart={() => { composing.current = true; }}
      onCompositionEnd={(e) => {
        composing.current = false;
        const val = (e.target as HTMLInputElement).value;
        setInner(val);
        onChange?.(val);
      }}
      onChange={(e) => {
        const val = e.target.value;
        setInner(val);
        if (!composing.current) onChange?.(val);
      }}
    />
  );
};


// 生日三下拉框：年 → 月 → 日，联动
const BirthPicker: React.FC<{ value?: string; onChange?: (val: string) => void }> = ({ value, onChange }) => {
  const curYear = new Date().getFullYear();
  const parsed = value ? value.split('-') : ['', '', ''];
  const [selYear, setSelYear] = React.useState(parsed[0]);
  const [selMonth, setSelMonth] = React.useState(parsed[1]);
  const [selDay, setSelDay] = React.useState(parsed[2]);

  const years = Array.from({ length: curYear - 1899 }, (_, i) => String(curYear - i));
  const months = selYear ? Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, '0')) : [];
  const daysInMonth = selYear && selMonth ? new Date(Number(selYear), Number(selMonth), 0).getDate() : 0;
  const days = daysInMonth ? Array.from({ length: daysInMonth }, (_, i) => String(i + 1).padStart(2, '0')) : [];

  const emit = (y: string, m: string, d: string) => {
    if (y && m && d) onChange?.(`${y}-${m}-${d}`);
  };

  const onYear = (y: string) => {
    setSelYear(y);
    // 日可能越界，重置
    const maxDay = new Date(Number(y), Number(selMonth), 0).getDate();
    const safeDay = Number(selDay) > maxDay ? '' : selDay;
    setSelDay(safeDay);
    emit(y, selMonth, safeDay);
  };

  const onMonth = (m: string) => {
    setSelMonth(m);
    const maxDay = new Date(Number(selYear), Number(m), 0).getDate();
    const safeDay = Number(selDay) > maxDay ? '' : selDay;
    setSelDay(safeDay);
    emit(selYear, m, safeDay);
  };

  const onDay = (d: string) => {
    setSelDay(d);
    emit(selYear, selMonth, d);
  };

  return (
    <div className="birth-select-row">
      <select className="birth-select" value={selYear} onChange={e => onYear(e.target.value)}>
        <option value="">年</option>
        {years.map(y => <option key={y} value={y}>{y}年</option>)}
      </select>
      <select className="birth-select" value={selMonth} onChange={e => onMonth(e.target.value)} disabled={!selYear}>
        <option value="">月</option>
        {months.map(m => <option key={m} value={m}>{Number(m)}月</option>)}
      </select>
      <select className="birth-select" value={selDay} onChange={e => onDay(e.target.value)} disabled={!selMonth}>
        <option value="">日</option>
        {days.map(d => <option key={d} value={d}>{Number(d)}日</option>)}
      </select>
    </div>
  );
};

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
  const [activeTab, setActiveTab] = useState<string>('login');

  const [loginForm] = Form.useForm();
  const [registerForm] = Form.useForm();

  const captchaImageExchange = async () => {
    const verification = await Request_GetVerficationCode();
    const { data } = verification;
    setCaptcha(data.captchaImage);
  };

  const login = (values: LoginType) => {
    setVisible(true);
    loginReq(values);
  };

  const loginReq = async (values: LoginType) => {
    const setCommentMessageUnread = useStore.getState().setCommentMessageUnread;
    const setSystemMessageUnread = useStore.getState().setSystemMessageUnread;
    const setPrivateMessageUnread = useStore.getState().setPrivateMessageUnread;
    try {
      const { code, data } = await Request_Login(values);
      if (code === 0) {
        setTokenId(data.tokenId);
        setVisible(false);
        setPlayerInfo({
          account: data.account,
          name: data.name,
          avatarPath: data.avatarPath,
          level: data.level,
          status: data.status,
          id: data.id,
          campType: data.campType,
        });
        setCommentMessageUnread(data.commentMessageUnread);
        setSystemMessageUnread(data.systemMessageUnread);
        setPrivateMessageUnread(data.privateMessageUnread);
        Toast.show({ icon: 'success', content: '登录成功', duration: 2000 });
        setTimeout(() => navigate('/'), 1000);
      }
    } finally {
      setVisible(false);
      captchaImageExchange();
    }
  };

  const registerReq = async (values: RegisterType) => {
    const { code, data, msg } = await Request_Register(values);
    if (code === 0) {
      setTokenId(data.tokenId);
      Toast.show({ icon: 'success', content: '注册成功', duration: 2000 });
      setTimeout(() => navigate('/'), 1000);
    } else {
      Toast.show({ icon: 'fail', content: msg, position: 'top', duration: 2000 });
      captchaImageExchange();
    }
  };

  useEffect(() => {
    captchaImageExchange();
  }, []);

  const trimSpace = (value: string) => value.replace(/\s/g, '');

  const handleTabChange = (key: string) => {
    setActiveTab(key);
    if (key === 'login') loginForm.resetFields();
    else {
      registerForm.resetFields();
    }
  };

  return (
    <div className="login-page">
      <div className="login-bg-circle login-bg-circle--tl" />
      <div className="login-bg-circle login-bg-circle--br" />

      {/* Loading 弹窗 */}
      <CenterPopup
        visible={visible}
        onMaskClick={() => setVisible(false)}
        bodyStyle={{
          width: 'auto', minWidth: 60, maxWidth: '60vw', padding: '20px',
          background: '#fff', borderRadius: 12, display: 'flex',
          flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
        }}
      >
        <SpinLoading style={{ '--size': '48px' }} color="primary" />
        <div style={{ marginTop: 12, fontSize: 16, color: '#6b91c7' }}>正在登录中...</div>
      </CenterPopup>

      <div className="login-card">

        {/* Logo */}
        <div className="login-logo">
          <img src={logo} alt="logo" className="login-logo__img" />
          <div className="login-logo__name">大新闻</div>
          <div className="login-logo__sub">让我们一起搞点大新闻 ~</div>
        </div>

        {/* Tab 栏 */}
        <div className="login-tab-bar">
          <button
            className={`login-tab-btn${activeTab === 'login' ? ' login-tab-btn--active' : ''}`}
            onClick={() => handleTabChange('login')}
          >
            登录<span className="login-tab-dot" />
          </button>
          <button
            className={`login-tab-btn${activeTab === 'register' ? ' login-tab-btn--active' : ''}`}
            onClick={() => handleTabChange('register')}
          >
            注册<span className="login-tab-dot" />
          </button>
          <div className="login-tab-indicator" style={{ left: activeTab === 'login' ? '0%' : '50%' }} />
        </div>

        {/* 登录表单 */}
        <div style={{ display: activeTab === 'login' ? 'block' : 'none' }}>
          <Form
            form={loginForm}
            className="login-form"
            onFinish={login}
            footer={
              <Button block color="primary" type="submit" size="large" className="login-submit-btn">
                登 录
              </Button>
            }
            layout="horizontal"
            requiredMarkStyle="none"
            mode="default"
          >
            <Form.Item label="账号" name="account" normalize={trimSpace}
              rules={[
                { required: true, message: '账号不能为空' },
                { min: 4, message: '账号最少4位' },
                { max: 20, message: '账号最大20位' },
                { pattern: /^[a-zA-Z0-9]+$/, message: '用户名只能包含字母和数字' },
              ]}
            >
              <ImeInput placeholder="4-20位英文或数字" className="login-input" />
            </Form.Item>

            <Form.Item label="密码" name="password" normalize={trimSpace}
              rules={[
                { required: true, message: '密码不能为空' },
                { min: 8, message: '密码最少8位' },
                { max: 20, message: '密码最大20位' },
                { pattern: /^[a-zA-Z0-9]+$/, message: '密码只能包含字母和数字' },
              ]}
            >
              <ImeInput type="password" placeholder="8-20位英文或数字" className="login-input" />
            </Form.Item>

            <Form.Item label="验证码" name="verificationCode" normalize={trimSpace}
              rules={[
                { required: true, message: '验证码不能为空' },
                { max: 5, message: '验证码最大5位' },
              ]}
            >
              <div className="login-captcha-row">
                <Input placeholder="请输入验证码" autoComplete="off" />
                <Image onClick={captchaImageExchange} src={captcha} alt="验证码" width={80} height={36} className="login-captcha-img" />
              </div>
            </Form.Item>
          </Form>
        </div>

        {/* 注册表单 */}
        <div style={{ display: activeTab === 'register' ? 'block' : 'none' }}>
          <Form
            form={registerForm}
            className="login-form"
            onFinish={registerReq}
            footer={
              <Button block color="primary" type="submit" size="large" className="login-submit-btn">
                注 册
              </Button>
            }
            layout="horizontal"
            requiredMarkStyle="none"
            mode="default"
          >
            <Form.Item label="账号" name="account" normalize={trimSpace}
              rules={[
                { required: true, message: '账号不能为空' },
                { min: 4, message: '账号最少4位' },
                { max: 20, message: '账号最大20位' },
                { pattern: /^[a-zA-Z0-9]+$/, message: '用户名只能包含字母和数字' },
              ]}
            >
              <ImeInput placeholder="4-20位英文或数字" className="login-input" />
            </Form.Item>

            <Form.Item label="昵称" name="name" normalize={trimSpace}
              rules={[
                { required: true, message: '昵称不能为空' },
                { max: 20, message: '昵称最大20位' },
                {
                  pattern: /^(?!.*[._-]{2})(?!.*([._-]).*\1)[\u4e00-\u9fa5a-zA-Z0-9]+[._-]?[\u4e00-\u9fa5a-zA-Z0-9]*$/,
                  message: '昵称仅支持一位.或_或-的特殊符号',
                },
              ]}
            >
              <ImeInput placeholder="1-20位，支持中英文数字" className="login-input" />
            </Form.Item>

            <Form.Item label="密码" name="password" normalize={trimSpace}
              rules={[
                { required: true, message: '密码不能为空' },
                { min: 8, message: '密码最少8位' },
                { max: 20, message: '密码最大20位' },
                { pattern: /^[a-zA-Z0-9]+$/, message: '密码只能包含字母和数字' },
              ]}
            >
              <ImeInput type="password" placeholder="8-20位英文或数字" className="login-input" />
            </Form.Item>

            <Form.Item name="birth" label="生日" rules={[{ required: true, message: '请选择生日' }]}>
              <BirthPicker />
            </Form.Item>

            <Form.Item label="性别" name="gender" rules={[{ required: true, message: '请选择性别' }]}>
              <Radio.Group>
                <Space>
                  <Radio value={1} style={{ '--icon-size': '18px', '--font-size': '16px', '--gap': '6px', color:'#6b91c7' }}>男</Radio>
                  <Radio value={0} style={{ '--icon-size': '18px', '--font-size': '16px', '--gap': '6px' , color:'#6b91c7' ,marginLeft: '30px'}}>女</Radio>
                </Space>
              </Radio.Group>
            </Form.Item>

            {/* 阵营字段（暂时注释）
            <Form.Item name="campType" label="阵营" rules={[{ required: true, message: '请选择支持阵营' }]}>
              ...
            </Form.Item>
            */}

            <Form.Item label="验证码" name="verificationCode" normalize={trimSpace}
              rules={[
                { required: true, message: '验证码不能为空' },
                { max: 5, message: '验证码最大5位' },
              ]}
            >
              <div className="login-captcha-row">
                <Input placeholder="请输入验证码" autoComplete="off" />
                <Image onClick={captchaImageExchange} src={captcha} alt="验证码" width={80} height={36} className="login-captcha-img" />
              </div>
            </Form.Item>
          </Form>
        </div>

      </div>

      <div className="login-footer">
        <div className="login-footer__domain">www.grayasia.com</div>
        <div className="login-footer__slogan">我来不是阻止你的,我来是希望你一切都能平安的</div>
      </div>
    </div>
  );
};

export default Login;