import { NavBar, Form, Toast } from 'antd-mobile'
import '@/pages/login/Login.less';
import { Input } from 'antd-mobile'
import { Footer, Button } from 'antd-mobile'


const back = () =>
  Toast.show({
    content: '点击了返回区域',
    duration: 1000,
  })

const Login: React.FC = () => {
  //const [value, setValue] = useState('')

  return (
    <>

      <NavBar onBack={back}>登陆页面</NavBar>

      <div className="login-container">
        <Form layout='horizontal'>
          <Form.Item label='手机号' name='username'>
            <Input placeholder='请输入用户名' clearable />
          </Form.Item>
        </Form>

        <Form layout='horizontal'>
          <Form.Item
            label='短信验证码'
            extra={
              <div className='extraPart'>
                <a>发送验证码</a>
              </div>
            }
          >
            <Input placeholder='请输入验证码' clearable />
          </Form.Item>
        </Form>

        <Button className='login' block color='primary' size='large'>
          登陆
        </Button>

        <Footer className='login-footer' label='xxx网站'></Footer>

      </div>

    </>

  )
}

export default Login