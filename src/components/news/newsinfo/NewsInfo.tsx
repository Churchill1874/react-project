import { Swiper, Toast, NavBar, Card} from 'antd-mobile'
import { useNavigate } from 'react-router-dom';
import '@/components/news/newsinfo/NewsInfo.less'
import Comment from '@/components/comment/Comment'
import { useLocation } from 'react-router-dom';

import React from 'react'


const colors = ['#ace0ff', '#bcffbd', '#e4fabd', '#ffcfac'];

const items = colors.map((color, index) => (
    <Swiper.Item key={index}>
        <div className="banner" style={{ background: color }} onClick={() => { Toast.show(`你点击了卡片 ${index + 1}`) }}>
            {index + 1}
        </div>
    </Swiper.Item>
));


const NewsInfo: React.FC = () => {
    const navigate = useNavigate();
    const {id, title, content, photoPath, likesCount, badCount, commentsCount, viewCount, createTime} = useLocation().state;


    //返回上一层
    const back = () => {
        navigate(-1);
    };

    return (

        <div className='news-info'>
            <NavBar className="edit" onBack={back}></NavBar>
            
            <div className='newsinfo-title'>{title}</div>
            <div className='newsinfo-time'>{createTime}</div>
            <Swiper loop autoplay allowTouchMove>
                {items}
            </Swiper>

            <div className="newsinfo-attribute">
                <span>Span {viewCount}</span>
                <span>Span {commentsCount}</span>
                <span>Span {likesCount}</span>
                <span>Span {badCount}</span>
            </div>


            <div className='newsinfo-content'>{content}</div>
            <Comment newsId={id} />
        </div>

    );
}

export default NewsInfo;