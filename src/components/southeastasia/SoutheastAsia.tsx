import { useState, useEffect, useRef, forwardRef, useImperativeHandle } from "react";
import { Card, Divider, Tag, Ellipsis, Image, Popup, TextArea, TextAreaRef, FloatingBubble, Button, Toast, Input, PullToRefresh, InfiniteScroll, DotLoading } from 'antd-mobile';
import Comment from '@/components/comment/Comment';
import { FcReading } from "react-icons/fc";
import { MessageOutline, LeftOutline, MessageFill, LocationFill } from 'antd-mobile-icons';
import '@/components/southeastasia/SoutheastAsia.less'
import { SendNewsCommentReqType, Request_SendNewsComment, SoutheastAsiaNewsPageReq, SoutheastAsiaNewsPageReqType, SoutheastAsiaNewsType } from '@/components/southeastasia/api'
import dayjs from 'dayjs'



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
  const [popupInfo, setPopupInfo] = useState<PopupInfo>({ id: null, area: "", content: "", readCount: 0, commentCount: 0, southeastasiaNewsImage: '', createTime: '', isHot: false, isTop: false, source: "", title: "" });

  const [southeastAsiaNewsList, setSoutheastAsiaNewsList] = useState<SoutheastAsiaNewsType[]>([]);
  const [southeastAsiaNewsHasHore, setSoutheastAsiaNewsHasHore] = useState<boolean>(true);
  const [southeastAsiaNewsPage, setSoutheastAsiaNewsPage] = useState<number>(1);


  interface PopupInfo {
    id: any | null;
    southeastasiaNewsImage: any | null; //图片路径
    readCount: any | null; // 读取次数
    commentCount: any | null; //评论数量
    area: any | null; //地区
    content: any | null; //新闻内容
    createTime: any | null;
    isHot: any | null;//热门
    isTop: any | null;//置顶
    source: any | null;
    title: any | null;
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


  const showPopupInfo = (id, area, content, readCount, commentCount, southeastasiaNewsImage, createTime, isHot, isTop, source, title) => {
    setVisibleCloseRight(true)
    setPopupInfo({ id, area, content, readCount, commentCount, southeastasiaNewsImage, createTime, isHot, isTop, source, title })
  }


  //获取api东南亚新闻数据
  const southeastAsiaNewsPageRequest = async (isReset: boolean) => {
    const pageNum = isReset ? 1 : southeastAsiaNewsPage;
    const param: SoutheastAsiaNewsPageReqType = { pageNum: pageNum, pageSize: 20 };
    const list: SoutheastAsiaNewsType[] = (await SoutheastAsiaNewsPageReq(param)).data.records || [];


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

  }

  const SoutheastAsiaNewsScrollContent = ({ hasMore }: { hasMore?: boolean }) => {
    return (
      <>
        {hasMore ? (
          <>
            <div className="dot-loading-custom" >
              <span >加载中</span>
              <DotLoading color='#fff' />
            </div>
          </>
        ) : (
          <span color='#fff'>--- 我是有底线的 ---</span>
        )}
      </>
    )
  }


  function splitBySentenceLength(text: string, maxChars = 200): string[] {
    const sentences = text.split(/(。)/); // 以句号 `。` 分割，同时保留句号
    const result: string[] = []; // 确保 result 是 string 数组
    let currentParagraph: string = '';

    for (let i = 0; i < sentences.length; i++) {
      currentParagraph += sentences[i] || ''; // 处理分割后的空元素

      // 遇到 `。` 并且当前段落字数超过 `maxChars`，就另起一行
      if (sentences[i] === '。' && currentParagraph.length >= maxChars) {
        result.push(currentParagraph);
        currentParagraph = ''; // 清空，准备下一段
      }
    }

    // 处理剩余的文本
    if (currentParagraph.trim()) {
      result.push(currentParagraph);
    }

    return result;
  }



  useEffect(() => {

  }, []);


  return (
    <>
      <div className="card-container" >
        <PullToRefresh onRefresh={() => southeastAsiaNewsPageRequest(true)}>
          {southeastAsiaNewsList?.map((southeastAsiaNews, index) => (
            <Card className="southeastasia-custom-card" key={index}>
              <div className="southeastasia-card-content">
                {southeastAsiaNews.imagePath &&
                  <div className="southeastasia-news-image-container">
                    <Image
                      className="southeastasia-news-image"
                      src={southeastAsiaNews.imagePath}
                      alt="Example"
                      fit="contain"
                    />
                  </div>
                }

                {southeastAsiaNews.imagePath &&
                  <Divider className='divider-line' />
                }

                {southeastAsiaNews.title &&
                  <div className="southeast-asia-title">
                    <Ellipsis direction='end' rows={2} content={southeastAsiaNews.title} />
                  </div>
                }

                <Ellipsis direction='end' rows={4} content={southeastAsiaNews.content} style={{ fontSize: "14px", letterSpacing: "1px", textIndent: "2em" }} />

                {/*                 <div className="text-area">
                  <Ellipsis direction='end' rows={2} content={southeastAsiaNews.content} />
                </div> */}
                <span className="southeastasia-time">

                  {southeastAsiaNews.isTop && <Tag className="southeastasia-tag" color='#a05d29'>置顶</Tag>}
                  {southeastAsiaNews.isHot && <Tag className="southeastasia-tag" color='red' fill='outline'>热门</Tag>}
                  {southeastAsiaNews.source && <span className="southeastasia-tag" >来源: <span className="source"> {southeastAsiaNews.source} </span></span>}
                  {southeastAsiaNews.createTime && dayjs(southeastAsiaNews.createTime).format('YYYY-MM-DD HH:mm')}

                </span>

                <Divider className='divider-line' />

                <div className="button-info">
                  <span className="tracking"><LocationFill className="area" />{southeastAsiaNews.area}</span>
                  <span className="icon-and-text">
                    <FcReading fontSize={17} />
                    <span className="number"> {southeastAsiaNews.readCount} </span>
                  </span>

                  <span className="tracking">
                    <span className="icon-and-text">
                      <MessageOutline fontSize={17} />
                      <span className="message-number"> {southeastAsiaNews.commentCount} </span>
                      <span className="click"
                        onClick={() => {
                          showPopupInfo(southeastAsiaNews.id, southeastAsiaNews.area, southeastAsiaNews.content,
                            southeastAsiaNews.readCount, southeastAsiaNews.commentCount, southeastAsiaNews.imagePath,
                            southeastAsiaNews.createTime, southeastAsiaNews.isHot, southeastAsiaNews.isTop,
                            southeastAsiaNews.source, southeastAsiaNews.title)
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
      <Popup className='news-record-popup' bodyStyle={{ display: 'flex', flexDirection: 'column', overflowY: 'auto', width: '100%', height: '100%' }}
        position='right'
        closeOnSwipe={true}
        closeOnMaskClick
        visible={visibleCloseRight}
        onClose={() => { setVisibleCloseRight(false) }}>

        <div className="popup-scrollable-content" >
          <div onClick={() => setVisibleCloseRight(false)} ><span style={{ paddingRight: '5px', color: 'gray', fontSize: '16px' }} ><LeftOutline fontSize={18} />返回 </span><span style={{ color: 'black', fontSize: '16px' }}>东南亚新闻</span></div>

          <Card className="southeastasia-custom-card-container">
            <div className="southeastasia-card-content">
              <div className="southeastasia-news-image-container">
                {popupInfo.southeastasiaNewsImage && <Image
                  className="southeastasia-news-image"
                  src={popupInfo.southeastasiaNewsImage}
                  alt="Example"
                  fit="contain"
                />}

              </div>

              <div className="southeast-asia-title">
                {popupInfo.title}
              </div>

              <div className="southeast-asia-text-area">
                {splitBySentenceLength(popupInfo.content).map((paragraph, index) => (
                  <p key={index} style={{ marginTop: '5px', marginBottom: '1px', lineHeight: '1.5' }}>
                    {paragraph}
                  </p>
                ))}
              </div>

              <span className="southeastasia-time">
                <span>
                  {popupInfo.isTop && <Tag className="southeastasia-tag" color='#a05d29'>置顶</Tag>}
                  {popupInfo.isHot && <Tag className="southeastasia-tag" color='red' fill='outline'>热门</Tag>}
                  {popupInfo.source && <span className="southeastasia-tag" > 来源: <span className="source"> {popupInfo.source} </span></span>}
                  {popupInfo.createTime && dayjs(popupInfo.createTime).format('YYYY-MM-DD HH:mm')}
                </span>
              </span>

              <Divider className='divider-line' />

              <div className="button-info">
                <span className="tracking">
                  <span className="city"><LocationFill className="area" />{popupInfo.area}</span>
                </span>

                <span className="tracking">
                  <span className="icon-and-text">
                    <FcReading fontSize={17} />
                    <span className="number">{popupInfo.readCount}</span>
                  </span>
                </span>

                <span className="tracking">
                  <Divider className='line'> 共 {newsCommentCount} 条评论 </Divider>
                </span>


              </div>

              <Comment newsCommentCount={newsCommentCount} setNewsCommentCount={setNewsCommentCount} newsId={popupInfo.id} infoType={2} />
            </div>
          </Card>
        </div>
      </Popup>
    </>
  );
}



export default Company;