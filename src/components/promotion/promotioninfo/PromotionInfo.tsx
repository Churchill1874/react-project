import { useState, useEffect } from "react";
import { Card, Divider, Tag, Image, ImageViewer, Swiper, Skeleton, DotLoading } from 'antd-mobile';
import Comment from '@/components/comment/Comment';
import { FcReading } from "react-icons/fc";
import { LeftOutline, LocationFill } from 'antd-mobile-icons';
import '@/components/promotion/Promotion.less';
import { PromotionType, PromotionFindReqType, PromotionFind_Requset } from '@/components/promotion/api'
import dayjs from 'dayjs'
import { PromotionTypeEnum } from "@/common/PromotionTypeEnum";


type CommentAttributeType = {
  needCommentPoint?: boolean;
  commentPointId?: string | null;
}
type PromotionPropsType = CommentAttributeType & {
  needCommentPoint?: boolean;
  commentPointId?: string | null;
  setVisibleCloseRight?: any;
  id: string;
}


const PromotionInfo: React.FC<PromotionPropsType & { commentRef: any }> = (props) => {
  const [promotion, setPromotion] = useState<PromotionType | null>();
  const [visible, setVisible] = useState(false)

  function splitBySentenceLength(text: string, maxChars = 200): string[] {
    const sentences = text.split(/(。)/); // 以句号 `。` 分割，同时保留句号
    const result: string[] = []; // 确保 result 是 string 数组
    let currentParagraph: string = '';

    for (let i = 0; i < sentences.length; i++) {
      currentParagraph += sentences[i] || ''; // 处理分割后的空元素

      // 遇到 `。` 并且当前段落字数超过 `maxChars`，就另起一行
      if (sentences[i] === '。' && currentParagraph.length >= maxChars) {
        result.push(currentParagraph);
        currentParagraph = ''; // 清空，准备下一段
      }
    }

    // 处理剩余的文本
    if (currentParagraph.trim()) {
      result.push(currentParagraph);
    }
    return result;
  }

  const promotionFindRequest = async () => {
    const param: PromotionFindReqType = { id: props.id }
    const data: PromotionType = (await PromotionFind_Requset(param)).data;
    setPromotion(data);
  }


  const getImages = (): string[] => {
    return (promotion?.imagePath ? promotion.imagePath.split('||') : [])
      .filter((src): src is string => typeof src === 'string' && src.trim() !== '');
  };


  useEffect(() => {
    if (props.id) {
      setPromotion(null)
      promotionFindRequest();
    }

  }, [props.id]);

  return (
    <>
      {promotion &&
        <>
          <ImageViewer.Multi classNames={{ mask: 'customize-mask', body: 'customize-body', }} images={getImages()} visible={visible} onClose={() => { setVisible(false) }} />

          <div onClick={() => props.setVisibleCloseRight(false)} >
            <span style={{ paddingRight: '5px', color: 'gray', fontSize: '16px' }} >
              <LeftOutline fontSize={18} />返回 </span>
            <span style={{ color: 'black', fontSize: '16px', letterSpacing: '1px' }}>
              帮推广信息
            </span>
          </div>

          <Card className="promotion-custom-card-container">

            <div className="promotion-title">
              {promotion?.title}
            </div>

            <div className="promotion-time">
              {<span className="promotion-time">{dayjs(promotion?.createTime).format('YYYY-MM-DD HH:mm')}</span>}
            </div>



            <div className="promotion-card-content">
              {promotion?.videoCover &&
                <div className="promotion-news-image-container">
                  <video className="promotion-news-video-inner" src="/1.mp4" controls poster={promotion.videoCover} />
                </div>
              }

              {!promotion?.videoCover && promotion?.imagePath && (
                <div className="promotion-news-image-container">
                  <Swiper loop autoplay allowTouchMove>
                    <Swiper.Item className="swiper-item" key="photoPath">
                      <Image
                        className="promotion-news-image"
                        src={promotion.imagePath}
                        alt="Example"
                        fit="contain"
                      />
                    </Swiper.Item>
                  </Swiper>
                </div>
              )}

              <div className="promotion-contact">
                类型: <span className="promotion-type">  {promotion?.type ? PromotionTypeEnum(promotion?.type) : ''} </span>
                {
                  promotion?.price && (
                    <>
                      <Divider className='promotion-divider-line' direction="vertical" />
                      <span className="promotion-type"> 价格:  {promotion?.price}</span>
                    </>
                  )
                }
              </div>

              <div className="promotion-text-area">
                {splitBySentenceLength((promotion?.content || '')).map((paragraph, index) => (
                  <p key={index} style={{ marginTop: '5px', marginBottom: '1px', lineHeight: '1.5' }}>
                    {paragraph}
                  </p>
                ))}
              </div>

              <div className="promotion-contact">
                {promotion?.isTop && <Tag className="promotion-tag" color='#a05d29'>置顶</Tag>}
                {/* {promotion?.source && <span className="promotion-tag" > 来源: <span className="source"> {promotion?.source} </span></span>} */}
                {<span className="promotion-tag" > 联系方式： <span className="source">{promotion?.contact} </span></span>}


              </div>


              <div className="promotion-button-info-inner">
                <span className="tracking">
                  <span className="city"><LocationFill className="area" />{promotion?.area}</span>
                </span>

                <span className="tracking">
                  <span className="icon-and-text">
                    <FcReading fontSize={17} />
                    <span className="number">{promotion?.viewCount}</span>
                  </span>
                </span>

                <span className="tracking">
                  <Divider className='line'> 共 {promotion?.commentsCount} 条评论 </Divider>
                </span>
              </div>

              <Comment
                needCommentPoint={props.needCommentPoint}
                commentPointId={props.commentPointId}
                setPromotion={setPromotion}
                newsId={props.id}
                newsType={5}
                ref={props.commentRef}
              />
            </div>
          </Card>
        </>
      }

      {
        !promotion &&
        <>
          <DotLoading color='primary' />
          <Skeleton.Title animated />
          <Skeleton.Paragraph lineCount={12} animated />
        </>
      }
    </>

  );

}

export default PromotionInfo;