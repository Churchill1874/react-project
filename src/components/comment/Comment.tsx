import { useEffect, useState } from "react";
import { Divider, Avatar } from "antd-mobile";
import '@/components/comment/Comment.less'
import avatars from '@/common/avatar';
const Comment: React.FC<any> = ({ newsId }) => {
    const [comments, setComments] = useState<CommentType[]>([]);

    interface CommentType {
        id: number;
        avatarPath: string;
        account: string;
        name: string;
        content: string;
        time: string;
        replay: ReplayType[]
        isExpanded?: boolean;
    }

    interface ReplayType {
        avatarPath: string;
        account: string;
        name: string;
        content: string;
        time: string;
    }

    const replayList: ReplayType[] = [
        { avatarPath: '1', account: 'test1', name: 'test1', content: 'goodgoodgoodgoodgoodgoodgoodgoodgoodgoodgoodgoodgoodgoodgoodgoodgoodgoodgoodgoodgoodgoodgoodgoodgoodgoodgoodgood', time: '2022-10-11 09:10' },
        { avatarPath: '2', account: 'test2', name: 'test2', content: 'bad', time: '2022-10-12 09:10' },
        { avatarPath: '3', account: 'test3', name: 'test3', content: '啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊', time: '2022-10-13 09:10' }
    ];

    const commentList: CommentType[] = [
        { id: 1, avatarPath: '1', account: 'test1', name: 'test1', content: 'goodgoodgoodgoodgoodgoodgoodgoodgoodgoodgoodgoodgoodgoodgoodgoodgoodgoodgoodgoodgoodgoodgoodgoodgoodgoodgoodgood', time: '2022-10-11 09:10', replay: replayList, isExpanded: false },
        { id: 2, avatarPath: '2', account: 'test2', name: 'test2', content: 'bad', time: '2022-10-12 09:10', replay: [], isExpanded: false },
        { id: 3, avatarPath: '3', account: 'test3', name: 'test3', content: '啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊', time: '2022-10-13 09:10', replay: [], isExpanded: false }
    ];


    const reqCommentApi = (selectId: number) => {
        setComments((prevComments) =>
            prevComments.map((comment, _index) =>
                comment.id === selectId ? { ...comment, isExpanded: true } : comment
            )
        );

    };

    useEffect(() => {
        setComments(commentList);
    }, []);

    return (
        <>
            <Divider className='line'> 共 10 条评论 </Divider>

            {comments.map((comment, _index) => (
                <div className="outer-comment" key={comment.id}>
                    <div className="left-comment">
                        <Avatar src={avatars[comment.avatarPath]} style={{ '--size': '30px' }} />
                    </div>
                    <div className="right-comment">
                        <span className='name'>{comment.name}</span>
                        <span className='comment'>{comment.content}</span>
                        <span className='comment-time'>
                            {comment.time}
                            <span className='reply'> 回复</span>
                            <span className="comment-attribute"> 赞：1</span>
                            <span className="comment-attribute"> 差：1</span>
                        </span>

                        {comment.replay.length > 0 && !comment.isExpanded && (<span className="show-replay" onClick={() => reqCommentApi(comment.id)}> 展开 </span>)}

                        {comment.isExpanded && (
                            comment.replay.map((replay, replayIndex) =>
                                <div className="outer-comment" key={replayIndex}>
                                    <div className="left-comment">
                                        <Avatar src={avatars[replay.avatarPath]} style={{ '--size': '25px' }} />
                                    </div>
                                    <div className="right-comment">
                                        <span className='name'>{replay.name}</span>
                                        <span className='comment'>{replay.content}</span>
                                        <span className='comment-time'>
                                            {replay.time}
                                            <span className='reply'> 回复</span>
                                            <span className="comment-attribute">赞：1</span>
                                            <span className="comment-attribute">差：1</span>
                                        </span>
                                    </div>
                                </div>
                            )
                        )}
                        <Divider className='line' />
                    </div>
                </div>
            ))}
        </>
    );
}

export default Comment;
