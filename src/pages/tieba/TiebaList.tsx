import React, { useState, useEffect } from 'react';
import '@/pages/tieba/TiebaList.less';
import { useNavigate } from 'react-router-dom'; // 添加这个导入
import { Button, DotLoading, Skeleton, Space } from 'antd-mobile'
import { FillinOutline, SearchOutline, EyeOutline, MessageOutline, EnvironmentOutline, LikeOutline } from 'antd-mobile-icons'

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

interface Author {
  id: number;
  name: string;
  avatar: string;
  level: number;
  ip: string;
}

interface Post {
  id: number;
  title: string;
  time: string;
  replies: number;
  views: number;
  status: 'top' | 'hot' | 'recommend' | '';
  image?: string;
  author: Author;
}

const TiebaList: React.FC = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState<Post[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);

  // 模拟API数据
  const mockPosts: Post[] = [
    {
      id: 10001,
      title: "分享一些学习前端开发的心得体会，希望对新手有帮助",
      time: "2025-09-01 14:30",
      replies: 156,
      views: 2340,
      status: "hot",
      image: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='80' viewBox='0 0 120 80'%3E%3Crect width='120' height='80' fill='%234a90e2'/%3E%3Ctext x='60' y='45' text-anchor='middle' fill='white' font-size='14' font-weight='bold'%3E前端开发%3C/text%3E%3C/svg%3E",
      author: {
        id: 888888,
        name: "前端小白",
        avatar: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 40 40'%3E%3Ccircle cx='20' cy='20' r='20' fill='%234a90e2'/%3E%3Ctext x='20' y='26' text-anchor='middle' fill='white' font-size='16' font-weight='bold'%3E前%3C/text%3E%3C/svg%3E",
        level: 5,
        ip: "北京"
      }
    },
    {
      id: 10002,
      title: "今天天气真不错，适合出去走走拍照",
      time: "2025-09-01 13:45",
      replies: 23,
      views: 5998997,
      status: "top",
      image: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='80' viewBox='0 0 120 80'%3E%3Crect width='120' height='80' fill='%2387ceeb'/%3E%3Ctext x='60' y='45' text-anchor='middle' fill='white' font-size='14' font-weight='bold'%3E风景照%3C/text%3E%3C/svg%3E",
      author: {
        id: 777777,
        name: "摄影爱好者",
        avatar: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 40 40'%3E%3Ccircle cx='20' cy='20' r='20' fill='%2367b26f'/%3E%3Ctext x='20' y='26' text-anchor='middle' fill='white' font-size='16' font-weight='bold'%3E摄%3C/text%3E%3C/svg%3E",
        level: 8,
        ip: "上海"
      }
    },
    {
      id: 10003,
      title: "推荐几本值得一读的技术书籍，包含详细的阅读心得",
      time: "2024-09-01 12:20",
      replies: 89,
      views: 123456,
      status: "recommend",
      author: {
        id: 666666,
        name: "书虫程序员",
        avatar: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 40 40'%3E%3Ccircle cx='20' cy='20' r='20' fill='%23f39c12'/%3E%3Ctext x='20' y='26' text-anchor='middle' fill='white' font-size='16' font-weight='bold'%3E书%3C/text%3E%3C/svg%3E",
        level: 12,
        ip: "深圳"
      }
    },
    {
      id: 10004,
      title: "求助：JavaScript闭包的理解问题",
      time: "2025-07-01 11:15",
      replies: 45,
      views: 678,
      status: "",
      author: {
        id: 555555,
        name: "新手小明",
        avatar: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 40 40'%3E%3Ccircle cx='20' cy='20' r='20' fill='%239b59b6'/%3E%3Ctext x='20' y='26' text-anchor='middle' fill='white' font-size='16' font-weight='bold'%3E明%3C/text%3E%3C/svg%3E",
        level: 2,
        ip: "广州"
      }
    }
  ];


  // 获取帖子数据
  const fetchPosts = async () => {
    setLoading(true);
    try {
      // TODO: 替换为真实的API调用
      // const response = await fetch('/api/tieba/posts');
      // const data = await response.json();

      // 模拟API延迟
      await new Promise(resolve => setTimeout(resolve, 500));
      setPosts(mockPosts);
    } catch (error) {
      console.error('获取帖子数据失败:', error);
    } finally {
      setLoading(false);
    }
  };

  // 搜索帖子
  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (!query.trim()) {
      //fetchPosts();
      return;
    }

    // TODO: 替换为真实的搜索API
    // const response = await fetch(`/api/tieba/search?q=${encodeURIComponent(query)}`);
    // const data = await response.json();

    // 模拟搜索过滤
    /*   const allData = generateMockData();
      const filteredPosts = allData.filter(post =>
        post.title.toLowerCase().includes(query.toLowerCase())
      );
      setPosts(filteredPosts); */
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

  const getStatusBadge = (status: string) => {
    const statusMap = {
      'top': { text: '置顶', class: 'status-top' },
      'hot': { text: '热门', class: 'status-hot' },
      'recommend': { text: '推荐', class: 'status-recommend' }
    };

    if (status && statusMap[status as keyof typeof statusMap]) {
      const statusInfo = statusMap[status as keyof typeof statusMap];
      return <div className={`status-badge ${statusInfo.class}`}>{statusInfo.text}</div>;
    }
    return null;
  };

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

          {/*           <button className="search-btn" onClick={() => handleSearch(searchQuery)}>
            <svg className="publish-icon" viewBox="0 0 24 24">
              <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" fill="white" />
            </svg>
          </button> */}

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
        ) : posts.length === 0 ? (
          <div className="empty">暂无数据</div>
        ) : (
          posts.map((post) => (
            <div
              key={post.id}
              className="post-item"
              onClick={() => handlePostClick(post.id)}
            >
              {getStatusBadge(post.status)}
              <div className="post-header">
                <img src={post.author.avatar} alt={post.author.name} className="avatar" />
                <div className="tieba-user-info">
                  <div className="username" style={{ marginRight: '0px' }}>
                    {post.author.name}
                    <span className="user-level">Lv.{post.author.level}</span>
                  </div>
                  <div className="user-meta">
                    <span>ID: {post.author.id}</span>
                  </div>
                </div>
              </div>
              <div className={`post-content ${!post.image ? 'no-image' : ''}`}>
                <div className="post-text">
                  <div className='post-title' style={{ alignSelf: 'flex-start' }} >{post.title}</div>

                  {!post.image &&

                    <div style={{ color: '#8899a6', marginBottom: '20px' }} >
                      <span style={{ marginRight: '10px' }}> 发布: {formatTime(post.time)}</span>
                      <EnvironmentOutline fontSize={13} />北京
                    </div>

                  }
                  {post.image &&
                    <div style={{ color: '#8899a6' }}>
                      <span style={{ marginRight: '10px' }} >发布: {formatTime(post.time)}</span>
                      <EnvironmentOutline fontSize={13} />北京
                    </div>
                  }

                </div>
                {post.image && (
                  <img src={post.image} alt="帖子图片" className="post-image" />
                )}
              </div>
              <div className="post-footer">
                <div className="post-stats">

                  <div className="stat-item">
                    <EyeOutline fontSize={16} />
                    <span>{formatNumber(post.views)}</span>
                  </div>


                  <div className="stat-item">
                    <MessageOutline fontSize={16} />
                    <span>{formatNumber(post.replies)}</span>
                  </div>


                  <div className="stat-item">
                    <LikeOutline fontSize={16} />
                    <span>102</span>

                  </div>
                </div>

                <div className="post-time">最后评论: {formatTime(post.time)}</div>

              </div>
            </div>
          ))
        )}

        <div className="infinite-scroll-footer">
          <span >--- 我是有底线的 ---</span>
        </div>
      </div>


    </div>
  );
};

export default TiebaList;