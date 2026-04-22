import React, { useEffect, useState } from 'react';
import { Card, Avatar, Tag, PullToRefresh, DotLoading, InfiniteScroll, Skeleton, Image, Toast } from 'antd-mobile';
import '@/pages/lottery/politicslottery/betorder/BetOrder.less';
import { LeftOutline } from 'antd-mobile-icons';
import { useNavigate, useParams } from 'react-router-dom';
import avatars from '@/common/avatar';
import { BetOrderType, BetOrderPageReq, Request_LotteryDealerPlayerPage, Request_LotteryDealerQueryPage } from '@/pages/lottery/politicslottery/betorder/api'
import dayjs from 'dayjs'

const ScrollContent = ({ hasMore }: { hasMore?: boolean }) => {
  return (
    <>
      {hasMore ? (
        <>
          <div className="dot-loading-custom" >
            <span >加载中</span>
            <DotLoading color='black' />
          </div>
        </>
      ) : (
        <span color='#fff'>---</span>
      )}
    </>
  )
}

const BetOrder: React.FC = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [dealerPageNum, setDealerPageNum] = useState<number>(1)
  const [lotteryDealerList, setLotteryDealerList] = useState<BetOrderType[]>([]);
  const { dealerId } = useParams();

  useEffect(() => {
    setTimeout(() => {
      window.scrollTo(0, 0);
      document.body.scrollTop = 0; // Safari 兼容
      document.documentElement.scrollTop = 0; // 其他浏览器
    }, 0);


  }, [])


  //获取api玩家当前注单
  const lotteryDealerPageRequest = async (isReset: boolean) => {
    if (loading) {
      return;
    }
    setLoading(true);
    const pageNum = isReset ? 1 : dealerPageNum;
    let param: BetOrderPageReq = { pageNum: pageNum, pageSize: 20, type: 1 };


    if (dealerId) {
      param = { ...param, dealerId: dealerId }
    }

    const fn = dealerId ? Request_LotteryDealerQueryPage : Request_LotteryDealerPlayerPage;
    const list: BetOrderType[] = (await fn(param)).data.records || [];


    //循环便利
    if (list.length > 0) {
      if (isReset) {
        setDealerPageNum(() => 2);
        setLotteryDealerList(list);
        setHasMore(true);
      } else {
        if (JSON.stringify(list) !== JSON.stringify(lotteryDealerList)) {
          setDealerPageNum(prev => (prev + 1))
          setLotteryDealerList([...lotteryDealerList, ...list])
          setHasMore(true)
        } else {
          setHasMore(false)
        }
      }
    } else {
      if (pageNum === 1) {
        Toast.show('暂无下注数据')
      }

      setHasMore(false)
    }

    setLoading(false);
  }


  const getStatusColor = (status: string) => {
    switch (status) {
      case '0':
        return 'primary';
      case '1':
        return 'success';
      case '2':
        return 'danger';
      default:
        return 'default';
    }
  };

  const getStatusName = (status: string) => {
    switch (status) {
      case '0':
        return '待开奖';
      case '1':
        return '恭喜中奖';
      case '2':
        return '未中奖';
      case '3':
        return '取消事件';
      default:
        return '待开奖';
    }
  };

  return (
    <>
      <div className="dealer-header">
        <span onClick={() => navigate(-1)}>
          <LeftOutline fontSize={18} />
          返回
        </span>
        <span className="header-title"><span style={{ fontSize: '13px' }}>📊</span> {dealerId ? '' : '您的'}投注记录</span>
      </div>

      <div className="bet-cards-container">

        {(!lotteryDealerList || lotteryDealerList.length === 0) && loading
          &&
          <>
            <Skeleton.Title animated />
            <Skeleton.Paragraph lineCount={8} animated />
          </>
        }

        <PullToRefresh onRefresh={() => lotteryDealerPageRequest(true)} >
          {lotteryDealerList.map((bet) => (
            <Card key={bet.id} className="bet-card">
              {/* 卡片头部 */}
              <div className="card-header">
                <div className="header-left">
                  <div className="card-title"><span style={{ color: 'gray', fontSize: '14px', fontWeight: '500' }}> </span>{bet.title}</div>
                  <div className="card-id">
                    <span style={{ fontSize: '13px' }}><span style={{ fontSize: '12px' }}>🆔</span>: {bet.id}</span>
                  </div>
                </div>
                <div className="header-right">
                  <Tag color={getStatusColor(String(bet.status))} className="status-tag">
                    {getStatusName(String(bet.status))}
                  </Tag>
                  <div className="amount">

                    <span style={{ display: 'flex', alignItems: 'center', fontSize: '13px', fontWeight: '400', color: '#666' }}>奖金<span style={{ fontSize: '11px' }}>💰</span></span>
                    <span style={{ fontSize: '15px' }}> {bet.amount} </span>
                    <span style={{ fontSize: '13px' }}> U</span>
                  </div>

                </div>
              </div>

              {/* 投注信息 */}
              <div className="bet-info-section">
                <div className="bet-labels">
                  <span className="label">投注选项</span>
                  <span className="label">赔率</span>
                  <span className="label">投注金额</span>
                </div>
                <div className="bet-values">
                  <span className="bet-option">{bet.choose}</span>
                  <span className="odds">{bet.odds}</span>
                  <span className="bet-amount">{bet.betAmount} <span style={{ fontSize: '13px' }}>U</span></span>
                </div>
              </div>

              {/* 底部用户信息 */}
              <div className="card-footer">
                <div className="time-info">
                  <div className="timestamp">下注时间: {dayjs(bet.createTime).format("YYYY年MM月DD")} </div>
                  <div className="timestamp">开奖时间: {dayjs(bet.drawTime).format("YYYY年MM月DD")} </div>
                </div>
                <div className="creator-info">
                  <Avatar className="creator-avatar" src={avatars[bet.playerAvatar]} />
                  <div className="creator-details">
                    <span className="creator-name">{bet.playerName}</span>
                    <span className="creator-level">LV.{bet.playerLevel}</span>
                  </div>
                </div>

              </div>
            </Card>
          ))}

        </PullToRefresh>

        <InfiniteScroll loadMore={() => lotteryDealerPageRequest(false)} hasMore={hasMore}>
          <ScrollContent hasMore={hasMore} />
        </InfiniteScroll>

      </div>
    </>
  );
};

export default BetOrder;