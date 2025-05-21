import { useState, useEffect } from 'react';
import { Card, Image, Popup, Badge } from 'antd-mobile';
import '@/components/news/NewsRecord.less';
import { FcLike, FcReading } from "react-icons/fc";
import { MessageOutline } from 'antd-mobile-icons';
import NewsInfo from '@/components/news/newsinfo/NewsInfo';
import { newsEnum } from '@/common/news'
import dayjs from 'dayjs'
import { NewsInfoType } from '@/pages/news/api'


const NewsRecord: React.FC<NewsInfoType> = ({ id,
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
  const [visibleCloseRight, setVisibleCloseRight] = useState(false)
  const [imageHeights, setImageHeights] = useState<number[]>([]);
  const handleImageLoad = (index: number, event: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const imgElement = event.currentTarget;
    const newImageHeights = [...imageHeights];
    newImageHeights[index] = imgElement.naturalHeight;
    setImageHeights(newImageHeights);
  };

  // `useState` 控制是否加载完成
  const [isLongImage, setIsLongImage] = useState<boolean | null>(null);

  const horizontalNews = (
    <>
      <div className="content-container">
        <div className="image-container">
          <Image className='news-image' lazy src={imagePath} alt={`图片${id}`} onLoad={(event) => handleImageLoad(id, event)} />
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

  const longitudinalNews = (
    <>
      <div className="h-title">{title}</div>
      <div className='h-time'>{createTime ? dayjs(createTime).format('YYYY-MM-DD HH:mm') : '时间未知'}</div>

      <div className="h-image-container">
        <Image className='h-news-image' lazy src={imagePath} alt={`图片${id}`} onLoad={(event) => handleImageLoad(id, event)} />
      </div>
      <div className="h-attributes-contariner">
        <div className="h-column">
          <Badge className='h-news-info-badge' color={newsEnum(category).color} content={newsEnum(category).name} />
        </div>
        <div className="h-column"><FcReading fontSize={18} /><span>{viewCount}</span></div>
        <div className="h-column"><FcLike fontSize={18} /><span>{likesCount}</span></div>
        <div className="h-column"><MessageOutline fontSize={18} /><span>{commentsCount}</span></div>
        <div className="h-column"><span className='source'>{source}</span></div>
      </div>
    </>
  );


  useEffect(() => {
    if (!photoPath || photoPath === '1') {
      setIsLongImage(false);
      return;
    }

    const firstImageSrc = photoPath.split('||').filter(Boolean)[0];


    if (!firstImageSrc) {
      setIsLongImage(false);
      return;
    }

    const img = new window.Image(); // ✅ 这样明确使用原生 `Image`
    img.src = firstImageSrc;

    img.onload = () => {
      const width = img.naturalWidth;
      const height = img.naturalHeight;

      // 只有当值 **真的改变** 时，才 `setState`
      setIsLongImage((prev) => (prev === null ? height >= 1.5 * width : prev));
    };
  }, [photoPath]);


  //如果没有加载完就先不渲染 知道useEffect执行完了 变化了状态
  if (isLongImage === null) {
    return null;
  }


  return (
    <>
      <Card className="inner-container" data-id={id} onClick={() => { setVisibleCloseRight(true) }}>
        {isLongImage ? longitudinalNews : horizontalNews}
      </Card>

      <Popup className='news-record-popup' bodyStyle={{ display: 'flex', flexDirection: 'column', overflowY: 'auto', width: '100%', height: '100%' }}
        position='right'
        // closeOnSwipe={true}
        closeOnMaskClick
        visible={visibleCloseRight}
        onClose={() => { setVisibleCloseRight(false) }}>

        <div className="popup-scrollable-content" >
          {
            visibleCloseRight
            &&
            <NewsInfo
              setVisibleCloseRight={setVisibleCloseRight}
              id={id}
              title={title}
              content={content}
              photoPath={imagePath}
              likesCount={likesCount}
              contentImagePath={contentImagePath}
              commentsCount={commentsCount}
              viewCount={viewCount}
              createTime={createTime}
              source={source}
              newsList={newsList}
              setNewsList={setNewsList}
              needCommentPoint={false}
              commentPointId={null}
              commentRef={null}
            />
          }
        </div>

      </Popup>
    </>
  );
};

export default NewsRecord;
