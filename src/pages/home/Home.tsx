import React from 'react';
import '@/pages/home/Home.less';

const Home: React.FC = () => {
  return (
    <div className="container">
      {/* 头部 */}
      <div className="header">
        <div className="header-content">
          <div className="logo">📰  新闻中心</div>
          <div className="online-users">
            <span className="online-dot"></span>
            1,234 在线
          </div>
        </div>
      </div>


      <div className="content">




        {/* 热门新闻 */}
        <div className="section">

          {/****菜单图标*** */}
          <div className="menu-icons">
            <a href="#" className="menu-icon">
              <div className="menu-icon-image">🗳️</div>
              <div className="menu-icon-text">政治盘口</div>
            </a>
            <a href="#" className="menu-icon">
              <div className="menu-icon-image">🎮</div>
              <div className="menu-icon-text">多人游戏</div>
            </a>
            <a href="#" className="menu-icon">
              <div className="menu-icon-image">🔍</div>
              <div className="menu-icon-text">追查公司</div>
            </a>
            <a href="#" className="menu-icon">
              <div className="menu-icon-image">ℹ️</div>
              <div className="menu-icon-text">了解我们</div>
            </a>
            <a href="#" className="menu-icon">
              <div className="menu-icon-image">📰</div>
              <div className="menu-icon-text">政治新闻</div>
            </a>
          </div>


          {/****热门新闻 */}
          <div className="section-title">🔥 今日热点</div>

          <div className="news-item pinned">
            <div className="news-number">📌</div>
            <div className="news-title">重大突破：新能源技术获得历史性进展</div>
          </div>

          <div className="news-item">
            <div className="news-number" > 1</div>
            <div className="news-title">全球经济形势分析：专家预测下半年走势</div>

          </div>

          <div className="news-item">
            <div className="news-number" > 2</div>
            <div className="news-title">科技创新推动产业升级，多家企业受益</div>

          </div>

          <div className="news-item">
            <div className="news-number" > 3</div>
            <div className="news-title">科技创新推动产业升级，多家企业受益</div>
          </div>




          {/* 轮播图 */}
          <div className="section-title">📸 焦点图片</div>
          <div className="carousel-container">
            <div className="carousel-slide active">
              <img src="https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=400&h=200&fit=crop" alt="新闻图片" />
              <div className="carousel-caption">国际会议达成重要共识</div>
            </div>
            <div className="carousel-slide">
              <img src="https://images.unsplash.com/photo-1551434678-e076c223a692?w=400&h=200&fit=crop" alt="广告图片" />
            </div>
            <div className="carousel-slide">
              <img src="https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=400&h=200&fit=crop" alt="新闻图片" />
              <div className="carousel-caption">科技发展新突破</div>
            </div>
            <div className="carousel-indicators">
              <div className="carousel-indicator active"></div>
              <div className="carousel-indicator"></div>
              <div className="carousel-indicator"></div>
            </div>
          </div>






        </div>



        {/* 政治博彩 */}
        <div className="section">

          <div className="betting-card">
            <div className="betting-header">
              <div className="betting-title">🗳️ 美国中期选举预测</div>
            </div>

            <div className="betting-options">
              <div className="betting-option">
                <img
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face"
                  alt="民主党候选人"
                  className="option-avatar"
                />
                <div className="option-info">
                  <div className="option-name">民主党</div>
                  <div className="option-details">
                    <div className="option-odds">2.1x</div>
                    <div className="option-bets">8,432人</div>
                  </div>
                </div>
              </div>
              <div className="betting-option">
                <img
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face"
                  alt="共和党候选人"
                  className="option-avatar"
                />
                <div className="option-info">
                  <div className="option-name">共和党</div>
                  <div className="option-details">
                    <div className="option-odds">1.8x</div>
                    <div className="option-bets">12,567人</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="betting-footer">
              <span className="betting-pool">总奖池: <span className="pool-amount">$2,457,890</span></span>
              <span className="betting-time">开奖时间:2025-11-8</span>
            </div>
          </div>
        </div>



        {/* 公司信息 */}
        <div className="company-card">
          <div className="company-header">
            <div className="company-name">🏢追踪公司信息： AG集团</div>
            <div className="company-location">菲律宾</div>
          </div>

          <div className="company-business">
            主营业务：社交媒体平台、虚拟现实技术、元宇宙开发
          </div>

          <div className="company-events">
            <div className="event good">
              <div className="event-date">2024年3月</div>
              <div className="event-text">推出全新AI助手，获得用户好评</div>
            </div>
            <div className="event bad">
              <div className="event-date">2024年6月</div>
              <div className="event-text">数据隐私问题遭到监管部门调查</div>
            </div>
          </div>

          <div className="other-companies">
            <div className="other-companies-title">我们还在追踪以下公司：</div>
            <div className="company-tags">
              <div className="company-tag">苹果公司</div>
              <div className="company-tag">谷歌</div>
              <div className="company-tag">微软</div>
              <div className="company-tag">亚马逊</div>
              <div className="company-tag">特斯拉</div>
            </div>
          </div>
        </div>


        {/* 东南亚新闻 */}
        <div className="section">
          <div className="section-title">🌏 东南亚资讯</div>
          <div className="sea-news-item">
            <div className="sea-news-flag">TH</div>
            <div className="sea-news-content">
              <div className="sea-news-title">泰国数字经济发展计划获得政府大力支持</div>
              <div className="sea-news-meta">
                <div className="sea-news-date">2025-07-30 14:30</div>
                <div className="sea-news-stats">
                  <div className="stat views">2.3k</div>
                  <div className="stat comments">156</div>
                </div>
              </div>
            </div>
          </div>

          <div className="sea-news-item">
            <div className="sea-news-flag">VN</div>
            <div className="sea-news-content">
              <div className="sea-news-title">越南制造业指数创新高，外资持续涌入</div>
              <div className="sea-news-meta">
                <div className="sea-news-date">2025-07-30 13:45</div>
                <div className="sea-news-stats">
                  <div className="stat views">4.1k</div>
                  <div className="stat comments">289</div>
                </div>
              </div>
            </div>
          </div>

          <div className="sea-news-item">
            <div className="sea-news-flag">SG</div>
            <div className="sea-news-content">
              <div className="sea-news-title">新加坡金融管理局推出新的数字货币监管框架</div>
              <div className="sea-news-meta">
                <div className="sea-news-date">2025-07-30 12:20</div>
                <div className="sea-news-stats">
                  <div className="stat views">5.7k</div>
                  <div className="stat comments">432</div>
                </div>
              </div>
            </div>
          </div>


        </div>
      </div>
    </div>
  );
};

export default Home;