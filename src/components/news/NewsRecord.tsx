import { useState } from 'react';
import { Card, Image, Badge } from 'antd-mobile';
import '@/components/news/NewsRecord.less';
import { FcLike, FcReading } from "react-icons/fc";
import { MessageOutline } from 'antd-mobile-icons';
import { useNavigate } from 'react-router-dom';
import useStore from '@/zustand/store';
import { newsEnum } from '@/common/news'
import dayjs from 'dayjs'
import { NewsInfoType } from '@/pages/news/api'
import { getImgUrl } from '@/utils/commentUtils';

type Props = NewsInfoType & {
  newsList: NewsInfoType[];
  setNewsList: React.Dispatch<React.SetStateAction<NewsInfoType[]>>;
};


const NewsRecord: React.FC<Props> = ({ id,
  title,
  content,
  photoPath,
  likesCount,
  contentImagePath,
  commentsCount,
  viewCount,
  createTime,
  category,
  source,
  newsList,
  setNewsList,
}) => {

  const imagePath = photoPath && photoPath !== '1' ? photoPath : '/assets/logo/logo2.png'
  const navigate = useNavigate();
  const { setNewsScrollPosition } = useStore();

  const toDetail = () => {
    const container = document.querySelector('.news-content') as HTMLElement | null;
    if (container) {
      setNewsScrollPosition('news', container.scrollTop);  // 只存 scrollTop
    }
    // 不 replace，让后退能回到列表原位置（而不是直接跳到上一层、不保留新闻列表状态）
    navigate('/newsInfo/' + id, {
      state: {
        fromPath: window.location.pathname,
      },
    });
  };

  const horizontalNews = (
    <>
      <div className="content-container">
        <div className="image-container">
          <Image className='news-image' lazy src={getImgUrl(imagePath)} alt={`图片${id}`} />
        </div>
        <div className="text-container">
          <div className="title">
            {title}
          </div>
          <div >
            <span className='time'>{dayjs(createTime).format('YYYY-MM-DD HH:mm')}</span>
          </div>
          <div className='news-info-container'>
            <Badge className='news-info-badge' color={newsEnum(category).color} content={newsEnum(category).name} />
          </div>
          <div className='news-info-source-container'>
            <span className='source'>{source}</span>
          </div>
          <div className="attributes">
            <span><FcReading fontSize={15} /> {viewCount}</span>
            <span><FcLike fontSize={15} /> {likesCount}</span>
            <span><MessageOutline fontSize={15} /> {commentsCount}</span>
          </div>
        </div>
      </div>

    </>
  );

  return (
    <>
      <Card className="inner-container" data-id={id} onClick={toDetail}>
        {horizontalNews}
      </Card>
    </>
  );
};

export default NewsRecord;
