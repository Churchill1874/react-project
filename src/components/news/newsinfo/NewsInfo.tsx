import { useState, useRef, useImperativeHandle, forwardRef } from 'react';
import { Swiper, NavBar, Image, TextArea, ImageViewer, Input, Button, Toast, Popup, TextAreaRef} from 'antd-mobile'
import { HeartOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import '@/components/news/newsinfo/NewsInfo.less'
import Comment from '@/components/comment/Comment'
import { useLocation } from 'react-router-dom';
import { FcLike, FcReading } from "react-icons/fc";
import {Request_SendNewsComment, SendNewsCommentReqType} from '@/components/news/newsinfo/api'

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

    return <TextArea {...props} ref={innerRef} />;
});

const NewsInfo: React.FC = () => {
    const textAreaRef = useRef<TextAreaRef>(null);
    const [comment, setComment] = useState('')
    const [showsCommentInput, setShowCommentInput] = useState(false)
    const navigate = useNavigate();
    const [visible, setVisible] = useState(false)
    const { id, title, content, contentImagePath, photoPath, likesCount, viewCount, commentsCount, createTime} = useLocation().state;

    const showImage = () => {
        setVisible( prev => !prev );
    }

    const getImages = () => {
        return contentImagePath ? contentImagePath.split(',') : [photoPath];
    };

    const getContentRows = () => {
        const contentLength = content.length / 28;
        return contentLength < 12? Math.ceil(contentLength) : 12;
    }

    //发送顶层评论
    const sendTopComment = async () => {
        const param: SendNewsCommentReqType = {newsId: id, content: comment}
        const response = await Request_SendNewsComment(param);

        if(response.code === 0){
            setComment('');
            Toast.show('评论成功');
        }
    }

    //输入文本域的内容存入状态
    const inputCommentChange = (value: string)=> {
        Toast.show({
            icon: <HeartOutlined/>,
            content: '点赞 +1',
            duration: 800,
          })
        setComment(value);        
    }

    // 处理 Input 聚焦事件，阻止其获取焦点
    const handleInputFocus = (event) => {
        event.preventDefault();
        event.target.blur();
    };

    //点击输入框时候 让文本域获取到焦点
    const inputCommentClick = ()=>{
        setShowCommentInput(true);
        setTimeout(() => {
            if (textAreaRef.current) {
                textAreaRef.current.focus();
            }
        }, 0);
    }

    //返回上一层
    const back = () => {
        navigate(-1);
    };


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
                                <Image fit='contain' width={300} height={200} src={imagePath} onClick={showImage}/>
                            </Swiper.Item>
                        ))}
                    </Swiper>
                }
                {!contentImagePath &&
                    <Swiper loop autoplay allowTouchMove>
                        <Swiper.Item className="swiper-item" key={1} >
                            <Image fit='contain' width={300} height={200} src={photoPath} onClick={showImage}/>
                        </Swiper.Item>
                    </Swiper>
                }


                <TextArea defaultValue={content} readOnly rows={getContentRows()} className='newsinfo-content' />

                <div className="newsinfo-attribute">
                    <span><FcReading className='attribute-icon' fontSize={20} /> 浏览  {viewCount}</span>
                    <span><FcLike className='attribute-icon' fontSize={20} /> 赞 {likesCount}</span>
                </div>

                <Comment commentsCount={commentsCount} newsId={id} />
            </div>

            <div className="send-news-comment">
                <Input className="input-comment" value='' onFocus={handleInputFocus} placeholder="请输入您的评论吧～" onClick={inputCommentClick} />
                <Popup className='comment-popup' visible={showsCommentInput} onMaskClick={() => { setShowCommentInput(false) }} onClose={() => {setShowCommentInput(false)}} bodyStyle={{ height: '40vh' }}>
                    <CustomTextArea className='commentArea' autoSize defaultValue={''} showCount maxLength={200} ref={textAreaRef} onChange={inputCommentChange} />
                    <Button className="send-comment-button" color="primary" onClick={sendTopComment}> 发送评论 </Button>
                </Popup>
            </div>
        </>

    );
}

export default NewsInfo;