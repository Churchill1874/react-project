import { useState, forwardRef, useRef, useImperativeHandle, useEffect } from "react";
import { Divider, Avatar, Toast, Popup, Button, TextAreaRef, TextArea, DotLoading, InfiniteScroll, PullToRefresh, FloatingBubble } from "antd-mobile";
import '@/components/comment/Comment.less'
import avatars from '@/common/avatar';
import { FcLike } from "react-icons/fc";
import { HeartOutline, MessageFill } from 'antd-mobile-icons';
import { Request_GetCommentPage, CommentPageType, Request_LikesCount } from "@/components/comment/api";
import { Request_SendNewsComment, SendNewsCommentReqType } from '@/components/news/newsinfo/api'
import { highlightReply } from '@/utils/commentUtils'
import dayjs from 'dayjs'
import OtherPeople from "@/pages/otherpeople/otherpeople";

const CommentScrollContent = ({ hasMore }: { hasMore?: boolean }) => {
  return (
    <>
      {hasMore ? (
        <>
          <div >
            <span >Loading</span>
            <DotLoading color='gray' />
          </div>
        </>
      ) : (
        <span color='gray'>--- 没有更多的评论了 ---</span>
      )}
    </>
  )
}
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



const Comment = forwardRef<any, any>(({ newsCommentCount, setNewsStatus, newsId, newsType, needCommentPoint, commentPointId }, ref) => {

  const [pageNum, setPageNum] = useState(1);
  const [commentsList, setCommentsList] = useState<CommentPageType[]>([]);//评论记录列表
  const [comment, setComment] = useState('')//评论内容
  const textAreaRef = useRef<TextAreaRef>(null);
  const [placeholder, setPlaceholder] = useState('请输入评论内容');
  const [topId, setTopId] = useState<string | null>();//顶层评论id
  const [replyId, setReplyId] = useState<string | null>();//回复内嵌评论id
  const [commentHasMore, setCommentHasMore] = useState<boolean>(true);
  const [likesIdList, setLikesIdList] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [showsCommentInput, setShowCommentInput] = useState(false);
  const [needCommentPointState, setNeedCommentPointState] = useState<boolean>(needCommentPoint);
  const commentRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const hasScrolled = useRef(false); // 评论记录滚动 保证只滚动一次
  const [visibleCloseRight, setVisibleCloseRight] = useState(false)
  const [otherPlayerId, setOtherPlayerId] = useState<string | null>()

  useImperativeHandle(ref, () => ({
    cleanState
  }))

  useEffect(() => {
    //如果需要定位 并且 当前分页不是第一页了已经
    if (needCommentPointState && pageNum > 1) {
      //就关闭需要定位状态
      setNeedCommentPointState(false);
      setCommentHasMore(false);
    }
  }, [pageNum])

  const hasExpanded = useRef(false);

  //如果是定位评论 就展开要查找的定位评论 然后展开 方便后面有滚动dom目标
  useEffect(() => {
    if (needCommentPoint && commentPointId && commentsList.length > 0 && !hasExpanded.current) {
      setCommentsList(prev =>
        prev.map(comment => {
          const isMatchTop = String(comment.topComment.id) === String(commentPointId);
          const isMatchReply = comment.replyCommentList?.some(r => String(r.id) === String(commentPointId));
          return (isMatchTop || isMatchReply) ? { ...comment, isExpanded: true } : comment;
        })
      );
      hasExpanded.current = true;
    }
  }, [needCommentPoint, commentPointId]);

  //如果需要对评论足底不过定位 进行滚动到评论位置 
  useEffect(() => {
    if (needCommentPoint && commentPointId && !hasScrolled.current) {
      const target = () => commentRefs.current[String(commentPointId)];
      const timer = setInterval(() => {
        const el = target();
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
          hasScrolled.current = true;
          console.log("✅ 滚动成功");
          clearInterval(timer);
        }
      }, 100); // 每 100ms 检查一次

      return () => clearInterval(timer);
    }
  }, [commentPointId]);

  useEffect(() => {
    if (newsId) {
      cleanState()
    }
  }, [newsId]);

  const cleanState = () => {
    setPageNum(1);
    setCommentsList([]);
    setCommentHasMore(true);
    setLoading(false);
    hasScrolled.current = false;
    hasExpanded.current = false;
    //reqCommentPageApi(true);
  }



  const reqCommentApi = (selectId: string) => {
    setCommentsList((prevComments) => {
      return prevComments.map((comment) => comment.topComment.id === selectId ? { ...comment, isExpanded: true } : comment)
    });
  };


  //回复顶层评论
  const replyTopComment = (topId: string, targetPlayerName: string) => {
    setShowCommentInput(true)
    setPlaceholder('回复 ' + targetPlayerName);
    setTopId(topId);
    setReplyId(null);
    setTimeout(() => {
      if (textAreaRef.current) {
        textAreaRef.current.focus();
      }
    }, 0);
  }


  //回复内嵌评论
  const replyComment = (topId: string, replyId: string, targetPlayerName: string) => {
    setShowCommentInput(true)
    setPlaceholder('回复 ' + targetPlayerName);
    setTopId(topId);
    setReplyId(replyId);
    setTimeout(() => {
      if (textAreaRef.current) {
        textAreaRef.current.focus();
      }
    }, 0);
  }

  const cleanComment = () => {
    setComment('');
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
    const param: SendNewsCommentReqType = { newsType: newsType, newsId: newsId, content: comment, topId: topId, replyId: replyId, needCommentPoint: needCommentPointState }
    console.log('param:' + JSON.stringify(param))

    const response = await Request_SendNewsComment(param);

    if (response.code === 0) {
      if (textAreaRef.current) {
        textAreaRef.current.clear();
      }
      Toast.show('发送成功');
      setComment('');
      setTopId(null);
      setReplyId(null);
      setNewsStatus((prev) => {
        if (!prev) return prev;

        return { ...prev, commentsCount: (prev.commentsCount || 0) + 1 };
      });
      setShowCommentInput(false)

      if (newsId) {
        //判断是顶层评论
        if (!topId && !replyId) {

          console.log('data:' + response.data)
          const commentPageType: CommentPageType = {
            replyCommentList: [],
            topComment: response.data
          }
          setCommentsList(prevList => [commentPageType, ...prevList])
        }

        if (topId && commentsList) {

          console.log('topId:' + topId + ',commentsList:' + JSON.stringify(commentsList))
          //如果回复楼主
          setCommentsList(
            prevList => prevList.map(
              prev => prev.topComment.id === topId ?
                { ...prev, replyCommentList: [response.data, ...prev.replyCommentList] } : prev
            )
          );
        }
      }
    }
  }



  //请求获取当前新闻评论内容
  const reqCommentPageApi = async (isReset: boolean) => {
    if (loading) return; // 如果正在加载，直接返回，防止重复请求
    setLoading(true);


    const reqPageNum = isReset ? 1 : pageNum;
    const param = { newsType: newsType, newsId: newsId, pageNum: reqPageNum, pageSize: 50 }
    const response = await Request_GetCommentPage(param);
    if (response.data.list?.length > 0) {
      //如果新取回来的评论数据和上一次的不一样
      if (response.data.list.length !== commentsList.length) {
        //将新请求回来的评论和之前的评论放在一起保存更新状态
        setCommentsList([...commentsList ?? [], ...response.data.list]);
      }
      setPageNum((prev) => prev + 1)
    } else {
      setCommentHasMore(false)
    }

    setLoading(false);
  }


  //输入文本域的内容存入状态
  const inputCommentChange = (value: string) => {
    setComment(value);
  }

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
  const clickLikes = async (id: string, isTopReply) => {
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
    const resp = await Request_LikesCount(param);
    const { code, data } = resp;

    if (code === 0) {
      if (data.value) {
        Toast.show({
          icon: <HeartOutline />,
          content: '点赞 +1',
          duration: 600,
        })

        // 判断点赞的是外层评论还是内嵌的评论
        if (isTopReply) {
          // 处理顶层评论
          const updateCommentsList = commentsList.map(
            (comment) => comment.topComment.id === id ?
              { ...comment, topComment: { ...comment.topComment, likesCount: comment.topComment.likesCount + 1 } }
              :
              comment
          );

          setCommentsList(updateCommentsList);
        } else {
          // 处理回复评论
          const updateCommentsList = commentsList.map(
            (comment) => {
              const newReplyCommentList = comment.replyCommentList?.map(
                (reply) => reply.id === id ? { ...reply, likesCount: reply.likesCount + 1 } : reply
              );

              return { ...comment, replyCommentList: newReplyCommentList };
            }
          );

          setCommentsList(updateCommentsList);
        }

      } else {
        Toast.show({
          content: '已点赞',
          duration: 600,
        })
        return;
      }

    } else {
      Toast.show({
        content: '网络异常,请稍后重试',
        duration: 600,
      })
    }
  }



  return (
    <>
      <Divider className='line'> 下拉更新 </Divider>

      <PullToRefresh onRefresh={() => reqCommentPageApi(true)}>
        {commentsList?.map((comment, _index) => (
          <div className="outer-comment" ref={el => commentRefs.current[String(comment.topComment.id)] = el} key={comment.topComment.id}>
            <div className="left-comment">
              <Avatar src={avatars[comment.topComment.avatarPath]} style={{ '--size': '38px' }} onClick={() => { setVisibleCloseRight(true); setOtherPlayerId(comment.topComment.playerId) }} />
            </div>
            <div className="right-comment">
              <span className='name'>{comment.topComment.commentator}</span>
              <span className='comment'>{comment.topComment.content}</span>
              <span className='comment-time'>
                <div>{dayjs(comment.topComment.createTime).format("YYYY-MM-DD HH:mm")}<span className='reply' onClick={() => replyTopComment(comment.topComment.id, comment.topComment.commentator)} > 回复</span></div>
                <span className="comment-attribute"> <FcLike fontSize={14} onClick={() => clickLikes(comment.topComment.id, true)} /> {comment.topComment.likesCount}</span>
              </span>

              {comment.replyCommentList?.length > 0 && !comment.isExpanded && (<span className="show-replay" onClick={() => reqCommentApi(comment.topComment.id)}> 展开 {comment.replyCommentList.length} 条回复 </span>)}

              {comment.isExpanded && (
                comment.replyCommentList.map((replay, replayIndex) =>
                  <div className="outer-comment" ref={el => commentRefs.current[String(replay.id)] = el} key={replay.id}>
                    <div className="left-comment">
                      <Avatar src={avatars[replay.avatarPath]} style={{ '--size': '32px' }} onClick={() => { setVisibleCloseRight(true); setOtherPlayerId(replay.playerId) }} />
                    </div>
                    <div className="right-comment">
                      <span className='name'>{replay.commentator}</span>
                      <span className='comment' dangerouslySetInnerHTML={{ __html: highlightReply(replay.content) }}></span>
                      <span className='comment-time'>
                        <div>{dayjs(replay.createTime).format("YYYY-MM-DD HH:mm")}<span className='reply' onClick={() => replyComment(comment.topComment.id, replay.id, replay.commentator)} > 回复</span></div>
                        <span className="comment-attribute"><FcLike fontSize={16} onClick={() => clickLikes(replay.id, false)} /> {replay.likesCount} </span>
                      </span>
                    </div>
                  </div>
                )
              )}
              <Divider className='comment-line' />
            </div>
          </div>
        ))}



        <InfiniteScroll loadMore={reqCommentPageApi} hasMore={commentHasMore}>
          <CommentScrollContent hasMore={commentHasMore} />
        </InfiniteScroll>

      </PullToRefresh>

      <FloatingBubble onClick={inputCommentClick} axis='xy' magnetic='x' style={{ '--initial-position-bottom': '24px', '--initial-position-right': '24px', '--edge-distance': '24px' }}>
        <MessageFill fontSize={32} />
      </FloatingBubble>


      {/*       <div className="comment-send-container">
        <TextArea className="comment-chat-textArea" maxLength={255} rows={1} autoSize={{ minRows: 1, maxRows: 5 }} placeholder="请输入..." onChange={inputCommentChange} value={comment} />
        <Button className="comment-send-button" color="primary" onClick={() => sendTopComment()} >
          发送
        </Button>
      </div>
       */}

      <Popup className='comments-popup'
        visible={showsCommentInput}
        onMaskClick={() => { setShowCommentInput(false) }}
        onClose={() => { setShowCommentInput(false) }}
        bodyStyle={{ height: '60vh', backgroundColor: 'transparent !important', boxShadow: 'none !important' }}
        maskStyle={{ backgroundColor: 'rgba(0, 0, 0, 0.5) !important' }}
      >
        <div className="comment-container">
          <div className="comment-area-container">
            <CustomTextArea className='comment-area' autoSize defaultValue={''} showCount maxLength={200} ref={textAreaRef} onChange={inputCommentChange} value={comment} />
          </div>
          <div className="comment-button-container">
            <Button className="clean-comment-button" color='primary' fill='outline' onClick={cleanComment}>清空</Button>
            <Button className="send-comment-button" color="primary" onClick={sendTopComment}> 发送 </Button>
          </div>
        </div>
      </Popup>

      <Popup className='news-record-popup' bodyStyle={{ display: 'flex', flexDirection: 'column', overflowY: 'auto', width: '100%', height: '100%' }}
        position='right'
        closeOnMaskClick
        visible={visibleCloseRight}
        onClose={() => { setVisibleCloseRight(false) }}>
        <OtherPeople setVisibleCloseRight={setVisibleCloseRight} otherPlayerId={otherPlayerId} />
      </Popup>
    </>
  );
})


export default Comment;
