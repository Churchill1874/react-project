// 目标路径: src/components/telegram/Telegram.tsx
// 电报频道/群组列表组件，用法与 Society.tsx / SoutheastAsia.tsx 完全一致：
// 作为 News.tsx 里 CapsuleTabs 的一个 tab 内容渲染。
import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Image, PullToRefresh, Skeleton } from 'antd-mobile';
import { ClockCircleOutline, SendOutline } from 'antd-mobile-icons';
import '@/components/telegram/Telegram.less';
import { TelegramPageReqType, TelegramType, TelegramPage_Request } from '@/components/telegram/api';
import dayjs from 'dayjs';
import { getImgUrl } from '@/utils/commentUtils';
import useStore from '@/zustand/store';

const CACHE_KEY = 'telegram';

const Telegram: React.FC = () => {
  const { getNewsListCache, setNewsListCache, setNewsScrollPosition, getNewsScrollPosition, getLastReadItemId, setLastReadItemId } = useStore();

  const [telegramList, setTelegramList] = useState<TelegramType[]>(() => {
    const cache = getNewsListCache(CACHE_KEY);
    return cache ? cache.data : [];
  });
  const [telegramHasMore, setTelegramHasMore] = useState<boolean>(() => {
    const cache = getNewsListCache(CACHE_KEY);
    return cache ? cache.hasMore : false;
  });
  const [telegramPage, setTelegramPage] = useState<number>(() => {
    const cache = getNewsListCache(CACHE_KEY);
    return cache ? cache.page : 1;
  });
  const [initialLoading, setInitialLoading] = useState<boolean>(() => {
    const cache = getNewsListCache(CACHE_KEY);
    return !cache || cache.data.length === 0;
  });

  const loadingRef = useRef<boolean>(false);
  const pageRef = useRef<number>(telegramPage);
  const hasMoreRef = useRef<boolean>(telegramHasMore);

  useEffect(() => {
    pageRef.current = telegramPage;
  }, [telegramPage]);

  useEffect(() => {
    hasMoreRef.current = telegramHasMore;
  }, [telegramHasMore]);

  const telegramPageRequest = async (isReset: boolean) => {
    if (loadingRef.current) return;
    loadingRef.current = true;

    const pageNum = isReset ? 1 : pageRef.current;
    try {
      const param: TelegramPageReqType = { pageNum, pageSize: 20 };
      const list: TelegramType[] = (await TelegramPage_Request(param)).data.records || [];

      if (list.length > 0) {
        if (isReset) {
          pageRef.current = 2;
          setTelegramPage(2);
          setTelegramList(list);
          setTelegramHasMore(true);
          setNewsListCache(CACHE_KEY, list, 2, true);
        } else {
          const newPage = pageNum + 1;
          pageRef.current = newPage;
          setTelegramPage(newPage);
          setTelegramList(prev => {
            const combined = [...prev, ...list];
            setNewsListCache(CACHE_KEY, combined, newPage, true);
            return combined;
          });
          setTelegramHasMore(true);
        }
      } else {
        setTelegramHasMore(false);
        const cache = getNewsListCache(CACHE_KEY);
        if (cache) setNewsListCache(CACHE_KEY, cache.data, cache.page, false);
      }
    } finally {
      loadingRef.current = false;
      setInitialLoading(false);
    }
  };

  // 监听滚动容器（News.tsx 提供的 .news-content）触底加载更多
  useEffect(() => {
    const container = document.querySelector('.news-content');
    if (!container) return;
    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container as HTMLElement;
      if (scrollHeight - scrollTop - clientHeight < 50 && hasMoreRef.current && !loadingRef.current) {
        telegramPageRequest(false);
      }
    };
    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, []);

  const hasRequestedRef = useRef(false);
  useEffect(() => {
    if (hasRequestedRef.current) return;
    hasRequestedRef.current = true;
    if (telegramList.length === 0) {
      telegramPageRequest(true);
    }
  }, []);

  // 恢复上次阅读位置
  useEffect(() => {
    const lastId = getLastReadItemId(CACHE_KEY);
    const container = document.querySelector('.news-content') as HTMLElement | null;

    if (container) {
      const savedPosition = getNewsScrollPosition(CACHE_KEY);
      const maxScroll = container.scrollHeight - container.clientHeight;
      if (savedPosition > 0 && maxScroll - savedPosition <= 400) {
        container.scrollTop = maxScroll;
        setLastReadItemId(CACHE_KEY, null);
        return;
      }
    }

    if (!lastId) return;

    const scrollToItem = () => {
      const el = document.querySelector(`.telegram-item[data-id="${lastId}"]`) as HTMLElement | null;
      const container = document.querySelector('.news-content') as HTMLElement | null;
      if (el && container) {
        container.scrollTop = Math.max(0, el.offsetTop - 20);
        setLastReadItemId(CACHE_KEY, null);
        return true;
      }
      return false;
    };

    if (!scrollToItem()) {
      let retries = 0;
      const interval = window.setInterval(() => {
        if (scrollToItem() || retries > 5) window.clearInterval(interval);
        retries += 1;
      }, 50);
      return () => window.clearInterval(interval);
    }
  }, [telegramList, getNewsListCache, getLastReadItemId, getNewsScrollPosition, setLastReadItemId]);

  const saveScrollAndItem = (id: string) => {
    const container = document.querySelector('.news-content') as HTMLElement | null;
    if (container) {
      const maxScroll = container.scrollHeight - container.clientHeight;
      const scrollTop = container.scrollTop;
      const isNearBottom = maxScroll - scrollTop <= 400;
      setNewsScrollPosition(CACHE_KEY, isNearBottom ? maxScroll : scrollTop);
      setLastReadItemId(CACHE_KEY, isNearBottom ? null : id);
    } else {
      setLastReadItemId(CACHE_KEY, id);
    }
  };

  return (
    <>
      {initialLoading ? (
        <div className="dot-loading-custom" style={{ padding: '12px' }}>
          <Skeleton.Title animated />
          <Skeleton.Paragraph lineCount={8} animated />
        </div>
      ) : (
        <PullToRefresh onRefresh={() => telegramPageRequest(true)}>
          <div className="telegram-container">
            <div className="telegram-toolbar">
              <span>共 <b>{telegramList.length}</b> 个电报频道与群组</span>
              <span>点击卡片查看详情</span>
            </div>

            <div className="telegram-list">
              {telegramList?.map((telegram, index) => (
                <Link
                  key={telegram.id || index}
                  to={`/telegram/${telegram.id}`}
                  className="telegram-card telegram-item"
                  data-id={telegram.id}
                  onClick={() => saveScrollAndItem(String(telegram.id))}
                >
                  <div className="telegram-card__poster">
                    <Image src={getImgUrl(telegram.posterImagePath)} alt={telegram.title} fit="cover" lazy />
                    <span
                      className={
                        'telegram-card__badge ' +
                        (telegram.type === 1 ? 'telegram-card__badge--channel' : 'telegram-card__badge--group')
                      }
                    >
                      <SendOutline fontSize={11} />
                      {telegram.type === 1 ? '频道' : '群组'}
                    </span>
                  </div>

                  <div className="telegram-card__body">
                    <div className="telegram-card__info">
                      <h2 className="telegram-card__title">{telegram.title}</h2>
                      <div className="telegram-card__meta">
                        <span className="telegram-account">
                          <SendOutline fontSize={12} />
                          {telegram.account}
                        </span>
                        <span className="telegram-time">
                          <ClockCircleOutline fontSize={12} />
                          {telegram.createTime && dayjs(telegram.createTime).format('YYYY-MM-DD')} 创建
                        </span>
                      </div>
                    </div>

                    {telegram.qrImagePath && (
                      <div className="telegram-card__qr">
                        <img src={getImgUrl(telegram.qrImagePath)} alt="二维码" />
                      </div>
                    )}
                  </div>
                </Link>
              ))}
            </div>

            <div style={{ marginTop: 14, textAlign: 'center', paddingBottom: 8 }}>
              <div style={{ fontSize: 10, padding: '0 10px', color: '#B4B2A9', lineHeight: 1.8 }}>
                以上电报频道/群组信息仅作导航展示，请自行核实后加入。
                <br />
                © 2026 GrayAsia. All rights reserved.
              </div>
            </div>
          </div>
        </PullToRefresh>
      )}
    </>
  );
};

export default Telegram;
