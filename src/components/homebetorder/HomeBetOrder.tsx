import React from 'react';
import '@/components/homebetorder/HomeBetOrder.less'
import { Divider, Avatar } from 'antd-mobile'
import { BetRecord } from '@/pages/home/api';
import avatars from '@/common/avatar';

type Props = {
  betOrderList?: BetRecord[]
}

const HomeBetOrder: React.FC<Props> = ({ betOrderList }) => {


  const getStatusText = (status: number) => {
    switch (status) {
      case 0: return '待开奖';
      case 1: return '恭喜中奖';
      case 2: return '未中奖';
      case 3: return '取消';
      default: return '未知';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('zh-CN', {
      style: 'currency',
      currency: 'CNY',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (

    <div>
      {
        betOrderList?.map((record, index) => (
          <div key={record.id} className="record-card">
            <div className="card-header">
              <div className={`status-badge status-${record.status}`}>
                {getStatusText(record.status)}
              </div>

              <div className="event-info">
                <div className="event-name"> {record.title}</div>
                <div className="bet-content">
                  <div className="bet-details">
                    <div className="bet-text">{record.choose} <span style={{ color: 'gray', fontWeight: '400', fontSize: '11px' }}> #ID:{record.id}</span></div>
                    <div className="odds">赔率: {record.odds}  </div>
                  </div>
                  <div className="amounts">
                    <div className="amount-item">
                      <div className="amount-label">下注</div>
                      <div className="amount-value bet-amount">-{record.betAmount}</div>
                    </div>
                    <div className="amount-item">
                      <div className="amount-label">{record.status === 1 ? '中奖' : '预期'}</div>
                      <div className="amount-value win-amount">
                        {record.status === 2 ? '-' : '+' + record.amount}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="user-info-out">
                <div className="user-info">
                  <Avatar src={avatars[record.playerAvatar]} alt={record.playerName} className="avatar" />
                  <div className="user-details">
                    <span>{record.playerName}</span>
                    <div className="user-meta">
                      <span style={{ fontSize: '11px' }}>lv.{record.playerLevel}</span>
                      <span style={{ fontSize: '11px' }}>ID: {record.playerId}</span>
                    </div>
                  </div>
                </div>
                <div className="user-info">
                  <div className="card-footer">
                    <div>{record.drawTime}</div>
                  </div>
                </div>
              </div>
            </div>

            {betOrderList.length != index + 1 &&
              <Divider style={{ padding: '0px', margin: '0px' }} />
            }

          </div>
        ))}

    </div>
  );
};

export default HomeBetOrder;