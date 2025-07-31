import React, { useState, useEffect } from 'react';
import '@/pages/hall/newscard/NewsCard.less';

interface NewsItem {
  id: number;
  title: string;
  publishTime: string;
  category: string;
  summary: string;
  views: string;
  comments: string;
  likes: string;
  hotTag: string;
}

const NewsCard: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [newsData, setNewsData] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNewsData = async () => {
      try {
        setLoading(true);

        const response = await fetch('/api/news/hot');

        if (!response.ok) {
          throw new Error('获取新闻数据失败');
        }

        const data = await response.json();
        setNewsData(data.data || data);

      } catch (err) {
        console.error('获取新闻数据失败:', err);

        setNewsData([
          {
            id: 1,
            title: 'ChatGPT-5正式发布！AI能力再次飞跃，震撼全球科技界',
            publishTime: '刚刚发布',
            category: '科技',
            summary: 'OpenAI最新发布的ChatGPT-5在推理能力、创作能力方面实现重大突破，多项测试超越人类专家水平...',
            views: '2360000',
            comments: '5847',
            likes: '12356',
            hotTag: '热度爆表'
          },
          {
            id: 2,
            title: '全球股市暴涨！科技股涨幅超15%，投资者疯狂入场',
            publishTime: '8分钟前',
            category: '财经',
            summary: '受AI技术突破利好影响，全球主要股指集体大涨，科技巨头股价创历史新高，投资热情空前高涨...',
            views: '1890000',
            comments: '3294',
            likes: '8756',
            hotTag: '涨势如虹'
          },
          {
            id: 3,
            title: '新能源车销量再创记录！特斯拉、比亚迪领跑市场',
            publishTime: '25分钟前',
            category: '汽车',
            summary: '最新数据显示，本月新能源汽车销量同比暴增120%，市场渗透率首次突破60%，传统燃油车销量持续萎缩...',
            views: '1420000',
            comments: '2567',
            likes: '6894',
            hotTag: '绿色出行'
          },
          {
            id: 4,
            title: '重磅！国家出台AI教育新政，中小学将全面普及人工智能课程',
            publishTime: '42分钟前',
            category: '教育',
            summary: '教育部最新发布政策文件，人工智能将成为中小学必修课程，培养数字时代原住民，为未来社会输送AI人才...',
            views: '218000',
            comments: '4923',
            likes: '11245',
            hotTag: '教育变革'
          },
          {
            id: 5,
            title: '气候峰会达成历史性协议！全球承诺2030年实现碳中和',
            publishTime: '1小时前',
            category: '环境',
            summary: '经过激烈谈判，各国领导人在联合国气候峰会上达成重要共识，承诺大幅提前碳中和目标，共同应对气候危机...',
            views: '167000万',
            comments: '3156',
            likes: '7894',
            hotTag: '绿色未来'
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchNewsData();
  }, []);

  useEffect(() => {
    if (newsData.length === 0) return;

    const interval = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % newsData.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [newsData.length]);

  const getCategoryEmoji = (category: string): string => {
    const categoryMap: { [key: string]: string } = {
      '科技': '🔥',
      '财经': '📈',
      '汽车': '⚡',
      '教育': '🎓',
      '环境': '🌱'
    };
    return categoryMap[category] || '🏷️';
  };

  const formatViews = (views: string): string => {
    const num = parseInt(views);
    if (num >= 10000) {
      return (num / 10000).toFixed(1) + '万';
    }
    return views;
  };

  if (loading) {
    return (
      <div className="news-carousel-container">
        <div className="news-carousel-header">
          <div className="header-title">
            <span className="fire-icon">🔥</span>
            <span>热点要闻</span>
            <span className="live-indicator">加载中</span>
          </div>
        </div>
        <div className="news-carousel loading">
          <div className="loading-content">
            📰 正在加载最新资讯...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="news-carousel-container">
      <div className="news-carousel-header">
        <div className="header-title">
          <span className="fire-icon">🔥</span>
          <span>热点要闻</span>
          <span className="live-indicator">实时</span>
        </div>
        <button className="more-button">
          更多 →
        </button>
      </div>

      <div className="news-carousel">
        {newsData.map((news, index) => (
          <div
            key={news.id}
            className={`news-slide ${index === currentSlide ? 'active' : ''}`}
          >
            <div className="news-title">
              {news.title}
            </div>

            <div className="news-meta">
              <span>📅 {news.publishTime}</span>
              <span>🏷️ {news.category}</span>
            </div>

            <div className="news-summary">
              {news.summary}
            </div>

            <div className="news-interactions">
              <div className="interaction-item">
                <span>👁️</span>
                <span>{formatViews(news.views)}</span>
              </div>

              <div className="interaction-item">
                <span>💬</span>
                <span>{news.comments}</span>
              </div>

              <div className="interaction-item">
                <span>👍</span>
                <span>{news.likes}</span>
              </div>

              <div className="interaction-item">
                <span>{getCategoryEmoji(news.category)}</span>
                <span>{news.hotTag}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="carousel-dots">
        {newsData.map((_, index) => (
          <span
            key={index}
            className={`dot ${index === currentSlide ? 'active' : ''}`}
            onClick={() => setCurrentSlide(index)}
          />
        ))}
      </div>
    </div>
  );
};

export default NewsCard;