import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Card, Divider, Tag, Swiper, Image, ImageViewer, Skeleton } from 'antd-mobile';
import { LeftOutline, LocationFill } from 'antd-mobile-icons';
import { FcReading } from 'react-icons/fc';
import Comment from '@/components/comment/Comment';
import { SoutheastAsiaNewsType, SoutheastAsiaFindReqType, SoutheastAsiaFind_Requset } from '@/components/southeastasia/api';
import { getImgUrl } from '@/utils/commentUtils';
import dayjs from 'dayjs';
import '@/components/southeastasia/SoutheastAsia.less'
import useStore from '@/zustand/store';

const SoutheastAsiaDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [southeastAsia, setSoutheastAsia] = useState<SoutheastAsiaNewsType | null>(null);
  const [visible, setVisible] = useState(false);

  const getImages = () => {
    return southeastAsia?.imagePath
      ? southeastAsia.imagePath.split('||').filter(Boolean).map((item: string) => getImgUrl(item))
      : [];
  };

  const fetchDetail = async () => {
    if (!id) return;
    const param: SoutheastAsiaFindReqType = { id };
    const resp = await SoutheastAsiaFind_Requset(param);
    if (resp?.data) {
      // ✅ SEO核心：动态更新每篇文章的title和description
      document.title = `${resp.data.title} - 灰亚新闻`;
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) {
        metaDesc.setAttribute(
          'content',
          resp.data.content?.slice(0, 120) || resp.data.title
        );
      }

      setSoutheastAsia({ ...resp.data, viewCount: (resp.data.viewCount || 0) + 1 });


      // ✅ 同步列表缓存浏览量 +1
      const { getNewsListCache, setNewsListCache } = useStore.getState();
      const cache = getNewsListCache('southeastAsia');
      if (cache) {
        const newData = cache.data.map((item: any) =>
          String(item.id) === String(id)
            ? { ...item, viewCount: (item.viewCount || 0) + 1 }
            : item
        );
        setNewsListCache('southeastAsia', newData, cache.page, cache.hasMore);
      }
    }
  };

  useEffect(() => {
    setSoutheastAsia(null);
    fetchDetail();
    // 离开页面时恢复默认title
    return () => {
      document.title = '灰亚新闻';
    };
  }, [id]);

  return (
    <div style={{ minHeight: '100%', paddingBottom: '60px', padding: '0px 5px', boxSizing: 'border-box' }}>
      {/* 顶部返回栏 */}
      <div
        onClick={() => navigate('/news/southeastAsia')}
        style={{ padding: '10px 12px', display: 'flex', alignItems: 'center', cursor: 'pointer' }}
      >
        <span style={{ paddingRight: '5px', color: 'gray', fontSize: '16px' }}>
          <LeftOutline fontSize={18} />返回
        </span>
        <span style={{ color: 'black', fontSize: '16px', fontWeight: 'bold' }}>东南亚新闻</span>
      </div>

      {/* 加载中骨架屏 */}
      {!southeastAsia && (
        <div style={{ padding: '12px' }}>
          <Skeleton.Title animated />
          <Skeleton.Paragraph lineCount={8} animated />
        </div>
      )}

      {/* 详情内容 */}
      {southeastAsia && (
        <>
          <ImageViewer.Multi
            classNames={{ mask: 'customize-mask', body: 'customize-body' }}
            images={getImages()}
            visible={visible}
            onClose={() => setVisible(false)}
          />

          <Card className="southeastasia-custom-card-container">
            <div className="southeastasia-card-content" style={{ marginBottom: '100px' }}>

              {/* 标题 */}
              <div className="southeast-asia-title">{southeastAsia.title}</div>

              {/* 图片轮播 */}
              {southeastAsia.imagePath?.trim() && (
                <div className="southeastasia-news-image-container">
                  <Swiper loop autoplay allowTouchMove>
                    {southeastAsia.imagePath
                      .split('||')
                      .filter(Boolean)
                      .map((imagePath: string, index: number) => (
                        <Swiper.Item className="swiper-item" key={index}>
                          <Image
                            fit="contain"
                            width={300}
                            height={200}
                            src={getImgUrl(imagePath)}
                            onClick={() => setVisible(true)}
                          />
                        </Swiper.Item>
                      ))}
                  </Swiper>
                </div>
              )}

              {/* 正文内容 */}
              <div
                className="southeast-asia-text-area"
                style={{ whiteSpace: 'pre-wrap', lineHeight: '1.5', padding: '8px 0', letterSpacing: "1px" }}
              >
                {southeastAsia.content}
              </div>

              {/* 来源 / 时间 / 标签 */}
              <span className="southeastasia-time">
                {southeastAsia.isTop && <Tag className="southeastasia-tag" color="#a05d29">置顶</Tag>}
                {southeastAsia.isHot && <Tag className="southeastasia-tag" color="red" fill="outline">热门</Tag>}
                {southeastAsia.source && (
                  <span className="southeastasia-tag">
                    来源: <span className="source">{southeastAsia.source}</span>
                  </span>
                )}
                {southeastAsia.createTime && dayjs(southeastAsia.createTime).format('YYYY-MM-DD HH:mm')}
              </span>

              {/* 地区 / 浏览数 */}
              <div className="button-info-inner">
                <span className="tracking">
                  <span className="city">
                    <LocationFill className="area" />{southeastAsia.area}
                  </span>
                </span>
                <span className="tracking">
                  <span className="icon-and-text">
                    <FcReading fontSize={17} />
                    <span className="number">{southeastAsia.viewCount}</span>
                  </span>
                </span>
                <span className="tracking">
                  <Divider className="line">共 {southeastAsia.commentsCount} 条评论</Divider>
                </span>
              </div>

              {/* 评论组件 */}
              <Comment
                needCommentPoint={false}
                commentPointId={null}
                setSoutheastAsiaNews={setSoutheastAsia}
                newsId={id}
                newsType={2}
                ref={null}
              />
            </div>
          </Card>
        </>
      )}
    </div>
  );
};

export default SoutheastAsiaDetail;