import { useState, useEffect } from "react";
import { Card, Divider, Tag, Image } from 'antd-mobile';
import Comment from '@/components/comment/Comment';
import { FcReading } from "react-icons/fc";
import { LeftOutline, LocationFill } from 'antd-mobile-icons';
import '@/components/southeastasia/SoutheastAsia.less'
import { SoutheastAsiaNewsType, SoutheastAsiaFindReqType, SoutheastAsiaFind_Requset } from '@/components/southeastasia/api'
import dayjs from 'dayjs'

type CommentAttributeType = {
  needCommentPoint?: boolean;
  commentPointId?: string | null;
}
type SoutheastAsiaPropsType = CommentAttributeType & {
  needCommentPoint?: boolean;
  commentPointId?: string | null;
  setVisibleCloseRight?: any;
  id: string;
}


const SoutheastAsiaInfo: React.FC<SoutheastAsiaPropsType & { commentRef: any }> = (props) => {
  const [southeastAsia, setSoutheastAsia] = useState<SoutheastAsiaNewsType>();

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

  const southeastAsiaFindRequest = async () => {
    const param: SoutheastAsiaFindReqType = { id: props.id }
    const data: SoutheastAsiaNewsType = (await SoutheastAsiaFind_Requset(param)).data;
    setSoutheastAsia(data);
  }

  useEffect(() => {
    if (props.id) {
      southeastAsiaFindRequest();
    }

  }, [props.id]);

  return (
    <>
      <div onClick={() => props.setVisibleCloseRight(false)} ><span style={{ paddingRight: '5px', color: 'gray', fontSize: '16px' }} ><LeftOutline fontSize={18} />返回 </span><span style={{ color: 'black', fontSize: '16px' }}>东南亚新闻</span></div>

      <Card className="southeastasia-custom-card-container">
        <div className="southeastasia-card-content">
          <div className="southeastasia-news-image-container">
            {southeastAsia?.imagePath && <Image
              className="southeastasia-news-image"
              src={southeastAsia?.imagePath}
              alt="Example"
              fit="contain"
            />}

          </div>

          <div className="southeast-asia-title">
            {southeastAsia?.title}
          </div>

          <div className="southeast-asia-text-area">
            {splitBySentenceLength((southeastAsia?.content || '')).map((paragraph, index) => (
              <p key={index} style={{ marginTop: '5px', marginBottom: '1px', lineHeight: '1.5' }}>
                {paragraph}
              </p>
            ))}
          </div>

          <span className="southeastasia-time">
            <span>
              {southeastAsia?.isTop && <Tag className="southeastasia-tag" color='#a05d29'>置顶</Tag>}
              {southeastAsia?.isHot && <Tag className="southeastasia-tag" color='red' fill='outline'>热门</Tag>}
              {southeastAsia?.source && <span className="southeastasia-tag" > 来源: <span className="source"> {southeastAsia?.source} </span></span>}
              {southeastAsia?.createTime && dayjs(southeastAsia?.createTime).format('YYYY-MM-DD HH:mm')}
            </span>
          </span>

          <Divider className='divider-line' />

          <div className="button-info">
            <span className="tracking">
              <span className="city"><LocationFill className="area" />{southeastAsia?.area}</span>
            </span>

            <span className="tracking">
              <span className="icon-and-text">
                <FcReading fontSize={17} />
                <span className="number">{southeastAsia?.viewCount}</span>
              </span>
            </span>

            <span className="tracking">
              <Divider className='line'> 共 {southeastAsia?.commentsCount} 条评论 </Divider>
            </span>
          </div>
          <Comment needCommentPoint={props.needCommentPoint} commentPointId={props.commentPointId} setSoutheastAsiaNews={setSoutheastAsia} newsId={props.id} newsType={2} />
        </div>
      </Card>

    </>

  );

}

export default SoutheastAsiaInfo;