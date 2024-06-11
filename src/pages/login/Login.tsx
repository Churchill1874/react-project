import '@/pages/login/Login.less';
import { Form, Tabs, ResultPage, Input, Footer, Button, Space } from 'antd-mobile'
import { AntOutline } from 'antd-mobile-icons'


const Login: React.FC = () => {
  //const [value, setValue] = useState('')

  const onSubmit = () => {
    console.log(1)
  }

  const register = () => (
    <Tabs.Tab title='注册' key='register'>
    <Form className='form'
      footer={<Button block color='primary' onClick={onSubmit} size='middle'> 提交 </Button>}
      layout='horizontal' mode='card'>

      <Form.Item className='item' label='账号'>
        <Input placeholder='请输入' />
      </Form.Item>

      <Form.Item className='item' label='昵称'>
        <Input placeholder='请输入' />
      </Form.Item>

      <Form.Item className='item' label='密码'>
        <Input placeholder='请输入' />
      </Form.Item>

      <Form.Item className='item' label='性别'>
        <Input placeholder='请输入' />
      </Form.Item>

      <Form.Item className='item' label='验证码'>
        <Input placeholder='请输入' />
      </Form.Item>

    </Form>
  </Tabs.Tab>
  )

  const login =()=>(    
  <Tabs.Tab title='登陆' key='login'>
    <Form className='form'
      footer={<Button block color='primary' onClick={onSubmit} size='middle'> 提交 </Button>}
      layout='horizontal' mode='card'>

      <Form.Item className='item' label='账号'>
        <Input placeholder='请输入' />
      </Form.Item>

      <Form.Item className='item' label='密码'>
        <Input placeholder='请输入' />
      </Form.Item>

      <Form.Item className='item' label='验证码'>
        <Input placeholder='请输入' />
      </Form.Item>

      </Form>
  </Tabs.Tab>
  )

  return (
    <>
      <ResultPage status='success'
        title={<div><span>让我们一起搞点</span><hr /><span>大 新 闻 ~</span></div>}
        icon={<AntOutline fontSize={80} className='icon' />} >

        <Tabs activeLineMode='fixed' className='tabs'>
          {login()}

          {register()}
        </Tabs>

        <Footer className='footer' label={<>www.daxinwen.com (大新闻)</>} />

      </ResultPage>
    </>
  )
}

export default Login