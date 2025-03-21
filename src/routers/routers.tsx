//所有路由配置文件
import Home from '@/pages/home/Home';
import Login from '@/pages/login/Login';
import Personal from '@/pages/personal/Personal';
import SetPersonal from '@/pages/setpersonal/SetPersonal'
import News from '@/pages/news/News'
import NewsInfo from '@/components/news/newsinfo/NewsInfo'
import Message from '@/pages/message/Message';

export default [
  //首页
  {
    path: '/',
    component: Home,
  },
  {
    path: '/home',
    component: Home,
  },
  {
    path: '/news/:typeId?',
    component: News,
  },
  /*   {
      path: '/newsInfo',
      component: NewsInfo,
    }, */
  //登陆路由
  {
    path: '/login',
    component: Login,
  },
  //个人中心路由
  {
    path: '/personal',
    component: Personal,
  },
  {
    path: '/setPersonal',
    component: SetPersonal,
  },
  {
    path: '/message',
    component: Message,
  },
  {
    path: '/chatgirl',
    component: Message, // 暂时使用Message组件，后续可替换
  },
  {
    path: '/bet',
    component: Message, // 暂时使用Message组件，后续可替换
  }
];
