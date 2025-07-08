import React from 'react';
import { Image, Button, Divider } from 'antd-mobile';
import { ClockCircleOutline, CalendarOutline, ExclamationCircleOutline, HandPayCircleOutline } from 'antd-mobile-icons';
import '@/pages/lottery/politicslottery/politicsevent/PoliticsEvent.less';

const PoliticsEvent: React.FC = () => {
  return (
    <div className="cards-container">

      {/* ====== 欧洲杯（三个选项）====== */}
      <div className="prediction-card">
        <div className="card-title">2024 年欧洲杯冠军预测</div>
        <div className="card-subtitle">
          预测 2024 年欧洲杯最终冠军。以欧足联官方公布为准。
        </div>

        <div className="options-row options-three">
          <div className="option-item">
            <Image src="france.png" width={60} height={60} fit="cover" style={{ borderRadius: '50%' }} />
            <div className="option-label">法国队</div>
          </div>
          <div className="option-item">
            <Image src="germany.png" width={60} height={60} fit="cover" style={{ borderRadius: '50%' }} />
            <div className="option-label">德国队</div>
          </div>
          <div className="option-item">
            <Image src="england.png" width={60} height={60} fit="cover" style={{ borderRadius: '50%' }} />
            <div className="option-label">英格兰队</div>
          </div>
        </div>

        <div className="info-card">
          <div className="info-item">
            <ClockCircleOutline style={{ color: 'gray' }} className="info-icon" />
            截止下注：2024-07-14 23:59
          </div>
          <div className="info-item">
            <CalendarOutline style={{ color: 'gray' }} className="info-icon" />
            开奖时间：2024-07-15 02:00
          </div>
          <div className="info-item">
            <HandPayCircleOutline style={{ color: 'gray' }} className="info-icon" />

            最小奖池担保金：<span style={{ color: '#1890ff', fontWeight: 'bold', marginRight: '3px' }}> 1000 </span>  USDT
          </div>
          <Divider className='divider-line' />
          <div className="info-item">
            <div>
              <ExclamationCircleOutline style={{ color: 'orange' }} className="info-icon" />
            </div>
            <div style={{ letterSpacing: '0.8px' }}>
              如无人中奖,担保金全额退回。若有中奖者,系统自动从奖池派发奖金后退回余额到您的账户。
              未中奖玩家的下注金额将作为您的收益。开奖后,收益与奖池余额将全部退回到您的账户,平台仅收取您收益的   <span style={{ color: 'green' }}>10% </span>  手续费。
            </div>
          </div>

        </div>

        <Button color="primary" block className="card-button">
          开设盘口
        </Button>
      </div>

      {/* ====== 台湾领导人选举（两个选项）====== */}
      <div className="prediction-card">
        <div className="card-title">2025 年台湾地区领导人选举结果预测</div>
        <div className="card-subtitle">
          本次选举将于 2025 年 1 月举行，开放预测最终当选人选。结果以中央选举委员会正式公布为准。
        </div>

        <div className="options-row options-two">
          <div className="option-item">
            <Image src="dpp.png" width={60} height={60} fit="cover" style={{ borderRadius: '50%' }} />
            <div className="option-label">民进党候选人</div>
          </div>
          <div className="option-item">
            <Image src="kmt.png" width={60} height={60} fit="cover" style={{ borderRadius: '50%' }} />
            <div className="option-label">国民党候选人</div>
          </div>
        </div>

        <div className="info-card">
          <div className="info-item">
            <ClockCircleOutline style={{ color: 'gray' }} className="info-icon" />
            截止下注：2025-01-12 20:00
          </div>
          <div className="info-item">
            <CalendarOutline style={{ color: 'gray' }} className="info-icon" />
            开奖时间：2025-01-13 10:00
          </div>
          <div className="info-item">
            <HandPayCircleOutline style={{ color: 'gray' }} className="info-icon" />
            最小担保金：<span style={{ color: '#1890ff', fontWeight: 'bold', marginRight: '3px' }}> 800 </span> USDT
          </div>
          <Divider className='divider-line' />
          <div className='info-item'>
            <div>
              <ExclamationCircleOutline style={{ color: 'orange' }} className='info-icon' />
            </div>
            <div style={{ letterSpacing: '0.8px' }}>
              如无人中奖,担保金全额退回。若有中奖者,系统自动从奖池派发奖金后退回余额到您的账户。
              未中奖玩家的下注金额将作为您的收益。开奖后,收益与奖池余额将全部退回到您的账户,平台仅收取您收益的  <span style={{ color: 'green' }}>10%</span>  手续费。
            </div>
          </div>

        </div>

        <Button color="primary" block className="card-button">
          开设盘口
        </Button>
      </div>

    </div>
  );
};

export default PoliticsEvent;
