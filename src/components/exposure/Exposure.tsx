import { useState } from 'react';
import '@/components/exposure/Exposure.less';
import ExposureInfo from '@/components/exposure/exposureinfo/ExposureInfo';
import { PullToRefresh, Skeleton, InfiniteScroll, Popup, DotLoading, Image } from 'antd-mobile';
import { Request_ExposurePage, ExposurePageReqType, ExposureType } from '@/components/exposure/api'
import { getImgUrl } from '@/utils/commentUtils';

const ExposureList: React.FC = () => {
  const [exposureList, setExposureList] = useState<ExposureType[]>([]);
  const [exposureHasHore, setExposureHasHore] = useState<boolean>(true);
  const [exposurePage, setExposurePage] = useState<number>(1);
  const [visibleCloseRight, setVisibleCloseRight] = useState(false)
  const [loadingMore, setLoadingMore] = useState(false);
  const [id, setId] = useState<string | null>(null);

  //获取api东南亚新闻数据
  const exposurePageRequest = async (isReset: boolean) => {
    if (loadingMore) return;
    setLoadingMore(true);

    const pageNum = isReset ? 1 : exposurePage;
    const param: ExposurePageReqType = { pageNum: pageNum, pageSize: 20 };
    const list: ExposureType[] = (await Request_ExposurePage(param)).data.records || [];

    //循环便利
    if (list.length > 0) {
      if (isReset) {
        setExposurePage(() => 2);
        setExposureList(list);
        setExposureHasHore(true);
      } else {
        //if (JSON.stringify(list) !== JSON.stringify(exposureList)) {
        if (list.length > 0) {
          setExposurePage(prev => (prev + 1))
          setExposureList(prev => [...prev, ...list])
          setExposureHasHore(true)
        } else {
          setExposureHasHore(false)
        }
      }
    } else {
      setExposureHasHore(false)
    }

    setLoadingMore(false);
  }

  const getImages = (exposure: ExposureType) => {
    return [1, 2, 3, 4, 5, 6]
      .map(i => exposure[`image${i}` as keyof ExposureType] as string)
      .filter(Boolean);
  };

  const ExposureScrollContent = ({ hasMore }: { hasMore?: boolean }) => {
    return (
      <>
        {hasMore ? (
          <>
            <div className="dot-loading-custom" >
              <span >加载中</span>
              <DotLoading color='#fff' />
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

  const click = (id: string) => {
    setVisibleCloseRight(true)
    setId(id)
  }

  return (


    <>
      <div className="exposure-list-container">


        <div className="exposure-list">

          <PullToRefresh onRefresh={() => exposurePageRequest(true)}>
            {exposureList?.map((exposure) => {

              const images = getImages(exposure);

              return (
                <div
                  className="exposure-item"
                  key={exposure.id}
                  onClick={() => click(exposure.id)}
                >

                  <div className="item-content">

                    <div className={`exposure-title${exposure.isTop ? '-red' : ''}`}>
                      {exposure.isTop && <span className="top-badge">置 顶</span>}
                      {exposure.title}
                    </div>

                    {/* 图片 */}
                    {images.length > 0 && (
                      <div className='suspects-grid'>
                        {images.map((img, index) => (
                          <div className="suspect-card" key={index}>
                            <Image
                              fit='contain'
                              src={getImgUrl(img)}
                              className="suspect-photo"
                            />
                          </div>
                        ))}
                      </div>
                    )}

                  </div>

                  <div className="item-footer">
                    <div className="report-date">
                      举报时间: {exposure.createTime}
                    </div>
                    <div className="view-count">
                      浏览: {exposure.viewsCount}
                    </div>
                  </div>

                </div>
              );
            })}

            <InfiniteScroll
              loadMore={() => exposurePageRequest(false)}
              hasMore={exposureHasHore}
              threshold={50}
            >
              <ExposureScrollContent hasMore={exposureHasHore} />

            </InfiniteScroll>

          </PullToRefresh>

          {!exposureList &&
            <>
              <Skeleton.Title animated />
              <Skeleton.Paragraph lineCount={8} animated />
            </>

          }


        </div>
      </div>

      <Popup className='news-record-popup' bodyStyle={{ display: 'flex', flexDirection: 'column', overflowY: 'auto', width: '100%' }}
        position='right'
        closeOnSwipe={true}
        closeOnMaskClick
        visible={visibleCloseRight}
        onClose={() => { setVisibleCloseRight(false) }}
      >
        <ExposureInfo onClose={() => { setVisibleCloseRight(false) }} id={id} setId={() => setId} />

      </Popup>



    </>
  );
};

export default ExposureList;