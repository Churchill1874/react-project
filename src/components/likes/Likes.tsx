import { useState, useEffect } from "react"
import { Avatar } from "antd-mobile";
import '@/components/likes/Likes.less';
import { useNavigate, useSearchParams } from "react-router-dom";
import { NavBar, DotLoading, InfiniteScroll, PullToRefresh, Popup } from 'antd-mobile';
import avatars from '@/common/avatar';
import { Req_LikesPage, LikesRespType } from "@/components/likes/api";
import { levelEnum } from '@/common/level'
import OtherPeople from "@/pages/otherpeople/otherpeople";

const Likes: React.FC<any> = () => {
  const [likesList, setLikeList] = useState<LikesRespType[]>([]);
  const [likesPage, setLikesPage] = useState<number>(1);
  const [likesHasMore, setLikesHasMore] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);
  const [searchParams] = useSearchParams();

  const [visibleCloseRight, setVisibleCloseRight] = useState(false)
  const [otherPlayerId, setOtherPlayerId] = useState<string | null>()
  const playerId = searchParams.get('id');

  const navigate = useNavigate();

  //返回上一层
  const back = () => {
    navigate(-1);
  };

  // 请求分页点赞记录
  const reqPageApi = async (isReset: boolean) => {
    if (loading) {
      return;
    }
    setLoading(true);

    const pageNum = isReset ? 1 : likesPage;//如果是刷新就从第一页开始
    const pageReq = { id: playerId, pageNum: pageNum, pageSize: 50 };
    const likesListResp: LikesRespType[] = (await Req_LikesPage(pageReq)).data.records || [];
    //对比查询新闻的类型属于哪个类型数据 并且确认有新的数据返回才修改 全局的数据状态
    if (likesListResp.length > 0) {
      if (isReset) {
        setLikesPage(() => 2)//下一页是
        setLikeList(likesListResp);
        setLikesHasMore(true)
      } else {
        if (JSON.stringify(likesList) !== JSON.stringify(likesListResp)) {
          setLikesPage((prev) => prev + 1);//新闻页面当前页号
          setLikeList([...likesList, ...likesListResp]);
          setLikesHasMore(true)
        } else {
          setLikesHasMore(false);
        }
      }
    } else {
      setLikesHasMore(false)
    }

    setLoading(false);
  };

  /* 
    useEffect(() => {
    }, [playerId]) */


  const LikesScrollContent = ({ hasMore }: { hasMore?: boolean }) => {
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


  return <>
    <NavBar className="likes-nabar" back='返回' onBack={back} style={{ '--height': '46px' }}>
      收赞记录
    </NavBar>

    <PullToRefresh onRefresh={() => reqPageApi(true)}>
      {
        likesList?.map((likes, index) => (
          <div className="like-list" key={likes.id}>
            <div className="like-item">
              <Avatar src={avatars[likes.avatarPath]} style={{ '--size': '40px', marginRight: 12 }} onClick={() => { setVisibleCloseRight(true); setOtherPlayerId(likes.playerId) }} />
              <div className="content">
                <div>
                  <span className="username">{likes.playerName}</span>
                  <span className="tag tag-red">{likes.level} 级 {levelEnum(likes.level)}</span>
                </div>
                <div className="meta"> {likes.createTime} 点赞了 你的评论</div>
                <div className="liked"><span>{likes.content}</span></div>
              </div>
            </div>
          </div>
        ))

      }

    </PullToRefresh>


    <InfiniteScroll loadMore={() => reqPageApi(false)} hasMore={likesHasMore} >
      <LikesScrollContent hasMore={likesHasMore} />
    </InfiniteScroll>

    <Popup className='news-record-popup' bodyStyle={{ display: 'flex', flexDirection: 'column', overflowY: 'auto', width: '100%', height: '100%' }}
      position='right'
      closeOnMaskClick
      visible={visibleCloseRight}
      onClose={() => { setVisibleCloseRight(false) }}>
      <OtherPeople setVisibleCloseRight={setVisibleCloseRight} otherPlayerId={otherPlayerId} />
    </Popup>
  </>
}

export default Likes;