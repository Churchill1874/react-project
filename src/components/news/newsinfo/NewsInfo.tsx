import { useState } from 'react';
import { Swiper, NavBar, Image, TextArea, ImageViewer } from 'antd-mobile'
import { useNavigate } from 'react-router-dom';
import '@/components/news/newsinfo/NewsInfo.less'
import Comment from '@/components/comment/Comment'
import { useLocation } from 'react-router-dom';
import { FcLike, FcReading } from "react-icons/fc";
import React from 'react'


const NewsInfo: React.FC = () => {
    const navigate = useNavigate();
    const [visible, setVisible] = useState(false)
    const { id, title, content, contentImagePath, photoPath, likesCount, viewCount, createTime } = useLocation().state;

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
                    <span><FcReading className='attribute-icon' fontSize={20} /> {viewCount}</span>
                    <span><FcLike className='attribute-icon' fontSize={20} /> {likesCount}</span>
                </div>

                <Comment newsId={id} />
            </div>
        </>


    );
}

export default NewsInfo;