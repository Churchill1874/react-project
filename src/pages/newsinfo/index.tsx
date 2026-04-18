import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { NavBar } from 'antd-mobile';
import NewsInfo from '@/components/news/newsinfo/NewsInfo';

const NewsInfoDetail: React.FC = () => {
  const params = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const location = useLocation();

  // 兼容：path param /newsInfo/:id, query ?id=xxx, 或 fallback 从 pathname 解析
  const idFromPath = params.id || new URLSearchParams(location.search).get('id') || (() => {
    const segments = location.pathname.split('/').filter(Boolean);
    const last = segments[segments.length - 1];
    return last && !Number.isNaN(Number(last)) ? last : null;
  })();

  const onBack = () => {
    const fromPath = (location.state as any)?.fromPath;
    if (fromPath) {
      const normalized = fromPath === '/news' ? '/news/news' : fromPath;
      navigate(normalized, { replace: true });
      return;
    }

    // 优先回退历史，避免重新加载列表接口
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate('/news/news');
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#c1e4f91e', overflowY: 'auto' }}>
      <NavBar onBack={onBack} style={{fontWeight:'600'}}>
        国内新闻数据源详情
      </NavBar>

      {idFromPath ? (
        <div style={{ padding: '0px 10px'}}>
          <div
            style={{
              background: '#ffffff',
              borderRadius: 12,
              padding: '5px 10px',
              boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)',
              minHeight: 'calc(100vh - 56px - 20px)',
            }}
          >
            <NewsInfo
              commentRef={null}
              id={Number(idFromPath)}
              needCommentPoint={false}
              commentPointId={null}
              showHeader={false}
            />
          </div>
        </div>
      ) : (
        <div style={{ padding: '10px', color: '#999' }}>
          未找到国内新闻详情ID，请检查URL格式，需为 <code>/newsInfo/&lt;id&gt;</code> 或 <code>?id=123</code>
        </div>
      )}
    </div>
  );
};

export default NewsInfoDetail;
