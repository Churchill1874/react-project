import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Card, Divider, NavBar, Skeleton, Image, Steps, Swiper, ImageViewer } from 'antd-mobile';
import { LocationFill } from 'antd-mobile-icons';
import { Request_CompanyFind, CompanyDetailReqType, CompanyPageType } from '@/components/company/api';
import dayjs from 'dayjs';
import '@/components/company/Company.less';

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
  };

  const images = company?.image ? company.image.split('||').filter(Boolean) : [];

  return (
    <>
      <div style={{ minHeight: '100vh', paddingBottom: '20px', overflowY: 'auto' }}>
        <NavBar onBack={() => navigate('/news/company')}>
          公司详情
        </NavBar>

        {company ? (
          <div className="company-info-popup">
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

              <div className="text-area">
                {company?.description}
              </div>

              <Divider className='company-divider-line' style={{ marginTop: 10 }} />
              <div className="line-group">
                <div className="line">{company?.overtimeCompensation}</div>
                <Divider className='blue-divider-line' direction="vertical" />
                <div className="line">{company?.holiday}</div>
                <Divider className='blue-divider-line' direction="vertical" />
                <div className="line">{company?.teamScale}</div>
                <Divider className='blue-divider-line' direction="vertical" />
                <div className="line">{company?.bonus}</div>
              </div>

              <Divider className='divider-line' />
              <div className="line-group">
                <div className="line">{company?.salaryRange}</div>
                <Divider className='blue-divider-line' direction="vertical" />
                <div className="line">{company?.leadershipCharacter}</div>
                <Divider className='blue-divider-line' direction="vertical" />
                <div className="line">{company?.live}</div>
                <Divider className='blue-divider-line' direction="vertical" />
                <div className="line">{company?.officeEnvironment}</div>
              </div>
              <Divider className='divider-line' />
              <div className="line-group">
                <span style={{ marginTop: 10 , color:'gray'}} ><LocationFill className="area" /> {company?.city}</span>
                <span style={{ marginTop: 10 }} className='last-time'>最后一次更新时间: {dayjs(company?.updateTime).format('YYYY-MM-DD HH:mm')} </span>
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
