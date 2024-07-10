import React from 'react';
import { Card, Image } from 'antd-mobile';
import '@/components/news/NewsRecord.less';
import { NewsInfoType } from '@/pages/news/api';

const NewsRecord: React.FC<NewsInfoType> = ({ title, photoPath, likesCount, badCount, commentsCount, viewCount, createTime }) => {
    return (
        <Card className="inner-container">
            <div className="content-container">
                <div className="image-container">
                    {photoPath && photoPath.split(',').map((src, index) => (
                        <Image key={index} src={src} alt={`图片${index + 1}`}/>
                    ))}
                </div>
                <div className="text-container">
                    <div className="title">
                        {title} 
                        <div><span className='time'>{createTime.split(' ')[0]}</span></div>
                    </div>
                    <div className="attributes">
                        <span>览: {viewCount}</span>
                        <span>赞: {likesCount}</span>
                        <span>差: {badCount}</span>
                        <span>评: {commentsCount}</span>           
                    </div>
                </div>
            </div>
        </Card>
    );
};

export default NewsRecord;
