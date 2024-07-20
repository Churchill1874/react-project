import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextArea, NavBar, Form, Button, Input, Card, Avatar, Popup, Tabs } from 'antd-mobile';
import '@/pages/setpersonal/SetPersonal.less';
import avatars from '@/common/avatar';
import {Request_UpdatePlayerInfo, PersonalUpdateRequestType} from '@/pages/setpersonal/api';
//全局状态管理
import useStore from '@/zustand/store';

const SetPersonal: React.FC = () => {
    const {playerInfo, setPlayerInfo} = useStore();
    const [form] = Form.useForm();
    const [visible, setVisible] = useState(false)

    const navigate = useNavigate();

    //从个人信息页面加载用户信息
    const loadPlayerInfo = ()=> {
        form.setFieldsValue({
            name: playerInfo?.name,
            city: playerInfo?.city,
            selfIntroduction: playerInfo?.selfIntroduction || ''
        });
    }

    //返回上一层
    const back = () => {
        navigate(-1);
    };

    //保存更新
    const update = async () => {
        const { name, selfIntroduction } = form.getFieldsValue();
        const param: PersonalUpdateRequestType = { avatarPath: playerInfo?.avatarPath, email: playerInfo?.email, phone: playerInfo?.phone, name: name, selfIntroduction: selfIntroduction };
        //请求后端更新用户编辑信息
        const {code} = await Request_UpdatePlayerInfo(param);
        if(code === 0 && playerInfo){
            setPlayerInfo({...playerInfo, name, avatarPath:playerInfo?.avatarPath, selfIntroduction});
        }
    };

    //加载后执行钩子
    useEffect(() => {
        loadPlayerInfo();
    }, []);

    //获取点击的头像
    const choose = (index : string)=> {
        if(playerInfo){
            //更新全局状态中的用户信息的头像信息 并重新渲染
            setPlayerInfo({...playerInfo, avatarPath: index});
        }
        setVisible(false)
    }

    //头像库内容
    const avatarGallery = (
        <div className="avatar-list">
            <Tabs activeLineMode="fixed" className="tabs-personal">
                <Tabs.Tab title="经典头像" key="classic">
                    <div className="avatar-gallery">
                        {
                            Object.keys(avatars).map((index) => (
                                <Avatar className="avatar-style" key={index} src={avatars[index]} onClick={() => choose(index)}/>
                            ))
                        }
                    </div>
                </Tabs.Tab>

                <Tabs.Tab title="名人头像" key="youtube">

                </Tabs.Tab>
            </Tabs>

        </div>
    )

    return (
        <>
            <div className="set-personal">
                <NavBar className="edit" onBack={back}>
                    编辑个人信息
                </NavBar>

                <Card className="card">
                    <div className="avatar-container">
                        <div className="avatar-with-text">
                            <Avatar className="personal-avatar" src={avatars[playerInfo?.avatarPath]} />
                        </div>

                        <div className="button-container">
                            <Button onClick={() => { setVisible(true) }} className="change-avatar-button" block color="primary" type="submit" size="middle">替换</Button>
                            <Popup
                                showCloseButton
                                visible={visible}
                                onMaskClick={() => { setVisible(false) }}
                                onClose={() => { setVisible(false) }}
                                position='top'
                                bodyStyle={{ height: '50vh' , padding: 0}}
                            >
                                {avatarGallery}
                            </Popup>
                        </div>
                    </div>
                </Card>


                <Form form={form} className="form" onFinish={update}
                    footer={<Button block color="default" type="submit" size="middle"> 更新 </Button>}
                    layout="horizontal"
                    requiredMarkStyle="asterisk"
                    mode="card"
                >
                    <Form.Item className="item" label="昵称:" name="name"
                        rules={[
                            { required: true, message: '昵称不能为空' },
                            { max: 20, message: '昵称最大20位' },
                            {
                                pattern: /^(?!.*[._-]{2})(?!.*([._-]).*\1)[\u4e00-\u9fa5a-zA-Z0-9]+[._-]?[\u4e00-\u9fa5a-zA-Z0-9]*$/,
                                message: '昵称仅支持一位.或_或-的特殊符号',
                            },
                        ]}
                    >
                        <Input placeholder="请输入" />
                    </Form.Item>

                    <Form.Item className="item" label="城市:" name="city" rules={[{ required: false }, { max: 20, message: '城市最大20位' }]} >
                        <Input placeholder="请输入" />
                    </Form.Item>

                    <Form.Item className="item" label="留言板:" name="selfIntroduction">
                        <TextArea rows={3} maxLength={50} className="textArea" placeholder="请输入" showCount />
                    </Form.Item>
                </Form>
            </div>
        </>
    );
};

export default SetPersonal;
