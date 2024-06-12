import '@/pages/login/Login.less';
import { useState , useEffect} from 'react';
import { Image, Form, Tabs, ResultPage, Input, Footer, Button, Toast } from 'antd-mobile'
import { AntOutline } from 'antd-mobile-icons'
import { Request_GetVerficationCode, Request_Register } from '@/pages/login/api'

interface Register {
  account: string;
  name: string;
  password: string;
  gender: number;
  verificationCode: string;
}
const regex = /^[A-Za-z0-9]+$/;


const checkRegister = (register: Register):boolean=>{
  if(!regex.test(register.account)){
    Toast.show({
      icon: 'fail',
      content: '账号只能是字母或数字',
      position:'top',
      duration: 3000
    })
    return false;
  }



  return true;
}


const Login: React.FC = () => {

  const [captcha, setCaptcha] = useState('')

  //请求图片验证啊
  const captchaImageExchange = async () => {
    const {data} = await Request_GetVerficationCode();
    const captchaImage = data.captchaImage;
    setCaptcha(captchaImage)
  }

  //请求注册
  const register = async (values: Register)=> {
    const result = checkRegister(values);
    if(!result){
      return;
    }
    console.log(1)
    
    const {code,data,msg} = await Request_Register(values);
    if(code === -1){
      Toast.show({
        icon: 'fail',
        content: msg,
        position:'top',
        duration: 3000
      }) 
    }

    

  }

  useEffect(()=>{
    captchaImageExchange();
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
              onFinish={register}
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