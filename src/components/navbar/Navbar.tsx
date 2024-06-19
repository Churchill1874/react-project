import { useNavigate } from 'react-router-dom';
import { Tabs } from 'antd-mobile';

const Navbar = () => {
  const navigate = useNavigate();

  const handleTabChange = (key: string) => {
    navigate(`/${key}`);
  };

  return (
    <Tabs className='navbar' onChange={handleTabChange}>
      <Tabs.Tab title="首页" key="" />
      <Tabs.Tab title="新闻" key="news" />
      <Tabs.Tab title="市场" key="market" />
      <Tabs.Tab title="消息" key="message" />
      <Tabs.Tab title="个人" key="personal" />
    </Tabs>
  );
};

export default Navbar;
