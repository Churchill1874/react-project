import { useParams, useNavigate } from 'react-router-dom';
import ExposureInfo from '@/components/exposure/exposureinfo/ExposureInfo';

const ExposureDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  return (
    <div style={{ minHeight: '100vh', overflowY: 'auto' }}>
      {id ? (
        <ExposureInfo id={id} onClose={() => navigate('/news/exposure')} />
      ) : (
        <div>未找到曝光详情 ID</div>
      )}
    </div>
  );
};

export default ExposureDetail;
