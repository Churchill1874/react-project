import { useState, useEffect } from "react";
import { Card, ImageViewer, Tag, Image, Skeleton, DotLoading } from 'antd-mobile';
import Comment from '@/components/comment/Comment';
import { FcReading } from "react-icons/fc";
import { LeftOutline } from 'antd-mobile-icons';
import '@/components/topic/Topic.less';
import { TopicType, TopicFindReqType, TopicFind_Requset } from '@/components/topic/api'
import dayjs from 'dayjs'

type CommentAttributeType = {
  needCommentPoint?: boolean;
  commentPointId?: string | null;
}
type TopicPropsType = CommentAttributeType & {
  needCommentPoint?: boolean;
  commentPointId?: string | null;
  setVisibleCloseRight?: any;
  id: string;
}


const TopicInfo: React.FC<TopicPropsType & { commentRef: any }> = (props) => {
  const [topic, setTopic] = useState<TopicType>();
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

  const topicFindRequest = async () => {
    const param: TopicFindReqType = { id: props.id }
    const data: TopicType = (await TopicFind_Requset(param)).data;
    setTopic(data);
  }

  const getImages = (): string[] => {
    return (topic?.imagePath ? topic.imagePath.split('||') : [])
      .filter((src): src is string => typeof src === 'string' && src.trim() !== '');
  };

  useEffect(() => {
    if (props.id) {
      topicFindRequest();
    }

  }, [props.id]);

  return (
    <>


      {topic &&
        <>

          <ImageViewer.Multi classNames={{ mask: 'customize-mask', body: 'customize-body', }} images={getImages()} visible={visible} onClose={() => { setVisible(false) }} />

          <div onClick={() => props.setVisibleCloseRight(false)} >
            <span style={{ paddingRight: '5px', color: 'gray', fontSize: '16px' }} >
              <LeftOutline fontSize={18} />返回 </span>
            <span style={{ color: 'black', fontSize: '16px', letterSpacing: '1px' }}>
              话题
            </span>
          </div>

          <Card className="topic-custom-card-container">

            <div className="topic-title">
              {topic?.title}
            </div>

            <div className="topic-card-content">

              {topic?.videoCover &&
                <div className="topic-news-image-container">
                  <video className="topic-news-video" src="/1.mp4" controls poster={topic.videoCover} />
                </div>
              }
              {!topic?.videoCover && topic?.imagePath &&
                <div className="topic-news-image-container">
                  <Image
                    className="topic-news-image"
                    src={topic.imagePath}
                    alt="Example"
                    fit="contain"
                  />
                </div>
              }

              <div className="topic-text-area">
                {splitBySentenceLength((topic?.content || '')).map((paragraph, index) => (
                  <p key={index} style={{ marginTop: '5px', marginBottom: '1px', lineHeight: '1.5' }}>
                    {paragraph}
                  </p>
                ))}
              </div>

              <span className="topic-time">
                <span>
                  {topic?.isTop && <Tag className="topic-tag" color='#a05d29'>置顶</Tag>}
                  {topic?.isHot && <Tag className="topic-tag" color='red' fill='outline'>热门</Tag>}
                  {/* {topic?.source && <span className="topic-tag" > 来源: <span className="source"> {topic?.source} </span></span>} */}

                  {<span className="topic-tag" > 类型: <span className="source">  {topic?.type} </span></span>}
                  {topic?.createTime && dayjs(topic?.createTime).format('YYYY-MM-DD HH:mm')}
                </span>
              </span>

              <div className="topic-button-info-inner">
                <span className="icon-and-text">
                  <FcReading fontSize={17} />
                  <span className="number">{topic?.viewCount}</span>
                </span>

                <span className="icon-and-text">
                  <span className="number">
                    共 {topic?.commentsCount} 条评论
                  </span>
                </span>
              </div>

              <Comment
                needCommentPoint={props.needCommentPoint}
                commentPointId={props.commentPointId}
                setTopic={setTopic}
                newsId={props.id}
                newsType={6}
                ref={props.commentRef}
              />

            </div>
          </Card>
        </>
      }

      {
        !topic &&
        <>
          <DotLoading color='primary' />
          <Skeleton.Title animated />
          <Skeleton.Paragraph lineCount={12} animated />
        </>
      }
    </>

  );

}

export default TopicInfo;