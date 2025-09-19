import React, { useState, useEffect } from 'react';
import '@/pages/tieba/TiebaList.less';
import { useNavigate } from 'react-router-dom'; // 添加这个导入
import { Button, DotLoading, Skeleton, Space } from 'antd-mobile'
import { FillinOutline, SearchOutline, EyeOutline, MessageOutline, EnvironmentOutline, LikeOutline } from 'antd-mobile-icons'
import { TiebaType, Request_TiebaPage } from '@/pages/tieba/api';
import avatars from '@/common/avatar';

const ScrollContent = ({ hasMore }: { hasMore?: boolean }) => {
  return (
    <>
      {hasMore ? (
        <>
          <div className="dot-loading-custom" >
            <span >加载中</span>
            <DotLoading />
            <Skeleton.Title animated />
            <Skeleton.Paragraph lineCount={8} animated />
          </div>
        </>
      ) : (
        <div className="infinite-scroll-footer">
          <span >--- 我是有底线的 ---</span>
        </div>
      )}
    </>
  )
}


const TiebaList: React.FC = () => {
  const navigate = useNavigate();
  const [tiebaList, setTiebaList] = useState<TiebaType[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [isReset, setIsReset] = useState(false)
  const [hasMore, setHasMore] = useState(true);
  const [isHorizontal, setIsHorizontal] = useState(true)

  // 获取帖子数据
  const fetchPosts = async () => {
    setLoading(true);
    try {
      const pageNum = isReset ? 1 : page;
      const param = { pageNum: pageNum, pageSize: 20, title: searchQuery };
      const list: TiebaType[] = (await Request_TiebaPage(param)).data.records || [];
      if (list.length > 0) {
        if (isReset) {
          setPage(() => 2);
          setTiebaList(list);
          setHasMore(true);
        } else {
          if (JSON.stringify(list) !== JSON.stringify(tiebaList)) {
            setPage(prev => (prev ?? 1) + 1)
            setTiebaList([...(tiebaList ?? []), ...list])
            setHasMore(true)
          } else {
            setHasMore(false)
          }
        }
      } else {
        setHasMore(false)
      }
      setLoading(false)
    }
    catch (error) {
      console.error('获取帖子数据失败:', error);
    } finally {
      setLoading(false);
    }
  };

  // 搜索帖子
  const handleSearch = async (query: string) => {
    if (!query.trim()) {
      return;
    }
    setSearchQuery(query);
  };

  // 点击帖子
  const handlePostClick = (postId: number) => {
    // TODO: 跳转到帖子详情页
    console.log('点击帖子:', postId);
    // 例如: navigate(`/tieba/post/${postId}`);
    navigate('/tiebaDetail')
  };

  // 组件初始化时获取数据
  useEffect(() => {
    fetchPosts();
  }, []);

  const getStatusBadge = (isHot: boolean, isTop: boolean) => {
    console.log(1, isHot, 2, isTop)
    if (!isHot && !isTop) {
      return;
    }

    if (isHot && isTop) {
      console.log(888)
      return <div className={`status-badge`}>
        <span style={{ fontSize: '16px' }}>{'🔥'}</span>
        <span style={{ fontSize: '16px' }}>{'🚀'}</span>
      </div>;
    }

    if (isHot) {
      return <div className={`status-badge`}>{'🔥'}</div>;
    }
    if (isTop) {
      return <div className={`status-badge`}>{'🚀'}</div>;
    }

  }


  const formatTime = (timeStr: string) => {
    const now = new Date();
    const time = new Date(timeStr);
    const diff = now.getTime() - time.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    const months = Math.floor(days / 30);
    const years = Math.floor(days / 365);

    if (minutes < 5) return '刚刚';
    if (minutes < 60) return `${minutes}分钟前`;
    if (hours < 24) return `${hours}小时前`;
    if (days < 7) return `${days}天前`;
    if (days < 30) return `${Math.floor(days / 7)}周前`;
    if (months < 12) return `${months}月前`;
    if (years >= 1) return `${years}年前`;

    // 如果以上都不符合，返回具体日期
    return timeStr.split(' ')[0];
  };

  const formatNumber = (num: number) => {
    if (num < 1000) return num.toString();
    if (num < 10000) return (num / 1000).toFixed(1) + 'k';
    return (num / 10000).toFixed(1) + 'w';
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value === '') {
      return
    }
    const query = e.target.value;
    setSearchQuery(query);

  };

  return (
    <div className="tieba-container">
      <div className="tieba-header">
        <h1>贴吧</h1>
      </div>

      <div className="search-bar">
        <div className="search-wrapper">
          <input
            type="text"
            className="search-input"
            placeholder="搜索贴子..."
            value={searchQuery}
            onChange={handleSearchChange}
          />

          <Button color='primary' style={{ background: 'linear-gradient(135deg, #4a90e2 0%, #357abd 100%)', fontSize: '26px', borderRadius: '20px', padding: '0px 5px' }} fill='solid' onClick={() => handleSearch(searchQuery)}>
            <SearchOutline />
          </Button>

          <Button color='primary' style={{ background: 'linear-gradient(135deg, #4a90e2 0%, #357abd 100%)', fontSize: '24px', padding: '0px 5px' }} fill='solid' onClick={() => handleSearch(searchQuery)}>
            <FillinOutline />
          </Button>

        </div>
      </div>

      <div className="post-list">
        {loading ? (
          <div className="loading">加载中...</div>
        ) : tiebaList.length === 0 ? (
          <div className="empty">暂无数据</div>
        ) : (
          tiebaList.map((tieba) => (
            <div
              key={tieba.id}
              className="post-item"
              onClick={() => handlePostClick(tieba.id)}
            >
              {getStatusBadge(tieba.isHot, tieba.isTop)}

              <div className="post-header">
                <img src={avatars[tieba.avatar]} alt={tieba.createName} className="avatar" />
                <div className="tieba-user-info">
                  <div className="username" style={{ marginRight: '0px' }}>
                    {tieba.createName}
                    <span className="user-level">Lv.{tieba.level}</span>
                  </div>
                  <div className="user-meta">
                    <span>ID: {tieba.account}</span>
                  </div>
                </div>
              </div>
              <div className={`post-content ${!tieba.image1 ? 'no-image' : ''}`}>
                <div className="post-text">
                  <div className='post-title' style={{ alignSelf: 'flex-start' }} >{tieba.title}</div>

                  {!tieba.image1 &&

                    <div style={{ color: '#8899a6', marginBottom: '20px' }} >
                      <span style={{ marginRight: '10px' }}> 发布: {formatTime(tieba.createTime)}</span>
                      <EnvironmentOutline fontSize={13} />{tieba.address}
                    </div>

                  }
                  {tieba.image1 &&
                    <div style={{ color: '#8899a6' }}>
                      <span style={{ marginRight: '10px' }} >发布: {formatTime(tieba.createTime)}</span>
                      <EnvironmentOutline fontSize={13} />{tieba.address}
                    </div>
                  }

                </div>

                {tieba.image1 && (
                  <img
                    src={tieba.image1}
                    alt="帖子图片"
                    className="post-image" // 默认样式
                    onLoad={(e) => {
                      const img = e.target as HTMLImageElement;
                      {
                        console.log('==', img.naturalHeight / img.naturalWidth)
                        if (img.naturalHeight / img.naturalWidth > 1.6) {
                          img.className = 'l-post-image';
                        }
                      }

                    }}
                  />
                )}

              </div>
              <div className="post-footer">
                <div className="post-stats">

                  <div className="stat-item">
                    <EyeOutline fontSize={16} />
                    <span>{formatNumber(tieba.viewCount)}</span>
                  </div>


                  <div className="stat-item">
                    <MessageOutline fontSize={16} />
                    <span>{formatNumber(tieba.commentCount)}</span>
                  </div>


                  <div className="stat-item">
                    <LikeOutline fontSize={16} />
                    <span>{formatNumber(tieba.likesCount)}</span>

                  </div>
                </div>

                <div className="post-time">最后评论:  {tieba.lastCommentTime ? formatTime(tieba.lastCommentTime) : '暂无'}</div>

              </div>
            </div>
          ))
        )}

        {(tiebaList.length != 0) &&
          <div className="infinite-scroll-footer">
            <span >--- 我是有底线的 ---</span>
          </div>
        }

      </div>


    </div>
  );
};

export default TiebaList;