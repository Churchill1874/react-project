import '@/pages/login/Login.less';
import { useState , useEffect} from 'react';
import { Image, Form, Tabs, ResultPage, Input, Footer, Button } from 'antd-mobile'
import { AntOutline } from 'antd-mobile-icons'
import { Request_GetVerficationCode } from '@/pages/login/api'

const Login: React.FC = () => {

  const [captcha, setCaptcha] = useState('')
  let captchaImage;

  const captchaImageExchange = async () => {
    const {data} = await Request_GetVerficationCode();
    captchaImage = data.captchaImage;
    setCaptcha(captchaImage)
  }

  const login = ()=> {

  }

  useEffect(()=>{
    console.log(1)
    //captchaImageExchange();
  },[])

  return (
    <>
      <ResultPage status='success'
        title={<div><span>让我们一起搞点</span><hr /><span>大 新 闻 ~</span></div>}
        icon={<AntOutline fontSize={80} className='icon' />} >

        <Tabs activeLineMode='fixed' className='tabs'>
          <Tabs.Tab title='登陆' key='login'>
            <Form className='form'
              footer={<Button block color='primary' type='submit' size='middle'> 提交 </Button>}
              layout='horizontal' mode='card'
              requiredMarkStyle="asterisk" >

              <Form.Item className='item' label='账号' name='account' rules={[{ required: true, message: '账号不能为空' }]}>
                <Input placeholder='请输入' />
              </Form.Item>

              <Form.Item className='item' label='密码' name='password' rules={[{ required: true, message: '密码不能为空' }]}>
                <Input placeholder='请输入' />
              </Form.Item>

              <Form.Item className='item' label='验证码' name='verificationCode' rules={[{ required: true, message: '验证码不能为空' }]} extra={<Image onClick={captchaImageExchange} src={captcha} alt="验证码" width={80} height={40} />} >
                <Input placeholder='请输入' />
              </Form.Item>
            </Form>
          </Tabs.Tab>


          <Tabs.Tab title='注册' key='register'>
            <Form className='form'
              onFinish={login}
              footer={<Button block color='primary' type='submit' size='middle'> 提交 </Button>}
              layout='horizontal'
              requiredMarkStyle='asterisk'
              mode='card'>

              <Form.Item className='item' label='账号' name='account' rules={[{ required: true, message: '账号不能为空' }]}>
                <Input placeholder='请输入' />
              </Form.Item>

              <Form.Item className='item' label='昵称' name='name' rules={[{ required: true, message: '昵称不能为空' }]}>
                <Input placeholder='请输入' />
              </Form.Item>

              <Form.Item className='item' label='密码' name='password' rules={[{ required: true, message: '密码不能为空' }]}>
                <Input placeholder='请输入' />
              </Form.Item>

              <Form.Item className='item' label='性别' name='gender' rules={[{ required: true, message: '性别不能为空' }]}>
                <Input placeholder='请输入' />
              </Form.Item>

              <Form.Item className='item' label='验证码' name='verificationCode' rules={[{ required: true, message: '验证码不能为空' }]} extra={<Image onClick={captchaImageExchange} src={captcha} alt="验证码" width={80} height={40} />} >
                <Input placeholder='请输入' />
              </Form.Item>

            </Form>
          </Tabs.Tab>
        </Tabs>


        <Footer className='footer' label={<>www.daxinwen.com (大新闻)</>} />
      </ResultPage>
    </>
  )
}

export default Login;