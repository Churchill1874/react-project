import React from 'react';
import { Card, Image } from 'antd-mobile';
import '@/components/news/NewsRecord.less';
import {NewsInfoType} from '@/pages/news/api'

const NewsRecord: React.FC<NewsInfoType> = ({ title, photoPath, likesCount, badCount, commentsCount, viewCount, createTime }) => {
    return (
        <Card className="inner-container">
            <div className="title">{title}</div>
            <div className="image-container">
                {photoPath && photoPath.split(',').map((src, index) => (
                    <Image key={index} src={src} alt={`图片${index + 1}`} width={100} />
                ))}
            </div>
            <div className="attributes">
                <span>{createTime.split(' ')[0]}</span>
                <span>浏览: {viewCount}</span>
                <span>点赞: {likesCount}</span>
                <span>差评: {badCount}</span>
                <span>评论: {commentsCount}</span>           
            </div>
        </Card>
    );
};

export default NewsRecord;
