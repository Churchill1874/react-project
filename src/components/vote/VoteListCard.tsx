import { Link } from 'react-router-dom';
import { Ellipsis, Image } from 'antd-mobile';
import dayjs from 'dayjs';
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
            <span>{vote.ended ? `${dayjs(vote.deadline).format('MM-DD HH:mm')} 截止` : remainText(vote.deadline)}</span>
          </div>
        </div>
      </div>

      <div className="vote-list-options">
        {shown.map((o) => {
          const percent = votePercent(o.voteCount, vote.voterCount);
          return (
            <div className="vote-mini-option" key={o.id}>
              <div className="vote-mini-bar" style={{ width: `${Math.min(percent, 100)}%` }} />
              <div className="vote-mini-text">
                <span>{o.content}</span>
                <span>{percent}%</span>
              </div>
            </div>
          );
        })}
        <div className="vote-list-more">
          {restCount > 0 ? `还有 ${restCount} 个选项，` : ''}
          {vote.ended ? '查看结果 ›' : '去投票 ›'}
        </div>
      </div>
    </Link>
  );
};

export default VoteListCard;
