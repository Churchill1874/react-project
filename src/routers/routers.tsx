//所有路由配置文件
import Home from '@/pages/home/Home';
import Login from '@/pages/login/Login';
import Personal from '@/pages/personal/Personal';
import SetPersonal from '@/pages/setpersonal/SetPersonal'
import News from '@/pages/news/News'

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
    path: '/news',
    component: News,
  },
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
];
