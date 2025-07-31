import { useState } from "react";
import {
  Card,
  Skeleton,
  Tag,
  Ellipsis,
  Image,
  Popup,
  PullToRefresh,
  InfiniteScroll,
  DotLoading
} from "antd-mobile";
import { FcReading } from "react-icons/fc";
import { MessageOutline, LocationFill } from "antd-mobile-icons";
import "@/components/promotion/Promotion.less";
import {
  PromotionPageReqType,
  PromotionType,
  PromotionPage_Request
} from "@/components/promotion/api";
import PromotionInfo from "@/components/promotion/promotioninfo/PromotionInfo";
import dayjs from "dayjs";
import { PromotionTypeEnum } from "@/common/PromotionTypeEnum";

type PopupInfo = {
  id: any | null;
  imagePath: any | null;
  videoPath: any | null;
  viewCount: any | null;
  commentsCount: any | null;
  area: any | null;
  content: any | null;
  createTime: any | null;
  contact: any | null;
  isTop: any | null;
  type: any | null;
  title: any | null;
  price: string | null;
};

const Promotion: React.FC = () => {
  const [visibleCloseRight, setVisibleCloseRight] = useState(false);
  const [popupInfo, setPopupInfo] = useState<PopupInfo>({
    id: null,
    area: "",
    content: "",
    viewCount: 0,
    commentsCount: 0,
    imagePath: "",
    videoPath: "",
    createTime: "",
    contact: "",
    isTop: false,
    type: null,
    title: "",
    price: ""
  });

  const [promotionList, setPromotionList] = useState<PromotionType[]>([]);
  const [promotionHasHore, setPromotionHasHore] = useState<boolean>(true);
  const [promotionPage, setPromotionPage] = useState<number>(1);

  const showPopupInfo = (
    id,
    area,
    content,
    viewCount,
    commentsCount,
    imagePath,
    videoPath,
    createTime,
    contact,
    isTop,
    type,
    title,
    price
  ) => {
    setVisibleCloseRight(true);
    setPopupInfo({
      id,
      area,
      content,
      viewCount,
      commentsCount,
      imagePath,
      videoPath,
      createTime,
      contact,
      isTop,
      type,
      title,
      price
    });
  };

  const promotionPageRequest = async (isReset: boolean) => {
    const pageNum = isReset ? 1 : promotionPage;
    const param: PromotionPageReqType = { pageNum: pageNum, pageSize: 20 };
    const list: PromotionType[] =
      (await PromotionPage_Request(param)).data.records || [];

    if (list.length > 0) {
      if (isReset) {
        setPromotionPage(() => 2);
        setPromotionList(list);
        setPromotionHasHore(true);
      } else {
        if (JSON.stringify(list) !== JSON.stringify(promotionList)) {
          setPromotionPage((prev) => prev + 1);
          setPromotionList([...promotionList, ...list]);
          setPromotionHasHore(true);
        } else {
          setPromotionHasHore(false);
        }
      }
    } else {
      setPromotionHasHore(false);
    }
  };

  const PromotionScrollContent = ({ hasMore }: { hasMore?: boolean }) => {
    return (
      <>
        {hasMore ? (
          <div className="dot-loading-custom">
            <span>加载中</span>
            <DotLoading color="#fff" />
            <Skeleton.Title animated />
            <Skeleton.Paragraph lineCount={8} animated />
          </div>
        ) : (
          <div className="infinite-scroll-footer">
            <span >--- 我是有底线的 ---</span>
          </div>
        )}
      </>
    );
  };

  return (
    <>
      <InfiniteScroll
        loadMore={() => promotionPageRequest(false)}
        hasMore={promotionHasHore}
        threshold={50}
      >
        <div className="card-container">
          <PullToRefresh onRefresh={() => promotionPageRequest(true)}>
            {promotionList?.map((promotion, index) => (
              <Card className="promotion-custom-card-container" key={index} onClick={() => {
                showPopupInfo(
                  promotion.id,
                  promotion.area,
                  promotion.content,
                  promotion.viewCount,
                  promotion.commentsCount,
                  promotion.imagePath,
                  promotion.videoPath,
                  promotion.createTime,
                  promotion.contact,
                  promotion.isTop,
                  promotion.type,
                  promotion.title,
                  promotion.price
                );
              }}>

                <div className="promotion-container">
                  <div className="promotion-left">
                    {promotion.videoCover && (
                      <video
                        className="promotion-news-video"
                        src="/1.mp4"
                        controls
                        poster={promotion.videoCover}
                      />
                    )}

                    {promotion.imagePath && (<Image
                      className="promotion-news-image"
                      src={promotion.imagePath}
                      alt="Example"
                      fit="contain"
                    />)
                    }
                  </div>
                  <div className="promotion-right">
                    <div className="promotion-item">
                      <Ellipsis style={{ fontWeight: 'bold', letterSpacing: '1px' }} direction="end" rows={2} content={promotion.title} />
                    </div>
                    <div className="promotion-item">
                      <span>类型: {promotion?.type ? PromotionTypeEnum(promotion?.type) : ""}</span>

                      <span><LocationFill /> {promotion.area}</span>
                    </div>
                    {
                      promotion.price && <div className="promotion-item">价格:  <span style={{ marginLeft: '3px' }}> {promotion?.price}</span></div>
                    }

                    <div className="promotion-item">
                      <span>发布:
                        <span className="promotion-time">
                          {promotion?.createTime &&
                            dayjs(promotion?.createTime).format("YYYY-MM-DD")}
                        </span>
                      </span>
                    </div>

                    <div className="promotion-item">
                      {promotion.isTop &&
                        <span>
                          {
                            <Tag className="promotion-tag" color="#a05d29">
                              置顶
                            </Tag>
                          }
                        </span>
                      }
                      <span><FcReading fontSize={17} /> {promotion.viewCount}</span>
                      <span><MessageOutline fontSize={17} style={{ marginLeft: 6 }} /> {promotion.commentsCount}</span>

                    </div>

                  </div>
                </div>
              </Card>
            ))}
          </PullToRefresh>


          <PromotionScrollContent hasMore={promotionHasHore} />

        </div>
      </InfiniteScroll>
      <Popup
        className="news-record-popup"
        bodyStyle={{
          display: "flex",
          flexDirection: "column",
          overflowY: "auto",
          width: "100%",
          height: "100%"
        }}
        position="right"
        closeOnSwipe={true}
        closeOnMaskClick
        visible={visibleCloseRight}
        onClose={() => {
          setVisibleCloseRight(false);
        }}
      >
        <div className="popup-scrollable-content">
          <PromotionInfo
            commentRef={null}
            id={popupInfo.id}
            setVisibleCloseRight={setVisibleCloseRight}
            needCommentPoint={false}
            commentPointId={null}
          />
        </div>
      </Popup>
    </>
  );
};

export default Promotion;
