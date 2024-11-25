import { useState } from "react";
import { Card, Divider, PullToRefresh, Space, Tag, InfiniteScroll, DotLoading, Popup} from 'antd-mobile';
import '@/components/company/Company.less'

const Company: React.FC = () => {
    //const [jobList, setJobList] = useState<JobType[]>([]);
    const [pageNum, setPageNum] = useState<number>(1);
    const [hasMore, setHasMore] = useState<boolean>(true);


    return (
        <>
            <div className="card-container" >
                <Card className="custom-card">
                    <div className="card-content">
                        <div className="line1">AG集团 IVI公司</div>

                        <Divider className='divider-line' />

                        <div className="text-area">
                            上千人公司,主要提供东南亚,行业龙头,主要经营项目为线上游戏源头,对接第三方大厅,和第三方支付项目提供对接
                            上千人公司,主要提供东南亚,行业龙头,主要经营项目为线上游戏源头,对接第三方大厅,和第三方支付项目提供对接
                        </div>

                        <Divider className='divider-line' />

                        <div className="line-group">
                            <div className="line">菲律宾</div>
                            <Divider className='divider-line' direction="vertical" />
                            <div className="line">双休制</div>
                            <Divider className='divider-line' direction="vertical" />
                            <div className="line">1000人以上</div>
                            <Divider className='divider-line' direction="vertical" />
                            <div className="line">评价良好</div>
                        </div>

                        <Divider className='divider-line' />

                        <span className="tracking">10条追踪动态 <span className="click">点击查看</span> </span>
                    </div>
                </Card>
                <Card className="custom-card">
                    <div className="card-content">
                        <div className="line1">AG集团 IVI公司</div>

                        <Divider className='divider-line' />

                        <div className="text-area">
                            上千人公司,主要提供东南亚,行业龙头,主要经营项目为线上游戏源头,对接第三方大厅,和第三方支付项目提供对接
                            上千人公司,主要提供东南亚,行业龙头,主要经营项目为线上游戏源头,对接第三方大厅,和第三方支付项目提供对接
                        </div>

                        <Divider className='divider-line' />

                        <div className="line-group">
                            <div className="line">菲律宾</div>
                            <Divider className='divider-line' direction="vertical" />
                            <div className="line">双休制</div>
                            <Divider className='divider-line' direction="vertical" />
                            <div className="line">1000人以上</div>
                            <Divider className='divider-line' direction="vertical" />
                            <div className="line">评价良好</div>
                        </div>

                        <Divider className='divider-line' />

                        <span className="tracking">10条追踪动态 <span className="click">点击查看</span> </span>
                    </div>
                </Card>
            </div>
        </>
    );
}



export default Company;