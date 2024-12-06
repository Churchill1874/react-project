import { useState, useEffect, useRef, forwardRef, useImperativeHandle } from "react";
import { Card, Divider, Tag, Ellipsis, Image, Popup, TextArea, TextAreaRef, FloatingBubble, Button, Toast, Input, PullToRefresh, InfiniteScroll, DotLoading } from 'antd-mobile';
import Comment from '@/components/comment/Comment';
import { FcReading } from "react-icons/fc";
import { MessageOutline, LeftOutline, MessageFill } from 'antd-mobile-icons';
import '@/components/southeastasia/SoutheastAsia.less'
import { SendNewsCommentReqType, Request_SendNewsComment, SoutheastAsiaNewsPageReq, SoutheastAsiaNewsPageReqType, SoutheastAsiaNewsType } from '@/components/southeastasia/api'
import useStore from '@/zustand/store'



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


const Company: React.FC = () => {
  const [showsCommentInput, setShowCommentInput] = useState(false)
  const textAreaRef = useRef<TextAreaRef>(null);
  const [comment, setComment] = useState('')
  const [newsCommentCount, setNewsCommentCount] = useState(0);//新闻评论数量
  const [visibleCloseRight, setVisibleCloseRight] = useState(false)
  const content = '上千人公司,主要提供东南亚,行业龙头,主要经营项目为线上游戏源头,对接第三方大厅,和第三方支付项目提供对接上千人公司,主要提供东南亚,行业龙头,主要经营项目为线上游戏源头,对接第三方大厅,和第三方支付项目提供对接';
  const [popupInfo, setPopupInfo] = useState<PopupInfo>({ id: null, area: "", content: "", readCount: 0, commentCount: 0, southeastasiaNewsImage: '', createTime: '', isHot: false });
  const { southeastAsiaNewsList, setSoutheastAsiaNewsList, southeastAsiaNewsHasHore, setSoutheastAsiaNewsHasHore, southeastAsiaNewsPage, setSoutheastAsiaNewsPage } = useStore();

  interface PopupInfo {
    id: any | null;
    southeastasiaNewsImage: any | null; //图片路径
    readCount: any | null; // 读取次数
    commentCount: any | null; //评论数量
    area: any | null; //地区
    content: any | null; //新闻内容
    createTime: any | null;
    isHot: any | null;

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

  //输入文本域的内容存入状态
  const inputCommentChange = (value: string) => {
    setComment(value);
  }


  //发送顶层评论
  const sendTopComment = async (id: any) => {
    if (!comment) {
      Toast.show({
        content: '请输入评论内容',
        duration: 1000
      })
      return;
    }
    const param: SendNewsCommentReqType = { newsType: 2, newsId: id, content: comment }
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


  const showPopupInfo = (id, area, content, readCount, commentCount, southeastasiaNewsImage, createTime, isHot) => {
    setVisibleCloseRight(true)
    setPopupInfo({ id, area, content, readCount, commentCount, southeastasiaNewsImage, createTime, isHot })
  }


  //获取api东南亚新闻数据
  const southeastAsiaNewsPageRequest = async (isReset: boolean) => {
    const pageNum = isReset ? 1 : southeastAsiaNewsPage;
    const param: SoutheastAsiaNewsPageReqType = { pageNum: pageNum, pageSize: 20 };
    const list: SoutheastAsiaNewsType[] = (await SoutheastAsiaNewsPageReq(param)).data.records || [];

    console.log('获取api东南亚新闻数据:' + list)

    //循环便利
    if (list.length > 0) {
      if (isReset) {
        setSoutheastAsiaNewsPage(() => 2);
        setSoutheastAsiaNewsList(list);
        setSoutheastAsiaNewsHasHore(true);
      } else {
        if (JSON.stringify(list) !== JSON.stringify(southeastAsiaNewsList)) {
          setSoutheastAsiaNewsPage(prev => (prev + 1))
          setSoutheastAsiaNewsList([...southeastAsiaNewsList, ...list])
          setSoutheastAsiaNewsHasHore(true)
        } else {
          setSoutheastAsiaNewsHasHore(false)
        }
      }
    } else {
      setSoutheastAsiaNewsHasHore(false)
    }

    setSoutheastAsiaNewsList(list);
  }

  const SoutheastAsiaNewsScrollContent = ({ hasMore }: { hasMore?: boolean }) => {
    return (
      <>
        {hasMore ? (
          <>
            <div className="dot-loading-custom" >
              <span >Loading</span>
              <DotLoading color='#fff' />
            </div>
          </>
        ) : (
          <span color='#fff'>--- 我是有底线的 ---</span>
        )}
      </>
    )
  }

  useEffect(() => {

  }, []);


  return (
    <>
      <div className="card-container" >
        <PullToRefresh onRefresh={() => southeastAsiaNewsPageRequest(true)}>
          {southeastAsiaNewsList?.map((southeastAsiaNews, index) => (
            <Card className="custom-card">
              <div className="card-content">
                <div className="southeastasia-news-image-container">
                  <Image
                    className="southeastasia-news-image"
                    src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRrZq5wFJ_FtNWQQGdRkmXonQOEuMVpWuWm3w&s"
                    alt="Example"
                    fit="contain"
                  />
                </div>

                <Divider className='divider-line' />

                <div className="text-area">
                  <Ellipsis direction='end' rows={3} content={southeastAsiaNews.content} />
                </div>
                <span className="southeastasia-time"> {southeastAsiaNews.isHot && <Tag color='red' fill='outline'>热门</Tag>} {southeastAsiaNews.createTime}</span>

                <Divider className='divider-line' />

                <div className="button-info">
                  <span className="tracking">{southeastAsiaNews.area}</span>
                  <span className="icon-and-text">
                    <FcReading fontSize={17} />
                    <span className="number"> {southeastAsiaNews.readCount} </span>
                  </span>

                  <span className="tracking">
                    <span className="icon-and-text">
                      <MessageOutline fontSize={17} />
                      <span className="number"> {southeastAsiaNews.commentCount}</span>
                      <span className="click"
                        onClick={() => {
                          showPopupInfo(southeastAsiaNews.id, southeastAsiaNews.area,
                            southeastAsiaNews.content, southeastAsiaNews.readCount,
                            southeastAsiaNews.commentCount, southeastAsiaNews.imagePath,
                            southeastAsiaNews.createTime, southeastAsiaNews.isHot)
                        }}>点击查看</span>
                    </span>
                  </span>
                </div>
              </div>
            </Card>
          ))}
        </PullToRefresh>

        <InfiniteScroll loadMore={() => southeastAsiaNewsPageRequest(false)} hasMore={southeastAsiaNewsHasHore}>
          <SoutheastAsiaNewsScrollContent hasMore={southeastAsiaNewsHasHore} />
        </InfiniteScroll>
      </div>


      {/********************新闻点击弹窗详情********************/}
      <Popup className='news-record-popup' bodyStyle={{ display: 'flex', flexDirection: 'column', overflowY: 'auto', width: '100%' }}
        position='right'
        closeOnSwipe={true}
        closeOnMaskClick
        visible={visibleCloseRight}
        onClose={() => { setVisibleCloseRight(false) }}>

        <div className="popup-scrollable-content" >
          <div onClick={() => setVisibleCloseRight(false)} ><span style={{ paddingRight: '5px', color: 'gray' }} ><LeftOutline fontSize={16} />返回 </span><span className="newsinfo-title">东南亚新闻</span></div>

          <Card className="custom-card">
            <div className="card-content">
              <div className="southeastasia-news-image-container">
                <Image
                  className="southeastasia-news-image"
                  src={popupInfo.southeastasiaNewsImage ? popupInfo.southeastasiaNewsImage : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRrZq5wFJ_FtNWQQGdRkmXonQOEuMVpWuWm3w&s"}
                  alt="Example"
                  fit="contain"
                />
              </div>

              <div className="text-area">
                {popupInfo.content}
              </div>

              <span className="southeastasia-time"><span >{popupInfo.isHot && <Tag color='red' fill='outline'>热门</Tag>}  {popupInfo.createTime}</span></span>

              <Divider className='divider-line' />
              <div className="button-info">
                <span className="tracking">
                  <Input className="southeastAsia-input-comment" value='' onFocus={handleInputFocus} placeholder="请输入您的评论吧～" onClick={inputCommentClick} />
                </span>

                <span className="tracking">
                  <span className="icon-and-text">
                    <FcReading fontSize={17} />
                    <span className="number">{popupInfo.readCount}</span>
                  </span>
                </span>

                <span className="tracking">
                  <span className="city">{popupInfo.area}</span>
                </span>
              </div>

              <Comment newsCommentCount={newsCommentCount} setNewsCommentCount={setNewsCommentCount} newsId={popupInfo.id} newsType={2} />
            </div>
          </Card>
        </div>

        <FloatingBubble onClick={inputCommentClick} axis='xy' magnetic='x' style={{ '--initial-position-bottom': '24px', '--initial-position-right': '24px', '--edge-distance': '24px' }}>
          <MessageFill fontSize={32} />
        </FloatingBubble>

        <Popup className='news-comment-popup'
          visible={showsCommentInput}
          onMaskClick={() => { setShowCommentInput(false) }}
          onClose={() => { setShowCommentInput(false) }}
          bodyStyle={{ height: '40vh', backgroundColor: 'transparent !important', boxShadow: 'none !important' }}
          maskStyle={{ backgroundColor: 'rgba(0, 0, 0, 0.5) !important' }}
        >
          <CustomTextArea className='news-comment-area' autoSize defaultValue={''} showCount maxLength={200} ref={textAreaRef} onChange={inputCommentChange} />
          <Button className="news-send-comment-button" color="primary" onClick={() => sendTopComment(popupInfo.id)}> 发送评论 </Button>
        </Popup>
      </Popup>
    </>
  );
}



export default Company;