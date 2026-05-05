import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Card, Divider, NavBar, Skeleton, Image, Steps, Swiper, ImageViewer } from 'antd-mobile';
import { LocationFill } from 'antd-mobile-icons';
import { Request_CompanyFind, CompanyDetailReqType, CompanyPageType } from '@/components/company/api';
import dayjs from 'dayjs';
import '@/components/company/Company.less';
import { Helmet } from 'react-helmet-async';
import useStore from '@/zustand/store';

const CompanyDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [company, setCompany] = useState<CompanyPageType | null>(null);
  const [visible, setVisible] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const { Step } = Steps;

  useEffect(() => {
    if (id) {
      companyFindReq();
    }
  }, [id]);

  const companyFindReq = async () => {
    if (!id) return;
    const param: CompanyDetailReqType = { id: id };
    const data: CompanyPageType = (await Request_CompanyFind(param)).data;
    setCompany(data);

    // 同步列表缓存浏览量 +1
    const { getNewsListCache, setNewsListCache } = useStore.getState();
    const cache = getNewsListCache('company');
    if (cache) {
      const newData = cache.data.map((item: any) =>
        String(item.id) === String(id)
          ? { ...item, viewCount: (item.viewCount || 0) + 1 }
          : item
      );
      setNewsListCache('company', newData, cache.page, cache.hasMore);
    }
  };

  const images = company?.image ? company.image.split('||').filter(Boolean) : [];

  return (
    <>
      <div style={{
        height: '100vh',
        overflow: 'auto',
        paddingBottom: '20px',
        boxSizing: 'border-box'
      }}>
        <NavBar onBack={() => navigate('/news/company')}>
          公司详情
        </NavBar>

        {company ? (

          <div className="company-info-popup">
            <Helmet>
              <title>{company.name} - 灰亚新闻</title>
              <meta name="description" content={company.description?.slice(0, 120).replace(/\s+/g, ' ')} />
              <meta property="og:title" content={company.name} />
              <meta property="og:description" content={company.description?.slice(0, 120).replace(/\s+/g, ' ')} />
              {images?.[0] && <meta property="og:image" content={images[0]} />}
            </Helmet>

            <Card className="company-custom-card">
              <div className="company-line1">
                <span className="company-name">
                  {company?.name}
                </span>
              </div>

              {company?.image &&
                <>
                  <Divider className='company-divider-line' />
                  <Swiper loop autoplay allowTouchMove>
                    {images.map((imagePath, index) => (
                      <Swiper.Item className="swiper-item" key={index}>
                        <Image
                          className='company-image-container'
                          fit='contain'
                          src={imagePath}
                          onClick={() => {
                            setCurrentIndex(index);
                            setVisible(true);
                          }}
                        />
                      </Swiper.Item>
                    ))}
                  </Swiper>
                </>
              }

              <div className="line-group" style={{ marginTop: 10 }}>
                <div className="line">{company?.overtimeCompensation}</div>
                <Divider className='blue-divider-line' direction="vertical" />
                <div className="line">{company?.holiday}</div>
                <Divider className='blue-divider-line' direction="vertical" />
                <div className="line">{company?.teamScale}</div>
              </div>

              <Divider className='divider-line' />

              <div className="line-group">
                <div className="line">{company?.salaryRange}</div>
                <Divider className='blue-divider-line' direction="vertical" />
                <div className="line">{company?.leadershipCharacter}</div>
                <Divider className='blue-divider-line' direction="vertical" />
                <div className="line">{company?.live}</div>
              </div>

              <Divider className='divider-line' />

              <div className="line-group" >
                <div className="line">{company?.bonus}</div>
                <Divider className='blue-divider-line' direction="vertical" />
                <div className="line">{company?.officeEnvironment}</div>
              </div>


              <div className="text-area" style={{ whiteSpace: 'pre-wrap' }}>
                {company?.description}
              </div>

              <Divider className='divider-line' />

              <div className="line-group">
                <span style={{ marginTop: 10, color: 'gray' }} ><LocationFill className="area" /> {company?.city}</span>
                <span style={{ marginTop: 10 }} className='last-time'>最后更新: {dayjs(company?.updateTime).format('YYYY-MM-DD HH:mm')} </span>
              </div>
            </Card>

            <Steps direction='vertical' className="custom-vertical-steps-info">
              {company?.companyEventList && company.companyEventList.length > 0 &&
                company?.companyEventList?.map((event, index) => {
                  return (
                    <Step
                      key={index}
                      title={event.description}
                      status='finish'
                      description={event.eventDate}
                      style={{ fontSize: '14' }}
                    />
                  )
                })
              }
            </Steps>
          </div>
        ) : (
          <>
            <Skeleton.Title animated />
            <Skeleton.Paragraph lineCount={8} animated />
          </>
        )}
      </div>

      {images.length > 0 &&
        <ImageViewer.Multi
          key={currentIndex}
          images={images}
          visible={visible}
          defaultIndex={currentIndex}
          onIndexChange={(i) => setCurrentIndex(i)}
          onClose={() => setVisible(false)}
        />
      }
    </>
  );
};

export default CompanyDetail;
