import { useState, useEffect } from 'react';
import '@/components/exposure/exposureinfo/ExposureInfo.less';
import { Request_ExposureFind, ExposureDetailReqType, ExposureType } from '@/components/exposure/api'
import { Image, Skeleton, ImageViewer } from 'antd-mobile';
import { Helmet } from 'react-helmet-async';

import { getImgUrl } from '@/utils/commentUtils'
interface ExposureDetailProps {
  id: string | null;
  onClose?: () => void;
  setId?: (id: string | null) => void;
}

const ExposureDetail: React.FC<ExposureDetailProps> = ({ onClose, id, setId }) => {
  const [exposure, setExposure] = useState<ExposureType | null>(null);
  const [visible, setVisible] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const exposureFindReq = async () => {
    const param: ExposureDetailReqType = { id: id }
    const data: ExposureType = (await Request_ExposureFind(param)).data;
    setExposure(data);
    setId?.(data.id)
  }

  useEffect(() => {
    if (id) {
      setExposure(null);
      exposureFindReq();
    }
  }, [id])

  const images = exposure ? [
    exposure.image1,
    exposure.image2,
    exposure.image3,
    exposure.image4,
    exposure.image5,
    exposure.image6,
  ].filter(Boolean).map(img => getImgUrl(img as string)) : [];


  return (

    <>

      {exposure &&
        <div className="detail-container">
          <Helmet>
            <title>{exposure?.title} - 灰亚新闻</title>
            <meta name="description" content={exposure?.content?.slice(0, 120).replace(/\s+/g, ' ')} />
            <meta property="og:title" content={exposure?.title} />
            <meta property="og:description" content={exposure?.content?.slice(0, 120).replace(/\s+/g, ' ')} />
            {images?.[0] && <meta property="og:image" content={images[0]} />}
          </Helmet>

          {/* 页面头部 */}
          <div className="detail-header">
            <div className="header-nav">
              <button className="back-btn" onClick={() => { onClose?.(); setId?.(null) }}>← 返回列表</button>
              <div className="header-title">案件详情</div>
            </div>
          </div>

          <div className="detail-content">
            {/* 案件详情卡片 */}
            <div className="detail-card">
              <div className="case-title">
                {exposure.title}
              </div>

              <div className="case-description">
                {exposure.content}
              </div>

              {/* 案件基本信息 - 融入到描述区域 */}
              <div className="case-meta">
                <div className="meta-row">
                  <span className="meta-icon">📍</span>
                  <span className="meta-text">作案地点：{exposure.address}</span>
                </div>
                <div className="meta-row">
                  <span className="meta-icon">📅</span>
                  <span className="meta-text">举报时间：{exposure.createTime}</span>
                </div>
                <div className="meta-row">
                  {/* <span className="meta-icon">👁️</span> */}
                  <span className="meta-text">浏览次数：{exposure.viewsCount}</span>
                </div>
                {exposure.username1 && <div className="meta-row">
                  {/*  <span className="meta-icon">👁️</span> */}
                  <span className="meta-text"> {exposure.username1}</span>
                </div>}
                {exposure.username2 && <div className="meta-row">
                  {/*   <span className="meta-icon">👁️</span> */}
                  <span className="meta-text"> {exposure.username2}</span>
                </div>}
                {exposure.username3 &&
                  <div className="meta-row">
                    {/* <span className="meta-icon">👁️</span> */}
                    <span className="meta-text"> {exposure.username3}</span>
                  </div>}
                {exposure.username4 &&
                  <div className="meta-row">
                    {/*  <span className="meta-icon">👁️</span> */}
                    <span className="meta-text"> {exposure.username4}</span>
                  </div>
                }
                {exposure.username5 &&
                  <div className="meta-row">
                    {/* <span className="meta-icon">👁️</span> */}
                    <span className="meta-text"> {exposure.username5}</span>
                  </div>}
                {exposure.username6 &&
                  <div className="meta-row">
                    {/* <span className="meta-icon">👁️</span> */}
                    <span className="meta-text"> {exposure.username6}</span>
                  </div>}
              </div>

              {/* 涉案人员 - 6个人员示例 */}
              <div className="suspects-title">涉及人员信息</div>
              <div className="suspects-detail-grid six">
                {images.map((img, index) => (
                  <div className="suspect-detail-card" key={index}>
                    <Image
                      fit='contain'
                      src={getImgUrl(img)}
                      className="suspect-detail-photo"
                      onClick={() => {
                        setCurrentIndex(index);
                        setVisible(true);
                      }}
                    />
                  </div>
                ))}


              </div>
            </div>

            {!exposure &&
              <>
                <Skeleton.Title animated />
                <Skeleton.Paragraph lineCount={8} animated />
              </>
            }


            {/* 底部统计信息 */}
            <div className="detail-footer">
              ⚠️ 如有相关举报意向, 提供资料, 请联系举报tg @grayasia
            </div>
          </div>
        </div>

      }

      {images.length > 0 &&
        <ImageViewer.Multi
          key={currentIndex} // ⭐关键：强制刷新
          images={images}
          visible={visible}
          defaultIndex={currentIndex} // ✅ 只能用这个
          onIndexChange={(i) => setCurrentIndex(i)}
          onClose={() => setVisible(false)}
        />
      }

    </>

  );
};

export default ExposureDetail;