import React from 'react';
import { DotLoading, Skeleton, Swiper } from 'antd-mobile';
import '@/pages/tieba/tiebadetail/TiebaDetail.less';
import { useNavigate } from 'react-router-dom';
import { FillinOutline, SearchOutline, EyeOutline, MessageOutline, EnvironmentOutline, LikeOutline } from 'antd-mobile-icons'

const TiebaDetail: React.FC = () => {

  const TiebaCommentScrollContent = ({ hasMore }: { hasMore?: boolean }) => {
    return (
      <>
        {hasMore ? (
          <>
            <div className="dot-loading-custom" >
              <span >加载中</span>
              <DotLoading color='#fff' />
              <Skeleton.Title animated />
              <Skeleton.Paragraph lineCount={8} animated />
            </div>
          </>
        ) : (
          <div className="infinite-scroll-footer" style={{ paddingBottom: '200px' }} >
            <span style={{ color: 'black' }}>--- 我是有底线的 ---</span>
          </div>
        )}
      </>
    )
  }



  const navigate = useNavigate();
  return (


    <div className="tieba-detail-container">
      {/* 顶部导航 */}
      <div className="detail-header">
        <button className="back-btn" onClick={() => navigate(-1)}>
          <svg className="back-icon" viewBox="0 0 24 24">
            <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
          </svg>
        </button>
        <div className="header-title">帖子详情</div>
      </div>

      {/* 帖子主体内容 */}
      <div className="post-detail">
        <div className="post-header">
          <img
            src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='45' height='45' viewBox='0 0 45 45'%3E%3Ccircle cx='22.5' cy='22.5' r='22.5' fill='%234a90e2'/%3E%3Ctext x='22.5' y='30' text-anchor='middle' fill='white' font-size='18' font-weight='bold'%3E前%3C/text%3E%3C/svg%3E"
            alt="前端小白"
            className="avatar"
          />

          <div className="user-info">
            <div className="username" >
              前端小白
              <span className="user-level">Lv.5</span>
            </div>
            <div className="user-meta" >
              <span>ID: 888888</span>
              <span className="post-time">北京</span>
            </div>
          </div>
        </div>

        <div className="post-status">

          <div className="status-badge status-hot">热门</div>
        </div>

        <div className="post-title">分享一些学习前端开发的心得体会，希望对新手有帮助</div>

        <div className="post-images">
          <Swiper>
            <Swiper.Item>
              <img
                src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='200' viewBox='0 0 400 200'%3E%3Crect width='400' height='200' fill='%234a90e2'/%3E%3Ctext x='200' y='110' text-anchor='middle' fill='white' font-size='20' font-weight='bold'%3E前端学习路线图%3C/text%3E%3C/svg%3E"
                alt="前端学习路线图"
                className="post-image"
              />
            </Swiper.Item>
            <Swiper.Item>
              <img
                src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='200' viewBox='0 0 400 200'%3E%3Crect width='400' height='200' fill='%2367b26f'/%3E%3Ctext x='200' y='110' text-anchor='middle' fill='white' font-size='18' font-weight='bold'%3E代码示例截图%3C/text%3E%3C/svg%3E"
                alt="代码示例"
                className="post-image"
              />
            </Swiper.Item>
            <Swiper.Item>
              <img
                src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='200' viewBox='0 0 400 200'%3E%3Crect width='400' height='200' fill='%23f39c12'/%3E%3Ctext x='200' y='110' text-anchor='middle' fill='white' font-size='18' font-weight='bold'%3E学习笔记%3C/text%3E%3C/svg%3E"
                alt="学习笔记"
                className="post-image"
              />
            </Swiper.Item>
          </Swiper>
        </div>

        <div className="post-content">
          大家好！作为一个从零开始学习前端开发的新手，经过半年的学习，我想分享一些心得体会，希望能够帮助到其他正在学习路上的朋友们。<br /><br />
          首先，学习前端开发最重要的是要有耐心和恒心。前端技术更新很快，新的框架和工具层出不穷，但是基础知识是不变的。HTML、CSS、JavaScript这三大基础一定要扎实掌握。<br /><br />
          其次，多做项目实践。理论知识再多，不如动手做一个完整的项目。我建议大家从简单的静态页面开始，逐步增加交互功能，最后尝试做一些完整的应用。<br /><br />
          最后，要善于利用开发者工具和社区资源。Chrome开发者工具是前端开发的好伙伴，GitHub上有很多优秀的开源项目可以学习。
        </div>

        <div className="post-stats">
          <div className="stats-left">
            <div className="stat-item">
              <MessageOutline fontSize={16} />
              <span>156</span>
            </div>
            <div className="stat-item">
              <EyeOutline fontSize={16} />
              <span>2.3k</span>
            </div>
            <div className="stat-item">
              <LikeOutline fontSize={16} />
              <span>102</span>
            </div>

          </div>

          <div className="post-time">3小时前</div>

        </div>
      </div>

      {/* 回复列表 */}
      <div className="replies-section">
        <div className="replies-header">
          <div className="replies-title">
            全部回复
            <span className="reply-count">156</span>
          </div>
        </div>

        <div className="reply-list">
          {/* 回复1 */}
          <div className="reply-item">
            <div className="reply-header">
              <img
                src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='36' height='36' viewBox='0 0 36 36'%3E%3Ccircle cx='18' cy='18' r='18' fill='%2367b26f'/%3E%3Ctext x='18' y='23' text-anchor='middle' fill='white' font-size='14' font-weight='bold'%3E老%3C/text%3E%3C/svg%3E"
                alt="前端老司机"
                className="reply-avatar"
              />
              <div className="reply-user-info">
                <div className="reply-username">
                  前端老司机
                  <span className="user-level">Lv.18</span>
                </div>
                <div className="reply-user-meta">
                  <span>ID: 123456</span>
                  <span>深圳</span>
                </div>
              </div>
            </div>
            <div className="reply-content">
              楼主总结得很好！我补充几点：学习前端一定要多看优秀的代码，GitHub上有很多高质量的项目可以学习。另外建议多关注一些技术博客和社区，比如掘金、知乎等，能及时了解行业动态。
            </div>
            <div className="reply-image">
              <img
                src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='120' viewBox='0 0 200 120'%3E%3Crect width='200' height='120' fill='%234a90e2'/%3E%3Ctext x='100' y='70' text-anchor='middle' fill='white' font-size='16' font-weight='bold'%3EGitHub推荐%3C/text%3E%3C/svg%3E"
                alt="GitHub推荐"
              />
            </div>
            <div className="reply-footer">
              <div className="reply-actions">
                <button className="reply-action">
                  <LikeOutline fontSize={16} />
                  <span>23</span>
                </button>
                <button className="reply-action">
                  <svg className="reply-action-icon" viewBox="0 0 24 24">
                    <path d="M10 9V5l-7 7 7 7v-4.1c5 0 8.5 1.6 11 5.1-1-5-4-10-11-11z" />
                  </svg>
                  回复
                </button>
              </div>
              <div className="reply-time">2小时前</div>
            </div>
          </div>


          {/* 回复3 - 对第二个回复的回复 */}
          <div className="reply-item">
            <div className="reply-header">
              <img
                src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='36' height='36' viewBox='0 0 36 36'%3E%3Ccircle cx='18' cy='18' r='18' fill='%2367b26f'/%3E%3Ctext x='18' y='23' text-anchor='middle' fill='white' font-size='14' font-weight='bold'%3E老%3C/text%3E%3C/svg%3E"
                alt="前端老司机"
                className="reply-avatar"
              />
              <div className="reply-user-info">
                <div className="reply-username">
                  前端老司机
                  <span className="user-level">Lv.18</span>
                </div>
                <div className="reply-user-meta">
                  <span>ID: 123456</span>
                  <span>深圳</span>
                </div>
              </div>
            </div>

            {/* 引用被回复的内容 */}
            <div className="reply-quote">
              <div className="reply-quote-header">
                <img
                  src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 20 20'%3E%3Ccircle cx='10' cy='10' r='10' fill='%239b59b6'/%3E%3Ctext x='10' y='13' text-anchor='middle' fill='white' font-size='8' font-weight='bold'%3E小%3C/text%3E%3C/svg%3E"
                  alt="小白学习中"
                  className="quote-avatar"
                />
                <span className="quote-username">@小白学习中</span>
              </div>
              <div className="reply-quote-content">
                感谢推荐！我刚开始学习，确实需要多看一些优秀的代码。请问有什么特别推荐的GitHub项目吗？
              </div>
            </div>

            <div className="reply-content">
              推荐几个很适合新手学习的项目：1. Vue官方的TodoMVC实现，代码简洁易懂；2. React的官方教程项目；3. 30-seconds-of-code这个项目收集了很多实用的JS代码片段。这些都很适合新手学习！
            </div>
            <div className="reply-image">
              <img
                src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='120' viewBox='0 0 200 120'%3E%3Crect width='200' height='120' fill='%2367b26f'/%3E%3Ctext x='100' y='70' text-anchor='middle' fill='white' font-size='14' font-weight='bold'%3E推荐项目截图%3C/text%3E%3C/svg%3E"
                alt="推荐项目"
              />
            </div>
            <div className="reply-footer">
              <div className="reply-actions">
                <button className="reply-action">
                  <LikeOutline fontSize={16} />
                  <span>15</span>
                </button>
                <button className="reply-action">
                  <svg className="reply-action-icon" viewBox="0 0 24 24">
                    <path d="M10 9V5l-7 7 7 7v-4.1c5 0 8.5 1.6 11 5.1-1-5-4-10-11-11z" />
                  </svg>
                  回复
                </button>
              </div>
              <div className="reply-time">30分钟前</div>
            </div>
          </div>

          {/* 回复5 - 对楼主的回复 */}
        </div>
      </div>

      {/* 底部输入框 */}
      {/*       <div className="reply-input-section">
        <div className="reply-input-wrapper">
          <input type="text" className="reply-input" placeholder="说点什么..." />
          <button className="reply-send-btn">
            <svg className="send-icon" viewBox="0 0 24 24">
              <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
            </svg>
          </button>
        </div>
      </div> */}



      <TiebaCommentScrollContent />
    </div>


  );
};

export default TiebaDetail;