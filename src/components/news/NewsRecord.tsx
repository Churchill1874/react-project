import React from 'react';
import { Card, Image } from 'antd-mobile';
import '@/components/news/NewsRecord.less';

export interface NewsRecordType {
    title: string;
    images: string[];
    likes: number;
    comments: number;
    views: number;
}

interface NewsListType {
    newsData: NewsRecordType[];
}

const NewsRecord: React.FC<NewsListType> = ({ newsData }) => {
  return (
    <div className="outer-container">
      {newsData.map((news, index) => (
        <Card className="inner-container" key={index}>
          <div className="title">{news.title}</div>
          <div className="image-container">
            {news.images.map((src, imgIndex) => (
              <Image key={imgIndex} src={src} alt={`图片${imgIndex + 1}`} width={100} />
            ))}
          </div>
          <div className="attributes">
            <span>点赞: {news.likes}</span>
            <span>评论: {news.comments}</span>
            <span>浏览: {news.views}</span>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default NewsRecord;
