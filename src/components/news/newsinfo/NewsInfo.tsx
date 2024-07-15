import { AutoCenter, Swiper, Toast, NavBar, Divider, Avatar } from 'antd-mobile'
import { useNavigate } from 'react-router-dom';
import '@/components/news/newsinfo/NewsInfo.less'
import Comment from '@/components/comment/Comment'

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

    //返回上一层
    const back = () => {
        navigate(-1);
    };

    return (

        <div className='news-info'>
            <NavBar className="edit" onBack={back}>
                新闻详情
            </NavBar>

            <div className="newsinfo-title">郭德纲又访问去了</div>
            <div className='newsinfo-time'>2024-10-22</div>
            <Swiper loop autoplay allowTouchMove>
                {items}
            </Swiper>
            <div className="newsinfo-attribute">
                <span>Span 1</span>
                <span>Span 2</span>
                <span>Span 3</span>
                <span>Span 4</span>
            </div>

            <AutoCenter className='newsinfo-content'>
                Quis sit dolore et in deserunt ex occaecat deserunt cillum magna fugiat nisi dolore quis.
                Cillum ullamco cupidatat officia ipsum eiusmod et. Et mollit ullamco laboris.
                Excepteur nulla do ut esse qui deserunt aliquip aute ad aliqua ullamco eiusmod sunt nisi magna.
                Nostrud eu esse elit magna cillum ex eu duis aute esse do.
                Consequat reprehenderit veniam qui veniam elit deserunt nostrud ad esse sint labore deserunt laboris incididunt.
                Voluptate quis incididunt esse esse esse proident exercitation veniam consectetur aute pariatur eu. Enim eu sint nostrud.
            </AutoCenter>

            <Divider className='line'> 评论区 </Divider>

            <Comment />

        </div>

    );
}

export default NewsInfo;