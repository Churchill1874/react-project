import { useState, useRef, useImperativeHandle, forwardRef, useEffect } from 'react';
import { Swiper, NavBar, Image, TextArea, ImageViewer, Input, Button, Toast, Popup, TextAreaRef } from 'antd-mobile'
import { HeartOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import '@/components/news/newsinfo/NewsInfo.less'
import Comment from '@/components/comment/Comment'
import { useLocation } from 'react-router-dom';
import { FcLike, FcReading } from "react-icons/fc";
import useStore from '@/zustand/store'
import {
  Request_SendNewsComment,
  Request_NewsInfo,
  NewsInfoReqType,
  SendNewsCommentReqType,
  Request_IncreaseLikesCount
} from '@/components/news/newsinfo/api'

const CustomTextArea = forwardRef<TextAreaRef, any>((props, ref) => {
  const innerRef = useRef<TextAreaRef>(null);

  useImperativeHandle(ref, () => ({
    focus: () => {
      if (innerRef.current) {
        innerRef.current.focus();
      }
    },
    clear: () => {
      if (innerRef.current) {
        innerRef.current.clear();
      }
    },
    blur: () => {
      if (innerRef.current) {
        innerRef.current.blur();
      }
    },
    get nativeElement() {
      return innerRef.current ? innerRef.current.nativeElement : null;
    }
  }));

  return <TextArea {...props} placeholder='请输入评论内容' ref={innerRef} />;
});

const NewsInfo: React.FC = () => {
  const textAreaRef = useRef<TextAreaRef>(null);
  const [comment, setComment] = useState('')
  const [showsCommentInput, setShowCommentInput] = useState(false)
  const navigate = useNavigate();
  const [visible, setVisible] = useState(false)
  const { id, title, content, contentImagePath, photoPath, likesCount, viewCount, commentsCount, createTime, previousType } = useLocation().state;
  const [newsCommentCount, setNewsCommentCount] = useState(commentsCount);//新闻评论数量
  const [newsLikesCount, setNewsLikesCount] = useState(likesCount);
  const [newsViewCount, setNewsViewCount] = useState(viewCount);
  const [likesIdList, setLikesIdList] = useState<number[]>([]);



  //各种新闻类型全局状态数据
  const { newsList, setNewsList,
    sportList, setSportList,
    entertainmentList, setEntertainmentList,
    militaryList, setMilitaryList,
    scienceList, setScienceList,
    netFriendList, setNetFriendList,
    southeastAsiaList, setSoutheastAsiaList,
    youtubeList, setYoutubeList
  } = useStore();//新闻的全局变量


  const showImage = () => {
    setVisible(prev => !prev);
  }

  const getImages = () => {
    return contentImagePath ? contentImagePath.split(',') : [photoPath];
  };

  const getContentRows = () => {
    const contentLength = content.length / 28;
    return contentLength < 12 ? Math.ceil(contentLength) : 12;
  }

  //发送顶层评论
  const sendTopComment = async () => {
    if (!comment) {
      Toast.show({
        content: '请输入评论内容',
        duration: 1000
      })
      return;
    }
    const param: SendNewsCommentReqType = { newsId: id, content: comment }
    const response = await Request_SendNewsComment(param);

    if (response.code === 0) {
      if (textAreaRef.current) {
        textAreaRef.current.clear();
      }
      Toast.show('发送成功');
      setComment('');
      setNewsCommentCount((prev) => prev + 1);
      setShowCommentInput(false)
    }
  }

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

  //输入文本域的内容存入状态
  const inputCommentChange = (value: string) => {
    setComment(value);
  }

  // 处理 Input 聚焦事件，阻止其获取焦点
  const handleInputFocus = (event) => {
    event.preventDefault();
    event.target.blur();
  };

  //点击输入框时候 让文本域获取到焦点
  const inputCommentClick = () => {
    setShowCommentInput(true);
    setTimeout(() => {
      if (textAreaRef.current) {
        textAreaRef.current.focus();
      }
    }, 0);
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
      if (resp.data) {
        Toast.show({
          icon: <HeartOutlined />,
          content: '点赞 +1',
          duration: 600,
        })
      } else {
        Toast.show({
          content: '已点赞',
          duration: 600,
        })
      }


      if (resp.data) {
        setNewsLikesCount((prev) => prev + 1)
      }
    } else {
      Toast.show({
        content: '网络异常,请稍后重试',
        duration: 600,
      })
    }

  }

  //返回上一层
  const back = () => {
    // 如果有 previousType，则导航回对应的新闻列表页面
    if (previousType) {
      navigate(`/news/${previousType}`);
    } else {
      navigate(-1); // 否则使用默认的返回行为
    }
  };

  useEffect(() => {
    //刷新新闻信息
    reqNewsInfoApi();
    //获取当前胶囊新闻类型所用的新闻数据状态
    updateNewsListViewsCount(id)
  }, [id])

  //获取当前胶囊新闻类型所用的新闻数据状态
  const updateNewsListViewsCount = (id: number) => {
    if (previousType === '1') {
      const updateList = newsList.map((data, _index) => (data.id === id) ? { ...data, viewCount: viewCount + 1 } : data)
      setNewsList(updateList);
    }
    if (previousType === '2') {
      const updateList = sportList.map((data, _index) => (data.id === id) ? { ...data, viewCount: viewCount + 1 } : data)
      setSportList(updateList);
    }
    if (previousType === '3') {
      const updateList = entertainmentList.map((data, _index) => (data.id === id) ? { ...data, viewCount: viewCount + 1 } : data)
      setEntertainmentList(updateList);
    }
    if (previousType === '4') {
      const updateList = militaryList.map((data, _index) => (data.id === id) ? { ...data, viewCount: viewCount + 1 } : data)
      setMilitaryList(updateList);
    }
    if (previousType === '5') {
      const updateList = scienceList.map((data, _index) => (data.id === id) ? { ...data, viewCount: viewCount + 1 } : data)
      setScienceList(updateList)
    }
    if (previousType === '7') {
      const updateList = netFriendList.map((data, _index) => (data.id === id) ? { ...data, viewCount: viewCount + 1 } : data)
      setNetFriendList(updateList)
    }
    if (previousType === '8') {
      const updateList = southeastAsiaList.map((data, _index) => (data.id === id) ? { ...data, viewCount: viewCount + 1 } : data)
      setSoutheastAsiaList(updateList)
    }
    if (previousType === '9') {
      const updateList = youtubeList.map((data, _index) => (data.id === id) ? { ...data, viewCount: viewCount + 1 } : data)
      setYoutubeList(updateList)
    }
  }


  return (
    <>
      <ImageViewer.Multi classNames={{ mask: 'customize-mask', body: 'customize-body', }} images={getImages()} visible={visible} onClose={() => { setVisible(false) }} />

      <div className='news-info'>
        <NavBar className="edit" onBack={back}></NavBar>

        <div className='newsinfo-title'>{title}</div>
        <div className='newsinfo-time'>{createTime}</div>

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


        <TextArea defaultValue={content} readOnly rows={getContentRows()} className='newsinfo-content' />

        <div className="newsinfo-attribute">
          <span><FcReading className='attribute-icon' fontSize={20} /> 浏览  {newsViewCount + 1}</span>
          <span><FcLike className='attribute-icon' fontSize={20} onClick={clickLikes} /> 赞 {newsLikesCount}</span>
        </div>

        <Comment key={newsCommentCount} newsCommentCount={newsCommentCount} setNewsCommentCount={setNewsCommentCount} newsId={id} />
      </div>

      <div className="send-news-comment">
        <Input className="news-input-comment" value='' onFocus={handleInputFocus} placeholder="请输入您的评论吧～" onClick={inputCommentClick} />
        <Popup className='news-comment-popup'
          visible={showsCommentInput}
          onMaskClick={() => { setShowCommentInput(false) }}
          onClose={() => { setShowCommentInput(false) }}
          bodyStyle={{ height: '40vh', backgroundColor: 'transparent !important', boxShadow: 'none !important' }}
          maskStyle={{ backgroundColor: 'rgba(0, 0, 0, 0.5) !important' }}
        >
          <CustomTextArea className='news-comment-area' autoSize defaultValue={''} showCount maxLength={200} ref={textAreaRef} onChange={inputCommentChange} />
          <Button className="news-send-comment-button" color="primary" onClick={sendTopComment}> 发送评论 </Button>
        </Popup>
      </div>
    </>

  );
}

export default NewsInfo;