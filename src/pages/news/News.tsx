import { Tabs } from "antd-mobile";
import { useState, useEffect } from "react";
import '@/pages/news/News.less'
import NewsRecord from '@/components/news/NewsRecord'
import { NewsRecordType } from "@components/news/NewsRecord";


const News: React.FC = () => {
    const newsList:NewsRecordType[] = [
        {
            title: '这是标题1',
            images: ['image1.jpg', 'image2.jpg'],
            likes: 100,
            comments: 50,
            views: 200,
        },
        {
            title: '这是标题1',
            images: ['image1.jpg', 'image2.jpg'],
            likes: 100,
            comments: 50,
            views: 200,
        },
        {
            title: '这是标题1',
            images: ['image1.jpg', 'image2.jpg'],
            likes: 100,
            comments: 50,
            views: 200,
        },
        {
            title: '这是标题1',
            images: ['image1.jpg', 'image2.jpg'],
            likes: 100,
            comments: 50,
            views: 200,
        },
        {
            title: '这是标题1',
            images: ['image1.jpg', 'image2.jpg'],
            likes: 100,
            comments: 50,
            views: 200,
        },
        {
            title: '这是标题1',
            images: ['image1.jpg', 'image2.jpg'],
            likes: 100,
            comments: 50,
            views: 200,
        },{
            title: '这是标题1',
            images: ['image1.jpg', 'image2.jpg'],
            likes: 100,
            comments: 50,
            views: 200,
        }
    ]

    return (
      <>
        <div className="news-content">
          <Tabs className="news-navbar">
            <Tabs.Tab title='新闻' key='news'>
              <NewsRecord newsData={newsList}/>
            </Tabs.Tab>
            <Tabs.Tab title='境外' key='abroad'>
              东南亚
            </Tabs.Tab>
            <Tabs.Tab title='公司' key='political'>
            公司追踪
            </Tabs.Tab>
            <Tabs.Tab title='曝光' key='exposure'>
            曝光
            </Tabs.Tab>
            <Tabs.Tab title='聊妹' key='chatgirl'>
            聊妹
            </Tabs.Tab>
            <Tabs.Tab title='油管' key='youtube'>
            YOUTUBE
            </Tabs.Tab>
          </Tabs>
        </div>
      </>
    );
  }
  

export default News;