import { useRef } from 'react';
import { Card, Image } from 'antd-mobile';
import '@/components/news/NewsRecord.less';
import { FcLike, FcReading } from "react-icons/fc";
import { MessageOutline} from 'antd-mobile-icons';
import useStore from '@/zustand/store'

export interface NewsInfoType{
  category?: any | null;
  commentsCount?: any | null;
  content?: any | null;
  contentImagePath?: any | null;
  createName?: any | null;
  createTime?: any | null;
  filterContent?: any | null;
  id?: any | null;
  likesCount?: any | null;
  newsStatus?: any | null;
  photoPath?: any | null;
  source?: any | null;
  title?: any | null;
  updateName?: any | null;
  updateTime?: any | null;
  url?: any | null;
  viewCount?: any | null;
  newsTab?: any;
  onClick?: any;
}


const NewsRecord: React.FC<NewsInfoType> = ({ id, title, content, photoPath, likesCount, contentImagePath, commentsCount, viewCount, createTime ,newsTab, onClick}) => {

  return (
    <Card className="inner-container" onClick={onClick} data-id={id}>
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
