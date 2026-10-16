import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { VotePage_Request, VoteType } from '@/components/vote/api';
import VoteListCard from '@/components/vote/VoteListCard';
import '@/components/vote/Vote.less';

// 首页投票模块：优先展示进行中的投票，没有进行中的就展示最近的投票
const HomeVote: React.FC = () => {
  const navigate = useNavigate();
  const [voteList, setVoteList] = useState<VoteType[]>([]);

  useEffect(() => {
    (async () => {
      try {
        let list = (await VotePage_Request({ pageNum: 1, pageSize: 2, ended: false })).data?.records || [];
        if (list.length === 0) {
          list = (await VotePage_Request({ pageNum: 1, pageSize: 1 })).data?.records || [];
        }
        setVoteList(list);
      } catch (e) {
        setVoteList([]);
      }
    })();
  }, []);

  // 没有任何投票时整个模块不显示
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
        <VoteListCard key={vote.id} vote={vote} maxOptions={3} />
      ))}
    </div>
  );
};

export default HomeVote;
