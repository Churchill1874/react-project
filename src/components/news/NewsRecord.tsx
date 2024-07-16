import React from 'react';
import { Card, Image } from 'antd-mobile';
import '@/components/news/NewsRecord.less';
import { NewsInfoType } from '@/pages/news/api';
import { useNavigate } from 'react-router-dom';
import { FcLike, FcVoicePresentation, FcReading } from "react-icons/fc";

const NewsRecord: React.FC<NewsInfoType> = ({ id, title, content, photoPath, likesCount, commentsCount, viewCount, createTime }) => {
  const navigate = useNavigate();

  const params = { id, title, content, photoPath, likesCount, commentsCount, viewCount, createTime }

  const toNewsInfo = () => {
    navigate('/newsinfo', { state: params })
  }

  return (
    <Card className="inner-container" onClick={() => toNewsInfo()}>
      <div className="content-container">
        <div className="image-container">
          {photoPath && photoPath.split(',').map((src, index) => (
            <Image key={index} src={src} alt={`图片${index + 1}`} />
          ))}
        </div>
        <div className="text-container">
          <div className="title">
            {title}
            <div><span className='time'>{createTime.split(' ')[0]}</span></div>
          </div>
          <div className="attributes">
            <span><FcReading /> {viewCount}</span>
            <span><FcLike /> {likesCount}</span>
            <span><FcVoicePresentation /> {commentsCount}</span>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default NewsRecord;
