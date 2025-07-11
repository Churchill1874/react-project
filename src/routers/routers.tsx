//所有路由配置文件
import Home from '@/pages/home/Home';
import Login from '@/pages/login/Login';
import Personal from '@/pages/personal/Personal';
import SetPersonal from '@/pages/setpersonal/SetPersonal'
import News from '@/pages/news/News'
import Message from '@/pages/message/Message';
import Likes from '@/components/likes/Likes';
import Relation from '@/components/relation/Relation';
import PoliticsEvent from '@/pages/lottery/politicslottery/politicsevent/PoliticsEvent';
import PoliticsLottery from '@/pages/lottery/politicslottery/PoliticsLottery';
import DealearConfig from '@/pages/lottery/politicslottery/politicsevent/dealerconfig/DealerConfig';
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
    path: '/likes',
    component: Likes
  },
  {
    path: '/collect',
    component: Relation
  },
  {
    path: '/followers',
    component: Relation
  },
  {
    path: '/bet',
    component: PoliticsLottery
  },
  {
    path: '/politicsEvent',
    component: PoliticsEvent
  },
  {
    path: '/dealerConfig/:id',
    component: DealearConfig

  }
];
