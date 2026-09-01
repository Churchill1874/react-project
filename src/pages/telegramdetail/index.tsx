// 目标路径: src/pages/telegramdetail/index.tsx
// SEO: 电报频道/群组独立详情页，可被搜索引擎收录（对应路由 /telegram/:id，非弹窗）
import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Image, Skeleton } from 'antd-mobile';
import { LeftOutline, SendOutline, ClockCircleOutline, ScanCodeOutline } from 'antd-mobile-icons';
import { Helmet } from 'react-helmet-async';
import { TelegramType, TelegramFindReqType, TelegramFind_Requset } from '@/components/telegram/api';
import { getImgUrl } from '@/utils/commentUtils';
import dayjs from 'dayjs';
import '@/components/telegram/Telegram.less';

const TelegramDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [telegram, setTelegram] = useState<TelegramType | null>(null);

  const fetchDetail = async () => {
    if (!id) return;
    const param: TelegramFindReqType = { id };
    const resp = await TelegramFind_Requset(param);
    if (resp?.data) {
      setTelegram(resp.data);
    }
  };

  useEffect(() => {
    setTelegram(null);
    fetchDetail();
  }, [id]);

  const descParagraphs = (telegram?.description || '').split(/\n+/).filter(Boolean);

  return (
    <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', WebkitOverflowScrolling: 'touch', paddingBottom: 'calc(20px + env(safe-area-inset-bottom))' }}>
      {telegram && (
        <Helmet>
          <title>{telegram.title}（{telegram.account}）- 电报{telegram.type === 1 ? '频道' : '群组'}详情｜灰亚新闻</title>
          <meta name="description" content={(telegram.description || telegram.title).slice(0, 120).replace(/\s+/g, ' ')} />
          <meta property="og:title" content={`${telegram.title}（${telegram.account}）`} />
          <meta property="og:description" content={(telegram.description || telegram.title).slice(0, 120).replace(/\s+/g, ' ')} />
          {telegram.posterImagePath && <meta property="og:image" content={getImgUrl(telegram.posterImagePath)} />}
        </Helmet>
      )}

      {/* 顶部渐变返回栏 */}
      <div className="telegram-detail-header">
        <div className="telegram-detail-back" onClick={() => navigate('/news/telegram')}>
          <span><LeftOutline fontSize={18} /></span>
          <span>返回列表</span>
        </div>
      </div>

      {!telegram && (
        <div style={{ padding: '12px' }}>
          <Skeleton.Title animated />
          <Skeleton.Paragraph lineCount={8} animated />
        </div>
      )}

      {telegram && (
        <>
          <div className="telegram-detail-poster">
            <Image src={getImgUrl(telegram.posterImagePath)} alt={telegram.title} fit="cover" />
          </div>

          <div className="telegram-detail-card">
            <div className="telegram-detail-title-row">
              <h1>{telegram.title}</h1>
              <span
                className={
                  'telegram-detail-badge ' +
                  (telegram.type === 1 ? 'telegram-detail-badge--channel' : 'telegram-detail-badge--group')
                }
              >
                <SendOutline fontSize={11} />
                {telegram.type === 1 ? '频道' : '群组'}
              </span>
            </div>

            <div className="telegram-detail-meta-list">
              <div className="telegram-detail-meta-item">
                <SendOutline fontSize={15} />
                Telegram 账号：<span className="telegram-detail-account-value">{telegram.account}</span>
              </div>
              <div className="telegram-detail-meta-item">
                <ClockCircleOutline fontSize={15} />
                创建时间：<strong>{telegram.createTime && dayjs(telegram.createTime).format('YYYY-MM-DD')}</strong>
              </div>
            </div>

            <a className="telegram-detail-cta" href={telegram.jumpUrl} target="_blank" rel="noopener noreferrer">
              <SendOutline fontSize={14} style={{ marginRight: 6, verticalAlign: '-2px' }} />
              打开 Telegram 加入{telegram.type === 1 ? '频道' : '群组'}
            </a>

            {telegram.qrImagePath && (
              <div className="telegram-detail-qr-block">
                <div className="telegram-detail-qr-block__img">
                  <img src={getImgUrl(telegram.qrImagePath)} alt="扫码加入" />
                </div>
                <div className="telegram-detail-qr-block__text">
                  <h3><ScanCodeOutline fontSize={14} style={{ marginRight: 4, verticalAlign: '-2px' }} />扫码加入{telegram.type === 1 ? '频道' : '群组'}</h3>
                  <p>使用 Telegram App 扫一扫，或长按图片识别二维码</p>
                </div>
              </div>
            )}

            <div className="telegram-detail-desc">
              <h2>{telegram.type === 1 ? '频道' : '群组'}介绍</h2>
              {descParagraphs.length > 0
                ? descParagraphs.map((p, idx) => <p key={idx}>{p}</p>)
                : <p>{telegram.description}</p>}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default TelegramDetail;
