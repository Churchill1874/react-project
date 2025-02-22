import { useState, forwardRef, useRef, useImperativeHandle } from "react";
import { Divider, Avatar, Toast, Popup, Button, TextAreaRef, TextArea, DotLoading, InfiniteScroll, PullToRefresh, FloatingBubble } from "antd-mobile";
import '@/components/comment/Comment.less'
import avatars from '@/common/avatar';
import { FcLike } from "react-icons/fc";
import { HeartOutline, MessageFill } from 'antd-mobile-icons';
import { Request_GetCommentPage, CommentPageType, Request_LikesCount } from "@/components/comment/api";
import { Request_SendNewsComment, SendNewsCommentReqType } from '@/components/news/newsinfo/api'
import { highlightReply } from '@/utils/commentUtils'
import dayjs from 'dayjs'


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



const Comment: React.FC<any> = ({ newsCommentCount, setNewsCommentCount, newsId, infoType }) => {
  const [pageNum, setPageNum] = useState(1);
  const [commentsList, setCommentsList] = useState<CommentPageType[]>([]);//评论记录列表
  const [comment, setComment] = useState('')//评论内容
  const textAreaRef = useRef<TextAreaRef>(null);
  const [placeholder, setPlaceholder] = useState('请输入评论内容');
  const [topId, setTopId] = useState<number | null>();//顶层评论id
  const [replyId, setReplyId] = useState<number | null>();//回复内嵌评论id
  const [commentHasMore, setCommentHasMore] = useState<boolean>(true);
  const [likesIdList, setLikesIdList] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);
  const [showsCommentInput, setShowCommentInput] = useState(false)



  const reqCommentApi = (selectId: number) => {
    setCommentsList((prevComments) => {
      return prevComments.map((comment) => comment.topComment.id === selectId ? { ...comment, isExpanded: true } : comment)
    });
  };


  //回复顶层评论
  const replyTopComment = (topId: number, targetPlayerName: string) => {
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
  const replyComment = (topId: number, replyId: number, targetPlayerName: string) => {
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


  //发送顶层评论
  const sendTopComment = async () => {
    if (!comment) {
      Toast.show({
        content: '请输入评论内容',
        duration: 1000
      })
      return;
    }
    const param: SendNewsCommentReqType = { infoType: infoType, newsId: newsId, content: comment, topId: topId, replyId: replyId }
    console.log('param:', param)
    const response = await Request_SendNewsComment(param);

    if (response.code === 0) {
      if (textAreaRef.current) {
        textAreaRef.current.clear();
      }
      Toast.show('发送成功');
      setComment('');
      setTopId(null);
      setReplyId(null);
      setNewsCommentCount((prev) => prev + 1);
      setShowCommentInput(false)

      if (newsId && response.data) {
        //判断是顶层评论
        if (!topId && !replyId) {
          const commentPageType: CommentPageType = {
            replyCommentList: [],
            topComment: response.data
          }
          setCommentsList(prevList => [commentPageType, ...prevList])
        }

        if (topId && commentsList) {
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
    const param = { infoType: infoType, newsId: newsId, pageNum: reqPageNum, pageSize: 10 }
    const response = await Request_GetCommentPage(param);

    if (response.data.list?.length > 0) {
      //如果新取回来的评论数据和上一次的不一样
      if (JSON.stringify(response.data.list) !== JSON.stringify(commentsList)) {
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
  const clickLikes = async (id: number, isTopReply) => {
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



  // 处理 Input 聚焦事件，阻止其获取焦点
  const handleInputFocus = (event) => {
    event.preventDefault();
    event.target.blur();
  };

  return (
    <>
      <Divider className='line'> 下拉更新 </Divider>

      <PullToRefresh onRefresh={() => reqCommentPageApi(true)}>
        {commentsList?.map((comment, _index) => (
          <div className="outer-comment" key={comment.topComment.id}>
            <div className="left-comment">
              <Avatar src={avatars[comment.topComment.avatarPath]} style={{ '--size': '38px' }} />
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
                  <div className="outer-comment" key={replayIndex}>
                    <div className="left-comment">
                      <Avatar src={avatars[replay.avatarPath]} style={{ '--size': '32px' }} />
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

      <Popup className='news-comment-popup'
        visible={showsCommentInput}
        onMaskClick={() => { setShowCommentInput(false) }}
        onClose={() => { setShowCommentInput(false) }}
        bodyStyle={{ height: '40vh', backgroundColor: 'transparent !important', boxShadow: 'none !important' }}
        maskStyle={{ backgroundColor: 'rgba(0, 0, 0, 0.5) !important' }}
      >
        <CustomTextArea className='news-comment-area' autoSize defaultValue={''} showCount maxLength={255} ref={textAreaRef} onChange={inputCommentChange} />
        <Button className="news-send-comment-button" color="primary" onClick={sendTopComment}> 发送评论 </Button>
      </Popup>

    </>
  );
}


export default Comment;
