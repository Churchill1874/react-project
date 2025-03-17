import Comment from '@/components/comment/Comment';
import '@/components/news/newsinfo/NewsInfo.less';
import {
  NewsInfoReqType,
  Request_IncreaseLikesCount,
  Request_NewsInfo,
} from '@/components/news/newsinfo/api';
import { Image, ImageViewer, Swiper, TextArea, Toast } from 'antd-mobile';
import { HeartOutline, LeftOutline, MessageOutline } from 'antd-mobile-icons';
import { useEffect, useState } from 'react';
import { FcLike, FcReading } from "react-icons/fc";
import dayjs from 'dayjs'
import { NewsInfoType } from '@/pages/news/api'



const NewsInfo: React.FC<NewsInfoType> = ({ setVisibleCloseRight,
  id,
  title,
  content,
  contentImagePath,
  photoPath,
  likesCount,
  viewCount,
  commentsCount,
  createTime,
  source,
  newsList,
  setNewsList
}) => {
  /* 
    const textAreaRef = useRef<TextAreaRef>(null);
    const [comment, setComment] = useState('') */
  const [visible, setVisible] = useState(false)
  const [likesIdList, setLikesIdList] = useState<number[]>([]);
  const [newsCommentCount, setNewsCommentCount] = useState(commentsCount);//新闻评论数量
  const [newsLikesCount, setNewsLikesCount] = useState(likesCount);
  const [newsViewCount, setNewsViewCount] = useState(viewCount);


  const showImage = () => {
    setVisible(prev => !prev);
  }

  const getImages = () => {
    return contentImagePath ? contentImagePath.split(',') : [photoPath];
  };


  //发送顶层评论
  /*   const sendTopComment = async () => {
      if (!comment) {
        Toast.show({
          content: '请输入评论内容',
          duration: 1000
        })
        return;
      }
      const param: SendNewsCommentReqType = { infoType: 1, newsId: id, content: comment }
      const response = await Request_SendNewsComment(param);
  
      if (response.code === 0) {
        if (textAreaRef.current) {
          textAreaRef.current.clear();
        }
        Toast.show('发送成功');
        setComment('');
        setNewsCommentCount((prev) => prev + 1);
        //setShowCommentInput(false)
      }
    } */

  //查询新闻详情
  const reqNewsInfoApi = async () => {
    const param: NewsInfoReqType = { id: id };
    const response = await Request_NewsInfo(param);

    const { code, data } = response;
    if (code === 0) {
      setNewsCommentCount(data.commentsCount);
      setNewsLikesCount(data.likesCount);
      setNewsViewCount(data.viewCount);
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

    const param = { id: id }
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
        setNewsLikesCount((prev) => prev + 1)
      }
    } else {
      Toast.show({
        content: '网络异常,请稍后重试',
        duration: 600,
      })
    }

  }

  useEffect(() => {
    //刷新新闻信息
    reqNewsInfoApi();
    //获取当前胶囊新闻类型所用的新闻数据状态
    updateNewsListViewsCount(id)
  }, [])

  //获取当前胶囊新闻类型所用的新闻数据状态
  const updateNewsListViewsCount = (id: number) => {
    const updateList = newsList?.map((data, _index) => (data.id === id) ? { ...data, viewCount: viewCount + 1 } : data)
    setNewsList(updateList);
  }

  function splitTextByMinLength(text: string, minLength: number = 100): string[] {
    const result: string[] = [];
    const segments: string[] = text.split(/(?<=。)/); // 按句号分割，保留句号

    let temp = ''; // 临时累积段落
    segments.forEach((segment) => {
      temp += segment.trim(); // 累积当前段落
      if (temp.length >= minLength) {
        result.push(temp); // 达到最小长度，存入结果
        temp = ''; // 清空临时累积
      }
    });

    if (temp) {
      result.push(temp); // 处理最后未存入的段落
    }

    return result;
  }


  return (
    <>
      <ImageViewer.Multi classNames={{ mask: 'customize-mask', body: 'customize-body', }} images={getImages()} visible={visible} onClose={() => { setVisible(false) }} />

      <div className='news-info'>
        <div className='newsinfo-title' onClick={() => setVisibleCloseRight(false)} ><span style={{ paddingRight: '5px', color: 'gray' }} ><LeftOutline fontSize={20} />返回</span> {title}</div>
        <div><span className='source'>{source}</span> <span className='newsinfo-time'>{dayjs(createTime).format('YYYY-MM-DD HH:mm')}</span></div>

        {contentImagePath &&
          <Swiper loop autoplay allowTouchMove>
            {contentImagePath.split(',').map((imagePath, index) => (
              <Swiper.Item className="swiper-item" key={index} >
                <Image fit='contain' width={300} height={200} src={imagePath} onClick={showImage} />
              </Swiper.Item>
            ))}
          </Swiper>
        }
        {!contentImagePath &&
          <Swiper loop autoplay allowTouchMove>
            <Swiper.Item className="swiper-item" key={1} >
              <Image fit='contain' width={300} height={200} src={photoPath} onClick={showImage} />
            </Swiper.Item>
          </Swiper>
        }

        <TextArea
          defaultValue={splitTextByMinLength(content, 200).join('\n\n')} // 使用两个换行符表示段间距
          readOnly
          rows={8}
          className='newsinfo-content'
        />

        <div className="newsinfo-attribute">
          <span><FcReading className='attribute-icon' fontSize={16} /> 浏览  {newsViewCount + 1}</span>
          <span><FcLike className='attribute-icon' fontSize={16} onClick={clickLikes} /> 赞 {newsLikesCount}</span>
          <span><MessageOutline className='attribute-icon' fontSize={17} /> 评论  {newsCommentCount} </span>

        </div>

        <Comment newsCommentCount={newsCommentCount} setNewsCommentCount={setNewsCommentCount} newsId={id} newsType={1} />
      </div>

    </>

  );
}

export default NewsInfo;