import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CapsuleTabs, InfiniteScroll, PullToRefresh, Empty } from 'antd-mobile';
import { LeftOutline } from 'antd-mobile-icons';
import { Helmet } from 'react-helmet-async';
import { VotePage_Request, VoteType } from '@/components/vote/api';
import VoteListCard from '@/components/vote/VoteListCard';
import '@/components/vote/Vote.less';

type TabKey = 'all' | 'going' | 'ended';

const endedParam = (tab: TabKey): boolean | undefined => {
  if (tab === 'going') return false;
  if (tab === 'ended') return true;
  return undefined;
};

// 投票列表页
const VoteList: React.FC = () => {
  const navigate = useNavigate();
  const [tab, setTab] = useState<TabKey>('all');
  const [list, setList] = useState<VoteType[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const pageRef = useRef(1);
  const loadingRef = useRef(false);
  const tabRef = useRef<TabKey>('all');

  const load = async (reset: boolean) => {
    if (loadingRef.current) return;
    loadingRef.current = true;
    const currentTab = tabRef.current;
    const pageNum = reset ? 1 : pageRef.current;
    try {
      const resp = await VotePage_Request({ pageNum, pageSize: 10, ended: endedParam(currentTab) });
      if (currentTab !== tabRef.current) return; // 请求返回前已切换 tab
      const records = resp.data?.records || [];
      const pages = resp.data?.pages || 0;
      setList((prev) => (reset ? records : [...prev, ...records]));
      pageRef.current = pageNum + 1;
      setHasMore(pageNum < pages);
    } catch (e) {
      setHasMore(false);
    } finally {
      loadingRef.current = false;
    }
  };

  const changeTab = (key: string) => {
    tabRef.current = key as TabKey;
    setTab(key as TabKey);
    setList([]);
    pageRef.current = 1;
    loadingRef.current = false;
    setHasMore(true);
    load(true);
  };

  return (
    <div className="vote-list-page">
      <Helmet>
        <title>投票 - 灰亚新闻</title>
        <meta name="description" content="灰亚新闻投票专区：东南亚生活、工作、时事热点话题投票，查看实时票数与大家的观点。" />
        <link rel="canonical" href="https://grayasia.com/voteList" />
      </Helmet>
      <div className="vote-list-page-header" onClick={() => navigate(-1)}>
        <span style={{ color: 'gray', paddingRight: 5 }}>
          <LeftOutline fontSize={18} />
          返回
        </span>
        <span style={{ fontWeight: 'bold' }}>投票</span>
      </div>

      <CapsuleTabs activeKey={tab} onChange={changeTab}>
        <CapsuleTabs.Tab title="全部" key="all" />
        <CapsuleTabs.Tab title="进行中" key="going" />
        <CapsuleTabs.Tab title="已截止" key="ended" />
      </CapsuleTabs>

      <PullToRefresh onRefresh={() => load(true)}>
        <div style={{ paddingTop: 8 }}>
          {list.map((vote) => (
            <VoteListCard key={vote.id} vote={vote} maxOptions={5} />
          ))}
          {!hasMore && list.length === 0 && <Empty description="暂无投票" />}
        </div>
        <InfiniteScroll loadMore={() => load(false)} hasMore={hasMore} />
      </PullToRefresh>
    </div>
  );
};

export default VoteList;
