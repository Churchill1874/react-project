import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { VotePage_Request, VoteType } from '@/components/vote/api';
import VoteListCard from '@/components/vote/VoteListCard';
import '@/components/vote/Vote.less';

// 首页最多展示几条投票（改这里即可）
const HOME_VOTE_COUNT = 1;

/**
 * 首页投票模块
 * 显示规则（后台通过「置顶」控制首页显示哪一条）：
 * 1. 优先取进行中的投票，置顶的排最前，其次按发布时间最新
 * 2. 没有进行中的投票时，显示最近的一条（已截止的结果）
 * 3. 一条投票都没有时，整个模块隐藏
 */
const HomeVote: React.FC = () => {
  const navigate = useNavigate();
  const [voteList, setVoteList] = useState<VoteType[]>([]);

  useEffect(() => {
    (async () => {
      try {
        let list = (await VotePage_Request({ pageNum: 1, pageSize: HOME_VOTE_COUNT, ended: false })).data?.records || [];
        if (list.length === 0) {
          list = (await VotePage_Request({ pageNum: 1, pageSize: HOME_VOTE_COUNT })).data?.records || [];
        }
        setVoteList(list.slice(0, HOME_VOTE_COUNT));
      } catch (e) {
        setVoteList([]);
      }
    })();
  }, []);

  if (voteList.length === 0) return null;

  return (
    <div className="home-vote-section">
      <div className="v2-section-title home-vote-header" style={{ fontWeight: 'bold' }}>
        <span>🗳️ 投票</span>
        <span className="home-vote-more" onClick={() => navigate('/voteList')}>
          更多投票 ›
        </span>
      </div>
      {voteList.map((vote) => (
        <VoteListCard key={vote.id} vote={vote} maxOptions={5} />
      ))}
    </div>
  );
};

export default HomeVote;
