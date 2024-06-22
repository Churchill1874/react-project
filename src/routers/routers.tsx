//所有路由配置文件
import Home from "@/pages/home/Home"
import Login from "@/pages/login/Login"
import Personal from "@/pages/personal/Personal"

export default [
    //首页
    {
        path: "/home",
        component: Home 
    },
    //登陆路由
    {
        path: "/login",
        component: Login 
    },
    //个人中心路由
    {
        path: "/personal",
        component: Personal 
    }
]



