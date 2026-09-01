import { useParams, useNavigate } from 'react-router-dom';
import { NavBar } from 'antd-mobile';
import PoliticsInfo from '@/components/politics/politicsinfo/PoliticsInfo';

const PoliticsDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  return (
    <div style={{
      marginBottom: '100px', minHeight: '100vh', overflowY: 'auto', height: '100vh', paddingBottom: 'calc(20px + env(safe-area-inset-bottom))', // 底部导航栏已改成右上角菜单按钮，不用再留那么多了
    }}>
      <NavBar onBack={() => navigate('/news/politics')}>
        政闻详情
      </NavBar>

      {id ? (
        <div style={{ padding: '0px 10px' }}>
          <PoliticsInfo
            commentRef={null}
            id={id}
            setVisibleCloseRight={() => navigate('/news/politics')}
            needCommentPoint={false}
            commentPointId={null}
            showHeader={false}
          />
        </div>
      ) : (
        <div>未找到政闻详情 ID</div>
      )}
    </div>
  );
};

export default PoliticsDetail;
