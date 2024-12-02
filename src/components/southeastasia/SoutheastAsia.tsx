import { useState, useEffect } from "react";
import { Card, Divider, Tag, Ellipsis, Image, Popup } from 'antd-mobile';
import Comment from '@/components/comment/Comment';

import { FcReading } from "react-icons/fc";
import { MessageOutline, LeftOutline} from 'antd-mobile-icons';
import '@/components/southeastasia/SoutheastAsia.less'

const Company: React.FC = () => {
    const [newsCommentCount, setNewsCommentCount] = useState(0);//新闻评论数量
    const [visibleCloseRight, setVisibleCloseRight] = useState(false)
    const content = '上千人公司,主要提供东南亚,行业龙头,主要经营项目为线上游戏源头,对接第三方大厅,和第三方支付项目提供对接上千人公司,主要提供东南亚,行业龙头,主要经营项目为线上游戏源头,对接第三方大厅,和第三方支付项目提供对接';
    const [popupInfo, setPopupInfo] = useState<PopupInfo>({id: null, area: "", content: "", readCount: 0, commentCount: 0, southeastasiaNewsImage: ''}); 

    interface PopupInfo {
        id: any | null;
        southeastasiaNewsImage: any | null; //图片路径
        readCount: any | null; // 读取次数
        commentCount: any | null; //评论数量
        area: any | null; //地区
        content: any | null; //新闻内容
    }

    const showPopupInfo = (id, area, content, readCount, commentCount, southeastasiaNewsImage) => {
        setVisibleCloseRight(true)
        setPopupInfo({id, area, content, readCount, commentCount, southeastasiaNewsImage})
    }

    useEffect(() => {

    }, []);

    return (
        <>
            <div className="card-container" >
                <Card className="custom-card">
                    <div className="card-content">
                        <div className="southeastasia-news-image-container">
                            <Image
                                className="southeastasia-news-image"
                                src="https://ichef.bbci.co.uk/ace/ws/800/cpsprodpb/0123/production/_127419200_mediaitem127419198.jpg.webp"
                                alt="Example"
                                fit="contain"
                            />
                        </div>

                        <Divider className='divider-line' />

                        <div className="text-area">
                            <Ellipsis direction='end' rows={3} content={content} />  
                        </div>
                        <span className="southeastasia-time"><Tag color='red' fill='outline'>热门</Tag> 2024-10-01</span>

                        <Divider className='divider-line' />     
                        
                        <div className="button-info">
                            <span className="tracking">菲律宾</span>
                            <span><FcReading fontSize={15} /> 10</span>
                            <span className="tracking"> <MessageOutline fontSize={15} /> 90 <span className="click" onClick={() => {showPopupInfo(1, '菲律宾', content, 0, 90, 'https://ichef.bbci.co.uk/ace/ws/800/cpsprodpb/0123/production/_127419200_mediaitem127419198.jpg.webp')}}>点击查看</span> </span>
                        </div> 
                    </div>
                </Card>
                <Card className="custom-card">
                    <div className="card-content">
                    <div className="southeastasia-image-container">
                            <Image
                                className="southeastasia-news-image"
                                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRd4RxQMW2mwN6NqVfDM-x6-eeAn2gIMrv54Q&s"
                                alt="Example"
                                fit="contain"
                            />
                        </div>
                        <Divider className='divider-line' />

                        <div className="text-area">
                            <Ellipsis direction='end' rows={3} content={content} />
                        </div>
                        <span className="southeastasia-time">2024-10-01</span>

                        <Divider className='divider-line' />     
                        
                        <div className="button-info">
                            <span className="tracking">迪拜</span>
                            <span><FcReading fontSize={15} /> 10</span>
                            <span className="tracking"> <MessageOutline fontSize={15} /> 90 <span className="click">点击查看</span> </span>
                        </div> 
                    </div>
                </Card>            
                <Card className="custom-card">
                    <div className="card-content">
                    <div className="southeastasia-news-image-container">
                            <Image
                                className="southeastasia-news-image"
                                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT60FmLOszH0OVNoUaFcENGYYlQkKA7jrvrzA&s"
                                alt="Example"
                                fit="contain"
                            />
                        </div>
                        <Divider className='divider-line' />

                        <div className="text-area">
                            <Ellipsis direction='end' rows={3} content={content} />   
                        </div>
                        <span className="southeastasia-time">2024-10-01</span>

                        <Divider className='divider-line' />     
                        
                        <div className="button-info">
                            <span className="tracking">泰国</span>
                            <span><FcReading fontSize={15} /> 10</span>
                            <span className="tracking"> <MessageOutline fontSize={15} /> 90 <span className="click">点击查看</span> </span>
                        </div> 
                    </div>
                </Card>            
                <Card className="custom-card">
                    <div className="card-content">
                    <div className="southeastasia-news-image-container">
                            <Image
                                className="southeastasia-news-image"
                                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQacTaDIqT1f3dyXRtr0OZBGdLLVJRCWS-CRg&s"
                                alt="Example"
                                fit="contain"
                            />
                        </div>
                        <Divider className='divider-line' />

                        <div className="text-area">
                            <Ellipsis direction='end' rows={3} content={content} /> 
                        </div>
                        <span className="southeastasia-time">2024-10-01</span>

                        <Divider className='divider-line' />     
                        
                        <div className="button-info">
                            <span className="tracking">越南</span>
                            <span><FcReading fontSize={15} /> 10</span>
                            <span className="tracking"> <MessageOutline fontSize={15} /> 90 <span className="click">点击查看</span> </span>
                        </div> 
                    </div>
                </Card>            
                <Card className="custom-card">
                    <div className="card-content">
                    <div className="southeastasia-news-image-container">
                            <Image
                                className="southeastasia-news-image"
                                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSma4JH2bKirqDTGGStPTbCqZxhsPu3Wl-Mjw&s"
                                alt="Example"
                                fit="contain"
                            />
                        </div>
                        <Divider className='divider-line' />

                        <div className="text-area">
                            <Ellipsis direction='end' rows={3} content={content} />
                        </div>
                        <span className="southeastasia-time">2024-10-01</span>

                        <Divider className='divider-line' />     
                        
                        <div className="button-info">
                            <span className="tracking">菲律宾</span>
                            <span><FcReading fontSize={15} /> 10</span>
                            <span className="tracking"> <MessageOutline fontSize={15} /> 90 <span className="click">点击查看</span> </span>
                        </div> 
                    </div>
                </Card>
            </div>


            <Popup className='news-record-popup' bodyStyle={{ display: 'flex', flexDirection: 'column', overflowY: 'auto', width: '100%' }}
                position='right'
                closeOnSwipe={true}
                closeOnMaskClick
                visible={visibleCloseRight}
                onClose={() => { setVisibleCloseRight(false) }}>

                <div className="popup-scrollable-content" >
                    <div className='newsinfo-title' onClick={() => setVisibleCloseRight(false)} ><span style={{ paddingRight: '5px', color: 'gray' }} ><LeftOutline fontSize={16} />返回</span></div>

                    <Card className="custom-card">
                        <div className="card-content">
                            <div className="southeastasia-news-image-container">
                                <Image
                                    className="southeastasia-news-image"
                                    src="https://ichef.bbci.co.uk/ace/ws/800/cpsprodpb/0123/production/_127419200_mediaitem127419198.jpg.webp"
                                    alt="Example"
                                    fit="contain"
                                />
                            </div>

                            <Divider className='divider-line' />

                            <div className="text-area">
                                {content}
                            </div>

                            <span className="southeastasia-time"></span>

                            <div className="button-info">
                                <span className="tracking">
                                    <span className="city">{popupInfo.area}</span>
                                </span>
                                <span className="tracking">
                                    <span className="icon-and-text">
                                        <FcReading fontSize={15} />
                                        <span className="number">{popupInfo.readCount}</span>
                                    </span>
                                </span>
                                <span className="tracking"><Tag color='red' fill='outline'>热门</Tag>  2024-10-01</span>
                            </div> 

                            <Comment newsCommentCount={newsCommentCount} setNewsCommentCount={setNewsCommentCount} newsId={popupInfo.id} newsType={2} />
                        </div>
                    </Card>
                </div>

            </Popup>



        </>
    );
}



export default Company;