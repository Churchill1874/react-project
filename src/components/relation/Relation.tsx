import { useState } from 'react';
import { Avatar, NavBar, InfiniteScroll, Popup, DotLoading, PullToRefresh } from 'antd-mobile';
import { useNavigate, useSearchParams } from 'react-router-dom';
import '@/components/relation/Relation.less'
import avatars from '@/common/avatar';
import { levelEnum } from '@/common/level'
import { Req_FollowersPage, Req_CollectPage, RelationType } from '@/components/relation/api';
import OtherPeople from '@/pages/otherpeople/otherpeople';


const RelationScrollContent = ({ hasMore }: { hasMore?: boolean }) => {
  return (
    <>
      {hasMore ? (
        <>
          <div style={{ fontSize: '15px', color: 'gray' }} >
            <span >加载中</span>
            <DotLoading color='gray' />
          </div>
        </>
      ) : (
        <span color='gray'>--- 我是有底线的 ---</span>
      )}
    </>
  )
}


const Relation: React.FC = () => {
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();
  const playerId = searchParams.get('playerId');
  const flag = searchParams.get('flag');
  const [loading, setLoading] = useState<boolean>(false);
  const [relationPage, setRelationPage] = useState<number>(1);
  const [relationHasMore, setRelationHasMore] = useState<boolean>(true);
  const [relationList, setRelationList] = useState<RelationType[]>([]);
  const [otherPlayerId, setOtherPlayerId] = useState<string | null>()
  const [visibleCloseRight, setVisibleCloseRight] = useState(false)

  //返回上一层
  const back = () => {
    navigate(-1);
  };

  // 请求分页关系记录
  const reqPageApi = async (isReset: boolean) => {
    if (loading) {
      return;
    }
    setLoading(true);

    const pageNum = isReset ? 1 : relationPage;//如果是刷新就从第一页开始
    let pageReq;
    let relationListResp: RelationType[] = [];
    if (flag === '0') {
      pageReq = { playerId: playerId, pageNum: pageNum, pageSize: 50 };
      relationListResp = (await Req_CollectPage(pageReq)).data.records || [];
    }
    if (flag === '1') {
      pageReq = { targetPlayerId: playerId, pageNum: pageNum, pageSize: 50 };
      relationListResp = (await Req_FollowersPage(pageReq)).data.records || [];
    }

    //对比查询新闻的类型属于哪个类型数据 并且确认有新的数据返回才修改 全局的数据状态

    if (relationListResp.length > 0) {
      if (isReset) {
        setRelationPage(() => 2)//下一页是
        setRelationList(relationListResp);
        setRelationHasMore(true)
      } else {
        if (JSON.stringify(relationList) !== JSON.stringify(relationListResp)) {
          setRelationPage((prev) => prev + 1);//新闻页面当前页号
          setRelationList([...relationList, ...relationListResp]);
          setRelationHasMore(true)
        } else {
          setRelationHasMore(false);
        }
      }
    } else {
      setRelationHasMore(false)
    }

    setLoading(false);
  };



  return (
    <>
      <NavBar className="likes-nabar" back='返回' onBack={back} style={{ '--height': '46px' }}>
        {flag === '0' ? '您的关注' : '粉丝列表'}
      </NavBar>

      <div className="relation-list">
        <PullToRefresh onRefresh={() => reqPageApi(true)}>
          {relationList?.map((relation, idx) => (
            <div className="relation-item" key={idx}>
              <Avatar
                onClick={() => { setVisibleCloseRight(true); setOtherPlayerId(relation.id) }}
                src={avatars[relation.avatarPath]}
                style={{ '--size': '40px', marginRight: '10px' }}
              />
              <div className="info">
                <div className="name">{relation.name}</div>
                <div className="desc">{relation.level} 级: {levelEnum(relation.level)} </div>
                <div className="time">{relation.createTime}</div>
              </div>

              {flag === '1' &&
                <div className={`status ${relation.collected ? 'mutual' : ''}`}>
                  {relation.collected ? '互相关注了' : '未关注对方'}
                </div>
              }

            </div>
          ))}
        </PullToRefresh>
      </div>

      <InfiniteScroll loadMore={() => reqPageApi(false)} hasMore={relationHasMore} >
        <RelationScrollContent hasMore={relationHasMore} />
      </InfiniteScroll>

      <Popup className='news-record-popup' bodyStyle={{ display: 'flex', flexDirection: 'column', overflowY: 'auto', width: '100%', height: '100%' }}
        position='right'
        closeOnMaskClick
        visible={visibleCloseRight}
        onClose={() => { setVisibleCloseRight(false) }}>
        <OtherPeople setVisibleCloseRight={setVisibleCloseRight} otherPlayerId={otherPlayerId} />
      </Popup>
    </>

  );
}


export default Relation;