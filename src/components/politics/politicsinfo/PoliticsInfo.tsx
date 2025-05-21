
import { useState, useEffect } from "react";
import { PoliticsType } from "@/components/politics/api";
import { Image, Card, Divider, Tag, Toast } from 'antd-mobile';
import { FcLike, FcReading } from "react-icons/fc";
import { LeftOutline, MessageOutline, LocationFill, HeartOutline } from 'antd-mobile-icons';
import Comment from "@/components/comment/Comment";
import { Request_IncreaseLikesCount } from '@/components/news/newsinfo/api';
import { PoliticsFind_Requset, PoliticsFindReqType } from '@/components/politics/api';

import dayjs from 'dayjs'

type PoliticsProps = {
  needCommentPoint?: boolean;
  commentPointId?: string | null;
  setVisibleCloseRight?: any;
  id: string;
}

const PoliticsInfo: React.FC<PoliticsProps & { commentRef: any }> = (props) => {
  const [politics, setPolitics] = useState<PoliticsType>();
  const [likesIdList, setLikesIdList] = useState<string[]>([]);

  useEffect(() => {
    if (props.id) {
      PoliticsFindRequest();
    }
  }, [props.id]);

  const PoliticsFindRequest = async () => {
    const param: PoliticsFindReqType = { id: props.id };
    const data: PoliticsType = (await PoliticsFind_Requset(param)).data;
    setPolitics(data);
  }

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

  //点赞
  const clickLikes = async (id: string) => {
    if (likesIdList.includes(id)) {
      Toast.show({
        content: '已点赞',
        duration: 600,
      })
      return;
    } else {
      setLikesIdList((prev) => [...prev, id])
    }

    const param = { id: id, infoType: 3 }
    console.log('Request param:', param);
    JSON.stringify(param); // 这一步如果报错，说明有问题
    const resp = await Request_IncreaseLikesCount(param);

    if (resp.code === 0) {
      if (resp.data.value) {
        Toast.show({
          icon: <HeartOutline />,
          content: '点赞 +1',
          duration: 600,
        })
      } else {
        Toast.show({
          content: '已点赞',
          duration: 600,
        })
        return;
      }


      if (resp.data.value) {
        setPolitics((prev) => {
          if (!prev) return prev;
          return { ...prev, likesCount: (prev.likesCount || 0) + 1 }
        })
      }
    } else {
      Toast.show({
        content: '网络异常,请稍后重试',
        duration: 600,
      })
    }
  }

  return (
    <>
      <div onClick={() => props.setVisibleCloseRight(false)} ><span style={{ paddingRight: '5px', color: 'gray', fontSize: '16px' }} ><LeftOutline fontSize={18} />返回 </span><span style={{ color: 'black', fontSize: '16px', letterSpacing: '2px' }}> 国际政治 </span></div>

      <Card className="politics-custom-card-container">
        <div className="politics-card-content">
          <div className="politics-title">
            {politics?.title || ''}
          </div>
          <div className="politics-image-container">
            {politics?.imagePath && <Image
              className="politics-image"
              src={politics.imagePath}
              alt="Example"
              fit="contain"
            />}
          </div>
          <Divider className='divider-line' />
          <div className="politics-text-area">

            {splitBySentenceLength(politics?.content || '').map((paragraph, index) => (
              <p key={index} style={{ marginTop: '5px', marginBottom: '1px', lineHeight: '1.5' }}>
                {paragraph}
              </p>
            ))}
          </div>

          <div className="politics-meta">
            <span className="politics-tag">
              {politics?.newsStatus == 2 && <Tag className="tag-size" color='#a05d29'>置顶</Tag>}
              {politics?.newsStatus == 3 && <Tag className="tag-size" color='red' fill='outline'>热门</Tag>}
            </span>

            {politics?.source &&
              <span className="politics-tag" > 来源:
                <span className="source">
                  <span className="tracking">
                    <LocationFill className="area" /> {politics?.country || ''}
                  </span>
                  <span className="source-inner">
                    {politics?.source || ''}
                  </span>

                </span>
                <span className="politics-time">
                  {politics?.createTime && dayjs(politics?.createTime).format('YYYY-MM-DD HH:mm')}
                </span>
              </span>
            }
          </div>

          {/*           <Divider className='divider-line' /> */}

          <div className="button-info-inner">
            <span className="tracking">
              <span className="icon-and-text">
                <FcReading fontSize={17} />
                <span className="number">{politics?.viewCount || 0} </span>
              </span>
            </span>

            <span className="tracking">
              <span className="icon-and-text">
                <FcLike className='attribute-icon' fontSize={15} onClick={() => { clickLikes(props.id) }} />
                <span className="number"> {politics?.likesCount || 0} </span>
              </span>
            </span>

            <span className="tracking">
              <span className="icon-and-text">
                <MessageOutline fontSize={17} />
                <span className="number"> {politics?.commentsCount || 0} </span>
              </span>
            </span>
          </div>

          <Comment setPolitics={setPolitics} newsId={props.id} newsType={3} needCommentPoint={props.needCommentPoint} commentPointId={props.commentPointId} />
        </div>
      </Card>

    </>
  );
}

export default PoliticsInfo;