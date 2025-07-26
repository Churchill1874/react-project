import React, { useState, useEffect } from 'react';
import { Image, Input, Button, Toast, CenterPopup, SpinLoading, Divider } from 'antd-mobile';
import { CloseOutline } from 'antd-mobile-icons';
import '@/pages/lottery/politicslottery/betorder/betpopup/BetPopup.less';
import { Request_GetPlayerInfo } from '@/pages/personal/api'
import { Request_LotteryDealerBet, BetOrderAddReq } from '@/pages/lottery/politicslottery/betorder/api'

interface BetPopupProps {
  visiable: boolean;
  onClose: () => void;
  refresh: () => void;
  dealerId?: string;
  chooseNumber?: number;
  title?: string;
  odds?: number;
  icon?: string;
}

const BetPopup: React.FC<BetPopupProps> = ({
  visiable,
  onClose,
  refresh,
  dealerId,
  chooseNumber,
  title = '',
  odds = 0,
  icon = ''
}) => {
  const [betAmount, setBetAmount] = useState<string>('');
  const [expectedReturn, setExpectedReturn] = useState<number>(0);
  const [maxAmount, setMaxAmount] = useState<number>(0);
  const [beting, setBeting] = useState<boolean>(false)
  const [processing, setProcessing] = useState<boolean>(false)

  useEffect(() => {
    console.log('odds:', odds, 'title:', title, 'icon:', icon)
    //加载用户当前余额
    playerBalanceRequest();
  }, []);

  const playerBalanceRequest = async () => {
    const balance = (await Request_GetPlayerInfo()).data.balance;
    setMaxAmount(balance)
  }

  // 预设金额选项
  const presetAmounts = [50, 100, 500, 1000];

  // 计算预计获利
  useEffect(() => {
    const amount = parseFloat(betAmount) || 0;
    const returnAmount = amount * odds;
    setExpectedReturn(Math.round(returnAmount * 100) / 100);
  }, [betAmount, odds]);

  // 处理输入金额变化
  const handleAmountChange = (value: string) => {
    const numericValue = value.replace(/[^\d.]/g, '');
    if (parseFloat(numericValue) > 10000000) {
      return;
    }
    setBetAmount(numericValue);
  };

  // 选择预设金额
  const handlePresetAmount = (amount: number) => {
    setBetAmount(amount.toString());
  };

  // 全部金额
  const handleMaxAmount = () => {
    setBetAmount(maxAmount.toString());
  };

  // 取消
  const handleCancel = () => {
    setBetAmount('');
    setExpectedReturn(0);
    onClose();
  };

  // 确认下注
  const handleConfirm = async () => {
    if (beting) {
      Toast.show({
        content: '提交中'
      })
      return;
    }
    setBeting(true)
    setProcessing(true)
    try {
      if (!betAmount || parseFloat(betAmount) <= 0) {
        Toast.show({
          content: '请输入金额'
        })
        return;
      }
      if (!dealerId || !chooseNumber) {
        Toast.show({
          content: '网络繁忙'
        })
        return;
      }

      const param: BetOrderAddReq = {
        dealerId,
        chooseNumber,
        betAmount
      }

      const data = (await Request_LotteryDealerBet(param))

      setBeting(false)
      setProcessing(false)
      if (data.code === 0) {
        Toast.show({
          icon: 'success',
          content: '下注成功,祝您好运',
          duration: 1000
        })
        refresh();
        handleCancel();
        playerBalanceRequest();
      }

    } catch (error) {
      setBeting(false)
      setProcessing(false)
    } finally {
      //setBeting(false)
      //setProcessing(false)
    }
  };

  // 点击遮罩关闭
  const handleMaskClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleCancel();
    }
  };

  // 在 return 之前添加这个判断
  if (!visiable) return null;

  return (
    <div className="custom-modal-mask" onClick={handleMaskClick}>
      <div className="custom-modal-container">

        <CenterPopup
          visible={processing}
          onMaskClick={() => setBeting(processing)}
          bodyStyle={{
            width: 'auto',
            minWidth: 60,
            maxWidth: '60vw',
            padding: '20px',
            background: '#fff',
            borderRadius: 8,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <SpinLoading style={{ '--size': '38px' }} color="primary" />
          <div style={{ marginTop: 12, fontSize: 16, color: '#999' }}>提交中</div>
        </CenterPopup>


        <div className="custom-modal-content">
          {/* 头部 */}
          <div className="modal-header">
            <div className="header-info">

              <div className="row-image">
                <Image src={icon}
                  fit="cover" width={52} height={52} />
              </div>

              <div className="bet-details">
                <div className="bet-label">下注内容</div>
                <div className="bet-title">{title}</div>
              </div>
            </div>
            <div className="header-odds">
              <div className="odds-label">赔率</div>
              <div className="odds-value">{odds}</div>
            </div>
            <CloseOutline className="close-icon" onClick={handleCancel} />
          </div>

          {/* 输入金额 */}
          <div className="amount-section">
            <Input
              placeholder="请输入下注金额"
              value={betAmount}
              onChange={handleAmountChange}
              clearable
              className="amount-input"
              type='number'
              max={10000000}
              min={1}
            />

          </div>

          <Divider style={{ marginTop: '0px' }} />

          {/* 预设金额 */}
          <div className="preset-section">
            {presetAmounts.map((amount) => (
              <Button
                key={amount}
                className="preset-btn"
                onClick={() => handlePresetAmount(amount)}
              >
                {amount}
                <span style={{ fontSize: '12px' }}> USDT</span>

              </Button>
            ))}
          </div>

          {/* 全部金额按钮 */}
          <Button className="max-btn" onClick={handleMaxAmount}>
            全部金额 <span style={{ fontSize: '16px' }}>({maxAmount.toLocaleString()})</span>
          </Button>

          {/* 预计获利 */}
          <div className="return-section">
            <span className="return-label">中奖金额</span>
            <span className="return-value">{expectedReturn.toLocaleString()} <span style={{ fontSize: '15px' }}>USDT</span></span>
          </div>

          {/* 操作按钮 */}
          <div className="action-section">
            <Button className="cancel-btn" onClick={handleCancel}>
              取消
            </Button>
            <Button
              className="confirm-btn"
              color="primary"
              onClick={handleConfirm}
              disabled={!betAmount || parseFloat(betAmount) <= 0}
            >
              确认下注
            </Button>
          </div>

          {/* 底部提示 */}
          <div className="bottom-tip">
            请理性投注，量力而行
          </div>
        </div>
      </div>
    </div>
  );
};

export default BetPopup;