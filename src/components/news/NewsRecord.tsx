import { useState } from 'react';
import { Card, Image, Popup } from 'antd-mobile';
import '@/components/news/NewsRecord.less';
import { FcLike, FcReading } from "react-icons/fc";
import { MessageOutline } from 'antd-mobile-icons';
import NewsInfo from '@/components/news/newsinfo/NewsInfo';

export interface NewsInfoType {
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
}



const NewsRecord: React.FC<NewsInfoType> = ({ id, title, content, photoPath, likesCount, contentImagePath, commentsCount, viewCount, createTime, newsTab }) => {
  const [visibleCloseRight, setVisibleCloseRight] = useState(false)

  return (
    <>
      <Card className="inner-container" data-id={id} onClick={() => { setVisibleCloseRight(true) }}>
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
              <span><FcLike fontSize={15} /> {likesCount}</span>
              <span><MessageOutline fontSize={15} /> {commentsCount}</span>
            </div>
          </div>
        </div>
      </Card>

      <Popup className='news-record-popup' bodyStyle={{ display: 'flex', flexDirection: 'column', overflowY: 'auto', width: '100%' }}
        position='right'
        closeOnSwipe={true}
        closeOnMaskClick
        visible={visibleCloseRight}
        onClose={() => { setVisibleCloseRight(false) }}>

        <div className="popup-scrollable-content" >
          <NewsInfo
            setVisibleCloseRight={setVisibleCloseRight}
            id={id}
            title={title}
            content={content}
            photoPath={photoPath}
            likesCount={likesCount}
            contentImagePath={contentImagePath}
            commentsCount={commentsCount}
            viewCount={viewCount}
            createTime={createTime}
            newsTab={newsTab} />
        </div>

      </Popup>
    </>
  );
};

export default NewsRecord;
