import { Tabs, CapsuleTabs } from "antd-mobile";
import { useState, useEffect } from "react";
import '@/pages/news/News.less'
import NewsList from '@/components/news/NewsList'
import { Request_NewsPage, NewsPageRequestType, NewsInfoType } from '@/pages/news/api';
import useStore from '@/zustand/store'

const News: React.FC = () => {
    const [activeKey, setActiveKey] = useState<string>('news');
    const [activeTab, setActiveTab] = useState<string>('1'); //新闻类型胶囊
    const { newsList, setNewsList,
        sportList, setSportList,
        entertainmentList, setEntertainmentList,
        militaryList, setMilitaryList,
        scienceList, setScienceList,
        favorList, setFavorList,
        netFriendList, setNetFriendList } = useStore();//新闻的全局变量


    // 模拟请求不同类型的新闻数据
    const fetchNews = async (categoryEnum: string) => {
        const pageReq: NewsPageRequestType = { pageNum: 1, pageSize: 10, categoryEnum: categoryEnum };
        const newsListResp = (await Request_NewsPage(pageReq)).data.records || [];

        //对比查询新闻的类型属于哪个类型数据 并且确认有新的数据返回才修改 全局的数据状态
        if (categoryEnum === '1' && JSON.stringify(newsList) !== JSON.stringify(newsListResp)) {//新闻
            setNewsList(newsListResp);
        }
        if (categoryEnum === '2' && JSON.stringify(newsList) !== JSON.stringify(sportList)) {//体育
            setSportList(newsListResp);
        }
        if (categoryEnum === '3' && JSON.stringify(newsList) !== JSON.stringify(entertainmentList)) {//娱乐
            setEntertainmentList(newsListResp);
        }
        if (categoryEnum === '4' && JSON.stringify(newsList) !== JSON.stringify(militaryList)) {//军事
            setMilitaryList(newsListResp);
        }
        if (categoryEnum === '5' && JSON.stringify(newsList) !== JSON.stringify(scienceList)) {//科技
            setScienceList(newsListResp);
        }
        if (categoryEnum === '6' && JSON.stringify(newsList) !== JSON.stringify(favorList)) {//人情
            setFavorList(newsListResp);
        }
        if (categoryEnum === '7' && JSON.stringify(newsList) !== JSON.stringify(netFriendList)) {//网友
            setNetFriendList(newsListResp);
        }
    };


    useEffect(() => {
        fetchNews(activeTab);
    }, [activeKey]);


    //切换新闻菜单导航
    const handleTabChange = (key: string) => {
        if (key === 'news') {
            fetchNews(activeTab);
        }
        if (key === 'abroad') {
            //setNewsList(null)
        }
        if (key === 'political') {
            //setNewsList(null)

        }
        if (key === 'exposure') {
            //setNewsList(null)

        }
        if (key === 'chatgirl') {
            //setNewsList(null)

        }
        if (key === 'youtube') {
            //setNewsList(null)

        }
        setActiveKey(key);
    };


    //切换新闻类型
    const handleCapsuleTabChange = (key: string) => {
        fetchNews(key);
        setActiveTab(key);
    };

    //获取当前胶囊新闻类型所用的新闻数据状态
    const capsuleTabData = (): NewsInfoType[] | null => {
        if (activeTab === '1') {
            return newsList;
        }
        if (activeTab === '2') {
            return sportList;
        }
        if (activeTab === '3') {
            return entertainmentList;
        }
        if (activeTab === '4') {
            return militaryList;
        }
        if (activeTab === '5') {
            return scienceList;
        }
        if (activeTab === '6') {
            return favorList;
        }
        if (activeTab === '7') {
            return netFriendList;
        }
        return [];
    }

    return (
        <>
            <div className="tabs-container">
                <Tabs activeKey={activeKey} onChange={handleTabChange}>
                    <Tabs.Tab title='新闻' key='news' />
                    <Tabs.Tab title='境外' key='abroad' />
                    <Tabs.Tab title='公司' key='political' />
                    <Tabs.Tab title='曝光' key='exposure' />
                    <Tabs.Tab title='聊妹' key='chatgirl' />
                    <Tabs.Tab title='油管' key='youtube' />
                </Tabs>
            </div>


            {activeKey === 'news' &&
                <div className="capsule-tabs-container">
                    <CapsuleTabs activeKey={activeTab} onChange={handleCapsuleTabChange}>
                        <CapsuleTabs.Tab title="新闻" key="1" />
                        <CapsuleTabs.Tab title="体育" key="2" />
                        <CapsuleTabs.Tab title="娱乐" key="3" />
                        <CapsuleTabs.Tab title="军事" key="4" />
                        <CapsuleTabs.Tab title="科技" key="5" />
                        <CapsuleTabs.Tab title="社会" key="6" />
                        <CapsuleTabs.Tab title="网友" key="7" />
                    </CapsuleTabs>
                </div>
            }

            {activeKey === 'news' &&
                <div className="news-content">
                    <NewsList newsData={capsuleTabData()} />
                </div>
            }
        </>
    );

}


export default News;