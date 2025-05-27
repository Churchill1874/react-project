import { useState, useEffect } from "react";
import { Card, Divider, Tag, Image, Skeleton, DotLoading } from 'antd-mobile';
import Comment from '@/components/comment/Comment';
import { FcReading } from "react-icons/fc";
import { LeftOutline, LocationFill } from 'antd-mobile-icons';
import '@/components/society/Society.less';
import { SocietyType, SocietyFindReqType, SocietyFind_Requset } from '@/components/society/api'
import dayjs from 'dayjs'

type CommentAttributeType = {
  needCommentPoint?: boolean;
  commentPointId?: string | null;
}
type SocietyPropsType = CommentAttributeType & {
  needCommentPoint?: boolean;
  commentPointId?: string | null;
  setVisibleCloseRight?: any;
  id: string;
}


const SocietyInfo: React.FC<SocietyPropsType & { commentRef: any }> = (props) => {
  const [society, setSociety] = useState<SocietyType>();

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

  const societyFindRequest = async () => {
    const param: SocietyFindReqType = { id: props.id }
    const data: SocietyType = (await SocietyFind_Requset(param)).data;
    setSociety(data);
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
          <div onClick={() => props.setVisibleCloseRight(false)} >
            <span style={{ paddingRight: '5px', color: 'gray', fontSize: '16px' }} >
              <LeftOutline fontSize={18} />返回 </span>
            <span style={{ color: 'black', fontSize: '16px', letterSpacing: '1px' }}>
              社会新闻
            </span>
          </div>

          <Card className="society-custom-card-container">

            <div className="society-asia-title">
              {society?.title}
            </div>

            <div className="society-card-content">
              {/*           <div className="society-news-image-container">
            {society?.imagePath && <Image
              className="society-news-image"
              src={society?.imagePath}
              alt="Example"
              fit="contain"
            />}
          </div> */}

              {society?.videoCover &&
                <div className="society-news-image-container">
                  <video className="society-news-video" src="/1.mp4" controls poster={society.videoCover} />
                </div>
              }
              {!society?.videoCover && society?.imagePath &&
                <div className="society-news-image-container">
                  <Image
                    className="society-news-image"
                    src={society.imagePath}
                    alt="Example"
                    fit="contain"
                  />
                </div>
              }

              <div className="society-asia-text-area">
                {splitBySentenceLength((society?.content || '')).map((paragraph, index) => (
                  <p key={index} style={{ marginTop: '5px', marginBottom: '1px', lineHeight: '1.5' }}>
                    {paragraph}
                  </p>
                ))}
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