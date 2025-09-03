// 修复后的 HallPage.tsx
import React from 'react';
import '@/pages/Hall/Hall.less';
import { useNavigate } from 'react-router-dom'; // 添加这个导入
import { Image } from 'antd-mobile';

const Hall: React.FC = () => {

  const navigate = useNavigate();
  return (
    <div className="hall-container">
      <div className="hall-header">
        <span className='hall-header-title'>新闻大厅</span>
        <span className="subtitle"> 最新资讯 • 实时互动</span>
      </div>

      {/* 滚动新闻 */}
      <div className="scrolling-news">
        <div className="hall-news-text">
          📢 最新消息：欢迎来到新闻大厅！实时资讯更新中... 点击新闻图片查看详情 🎯 积分排行榜实时更新
        </div>
      </div>


      {/* 快捷导航 */}
      <div className="quick-nav">
        <button className="nav-btn chat-btn" onClick={() => { navigate("/groupChat") }}>
          <div className='icon'>
            👬
          </div>
          <div>
            聊天大厅
          </div>
        </button>

        <button className="nav-btn game-btn" onClick={() => { navigate("/tiebaList") }}>
          <div className='icon'>🏷️</div>
          <div>贴吧</div>
        </button>

        <button className="nav-btn forum-btn">
          <div className='icon'>⚔️</div>
          <div>阵营新闻</div>
        </button>

        <button className="nav-btn message-btn">
          <div className='icon'> 📝</div>
          <div>一些规则</div>
        </button>
      </div>



      {/* 热门话题讨论 */}
      <div className="hall-topics-section">
        <div className="hall-section-title">
          🔥 热门话题
        </div>
        <div className="hall-topic-item">
          <div className="hall-topic-title">💍 你认为彩礼有必要吗？</div>
          <div className="hall-topic-stats">
            <div className="hall-topic-meta">
              <span>👥 2.3k参与</span>
              <span>💬 578评论</span>
            </div>
          </div>
        </div>

        <div className="hall-topic-item">
          <div className="hall-topic-title">⚪ 你认为灰产能做多久？</div>
          <div className="hall-topic-stats">
            <div className="hall-topic-meta">
              <span>👥 1.8k参与</span>
              <span>💬 421评论</span>
            </div>
          </div>
        </div>

        {/*         <div className="hall-topic-item">
          <div className="hall-topic-title">🤔 你们认为面试有必要问太深吗？</div>
          <div className="hall-topic-stats">
            <div className="hall-topic-meta">
              <span>👥 1.5k参与</span>
              <span>💬 356评论</span>
            </div>
          </div>
        </div> */}
      </div>

      {/* 新闻展示区 */}
      <div className="news-grid">
        <div className="hall-section-title">
          📰 社会事件
        </div>
        <div className="grid">
          <div className="hall-news-item">
            <div className="hall-news-image">
              <Image fit='fill' width="100%" height={window.innerWidth > 768 ? 120 : 100}  // 大屏120px，小屏100px
                src='https://img0.baidu.com/it/u=432699738,3690338511&fm=253&fmt=auto&app=138&f=JPEG?w=826&h=467'
                onClick={() => { }} />
            </div>
            <div className="hall-news-content">
              <div className="hall-news-title">科技前沿：AI技术新突破引发行业关注</div>
            </div>
          </div>
          <div className="hall-news-item">
            <div className="hall-news-image">
              <Image fit='fill' width="100%" height={window.innerWidth > 768 ? 120 : 100}  // 大屏120px，小屏100px
                src='https://img2.baidu.com/it/u=1262186181,542144633&fm=253&fmt=auto&app=120&f=JPEG?w=1080&h=546'
                onClick={() => { }} />

            </div>
            <div className="hall-news-content">
              <div className="hall-news-title">国际要闻：全球气候峰会达成重要共识</div>
            </div>
          </div>
        </div>
      </div>



      {/* 阵营统计 */}
      {/*  <div className="camp-stats">
        <div className="home-section-title" >
          ⚔️ 阵营统计
        </div>
        <div className="camp-container">
          <div className="camp-card blue-camp">
            <div className="camp-icon">🔵</div>
            <div className="camp-name">蓝营</div>
            <div className="camp-count">1248 位</div>
          </div>

          <div className="camp-card red-camp">
            <div className="camp-icon">🔴</div>
            <div className="camp-name">红营</div>
            <div className="camp-count">892 位</div>
          </div>

          <div className="camp-card purple-camp">
            <div className="camp-icon">🟣</div>
            <div className="camp-name">紫营</div>
            <div className="camp-count">635 位</div>
          </div>
        </div>
      </div>

 */}


      {/* 精选新闻 */}
      <div className="featured-news">
        <div className="hall-section-title">
          ⭐ 游戏信息
        </div>
        <div className="featured-item">
          <div className="featured-image">
            <Image fit='fill' width="100%" height={window.innerWidth > 768 ? 120 : 100}  // 大屏120px，小屏100px
              src='https://img0.baidu.com/it/u=2705743318,480011674&fm=253&fmt=auto&app=120&f=JPEG?w=800&h=500'
              onClick={() => { }} />
          </div>
          <div className="featured-content">
            <div className="featured-title">重磅！科技巨头联合发布AI伦理新标准，将重塑行业格局</div>
            {/* <div className="featured-summary">多家科技公司共同制定人工智能发展伦理准则，涉及数据隐私、算法透明度等关键领域，预计将对整个AI产业产生深远影响...</div> */}
          </div>
        </div>
      </div>




      {/* 排行榜 */}
      <div className="hall-ranking">
        <div className="hall-section-title">
          🏆 积分排行榜
        </div>
        <div className="hall-ranking-list">
          <div className="hall-rank-item">
            <div className="hall-rank-number rank-1">1</div>
            <div className="hall-rank-avatar">A</div>
            <div className="hall-rank-info">
              <div className="rank-name">新闻达人</div>
              <div className="rank-score">积分：9,850</div>
            </div>
          </div>
          <div className="hall-rank-item">
            <div className="hall-rank-number rank-2">2</div>
            <div className="hall-rank-avatar">B</div>
            <div className="hall-rank-info">
              <div className="rank-name">资讯专家</div>
              <div className="rank-score">积分：8,920</div>
            </div>
          </div>
          <div className="hall-rank-item">
            <div className="hall-rank-number rank-3">3</div>
            <div className="hall-rank-avatar">C</div>
            <div className="hall-rank-info">
              <div className="rank-name">热点追踪</div>
              <div className="rank-score">积分：8,156</div>
            </div>
          </div>
          <div className="hall-rank-item">
            <div className="hall-rank-number rank-other">4</div>
            <div className="hall-rank-avatar">D</div>
            <div className="hall-rank-info">
              <div className="rank-name">时事观察</div>
              <div className="rank-score">积分：7,543</div>
            </div>
          </div>
          <div className="hall-rank-item">
            <div className="hall-rank-number rank-other">5</div>
            <div className="hall-rank-avatar">E</div>
            <div className="hall-rank-info">
              <div className="rank-name">媒体先锋</div>
              <div className="rank-score">积分：7,128</div>
            </div>
          </div>
        </div>
        <div className="view-more-btn">
          查看完整排行榜 📊
        </div>
      </div>
    </div>
  );
};

export default Hall;