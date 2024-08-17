import { useState } from 'react';
import { Card, Divider, PullToRefresh, Space, Tag, InfiniteScroll, DotLoading, Popup } from 'antd-mobile';
import '@/components/job/Job.less'
import { Request_JobPage } from '@/components/job/api';

const NewsScrollContent = ({ hasMore }: { hasMore?: boolean }) => {
  return (
    <>
      {hasMore ? (
        <>
          <div className="dot-loading-custom" >
            <span >Loading</span>
            <DotLoading color='#fff' />
          </div>
        </>
      ) : (
        <span color='#fff'>--- 我是有底线的 ---</span>
      )}
    </>
  )
}


export interface JobType {
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
  tag: string;
  annualLeave: string;
  project: string;
}

const Job: React.FC = () => {
  const [jobList, setJobList] = useState<JobType[]>([]);
  const [pageNum, setPageNum] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [visibleCloseRight, setVisibleCloseRight] = useState(false)


  //分页查询工作岗位招聘记录
  const reqJobPage = async (isReset: boolean) => {
    const param = { pageNum: isReset ? 1 : pageNum, pageSize: 20 }
    const resp = await Request_JobPage(param);
    console.log(resp)

    if (resp.data.records && resp.data.records.length > 0) {
      if (isReset) {
        setPageNum(2)
        setHasMore(true)
        setJobList(resp.data.records)
      } else {
        if (JSON.stringify(jobList) !== JSON.stringify(resp.data.records)) {
          setPageNum(prev => prev + 1)
          setJobList([...jobList, ...(resp.data.records || [])])
        } else {
          setHasMore(false)
        }
      }

    } else {
      setHasMore(false)
    }
  }


  //请求后端岗位招聘记录数据
  return (
    <>
      <PullToRefresh onRefresh={() => reqJobPage(true)}>
        {jobList?.map((job, _index) => (
          <div className="card-container" key={job.id} onClick={() => setVisibleCloseRight(true)}>
            <Card className="custom-card">
              <div className="card-content">
                <div className="line1">{job.companyName} {job.name}</div>

                <Divider className='divider-line' />
                <div className="line-group">
                  <div className="line">{job.city}</div>
                  <Divider className='divider-line' direction="vertical" />
                  <div className="line">{job.room}</div>
                  <Divider className='divider-line' direction="vertical" />
                  <div className="line">{job.environment}</div>
                </div>
                <Divider className='divider-line' />
                <div className="line-group">
                  <div className="line">{job.salaryRange}</div>
                  <Divider className='divider-line' direction="vertical" />
                  <div className="line">{job.annualLeave}</div>
                  <Divider className='divider-line' direction="vertical" />
                  <div className="line">{job.educationConditions}</div>
                </div>
                <Divider className='divider-line' />
                <div className="line-group">
                  <div className="line">{job.welfare}</div>
                  <Divider className='divider-line' direction="vertical" />
                  <div className="line">{job.project}</div>
                  <Divider className='divider-line' direction="vertical" />
                  <div className="line">{job.holiday}</div>
                </div>
                <Divider className='divider-line' />
                <div >
                  <Space>
                    {job.tag && job.tag.includes('老公司') && <Tag color='primary' fill='outline'> 老公司 </Tag>}
                    {job.tag && job.tag.includes('氛围好') && <Tag color='green' fill='outline'> 氛围好 </Tag>}
                    {job.tag && job.tag.includes('高绩效') && <Tag color='danger' > 高绩效 </Tag>}
                    {job.tag && job.tag.includes('领导nice') && <Tag color='danger' fill='outline' style={{ '--border-color': 'var(--adm-color-weak)' }}> 领导nice </Tag>}
                    {job.tag && job.tag.includes('休假多') && <Tag color='#2db7f5' > 休假多 </Tag>}
                    {job.tag && job.tag.includes('龙头公司') && <Tag color='#ff6430' > 龙头公司 </Tag>}
                    {job.tag && job.tag.includes('团建丰富') && <Tag fill='outline' color='gray' > 团建丰富 </Tag>}
                  </Space>
                </div>
                <div className="text-area">
                  {job.companyEncapsulate}
                  <br />
                  <span className='last-time'>最后更新时间: {job.lastTime}</span>
                </div>
              </div>
            </Card>


            <Popup className='news-record-popup' bodyStyle={{ display: 'flex', flexDirection: 'column', overflowY: 'auto', width: '100%' }}
              position='right'
              closeOnSwipe={true}
              closeOnMaskClick
              visible={visibleCloseRight}
              onClose={() => { setVisibleCloseRight(false) }}>

              <Card className="popup-custom-card">
                <div className="card-content">
                  <div className="line1"> {job.companyName} 公司</div>
                  <Divider className='divider-line' />
                  <div className="line-group">
                    <div className="line">地点: {job.city}</div>
                    <Divider className='divider-line' direction="vertical" />
                    <div className="line">住宿: {job.room}</div>
                  </div>

                  <Divider className='divider-line' />
                  <div className="line-group">
                    <div className="line">办公环境: {job.environment}</div>
                    <Divider className='divider-line' direction="vertical" />
                    <div className="line">学历要求: {job.educationConditions}</div>
                  </div>

                  <Divider className='divider-line' />
                  <div className="line-group">
                    <div className="line">薪资范围: {job.salaryRange}</div>
                    <Divider className='divider-line' direction="vertical" />
                    <div className="line">年假: {job.annualLeave}</div>
                  </div>

                  <Divider className='divider-line' />
                  <div className="line-group">
                    <div className="line">休假制度: {job.holiday}</div>
                    <Divider className='divider-line' direction="vertical" />
                    <div className="line">经营项目: {job.project}</div>
                  </div>

                  <Divider className='divider-line' />
                  <div className="line-group">
                    <div className="line">其他福利: {job.welfare}</div>
                  </div>

                  <Divider className='divider-line' />
                  <div>招聘要求: </div>
                  <div className="line-group">
                  <div className="line">{job.skillConditions}</div>
                  </div>

                  <Divider className='divider-line' />
                  <div>公司简介: </div>
                  <div className="text-area">
                    {job.companyEncapsulate}
                  </div>
                </div>
                <br />
                <span className='last-time'>最后更新时间: {job.lastTime}</span>
              </Card>
            </Popup>

          </div>
        ))}

      </PullToRefresh>

      <InfiniteScroll loadMore={() => reqJobPage(false)} hasMore={hasMore}>
        <NewsScrollContent hasMore={hasMore} />
      </InfiniteScroll>
    </>
  );
}

export default Job;