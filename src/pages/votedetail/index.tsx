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

  const desc = vote?.description?.slice(0, 120).replace(/\s+/g, ' ') || vote?.title || '';

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

      {notFound && <div style={{ padding: 40, textAlign: 'center', color: '#999' }}>投票不存在或已下架</div>}

      {vote && (
        <>
          <Helmet>
            <title>{vote.title} - 灰亚新闻</title>
            <meta name="description" content={desc} />
            <meta property="og:title" content={vote.title} />
            <meta property="og:description" content={desc} />
            {vote.coverImagePath && <meta property="og:image" content={getImgUrl(vote.coverImagePath)} />}
          </Helmet>

          <Card className="vote-detail-card">
            <div className="vote-detail-title">{vote.title}</div>

            <div className="vote-detail-meta">
              <span className={`vote-status-tag ${vote.ended ? 'ended' : 'going'}`}>{vote.ended ? '已截止' : '进行中'}</span>
              {vote.isTop && <Tag color="#a05d29">置顶</Tag>}
              <span>统计截止：{dayjs(vote.deadline).format('YYYY-MM-DD HH:mm')}</span>
              {!vote.ended && <span style={{ color: '#fa8c16' }}>{remainText(vote.deadline)}</span>}
            </div>

            {vote.coverImagePath && (
              <div className="vote-detail-cover">
                <Image src={getImgUrl(vote.coverImagePath)} fit="contain" onClick={() => setCoverVisible(true)} />
                <ImageViewer image={getImgUrl(vote.coverImagePath)} visible={coverVisible} onClose={() => setCoverVisible(false)} />
              </div>
            )}

            {vote.description && (
              <div className="vote-detail-desc">
                <div className="vote-detail-desc-title">事件简介</div>
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
