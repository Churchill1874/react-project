import { useState } from "react";
import { Card, Divider, PullToRefresh, Skeleton, Tag, InfiniteScroll, Popup, ImageViewer, DotLoading, Image, Steps, Ellipsis, Swiper } from 'antd-mobile';
import { LeftOutline, LocationFill } from 'antd-mobile-icons';
import '@/components/company/Company.less'
import { Request_CompanyPage, CompanyPageType, CompanyPageReqType } from '@/components/company/api'
import dayjs from 'dayjs'


const Company: React.FC = () => {
  const [companyList, setCompanyList] = useState<CompanyPageType[]>([]);
  const [companyHasHore, setCompanyHasHore] = useState<boolean>(true);
  const [companyPage, setCompanyPage] = useState<number>(1);

  const { Step } = Steps
  const [visibleCloseRight, setVisibleCloseRight] = useState(false)
  const [visible, setVisible] = useState(false)
  const [popupInfo, setPopupInfo] = useState<CompanyPageType>();

  const showPopupInfo = (companyData: CompanyPageType) => {
    setVisibleCloseRight(true)
    setPopupInfo(companyData);
  }

  const showImage = () => {
    setVisible(prev => !prev);
  }

  const CompanyScrollContent = ({ hasMore }: { hasMore?: boolean }) => {
    return (
      <>
        {hasMore ? (
          <>
            <div className="dot-loading-custom" >
              <span >加载中</span>
              <DotLoading color='#fff' />
              <Skeleton.Title animated />
              <Skeleton.Paragraph lineCount={8} animated />
            </div>
          </>
        ) : (
          <div className="infinite-scroll-footer">
            <span >--- 我是有底线的 ---</span>
          </div>
        )}
      </>
    )
  }

  //获取api东南亚新闻数据
  const companyPageRequest = async (isReset: boolean) => {
    const pageNum = isReset ? 1 : companyPage;
    const param: CompanyPageReqType = { pageNum: pageNum, pageSize: 20 };
    const list: CompanyPageType[] = (await Request_CompanyPage(param)).data.records || [];

    //循环便利
    if (list.length > 0) {
      if (isReset) {
        setCompanyPage(() => 2);
        setCompanyList(list);
        setCompanyHasHore(true);
      } else {
        if (JSON.stringify(list) !== JSON.stringify(companyList)) {
          setCompanyPage(prev => (prev + 1))
          setCompanyList([...companyList, ...list])
          setCompanyHasHore(true)
        } else {
          setCompanyHasHore(false)
        }
      }
    } else {
      setCompanyHasHore(false)
    }

  }

  return (
    <>
      <InfiniteScroll
        loadMore={() => companyPageRequest(false)}
        hasMore={companyHasHore}
        threshold={50}
      >

        <div className="card-container" style={{ padding: '10px 10px' }}>
          <PullToRefresh onRefresh={() => companyPageRequest(true)}>
            {companyList?.map((company, index) => (
              <Card className="company-custom-card" key={index}>
                <div className="card-content">
                  <div className="company-line1">
                    <span style={{ color: '#0f61ae', fontSize: '16px', fontWeight: 'bold' }}> {company.name} </span>

                    <span style={{ color: 'gray', fontSize: '12px' }}><LocationFill className="area" /> {company.city}</span>
                  </div>


                  <Divider className='company-divider-line' style={{ marginTop: '5px' }} />
                  {company.image &&
                    <>
                      <Divider className='company-divider-line' />
                      <Swiper loop autoplay allowTouchMove>
                        {company.image.split('||').map((imagePath, index) => (
                          <Swiper.Item className="swiper-item" key={index} >
                            <Image className='company-image-container' fit='contain' src={imagePath} onClick={showImage} />
                          </Swiper.Item>
                        ))}
                      </Swiper>
                    </>

                  }

                  <div className="text-area">
                    <Ellipsis direction='end' rows={3} content={company.description} />
                  </div>
                  <Divider className='company-divider-line' />
                  {/*                 <div className="line-group">
                  <div className="line">{company.overtimeCompensation}</div>
                  <Divider className='blue-divider-line' direction="vertical" />
                  <div className="line">{company.holiday}</div>
                  <Divider className='blue-divider-line' direction="vertical" />
                  <div className="line">{company.teamScale}</div>
                  <Divider className='blue-divider-line' direction="vertical" />
                  <div className="line">{company.bonus}</div>
                </div>

                <Divider className='divider-line' />
                <div className="line-group">
                  <div className="line">{company.salaryRange}</div>
                  <Divider className='blue-divider-line' direction="vertical" />
                  <div className="line">{company.leadershipCharacter}</div>
                  <Divider className='blue-divider-line' direction="vertical" />
                  <div className="line">{company.live}</div>
                  <Divider className='blue-divider-line' direction="vertical" />
                  <div className="line">{company.officeEnvironment}</div>
                </div>
                <Divider className='divider-line' /> */}


                  <span className='company-record-bottom'>
                    <span className='update-last-time'>信息更新时间:  {dayjs(company.updateTime).format('YYYY-MM-DD HH:mm')}</span>
                    <span className="company-info" onClick={() => showPopupInfo(company)}> <span className="company-click">点击查看</span> </span>
                  </span>

                </div>
              </Card>
            ))}
          </PullToRefresh>


          <CompanyScrollContent hasMore={companyHasHore} />

        </div>
      </InfiniteScroll>
      <Popup className='news-record-popup' bodyStyle={{ display: 'flex', flexDirection: 'column', overflowY: 'auto', width: '100%' }}
        position='right'
        closeOnSwipe={true}
        closeOnMaskClick
        visible={visibleCloseRight}
        onClose={() => { setVisibleCloseRight(false) }}>

        <ImageViewer.Multi classNames={{ mask: 'customize-mask', body: 'customize-body', }} images={popupInfo?.image?.split('||')} visible={visible} onClose={() => { setVisible(false) }} />

        <div onClick={() => setVisibleCloseRight(false)}><span style={{ paddingRight: '5px', color: 'gray', fontSize: '16px' }} ><LeftOutline fontSize={16} />返回 </span></div>

        <div className="company-info-popup">
          <Card className="company-custom-card">
            <div className="company-line1">{popupInfo?.name}</div>


            {popupInfo?.image &&
              <>
                <Divider className='company-divider-line' />
                <Swiper loop autoplay allowTouchMove>
                  {popupInfo?.image.split('||').map((imagePath, index) => (
                    <Swiper.Item className="swiper-item" key={index} >
                      <Image className='company-image-container' fit='contain' src={imagePath} onClick={showImage} />
                    </Swiper.Item>
                  ))}
                </Swiper>
              </>
            }
            <Divider className='company-divider-line' />

            <div className="text-area">
              {popupInfo?.description}
            </div>

            <Divider className='company-divider-line' />
            <div className="line-group">
              <div className="line">{popupInfo?.overtimeCompensation}</div>
              <Divider className='blue-divider-line' direction="vertical" />
              <div className="line">{popupInfo?.holiday}</div>
              <Divider className='blue-divider-line' direction="vertical" />
              <div className="line">{popupInfo?.teamScale}</div>
              <Divider className='blue-divider-line' direction="vertical" />
              <div className="line">{popupInfo?.bonus}</div>
            </div>

            <Divider className='divider-line' />
            <div className="line-group">
              <div className="line">{popupInfo?.salaryRange}</div>
              <Divider className='blue-divider-line' direction="vertical" />
              <div className="line">{popupInfo?.leadershipCharacter}</div>
              <Divider className='blue-divider-line' direction="vertical" />
              <div className="line">{popupInfo?.live}</div>
              <Divider className='blue-divider-line' direction="vertical" />
              <div className="line">{popupInfo?.officeEnvironment}</div>
            </div>
            <Divider className='divider-line' />
            <div className="line-group">
              <span><LocationFill className="area" />{popupInfo?.city}</span>
            </div>
            <Divider className='divider-line' />

            <span className='last-time'>最后一次更新时间:  {dayjs(popupInfo?.updateTime).format('YYYY-MM-DD HH:mm')} </span>
          </Card>

          <Steps direction='vertical' >
            {popupInfo?.companyEventList && popupInfo.companyEventList.length > 0 &&
              popupInfo?.companyEventList?.map((event, index) => {
                return (
                  <Step
                    title={event.description}
                    status='finish'
                    description={event.createTime}
                    key={index}
                  />
                )
              })
            }
          </Steps>
        </div>

      </Popup>
    </>
  );
}

export default Company;