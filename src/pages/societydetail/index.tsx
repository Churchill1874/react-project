import { useParams, useNavigate } from 'react-router-dom';
import { NavBar, Skeleton } from 'antd-mobile';
import SocietyInfo from '@/components/society/societyinfo/SocietyInfo';

const SocietyDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  return (
    <>
      <div style={{ 
      marginBottom: '100px', minHeight: '100vh', overflowY: 'auto', height: '100vh', paddingBottom: 'calc(60px + env(safe-area-inset-bottom))',  // 👈 加这个
}}>
        <NavBar onBack={() => navigate('/news/society')}>
          社会瓜详情
        </NavBar>

        {id ? (
          <div style={{ padding: '0px 10px' }}>
            <SocietyInfo
              commentRef={null}
              id={id}
              setVisibleCloseRight={() => navigate('/news/society')}
              needCommentPoint={false}
              commentPointId={null}
              showHeader={false}
            />
          </div>
        ) : (
          <>
            <Skeleton.Title animated />
            <Skeleton.Paragraph lineCount={8} animated />
          </>
        )}
      </div>
    </>
  );
};

export default SocietyDetail;