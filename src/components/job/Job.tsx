import { useState } from 'react';
import { Card, Divider, Space, Tag } from 'antd-mobile';
import '@/components/job/Job.less'

interface JobType {
    ageConditions: string;
    city: string;
    companyEncapsulate: string;
    companyName: string;
    createName: string;
    createTime: string;
    educationConditions: string;
    environment: string;
    holiday: string;
    id: number;
    image: string;
    lastTime: string;
    name: string;
    room: string;
    roomOut: string;
    salaryRange: string;
    skillConditions: string;
    teamScale: string;
    welfare: string;
    contact: string;
}

const Job: React.FC = () => {
    const [jobList, setJobList] = useState<JobType[]>([]);


    //请求后端岗位招聘记录数据

    //
    return (
        <div className="card-container">
            <Card className="custom-card">
                <div className="card-content">
                    <div className="line1">AG IVI 招聘 java 前端 运维 测试岗位</div>

                    <Divider className='divider-line' />
                    <div className="line-group">
                        <div className="line">马尼拉,东京</div>
                        <Divider className='divider-line' direction="vertical" />
                        <div className="line">单人间</div>
                        <Divider className='divider-line' direction="vertical" />
                        <div className="line">写字楼办公</div>
                    </div>
                    <Divider className='divider-line' />
                    <div className="line-group">
                        <div className="line">30k-45k</div>
                        <Divider className='divider-line' direction="vertical" />
                        <div className="line">20天年假</div>
                        <Divider className='divider-line' direction="vertical" />
                        <div className="line">无学历要求</div>
                    </div>
                    <Divider className='divider-line' />
                    <div className="line-group">
                        <div className="line">15薪</div>
                        <Divider className='divider-line' direction="vertical" />
                        <div className="line">棋牌,视讯,交易所</div>
                        <Divider className='divider-line' direction="vertical" />
                        <div className="line">双休 +菲假</div>
                    </div>
                    <Divider className='divider-line' />
                    <div >
                        <Space>
                            <Tag color='primary' fill='outline' style={{ '--border-radius': '6px' }}>老公司</Tag>
                            <Tag color='danger' fill='outline' style={{ '--border-color': 'var(--adm-color-weak)' }}> 氛围好 </Tag>
                            <Tag color='#ff6430' fill='outline'> 平台推荐 </Tag>
                        </Space>
                    </div>
                    <div className="text-area">
                        长达15年的大型集团在线娱乐企业,菲律宾上市公司
                        <br />
                        更新时间: 2024-08-19 14:00
                    </div>
                </div>
            </Card>

            <Card className="custom-card">
                <div className="card-content">
                    <div className="line1">凤凰集团 招聘 java 前端 运维 测试岗位</div>
                    <Divider className='divider-line' />
                    <div className="line-group">
                        <div className="line">东京, 帕赛</div>
                        <Divider className='divider-line' direction="vertical" />
                        <div className="line">单人间</div>
                        <Divider className='divider-line' direction="vertical" />
                        <div className="line">写字楼办公</div>
                    </div>
                    <Divider className='divider-line' />
                    <div className="line-group">
                        <div className="line">45k-70k</div>
                        <Divider className='divider-line' direction="vertical" />
                        <div className="line">15天年假</div>
                        <Divider className='divider-line' direction="vertical" />
                        <div className="line">无学历要求</div>
                    </div>
                    <Divider className='divider-line' />
                    <div className="line-group">
                        <div className="line">14薪 项目分红</div>
                        <Divider className='divider-line' direction="vertical" />
                        <div className="line">棋牌,视讯,交易所</div>
                        <Divider className='divider-line' direction="vertical" />
                        <div className="line">大小周</div>
                    </div>
                    <Divider className='divider-line' />
                    <div className="text-area">
                        长达15年的大型集团在线娱乐企业,菲律宾上市公司
                        <br />
                        更新时间: 2024-08-19 14:00
                    </div>
                </div>
            </Card>


            <Card className="custom-card">
                <div className="card-content">
                    <div className="line1">亚美尼亚公司 招聘 java 前端</div>
                    <Divider className='divider-line' />
                    <div className="line-group">
                        <div className="line">亚美尼亚首都</div>
                        <Divider className='divider-line' direction="vertical" />
                        <div className="line">双人间</div>
                        <Divider className='divider-line' direction="vertical" />
                        <div className="line">别墅办公</div>
                    </div>
                    <Divider className='divider-line' />
                    <div className="line-group">
                        <div className="line">50k-70k</div>
                        <Divider className='divider-line' direction="vertical" />
                        <div className="line">20天年假</div>
                        <Divider className='divider-line' direction="vertical" />
                        <div className="line">无学历要求</div>
                    </div>
                    <Divider className='divider-line' />
                    <div className="line-group">
                        <div className="line">14薪</div>
                        <Divider className='divider-line' direction="vertical" />
                        <div className="line">视讯,交易所</div>
                        <Divider className='divider-line' direction="vertical" />
                        <div className="line">大小周</div>
                    </div>
                    <Divider className='divider-line' />
                    <div className="text-area">
                        长达15年的大型集团在线娱乐企业,菲律宾上市公司
                        <br />
                        更新时间: 2024-08-19 14:00
                    </div>
                </div>
            </Card>


        </div>
    );
}

export default Job;