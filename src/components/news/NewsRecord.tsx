import React from 'react';
import { Card, Image } from 'antd-mobile';
import '@/components/news/NewsRecord.less';
import { NewsInfoType } from '@/pages/news/api';
import { useNavigate } from 'react-router-dom';
import { FcLike, FcReading } from "react-icons/fc";
import { MessageOutline} from 'antd-mobile-icons';

const NewsRecord: React.FC<NewsInfoType> = ({ id, title, content, photoPath, likesCount, contentImagePath, commentsCount, viewCount, createTime }) => {
  const navigate = useNavigate();

  const params = { id, title, content, photoPath, likesCount, contentImagePath, commentsCount, viewCount, createTime }

  const toNewsInfo = () => {
    navigate('/newsinfo', { state: params })
  }

  return (
    <Card className="inner-container" onClick={() => toNewsInfo()}>
      <div className="content-container">
        <div className="image-container">
          {photoPath && photoPath.split(',').map((src, index) => (
            <Image className='news-image' lazy key={index} src={src} alt={`图片${index + 1}`} />
          ))}
        </div>
        <div className="text-container">
          <div className="title">
            {title}
            <div><span className='time'>{createTime.split(' ')[0]}</span></div>
          </div>
          <div className="attributes">
            <span><FcReading fontSize={15} /> {viewCount}</span>
            <span><FcLike fontSize={15}/> {likesCount}</span>
            <span><MessageOutline fontSize={15}/> {commentsCount}</span>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default NewsRecord;
