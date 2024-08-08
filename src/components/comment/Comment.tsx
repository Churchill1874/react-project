import { useState, forwardRef, useRef, useImperativeHandle } from "react";
import { Divider, Avatar, Toast, Popup, Button, TextAreaRef, TextArea, DotLoading, InfiniteScroll, PullToRefresh } from "antd-mobile";
import '@/components/comment/Comment.less'
import avatars from '@/common/avatar';
import { FcLike } from "react-icons/fc";
import { HeartOutlined } from "@ant-design/icons";
import { Request_GetCommentPage, CommentPageType } from "@/components/comment/api";
import { Request_SendNewsComment, SendNewsCommentReqType } from '@/components/news/newsinfo/api'
import { highlightReply } from '@/utils/commentUtils'
import { isExternal } from "util/types";


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
  let placeholder = props.placeholder;
  if (!placeholder) {
    placeholder = '请输入评论内容';
  }

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

  return <TextArea {...props} placeholder={placeholder} ref={innerRef} />;
});


const Comment: React.FC<any> = ({ setNewsViewCount, setNewsLikesCount, setNewsCommentCount, newsId }) => {
  const [pageNum, setPageNum] = useState(1);
  const [commentsList, setCommentsList] = useState<CommentPageType[]>([]);//评论记录列表
  const [commentCount, setCommentCount] = useState(0);
  const [comment, setComment] = useState('')//评论内容
  const [showsCommentInput, setShowCommentInput] = useState(false)//是否弹出评论输入框
  const textAreaRef = useRef<TextAreaRef>(null);
  const [placeholder, setPlaceholder] = useState('请输入评论内容');
  const [topId, setTopId] = useState<string>('');//顶层评论id
  const [replyId, setReplyId] = useState<string>('');//回复内嵌评论id
  const [commentHasMore, setCommentHasMore] = useState<boolean>(true);


  const reqCommentApi = (selectId: string) => {
    setCommentsList((prevComments) => {
      return prevComments.map((comment) => comment.topComment.id === selectId ? { ...comment, isExpanded: true } : comment)
    });
  };


  //回复顶层评论
  const replyTopComment = (topId: string, targetPlayerName: string) => {
    setPlaceholder('回复 ' + targetPlayerName);
    setTopId(topId);
    setReplyId('');
    setShowCommentInput(true);
    setTimeout(() => {
      if (textAreaRef.current) {
        textAreaRef.current.focus();
      }
    }, 0);
  }

  //回复内嵌评论
  const replyComment = (topId: string, replyId: string, targetPlayerName: string) => {
    setPlaceholder('回复 ' + targetPlayerName);
    setShowCommentInput(true);
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
    const param: SendNewsCommentReqType = { newsId: newsId, content: comment, topId: topId, replyId: replyId }
    const response = await Request_SendNewsComment(param);

    if (response.code === 0) {
      if (textAreaRef.current) {
        textAreaRef.current.clear();
      }
      Toast.show('发送成功');
      setComment('');
      setTopId('');
      setReplyId('');
      setNewsCommentCount((prev) => prev + 1);
      setShowCommentInput(false)
    }
  }



  //请求获取当前新闻评论内容
  const reqCommentPageApi = async (isReset: boolean) => {
    const reqPageNum = isReset ? 1 : pageNum;
    const param = { newsId: newsId, pageNum: reqPageNum, pageSize: 10 }
    const response = await Request_GetCommentPage(param);

    setCommentCount(response.data.commentCount);
    setNewsLikesCount(response.data.likesCount);
    setNewsViewCount(response.data.viewsCount);

    if (response.data.list?.length > 0) {
      //如果新取回来的评论数据和上一次的不一样
      if (JSON.stringify(response.data.list) !== JSON.stringify(commentsList)) {
        //将新请求回来的评论和之前的评论放在一起保存更新状态
        const list = [...commentsList ?? [], ...response.data.list];
        console.log(list)
        setCommentsList([...commentsList ?? [], ...response.data.list]);
      }

      setPageNum((prev) => prev + 1)
    } else {
      setCommentHasMore(false)
    }
  }



  //输入文本域的内容存入状态
  const inputCommentChange = (value: string) => {
    setComment(value);
  }



  //点赞
  const clickLikes = () => {
    Toast.show({
      icon: <HeartOutlined />,
      content: '点赞 +1',
      duration: 600,
    })
  }


  return (
    <>
      <PullToRefresh onRefresh={() => reqCommentPageApi(true)}>
        <Divider className='line'> 共 {commentCount} 条评论 </Divider>

        {commentsList?.map((comment, _index) => (
          <div className="outer-comment" key={comment.topComment.id}>
            <div className="left-comment">
              <Avatar src={avatars[comment.topComment.avatarPath]} style={{ '--size': '30px' }} />
            </div>
            <div className="right-comment">
              <span className='name'>{comment.topComment.commentator}</span>
              <span className='comment'>{comment.topComment.content}</span>
              <span className='comment-time'>
                <div>{comment.topComment.createTime}<span className='reply' onClick={() => replyTopComment(comment.topComment.id, comment.topComment.commentator)} > 回复</span></div>
                <span className="comment-attribute"> <FcLike fontSize={14} onClick={clickLikes} /> {comment.topComment.likesCount}</span>
              </span>

              {comment.replyCommentList?.length > 0 && !comment.isExpanded && (<span className="show-replay" onClick={() => reqCommentApi(comment.topComment.id)}> 展开 {comment.replyCommentList.length} 条回复 </span>)}

              {comment.isExpanded && (
                comment.replyCommentList.map((replay, replayIndex) =>
                  <div className="outer-comment" key={replayIndex}>
                    <div className="left-comment">
                      <Avatar src={avatars[replay.avatarPath]} style={{ '--size': '25px' }} />
                    </div>
                    <div className="right-comment">
                      <span className='name'>{replay.commentator}</span>
                      <span className='comment' dangerouslySetInnerHTML={{ __html: highlightReply(replay.content) }}></span>
                      <span className='comment-time'>
                        <div>{replay.createTime}<span className='reply' onClick={() => replyComment(comment.topComment.id, replay.id, replay.commentator)} > 回复</span></div>
                        <span className="comment-attribute"><FcLike fontSize={14} onClick={clickLikes} /> {replay.likesCount} </span>
                      </span>
                    </div>
                  </div>
                )
              )}
              <Divider className='line' />
            </div>
          </div>
        ))}

        <Popup className='comments-popup'
          visible={showsCommentInput}
          onMaskClick={() => { setShowCommentInput(false) }}
          onClose={() => { setShowCommentInput(false) }}
          bodyStyle={{ height: '40vh' }}
        >
          <CustomTextArea className='comment-area' autoSize defaultValue={''} showCount maxLength={200} ref={textAreaRef} onChange={inputCommentChange} placeholder={placeholder} />
          <Button className="send-comment-button" color="primary" onClick={sendTopComment} > 发送评论 </Button>
        </Popup>

        <InfiniteScroll loadMore={reqCommentPageApi} hasMore={commentHasMore}>
          <CommentScrollContent hasMore={commentHasMore} />
        </InfiniteScroll>

      </PullToRefresh>
    </>
  );
}

export default Comment;
