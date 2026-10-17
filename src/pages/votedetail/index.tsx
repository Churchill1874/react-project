import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, DotLoading, Image, ImageViewer, Skeleton, Tag } from 'antd-mobile';
import { LeftOutline, MessageOutline } from 'antd-mobile-icons';
import { FcReading } from 'react-icons/fc';
import { Helmet } from 'react-helmet-async';
import dayjs from 'dayjs';
import Comment from '@/components/comment/Comment';
import VoteBoard from '@/components/vote/VoteBoard';
import { VoteFind_Request, VoteType, remainText } from '@/components/vote/api';
import { getImgUrl } from '@/utils/commentUtils';
import '@/components/vote/Vote.less';

// 投票详情页 /vote/:id
const VoteDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [vote, setVote] = useState<VoteType | null>(null);
  const [coverVisible, setCoverVisible] = useState(false);
  const [notFound, setNotFound] = useState(false);

  const fetchDetail = async () => {
    if (!id) return;
    try {
      const resp = await VoteFind_Request({ id });
      if (resp?.data) {
        setVote({ ...resp.data, viewCount: (resp.data.viewCount || 0) + 1 });
      } else {
        setNotFound(true);
      }
    } catch (e) {
      setNotFound(true);
    }
  };

  useEffect(() => {
    setVote(null);
    setNotFound(false);
    fetchDetail();
  }, [id]);

  // 投票成功后用最新票数刷新，保留本地的浏览数和评论数
  const handleVoted = (latest: VoteType) => {
    setVote((prev) => (prev ? { ...latest, viewCount: prev.viewCount, commentsCount: prev.commentsCount } : latest));
  };

  // ===== SEO =====
  const pageUrl = `https://grayasia.com/vote/${id}`;
  const optionText = vote?.options?.map((o) => o.content).join('、') || '';
  const desc = (
    (vote?.description || '').replace(/\s+/g, ' ').trim() ||
    `${vote?.title || ''}，选项：${optionText}`
  ).slice(0, 150);
  const coverUrl = vote?.coverImagePath
    ? getImgUrl(vote.coverImagePath)
    : 'https://grayasia.com/assets/logo/logo1.png';
  const toIso = (t?: string) => (t ? dayjs(t).format('YYYY-MM-DDTHH:mm:ssZ') : undefined);
  // 结构化数据：Article（Google 收录标题、发布时间、图片、正文），正文里带上选项和票数
  const jsonLd = vote
    ? {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: vote.title.slice(0, 110),
        description: desc,
        image: [coverUrl],
        datePublished: toIso(vote.createTime),
        dateModified: toIso(vote.createTime),
        mainEntityOfPage: pageUrl,
        author: { '@type': 'Organization', name: '灰亚新闻', url: 'https://grayasia.com' },
        publisher: {
          '@type': 'Organization',
          name: '灰亚新闻',
          logo: { '@type': 'ImageObject', url: 'https://grayasia.com/assets/logo/logo1.png' },
        },
        articleBody: [
          vote.description || '',
          `投票选项：${vote.options.map((o) => `${o.content}（${o.voteCount || 0}票）`).join('，')}`,
          `共 ${vote.voterCount} 人参与，统计截止 ${dayjs(vote.deadline).format('YYYY-MM-DD HH:mm')}`,
        ]
          .filter(Boolean)
          .join('\n'),
        interactionStatistic: [
          { '@type': 'InteractionCounter', interactionType: 'https://schema.org/CommentAction', userInteractionCount: vote.commentsCount || 0 },
          { '@type': 'InteractionCounter', interactionType: 'https://schema.org/ViewAction', userInteractionCount: vote.viewCount || 0 },
        ],
      }
    : null;

  return (
    <div style={{ height: '100vh', overflowY: 'auto', overflowX: 'hidden', padding: '0px 5px', boxSizing: 'border-box' }}>
      {/* 顶部返回栏 */}
      <div onClick={() => navigate(-1)} style={{ padding: '10px 12px', display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
        <span style={{ paddingRight: '5px', color: 'gray', fontSize: '16px' }}>
          <LeftOutline fontSize={18} />
          返回
        </span>
        <span style={{ color: 'black', fontSize: '16px', fontWeight: 'bold' }}>投票</span>
      </div>

      {!vote && !notFound && (
        <div style={{ padding: '12px' }}>
          <DotLoading color="primary" />
          <Skeleton.Title animated />
          <Skeleton.Paragraph lineCount={10} animated />
        </div>
      )}

      {notFound && (
        <>
          <Helmet>
            <title>投票不存在 - 灰亚新闻</title>
            <meta name="robots" content="noindex" />
            {/* Rendertron 识别这个标签，给爬虫返回 404 状态码 */}
            <meta name="render:status_code" content="404" />
          </Helmet>
          <div style={{ padding: 40, textAlign: 'center', color: '#999' }}>投票不存在或已下架</div>
        </>
      )}

      {vote && (
        <>
          <Helmet>
            <title>{`${vote.title} - 投票 | 灰亚新闻`}</title>
            <meta name="description" content={desc} />
            <meta name="keywords" content={`${vote.title},投票,${optionText},灰亚新闻`} />
            <meta name="robots" content="index,follow,max-image-preview:large" />
            <link rel="canonical" href={pageUrl} />
            <meta property="og:type" content="article" />
            <meta property="og:url" content={pageUrl} />
            <meta property="og:site_name" content="灰亚新闻" />
            <meta property="og:title" content={vote.title} />
            <meta property="og:description" content={desc} />
            <meta property="og:image" content={coverUrl} />
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={vote.title} />
            <meta name="twitter:description" content={desc} />
            <meta name="twitter:image" content={coverUrl} />
            <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
          </Helmet>

          <Card className="vote-detail-card">
            <h1 className="vote-detail-title">{vote.title}</h1>

            <div className="vote-detail-meta">
              <span className={`vote-status-tag ${vote.ended ? 'ended' : 'going'}`}>{vote.ended ? '已截止' : '进行中'}</span>
              {vote.isTop && <Tag color="#a05d29">置顶</Tag>}
              <span>统计截止：{dayjs(vote.deadline).format('YYYY-MM-DD HH:mm')}</span>
              {!vote.ended && <span style={{ color: '#fa8c16' }}>{remainText(vote.deadline)}</span>}
            </div>

            {vote.coverImagePath && (
              <div className="vote-detail-cover">
                <Image src={getImgUrl(vote.coverImagePath)} alt={vote.title} fit="contain" onClick={() => setCoverVisible(true)} />
                <ImageViewer image={getImgUrl(vote.coverImagePath)} visible={coverVisible} onClose={() => setCoverVisible(false)} />
              </div>
            )}

            {vote.description && (
              <div className="vote-detail-desc">
                <h2 className="vote-detail-desc-title">事件简介</h2>
                {vote.description}
              </div>
            )}

            <div className="vote-detail-stats">
              <span>共 {vote.voterCount} 人参与</span>
              <span>发布于 {dayjs(vote.createTime).format('YYYY-MM-DD')}</span>
            </div>

            <VoteBoard vote={vote} onVoted={handleVoted} />

            <div className="topic-button-info-inner" style={{ display: 'flex', gap: 16, margin: '14px 0 4px', fontSize: 13, color: '#666' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <FcReading fontSize={17} />
                {vote.viewCount}
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <MessageOutline fontSize={17} />共 {vote.commentsCount} 条评论
              </span>
            </div>

            <Comment needCommentPoint={false} commentPointId={null} setVote={setVote} newsId={id} newsType={10} ref={null} />
          </Card>
        </>
      )}
    </div>
  );
};

export default VoteDetail;
