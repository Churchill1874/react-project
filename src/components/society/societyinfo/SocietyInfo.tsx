import { useState, useEffect } from "react";
import { Card, Divider, Tag, Image, Skeleton, DotLoading } from 'antd-mobile';
import Comment from '@/components/comment/Comment';
import { FcReading } from "react-icons/fc";
import { LeftOutline, LocationFill } from 'antd-mobile-icons';
import { SocietyType, SocietyFindReqType, SocietyFind_Requset } from '@/components/society/api'
import dayjs from 'dayjs'
import '@/components/society/societyinfo/SocietyInfo.less'
import { getImgUrl } from "@/utils/commentUtils";
import { Helmet } from 'react-helmet-async';
import useStore from '@/zustand/store';

type CommentAttributeType = {
  needCommentPoint?: boolean;
  commentPointId?: string | null;
}
type SocietyPropsType = CommentAttributeType & {
  needCommentPoint?: boolean;
  commentPointId?: string | null;
  setVisibleCloseRight?: any;
  id: string;
  showHeader?: boolean; // 新增：控制是否显示返回按钮和标题
}


const SocietyInfo: React.FC<SocietyPropsType & { commentRef: any }> = (props) => {
  const [society, setSociety] = useState<SocietyType>();


  const societyFindRequest = async () => {
    const param: SocietyFindReqType = { id: props.id }
    const data: SocietyType = (await SocietyFind_Requset(param)).data;
    setSociety({ ...data, viewCount: (data.viewCount || 0) + 1 }); // 详情页显示+1

    // 同步列表缓存浏览量 +1
    const { getNewsListCache, setNewsListCache } = useStore.getState();
    const cache = getNewsListCache('society');
    if (cache) {
      const newData = cache.data.map((item: any) =>
        String(item.id) === String(props.id)
          ? { ...item, viewCount: (item.viewCount || 0) + 1 }
          : item
      );
      setNewsListCache('society', newData, cache.page, cache.hasMore);
    }
  }

  useEffect(() => {
    if (props.id) {
      societyFindRequest();
    }

  }, [props.id]);

  return (
    <>
      {society &&
        <>
          <Helmet>
            <title>{society.title} - 灰亚新闻</title>
            <meta name="description" content={society.content?.slice(0, 120).replace(/\s+/g, ' ')} />
            <meta property="og:title" content={society.title} />
            <meta property="og:description" content={society.content?.slice(0, 120).replace(/\s+/g, ' ')} />
            {society.videoCover
              ? <meta property="og:image" content={getImgUrl(society.videoCover)} />
              : society.imagePath && <meta property="og:image" content={getImgUrl(society.imagePath)} />
            }
          </Helmet>

          {props.showHeader !== false && (
            <div onClick={() => props.setVisibleCloseRight(false)} >
              <span style={{ paddingRight: '5px', color: 'gray', fontSize: '16px' }} >
                <LeftOutline fontSize={18} />返回 </span>
              <span style={{ color: 'black', fontWeight: 'bold', fontSize: '16px', letterSpacing: '1px' }}>
                社会新闻
              </span>
            </div>
          )}

          <Card className="society-custom-card-container">

            <div className="society-title">
              {society?.title}
            </div>

            <div className="society-card-content">

              {society?.videoCover &&
                <div className="society-news-image-container">
                  <video className="society-news-video" src={getImgUrl(society.videoPath)} controls poster={getImgUrl(society.videoCover)} />
                </div>
              }
              {!society?.videoCover && society?.imagePath &&
                <div className="society-news-image-container">
                  <Image
                    className="society-news-image"
                    src={getImgUrl(society.imagePath)}
                    alt="Example"
                    fit="contain"
                  />
                </div>
              }
              {/* 
              <div className="society-text-area">
                {splitBySentenceLength((society?.content || '')).map((paragraph, index) => (
                  <p key={index} style={{ marginTop: '5px', marginBottom: '1px', lineHeight: '1.5' }}>
                    {paragraph}
                  </p>
                ))}
              </div> */}

              <div
                className="society-text-area"
                style={{ whiteSpace: 'pre-wrap', lineHeight: '1.5' }}
              >
                {society?.content}
              </div>


              <span className="society-time">
                <span>
                  {society?.isTop && <Tag className="society-tag" color='#a05d29'>置顶</Tag>}
                  {society?.isHot && <Tag className="society-tag" color='red' fill='outline'>热门</Tag>}
                  {/* {society?.source && <span className="society-tag" > 来源: <span className="source"> {society?.source} </span></span>} */}

                  {<span className="society-tag" > 类型: <span className="source">  {society?.videoCover ? '视频' : '图片'} </span></span>}
                  {society?.createTime && dayjs(society?.createTime).format('YYYY-MM-DD HH:mm')}
                </span>
              </span>


              <div className="society-button-info-inner">
                <span className="tracking">
                  <span className="city"><LocationFill className="area" />{society?.area}</span>
                </span>

                <span className="tracking">
                  <span className="icon-and-text">
                    <FcReading fontSize={17} />
                    <span className="number">{society?.viewCount}</span>
                  </span>
                </span>

                <span className="tracking">
                  <Divider className='line'> 共 {society?.commentsCount} 条评论 </Divider>
                </span>
              </div>
              <Comment
                needCommentPoint={props.needCommentPoint}
                commentPointId={props.commentPointId}
                setSociety={setSociety}
                newsId={props.id}
                newsType={4}
                ref={props.commentRef}
              />
            </div>
          </Card>
        </>

      }
      {
        !society &&
        <>
          <DotLoading color='primary' />
          <Skeleton.Title animated />
          <Skeleton.Paragraph lineCount={12} animated />
        </>
      }


    </>

  );

}

export default SocietyInfo;