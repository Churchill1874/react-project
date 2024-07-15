import { useEffect, useState } from "react";
import { Divider, Avatar } from "antd-mobile";
import '@/components/comment/Comment.less'
import avatars from '@/common/avatar';


const Comment: React.FC<any> = ({ newsId }) => {
    const [comments, setComments] = useState<ReplayType[]>([]);

    //用新闻id请求评论回来

    //根据评论数据遍历评论展示



    interface CommentType {
        avatarPath: string;
        account: string;
        name: string;
        content: string;
        time: string;
        replay: ReplayType[]
    }

    interface ReplayType {
        avatarPath: string;
        account: string;
        name: string;
        content: string;
        time: string;
    }

    const commentList = [];



    const reqCommentApi = (selectIndex: number) => {
        setComments((prevComments) => prevComments.map((comment, index) => {
            index === selectIndex ? { ...comment, isExpanded: true } : comment;
        }))
    }

    useEffect(() => {

    }, [])

    return (
        <>

            {commentList.map((comment, index) => (
                <div className="outer-comment" key={index}>
                    <div className="left-comment">
                        <Avatar src={avatars[comment.avatarPath]} style={{ '--size': '40px' }} />
                    </div>
                    <div className="right-comment">
                        <span className='name'>{comment.name}</span>
                        <span className='comment'>{comment.content}</span>
                        <span className='comment-time'>{comment.time}<span className='reply'> 回复</span></span>

                        {comment.replay.length > 0 && !comment.isExpanded && (<span className="show-replay" onClick={() => reqCommentApi(index)}> 展开 </span>)}

                        {comment.isExpanded && ({
                            comment.replay.map((replay, replayIndex) => {
                                <div className="outer-comment" key={replayIndex}>
                                    <div className="left-comment">
                                        <Avatar src={avatars[replay.avatarPath]} style={{ '--size': '40px' }} />
                                    </div>
                                    <div className="right-comment">
                                        <span className='name'>{replay.name}</span>
                                        <span className='comment'>{replay.content}</span>
                                        <span className='comment-time'>{replay.time}<span className='reply'> 回复</span></span>
                                    </div>
                                </div>
                            })
                        })}
                        <Divider className='line' />
                    </div>
                </div>
            ))}
        </>
    );

}

export default Comment;