import Comment from '@/components/comment/Comment';
import '@/components/news/newsinfo/NewsInfo.less';
import {
  NewsInfoReqType,
  Request_IncreaseLikesCount,
  Request_NewsInfo,
} from '@/components/news/newsinfo/api';
import { Image, ImageViewer, Swiper, TextArea, Toast, Skeleton, DotLoading } from 'antd-mobile';
import { HeartOutline, LeftOutline, MessageOutline } from 'antd-mobile-icons';
import { useEffect, useState } from 'react';
import { FcLike, FcReading } from "react-icons/fc";
import dayjs from 'dayjs'
import { NewsInfoType } from '@/pages/news/api'

type NewsInfoProps = NewsInfoType & {
  needCommentPoint?: boolean;
  commentPointId?: string | null;
}

const NewsInfo: React.FC<NewsInfoProps & { commentRef: any }> = ({
  setVisibleCloseRight,
  id,
  viewCount,
  newsList,
  setNewsList,
  needCommentPoint,
  commentPointId,
  commentRef
}) => {

  const [visible, setVisible] = useState(false)
  const [likesIdList, setLikesIdList] = useState<number[]>([]);

  const [newsStatus, setNewsStatus] = useState<NewsInfoType | null>();
  const showImage = () => {
    setVisible(prev => !prev);
  }

  const getImages = () => {
    return newsStatus?.contentImagePath ? newsStatus?.contentImagePath.split('||') : [newsStatus?.photoPath];
  };

  //查询新闻详情
  const reqNewsInfoApi = async () => {
    const param: NewsInfoReqType = { id: id };
    const response = await Request_NewsInfo(param);

    const { code, data } = response;
    if (code === 0) {
      if (data.filterContent) {
        data.filterContent = splitBySentenceLength(data.filterContent || '', 200).join('\n\n');
      }
      setNewsStatus(data);
    }
  }



  //点赞
  const clickLikes = async () => {
    if (likesIdList.includes(id)) {
      Toast.show({
        content: '已点赞',
        duration: 600,
      })
      return;
    } else {
      setLikesIdList((prev) => [...prev, id])
    }

    const param = { id: id, infoType: 1 }
    const resp = await Request_IncreaseLikesCount(param);

    if (resp.code === 0) {
      if (resp.data.value) {
        Toast.show({
          icon: <HeartOutline />,
          content: '点赞 +1',
          duration: 600,
        })
      } else {
        Toast.show({
          content: '已点赞',
          duration: 600,
        })
        return;
      }


      if (resp.data.value) {
        setNewsStatus((prev) => {
          if (!prev) return prev;
          return { ...prev, likesCount: (prev.likesCount || 0) + 1 }
        })
      }
    } else {
      Toast.show({
        content: '网络异常,请稍后重试',
        duration: 600,
      })
    }

  }


  useEffect(() => {
    setNewsStatus(null);
    // 强制重置TextArea内容
    const textarea = document.querySelector('.newsinfo-content textarea');
    if (textarea && 'value' in textarea) {
      (textarea as HTMLTextAreaElement).value = '';
      // 触发React的重新渲染
      textarea.dispatchEvent(new Event('input', { bubbles: true }));
    }

    reqNewsInfoApi();
    //获取当前胶囊新闻类型所用的新闻数据状态
    updateNewsListViewsCount(id)
  }, [id])

  //获取当前胶囊新闻类型所用的新闻数据状态
  const updateNewsListViewsCount = (id: number) => {
    const updateList = newsList?.map((data, _index) => (data.id === id) ? { ...data, viewCount: viewCount + 1 } : data)
    if (setNewsList && updateList) {
      setNewsList(updateList);
    }

  }


  function splitBySentenceLength(text: string, maxChars = 200): string[] {
    const sentences = text.split(/(。|！|？)/); // 保留句号、感叹号、问号（包括标点）
    const result: string[] = [];
    let currentParagraph = '';

    for (let i = 0; i < sentences.length; i += 2) {
      const sentence = (sentences[i] || '') + (sentences[i + 1] || '');

      // 判断是否需要换段
      if ((currentParagraph + sentence).length >= maxChars) {
        // 如果当前段落最后是引号开头或结尾的不完整形式，合并一下
        if (/^[”」']$/.test(sentence.trim().charAt(0))) {
          currentParagraph += sentence; // 不换段，把这句并进去
        } else {
          result.push(currentParagraph);
          currentParagraph = sentence;
        }
      } else {
        currentParagraph += sentence;
      }
    }

    if (currentParagraph.trim()) {
      result.push(currentParagraph);
    }

    return result;
  }

  return (
    <>

      {
        newsStatus
        && newsStatus.id
        && (
          <>
            <ImageViewer.Multi classNames={{ mask: 'customize-mask', body: 'customize-body', }} images={getImages()} visible={visible} onClose={() => { setVisible(false) }} />

            <div className='news-info'>
              <div className='newsinfo-title' onClick={() => { setVisibleCloseRight(false); }} ><span style={{ paddingRight: '5px', color: 'gray' }} ><LeftOutline fontSize={20} />返回</span> {newsStatus?.title || ''}</div>
              <div><span className='source'>{newsStatus?.source || ''}</span> <span className='newsinfo-time'>{dayjs(newsStatus?.createTime || '').format('YYYY-MM-DD HH:mm')}</span></div>
              {
                newsStatus?.contentImagePath?.trim() &&
                <Swiper loop autoplay allowTouchMove>
                  {
                    newsStatus.contentImagePath
                      .split('||')
                      .filter(Boolean)
                      .map((imagePath, index) => (
                        <Swiper.Item className="swiper-item" key={index}>
                          <Image
                            fit="contain"
                            width={300}
                            height={200}
                            src={imagePath}
                            onClick={showImage}
                          />
                        </Swiper.Item>
                      ))
                  }
                </Swiper>
              }

              {
                !newsStatus.contentImagePath && (
                  <Swiper loop autoplay allowTouchMove>
                    {
                      newsStatus.photoPath
                        .split('||')
                        .filter(Boolean)
                        .map((imagePath, index) => (
                          <Swiper.Item className="swiper-item" key={index}>
                            <Image
                              fit="contain"
                              width={300}
                              height={200}
                              src={imagePath}
                              onClick={showImage}
                            />
                          </Swiper.Item>
                        ))
                    }
                  </Swiper>
                )
              }


              {newsStatus?.filterContent ?
                <TextArea value={newsStatus?.filterContent} readOnly rows={10} className='newsinfo-content' />
                :
                <TextArea value={""} readOnly rows={8} className='newsinfo-content' />
              }



              <div className="newsinfo-attribute">
                <span><FcReading className='attribute-icon' fontSize={16} /> 浏览  {newsStatus?.viewCount ? newsStatus?.viewCount + 1 : 1}</span>
                <span><FcLike className='attribute-icon' fontSize={16} onClick={clickLikes} /> 赞 {newsStatus?.likesCount || 0}</span>
                <span><MessageOutline className='attribute-icon' fontSize={17} /> 评论  {newsStatus?.commentsCount || 0} </span>
              </div>

              <Comment
                needCommentPoint={needCommentPoint}
                commentPointId={commentPointId}
                setNewsStatus={setNewsStatus}
                newsId={id}
                newsType={1}
                ref={commentRef}
              />

            </div>
          </>
        )
      }

      {
        !newsStatus &&
        <>
          <DotLoading color='primary' />
          <Skeleton.Title animated />
          <Skeleton.Paragraph lineCount={12} animated />
        </>
      }



    </>

  );
}

export default NewsInfo;
