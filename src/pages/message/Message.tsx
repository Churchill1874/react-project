import { useState } from "react";
import { Tabs, Badge, Card, Image, Divider, Avatar } from 'antd-mobile'
import '@/pages/message/Message.less'
import { FcReading, } from "react-icons/fc";
import { MessageOutline, LeftOutline, MessageFill, ClockCircleOutline } from 'antd-mobile-icons';
import { FcAlarmClock } from "react-icons/fc";
import avatars from '@/common/avatar';




const Message: React.FC = () => {



    return (
        <>
            <Tabs className="message-tabs" activeLineMode='fixed'>
                <Tabs.Tab title={'1' ? <Badge content={1} style={{ '--right': '-10px', '--top': '8px' }}>私信</Badge> : '私信'} key='private-message'>

                    评论1
                </Tabs.Tab>



                <Tabs.Tab title={'1' ? <Badge content={1} style={{ '--right': '-10px', '--top': '8px' }}>系统消息</Badge> : '系统消息'} key='system-message'>
                    <Card className="message-custom-card">
                        <div className="card-content">

                            <div className="message-news-image-container">
                                <Image className="message-news-image" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRrZq5wFJ_FtNWQQGdRkmXonQOEuMVpWuWm3w&s" alt="Example" fit="contain" />
                            </div>


                            <div className="message-text-area">
                                内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容
                            </div>

                            <Divider className='message-line' />

                            <div className="message-time">
                                2025-01-01 10:15
                            </div>
                        </div>
                    </Card>

                    <Card className="message-custom-card">
                        <div className="card-content">
                            <div className="message-text-area">
                                内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容
                            </div>

                            <Divider className='message-line' />

                            <div className="message-time">
                                2025-01-01 10:15
                            </div>
                        </div>
                    </Card>

                    <Card className="message-custom-card">
                        <div className="card-content">
                            <div className="message-text-area">
                                内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容
                            </div>

                            <Divider className='message-line' />

                            <div className="message-time">
                                2025-01-01 10:15
                            </div>
                        </div>
                    </Card>
                </Tabs.Tab>



                <Tabs.Tab title={'1' ? <Badge content={1} style={{ '--right': '-10px', '--top': '8px' }}>评论</Badge> : '评论'} key='comment-message'>

                    <Card className="message-custom-card">
                        <div className="card-content">
                            <div className="message-title"><span className="news-type">#东南亚</span> 新闻标题 </div>

                            <div className="message-news-image-container">
                                <Image className="message-news-image" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRrZq5wFJ_FtNWQQGdRkmXonQOEuMVpWuWm3w&s" alt="Example" fit="contain" />
                            </div>
                            <div className="message-text-area">
                                <span className="message-chat-item">
                                    <Avatar className="avatar" src={avatars[1]} />
                                    <span className="message-content">
                                        <span > 他妈滴 <span className="reply"> 回复了你的评论: </span></span>
                                        <span className="comment">哈哈哈哈我们就喷他...</span>

                                    </span>
                                </span>

                                <span className="reply-content">
                                    <span className="reply"> 回复内容:</span> 内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容
                                </span>

 
                            </div>

                            <Divider className='message-line' />
                            <div className="message-bottom">

                                <div className="message-time">2025-01-01 10:15</div>
                                <div className="find">查看详情</div>
                            </div>
                        </div>
                    </Card>

                    <Card className="message-custom-card">
                        <div className="card-content">
                            <div className="message-title"><span className="news-type">#国内</span> 新闻标题 </div>

                            <div className="message-text-area">
                                <span className="message-chat-item">
                                    <Avatar className="avatar" src={avatars[1]} />
                                    <span className="message-content">
                                        <span > 他妈滴 <span className="reply"> 回复了你的评论: </span></span>
                                        <span className="comment">哈哈哈哈我们就喷他...</span>

                                    </span>
                                </span>

                                <span className="reply-content">
                                    <span className="reply"> 回复内容:</span> 内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容

                                </span>

 
                            </div>

                            <Divider className='message-line' />
                            <div className="message-bottom">
                                <div className="message-time">2025-01-01 10:15</div>
                                <div className="find">查看详情</div>
                            </div>
                            
                        </div>
                    </Card>


                </Tabs.Tab>
            </Tabs>
        </>
    )
}

export default Message;
