import React, { useEffect, useState } from 'react';
import { Card, Button, Avatar, Input } from 'antd-mobile';

import {
  FileOutline,
  InformationCircleOutline,
  SetOutline,
  ClockCircleOutline,
  CalendarOutline,
  LeftOutline,
  TagOutline
} from 'antd-mobile-icons';

import '@/pages/lottery/politicslottery/politicsevent/dealerconfig/DealerConfig.less';

const DealearConfig: React.FC<any> = ({ id, setOpenPopup }) => {
  const [pricePool, setPricePool] = useState<string>('100');

  useEffect(() => {
    console.log("id:", id)
  }, [])

  const [configData, setConfigData] = useState([
    {
      id: 1,
      name: '蔡英文',
      type: '短冠',
      odds: 1.8,
      avatar: '/api/placeholder/40/40'
    },
    {
      id: 2,
      name: '马英九',
      type: '短冠',
      odds: 2,
      avatar: '/api/placeholder/40/40'
    }
  ]);

  const [focusedItem, setFocusedItem] = useState<number | null>(null);

  const handleOddsChange = (id: number, value: string) => {
    setConfigData(prev =>
      prev.map(item =>
        item.id === id ? { ...item, odds: parseFloat(value) || 0 } : item
      )
    );
  };

  return (

    <>
      <div onClick={() => setOpenPopup(false)} className='dealer-header'>
        <span style={{ paddingRight: '5px', fontSize: '16px' }} ><LeftOutline fontSize={18} />返回 </span>
        <span style={{ color: '#1890ff', fontWeight: 'bold', fontSize: '16px', marginLeft: '10px' }}> 开盘坐庄设置 </span>

      </div>
      <div className="config-page">
        {/* 盒口标题 */}
        <Card className="title-card">
          <div className="card-header">
            <TagOutline className="icon" />
            <span className="title">事件</span>
          </div>
          <div style={{ fontSize: '16px' }} className="content">
            台湾大选
          </div>

          <div className="card-header">
            <InformationCircleOutline className="icon" />
            <span className="title">简介</span>
          </div>
          <div className="content">
            总统选举和时间可看跟美国国会会议，参考bbc新闻
          </div>
        </Card>


        {/* 配置选项 */}
        <Card className="config-card">
          <div className="card-header">
            <SetOutline className="icon" />
            <span className="title">设置赔率</span>
          </div>
          <div className="config-list">
            {configData.map(item => (

              <div
                key={item.id}
                className={`config-item ${focusedItem === item.id ? 'focused' : ''}`}
              >

                <div className="item-left">
                  <Avatar
                    src={item.avatar}
                    className="avatar"
                  />
                  <div className="item-info">
                    <div className="name">{item.name}</div>
                    <div className="type">{item.type}</div>
                  </div>
                </div>
                <div className="odds-input-wrapper">

                  <div style={{ display: 'flex', alignItems: 'center', marginBottom: 3 }}>
                    <span style={{ color: 'red', fontSize: '20px', marginRight: 4 }}>*</span>
                    <Input
                      className="odds-input"
                      value={item.odds.toString()}
                      onChange={(value) => handleOddsChange(item.id, value)}
                      onFocus={() => setFocusedItem(item.id)}
                      onBlur={() => setFocusedItem(null)}
                      placeholder="请输入赔率"
                    />
                  </div>
                </div>

              </div>


            ))}
          </div>

          <div style={{ marginTop: '10px' }} className="card-header">
            <SetOutline className="icon" />
            <span className="title" style={{ fontSize: '15px' }}>奖池 同 担保金设置</span>
          </div>
          <div className="funds-content">
            <div className="current-balance">
              <span className="label">当前余额</span>
              <span className="amount">1,250.00 USDT</span>
            </div>
            <div className="min-deposit">
              <span className="label">最小担保金额 <span style={{ color: '#1890ff', fontWeight: 'bold' }}>100 </span>USDT</span>
              <div className="input-wrapper">
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <span style={{ color: 'red', marginRight: 4, fontSize: '20px' }}>*</span>
                  <Input
                    className="odds-input"
                    value={pricePool}
                    //onChange={(value) => handleOddsChange(item.id, value)}
                    //onFocus={() => setFocusedItem(item.id)}
                    //onBlur={() => setFocusedItem(null)}
                    placeholder="请输入赔率"
                  />
                  <div style={{ color: 'black', fontWeight: 'bold', marginLeft: '5px', fontSize: '15px' }}> USDT </div>

                </div>
              </div>
            </div>
          </div>


          <div className="time-content">
            <div className="time-item">
              <div className="time-label">
                <ClockCircleOutline className="time-icon" />
                <span style={{ color: '#333', letterSpacing: '1px' }}>截止下注:</span><div className="time-value">2025-07-24 23:59</div>
              </div>
            </div>

            <div className="time-item">
              <div className="time-label">
                <CalendarOutline className="time-icon" />
                <span style={{ color: '#333', letterSpacing: '1px' }}>开奖时间:</span>
                <div className="time-value">2025-07-31 20:00</div>
              </div>
            </div>


            <div className="time-item">
              <div className="time-label">
                <FileOutline className="time-icon" />
                <span style={{ color: '#333', letterSpacing: '1px' }}>事件编号:</span>
                <div className="time-value"> {id}2345</div>
              </div>
            </div>

          </div>
        </Card>



        {/* 开盘按钮 */}
        <div className="button-container">
          <Button
            color="success"
            size="large"
            className="open-button"
            block
          >
            开盘
          </Button>
        </div>
      </div>

    </>

  );
};

export default DealearConfig;