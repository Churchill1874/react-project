import { Link } from 'react-router-dom';
import { Ellipsis, Image } from 'antd-mobile';
import dayjs from 'dayjs';
import { FcReading } from 'react-icons/fc';
import { MessageOutline } from 'antd-mobile-icons';
import { VoteType, votePercent, remainText } from '@/components/vote/api';
import { getImgUrl } from '@/utils/commentUtils';
import '@/components/vote/Vote.less';

type Props = {
  vote: VoteType;
  maxOptions?: number; // 卡片上最多展示几个选项
  onClick?: () => void;
};

// 投票列表卡片：封面 + 标题 + 前几个选项的票数条
const VoteListCard: React.FC<Props> = ({ vote, maxOptions = 3, onClick }) => {
  const shown = vote.options.slice(0, maxOptions);
  const restCount = vote.options.length - shown.length;
  // 只要有一个选项带图，所有选项都留出图片位置，保证文字对齐
  const hasOptionImage = shown.some((o) => !!o.imagePath);

  return (
    <Link to={`/vote/${vote.id}`} className="vote-list-card" onClick={onClick}>
      <div className="vote-list-head">
        {vote.coverImagePath && (
          <div className="vote-list-cover">
            <Image src={getImgUrl(vote.coverImagePath)} fit="cover" width="100%" height="100%" />
          </div>
        )}
        <div className="vote-list-main">
          <div className="vote-list-title">
            <Ellipsis direction="end" rows={2} content={vote.title} />
          </div>
          <div className="vote-list-meta">
            <span className={`vote-status-tag ${vote.ended ? 'ended' : 'going'}`}>{vote.ended ? '已截止' : '进行中'}</span>
            {vote.isTop && <span style={{ color: '#a05d29' }}>置顶</span>}
            <span>{vote.voterCount} 人参与</span>
            {!vote.ended && <span style={{ color: '#fa8c16' }}>{remainText(vote.deadline)}</span>}
          </div>
        </div>
      </div>

      <div className="vote-list-options">
        {shown.map((o) => {
          const percent = votePercent(o.voteCount, vote.voterCount);
          return (
            <div className={`vote-mini-option ${hasOptionImage ? 'with-image' : ''}`} key={o.id}>
              <div className="vote-mini-bar" style={{ width: `${Math.min(percent, 100)}%` }} />
              <div className="vote-mini-text">
                <span className="vote-mini-label">
                  {hasOptionImage &&
                    (o.imagePath ? (
                      <img className="vote-mini-thumb" src={getImgUrl(o.imagePath)} alt="" loading="lazy" />
                    ) : (
                      <span className="vote-mini-thumb vote-mini-thumb-empty" />
                    ))}
                  <span className="vote-mini-name">{o.content}</span>
                </span>
                <span className="vote-mini-percent">{percent}%</span>
              </div>
            </div>
          );
        })}
        <div className="vote-list-more">
          {restCount > 0 && <span className="vote-list-rest">另有 {restCount} 个选项未显示</span>}
          <span>{vote.ended ? '查看结果 ›' : '去投票 ›'}</span>
        </div>
      </div>

      {/* 底部信息：创建时间 / 截止时间 / 浏览 / 评论 */}
      <div className="vote-list-footer">
        <div className="vote-list-times">
          <span>发布 {dayjs(vote.createTime).format('YYYY-MM-DD HH:mm')}</span>
          <span>截止 {dayjs(vote.deadline).format('YYYY-MM-DD HH:mm')}</span>
        </div>
        <div className="vote-list-counts">
          <span className="vote-list-count">
            <FcReading fontSize={15} />
            {vote.viewCount || 0}
          </span>
          <span className="vote-list-count">
            <MessageOutline fontSize={15} />
            {vote.commentsCount || 0}
          </span>
        </div>
      </div>
    </Link>
  );
};

export default VoteListCard;
