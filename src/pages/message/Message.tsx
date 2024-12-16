import { useState } from "react";
import { Tabs, Badge } from 'antd-mobile'
import '@/pages/message/Message.less'


const Message: React.FC = () => {




    return (
        <>
            <Tabs className="message-tabs" activeLineMode='fixed'>
                <Tabs.Tab title={'1' ? <Badge content={1} style={{ '--right': '-10px', '--top': '8px' }}>私信</Badge> : '私信'} key='private-message'>
                
                    评论1
                </Tabs.Tab>



                <Tabs.Tab title={'' ? <Badge content={1} style={{ '--right': '-10px', '--top': '8px' }}>系统</Badge> : '系统'} key='system-message'>


                    变量内容2
                </Tabs.Tab>



                <Tabs.Tab title={'' ? <Badge content={1} style={{ '--right': '-10px', '--top': '8px' }}>评论</Badge> : '评论'} key='comment-message'>


                    变量内容3
                </Tabs.Tab>
            </Tabs>
        </>
    )
}

export default Message;
