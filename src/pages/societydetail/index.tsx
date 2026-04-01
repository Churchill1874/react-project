import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { NavBar, Skeleton } from 'antd-mobile';
import { SocietyFind_Requset, SocietyFindReqType, SocietyType } from '@/components/society/api';
import SocietyInfo from '@/components/society/societyinfo/SocietyInfo';

const SocietyDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [society, setSociety] = useState<SocietyType | null>(null);

  useEffect(() => {
    if (id) {
      societyFindReq();
    }
  }, [id]);

  const societyFindReq = async () => {
    if (!id) return;
    const param: SocietyFindReqType = { id: id };
    const data: SocietyType = (await SocietyFind_Requset(param)).data;
    setSociety(data);
  };

  return (
    <>
      <div style={{ minHeight: '100vh', paddingBottom: '0px', fontWeight:'bold', overflowY: 'auto'}}>
        <NavBar onBack={() => navigate('/news/society')}>
          社会瓜详情
        </NavBar>

        {society ? (
          <div style={{ padding: '0px 10px' }}>
            <SocietyInfo
              commentRef={null}
              id={String(society.id)}
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
