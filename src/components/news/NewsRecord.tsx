import React from 'react';
import { Card, Image } from 'antd-mobile';
import '@/components/news/NewsRecord.less';

export interface NewsRecordType {
    title: string;
    images: string[];
    likes: number;
    badCount: number;
    comments: number;
    views: number;
}

const NewsRecord: React.FC<NewsRecordType> = ({ title, images, likes,badCount, comments, views }) => {
    return (
        <Card className="inner-container">
            <div className="title">{title}</div>
            <div className="image-container">
                {images.map((src, index) => (
                    <Image key={index} src={src} alt={`图片${index + 1}`} width={100} />
                ))}
            </div>
            <div className="attributes">
                <span>浏览: {views}</span>
                <span>点赞: {likes}</span>
                <span>差评: {badCount}</span>
                <span>评论: {comments}</span>
                
            </div>
        </Card>
    );
};

export default NewsRecord;
