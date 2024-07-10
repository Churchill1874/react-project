import { Tabs } from "antd-mobile";
import { useState, useEffect } from "react";
import '@/pages/news/News.less'
import NewsList from '@/components/news/NewsList'
import { Request_NewsPage, NewsPageRequestType, NewsInfoType } from '@/pages/news/api';
import NewsTags from '@/components/newstag/NewsTags'


const News: React.FC = () => {
    const [newsList, setNewsList] = useState<NewsInfoType[] | null>([]);
    const [activeKey, setActiveKey] = useState<string>('news');


    // 模拟请求不同类型的新闻数据
    const fetchNews = async (key: string) => {
        if (key === 'news') {
            const pageReq: NewsPageRequestType = { pageNum: 1, pageSize: 10 };
            const newsList = (await Request_NewsPage(pageReq)).data.records || [];
            setNewsList(newsList);
        }
        if (key === 'abroad') {
            setNewsList(null)
        }
        if (key === 'political') {
            setNewsList(null)

        }
        if (key === 'exposure') {
            setNewsList(null)

        }
        if (key === 'chatgirl') {
            setNewsList(null)

        }
        if (key === 'youtube') {
            setNewsList(null)

        }
    };

    useEffect(() => {
        fetchNews(activeKey);
    }, [activeKey]);

    const handleTabChange = (key: string) => {
        setActiveKey(key);
    };

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

            <NewsTags />

            <div className="news-content">
                <NewsList newsData={newsList} />
            </div>
        </>
    );

}


export default News;