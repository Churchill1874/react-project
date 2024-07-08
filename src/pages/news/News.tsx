import { Tabs } from "antd-mobile";
import { useState, useEffect } from "react";
import '@/pages/news/News.less'
import NewsList from '@/components/news/NewsList'
import { NewsRecordType } from "@components/news/NewsRecord";

const newsListInit: NewsRecordType[] = [
    {
        title: '这是标题1',
        images: ['image1.jpg', 'image2.jpg'],
        likes: 100,
        badCount: 1,
        comments: 50,
        views: 200,
    },
    {
        title: '这是标题1',
        images: ['image1.jpg', 'image2.jpg'],
        likes: 100,
        badCount: 1,
        comments: 50,
        views: 200,
    },
    {
        title: '这是标题1',
        images: ['image1.jpg', 'image2.jpg'],
        likes: 100,
        badCount: 1,
        comments: 50,
        views: 200,
    },
    {
        title: '这是标题1',
        images: ['image1.jpg', 'image2.jpg'],
        likes: 100,
        badCount: 1,
        comments: 50,
        views: 200,
    },
    {
        title: '这是标题1',
        images: ['image1.jpg', 'image2.jpg'],
        likes: 100,
        badCount: 1,
        comments: 50,
        views: 200,
    },
    {
        title: '这是标题1',
        images: ['image1.jpg', 'image2.jpg'],
        likes: 100,
        badCount: 1,
        comments: 50,
        views: 200,
    }, 
    {
        title: '这是标题1',
        images: ['image1.jpg', 'image2.jpg'],
        likes: 100,
        badCount: 1,
        comments: 50,
        views: 200,
    }, 
    {
        title: '这是标题1',
        images: ['image1.jpg', 'image2.jpg'],
        likes: 100,
        badCount: 1,
        comments: 50,
        views: 200,
    }, 
    {
        title: '这是标题1',
        images: ['image1.jpg', 'image2.jpg'],
        likes: 100,
        badCount: 1,
        comments: 50,
        views: 200,
    }
]


const News: React.FC = () => {

    const [newsList, setNewsList] = useState<NewsRecordType[]>(newsListInit);
    const [activeKey, setActiveKey] = useState<string>('news');

    useEffect(() => {
        // 模拟请求不同类型的新闻数据
        const fetchNews = async (key: string) => {
            // 请求数据逻辑
            // const response = await fetch(`/api/news?type=${key}`);
            // const data = await response.json();
            const data = newsList;
            setNewsList(data);
        };

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
            <div className="news-content">
                <NewsList newsData={newsList} />
            </div>
        </>
    );

}


export default News;