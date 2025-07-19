import React from 'react';
import { Card, Avatar, Tag, Space } from 'antd-mobile';
import '@/pages/lottery/politicslottery/betorder/BetOrder.less';
import { LeftOutline } from 'antd-mobile-icons';
import { useNavigate } from 'react-router-dom';
import avatars from '@/common/avatar';

interface BetCardProps {
  id: string;
  title: string;
  status: '已中奖' | '未中奖' | '待开奖';
  amount: string;
  betOption: string;
  odds: string;
  betAmount: string;
  playerName: string;
  timestamp: string;
}

const BetOrder: React.FC = () => {
  const navigate = useNavigate();
  const betData: BetCardProps[] = [
    {
      id: 'BT2024001',
      title: '美国 2024 总统大选',
      status: '已中奖',
      amount: '1075.00',
      betOption: '特朗普 胜选',
      odds: '2.15',
      betAmount: '500',
      playerName: '王博今析师',
      timestamp: '2024-11-06 14:32'
    },
    {
      id: 'EU2024002',
      title: '英国脱欧公投结果',
      status: '未中奖',
      amount: '300.00',
      betOption: '留欧',
      odds: '1.85',
      betAmount: '300',
      playerName: '李博士',
      timestamp: '2024-11-05 09:15'
    },
    {
      id: 'FR2024003',
      title: '法国总统选举',
      status: '待开奖',
      amount: '1320.00',
      betOption: '马克龙',
      odds: '1.65',
      betAmount: '800',
      playerName: '张教授',
      timestamp: '2024-11-04 16:45'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case '已中奖':
        return 'success';
      case '未中奖':
        return 'danger';
      case '待开奖':
        return 'primary';
      default:
        return 'default';
    }
  };

  return (
    <>
      <div className="dealer-header">
        <span onClick={() => navigate(-1)}>
          <LeftOutline fontSize={18} />
          返回
        </span>
        <span className="header-title">投注记录</span>
      </div>

      <div className="bet-cards-container">
        {betData.map((bet) => (
          <Card key={bet.id} className="bet-card">
            {/* 卡片头部 */}
            <div className="card-header">
              <div className="header-left">
                <div className="card-title">{bet.title}</div>
                <div className="card-id">盘口ID: {bet.id}</div>
              </div>
              <div className="header-right">
                <Tag color={getStatusColor(bet.status)} className="status-tag">
                  {bet.status}
                </Tag>
                <div className="amount">
                  奖金 {bet.amount} U
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
                <span className="bet-option">{bet.betOption}</span>
                <span className="odds">{bet.odds}</span>
                <span className="bet-amount">{bet.betAmount} U</span>
              </div>
            </div>

            {/* 底部用户信息 */}
            <div className="card-footer">
              <div className="creator-info">
                <Avatar className="creator-avatar" src={avatars[1]} />
                <div className="creator-details">
                  <span className="creator-name">{bet.playerName}</span>
                  <span className="creator-level">LV.1</span>
                </div>
              </div>
              <div className="time-info">
                <div className="timestamp">{bet.timestamp} 下注</div>
                <div className="timestamp">{bet.timestamp} 开奖</div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </>
  );
};

export default BetOrder;