import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Card, Tag, Image, ImageViewer, Skeleton, DotLoading } from 'antd-mobile';
import { LeftOutline } from 'antd-mobile-icons';
import { FcReading } from 'react-icons/fc';
import { MessageOutline } from 'antd-mobile-icons';
import Comment from '@/components/comment/Comment';
import { TopicType, TopicFindReqType, TopicFind_Requset } from '@/components/topic/api';
import { getImgUrl } from '@/utils/commentUtils';
import dayjs from 'dayjs';
import '@/components/topic/Topic.less';
import useStore from '@/zustand/store';

const TopicDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [topic, setTopic] = useState<TopicType | null>(null);
  const [visible, setVisible] = useState(false);

  const getImages = (): string[] => {
    return (topic?.imagePath ? topic.imagePath.split('||') : [])
      .filter((src): src is string => typeof src === 'string' && src.trim() !== '')
      .map(src => getImgUrl(src));
  };

  function splitBySentenceLength(text: string, maxChars = 200): string[] {
    const sentences = text.split(/(。)/);
    const result: string[] = [];
    let currentParagraph = '';
    for (let i = 0; i < sentences.length; i++) {
      currentParagraph += sentences[i] || '';
      if (sentences[i] === '。' && currentParagraph.length >= maxChars) {
        result.push(currentParagraph);
        currentParagraph = '';
      }
    }
    if (currentParagraph.trim()) result.push(currentParagraph);
    return result;
  }

  const fetchDetail = async () => {
    if (!id) return;
    const param: TopicFindReqType = { id };
    const resp = await TopicFind_Requset(param);
    if (resp?.data) {

      document.title = `${resp.data.title} - 灰亚新闻`;
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) {
        metaDesc.setAttribute('content', resp.data.content?.slice(0, 120) || resp.data.title);
      }

      setTopic({ ...resp.data, viewCount: (resp.data.viewCount || 0) + 1 });

      // 同步列表缓存浏览量 +1
      const { getNewsListCache, setNewsListCache } = useStore.getState();
      const cache = getNewsListCache('topic');
      if (cache) {
        const newData = cache.data.map((item: any) =>
          String(item.id) === String(id)
            ? { ...item, viewCount: (item.viewCount || 0) + 1 }
            : item
        );
        setNewsListCache('topic', newData, cache.page, cache.hasMore);
      }
    }
  };

  useEffect(() => {
    setTopic(null);
    fetchDetail();
    return () => {
      document.title = '灰亚新闻';
    };
  }, [id]);

  return (
    <div style={{ height: '100vh', overflowY: 'auto', overflowX: 'hidden', padding: '0px 5px', boxSizing: 'border-box' }}>
      {/* 顶部返回栏 */}
      <div
        onClick={() => navigate(-1)}
        style={{ padding: '10px 12px', display: 'flex', alignItems: 'center', cursor: 'pointer' }}
      >
        <span style={{ paddingRight: '5px', color: 'gray', fontSize: '16px' }}>
          <LeftOutline fontSize={18} />返回
        </span>
        <span style={{ color: 'black', fontSize: '16px', fontWeight: 'bold' }}>话题</span>
      </div>

      {/* 骨架屏 */}
      {!topic && (
        <div style={{ padding: '12px' }}>
          <DotLoading color='primary' />
          <Skeleton.Title animated />
          <Skeleton.Paragraph lineCount={12} animated />
        </div>
      )}

      {/* 详情内容 */}
      {topic && (
        <>
          <ImageViewer.Multi
            classNames={{ mask: 'customize-mask', body: 'customize-body' }}
            images={getImages()}
            visible={visible}
            onClose={() => setVisible(false)}
          />

          <Card className="topic-custom-card-container">
            <div className="topic-title">{topic.title}</div>

            <div className="topic-card-content">
              {topic.videoCover && (
                <div className="topic-news-image-container">
                  <video
                    className="topic-news-video"
                    src={topic.videoPath}
                    controls
                    poster={getImgUrl(topic.videoCover)}
                  />
                </div>
              )}
              {!topic.videoCover && topic.imagePath && (
                <div className="topic-news-image-container">
                  <Image
                    className="topic-news-image"
                    src={getImgUrl(topic.imagePath)}
                    alt="图片"
                    fit="contain"
                    onClick={() => setVisible(true)}
                  />
                </div>
              )}

              <div className="topic-text-area">
                {splitBySentenceLength(topic.content || '').map((paragraph, index) => (
                  <p key={index} style={{ marginTop: '5px', marginBottom: '1px', lineHeight: '1.5' }}>
                    {paragraph}
                  </p>
                ))}
              </div>

              <span className="topic-time">
                {topic.isTop && <Tag className="topic-tag" color='#a05d29'>置顶</Tag>}
                {topic.isHot && <Tag className="topic-tag" color='red' fill='outline'>热门</Tag>}
                {<span className="topic-tag">类型: <span className="source">{topic.type}</span></span>}
                {topic.createTime && dayjs(topic.createTime).format('YYYY-MM-DD HH:mm')}
              </span>

              <div className="topic-button-info-inner">
                <span className="icon-and-text">
                  <FcReading fontSize={17} />
                  <span className="number">{topic.viewCount}</span>
                </span>
                <span className="icon-and-text">
                  <MessageOutline fontSize={17} />
                  <span className="number">共 {topic.commentsCount} 条评论</span>
                </span>
              </div>

              <Comment
                needCommentPoint={false}
                commentPointId={null}
                setTopic={setTopic}
                newsId={id}
                newsType={6}
                ref={null}
              />
            </div>
          </Card>
        </>
      )}
    </div>
  );
};

export default TopicDetail;