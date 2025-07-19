import React, { useEffect, useRef, useState } from 'react';
import { Card, Button, Avatar, Input, Toast, Dialog } from 'antd-mobile';
import { PoliticsLotteryType } from '@/pages/lottery/politicslottery/politicsevent/api'
import { LotteryDealerAddReq, Request_LotteryDealerAdd } from '@/pages/lottery/politicslottery/lotterydealer/api';
import { Request_GetPlayerInfo, PlayerInfoType } from '@/pages/personal/api';

import {
  FileOutline,
  InformationCircleOutline,
  SetOutline,
  ClockCircleOutline,
  CalendarOutline,
  LeftOutline,
  TagOutline,
  PayCircleOutline
} from 'antd-mobile-icons';

import '@/pages/lottery/politicslottery/politicsevent/dealerconfig/DealerConfig.less';
interface DealearConfigProps {
  setOpenPopup: (open: boolean) => void;
  politicsEvent: PoliticsLotteryType;
}

const DealearConfig: React.FC<DealearConfigProps> = (props) => {
  const [focusedItem, setFocusedItem] = useState<number | null>(null);
  const { politicsEvent } = props;
  const [dealerConfig, setDealerConfig] = useState<LotteryDealerAddReq>(politicsEvent as LotteryDealerAddReq);
  const [loading, setLoading] = useState<boolean>(false);
  const [odds1Tip, setOdds1Tip] = useState<string | null>();
  const [odds2Tip, setOdds2Tip] = useState<string | null>();
  const [odds3Tip, setOdds3Tip] = useState<string | null>();
  const [pricePoolTip, setPricePoolTip] = useState<string | null>();
  const lastRequestTimeRef = useRef<number>(0);
  const [playerInfo, setPlayerInfo] = useState<PlayerInfoType>();

  useEffect(() => {
    getPlayerInfo()
  }, [])

  const getPlayerInfo = async () => {
    const playerInfo = (await Request_GetPlayerInfo()).data
    setPlayerInfo(playerInfo)
  }

  const addDealer = () => {
    //检查投注1配置
    odds1OnBlur()
    //检查投注2配置
    odds2OnBlur()
    //检查投注3配置
    odds3OnBlur()
    //检查奖池担保金
    pricePoolOnBlur();
    //请求下注
    addDealerRequst()
  }

  const addDealerRequst = async () => {
    if (loading) {
      return;
    }

    const currentTime = Date.now();
    console.log('当前时间:', currentTime)
    const timeDiff = currentTime - lastRequestTimeRef.current;
    if (timeDiff < 3000 && lastRequestTimeRef.current !== 0) {
      //弹窗提示
      const result = await Dialog.confirm({
        content: '您刚刚提交过这个开盘申请,确定要继续再次提交吗?',
        confirmText: '确定',
        cancelText: '取消'
      })
      if (!result) {
        return;
      }
    }

    setLoading(true)
    lastRequestTimeRef.current = currentTime;

    const code = (await Request_LotteryDealerAdd(dealerConfig)).code;

    setLoading(false)
    if (code === 0) {
      Toast.show({
        icon: 'success',
        content: '开盘成功,投注菜单中展示'
      })
      return;
    }


    Toast.show({
      icon: 'fail',
      content: '开盘失败,请联系管理员'
    })
    return;
  }

  //校验赔率
  const odds1OnBlur = () => {
    setFocusedItem(null)
    //校验赔率
    if (!dealerConfig.odds1) {
      setOdds1Tip("请设置赔率")
      throw new Error('请设置赔率');
    }
    setOdds1Tip(null);
    const odds1 = parseFloat(dealerConfig.odds1);
    if (odds1 < 0.01) {
      setOdds1Tip("请输入大于0.01倍的赔率")
      throw new Error('请输入大于0.01倍的赔率');
    }
    setOdds1Tip(null);

    if (odds1 > 100) {
      setOdds1Tip("请输入小于100倍的赔率")
      throw new Error('请输入小于100倍的赔率');
    }
    setOdds1Tip(null);

    setFocusedItem(null)
  }

  const odds2OnBlur = () => {
    setFocusedItem(null)
    if (!dealerConfig.odds2) {
      setOdds2Tip("请设置赔率")
      throw new Error('请设置赔率');
    }
    setOdds2Tip(null);

    const odds2 = parseFloat(dealerConfig.odds2);

    if (odds2 > 100) {
      setOdds2Tip("请输入小于100倍的赔率")
      throw new Error('请输入小于100倍的赔率');
    }
    setOdds2Tip(null);

    if (odds2 < 0.01) {
      setOdds2Tip("请输入大于0.01倍的赔率")
      throw new Error('请输入大于0.01倍的赔率');
    }
    setOdds2Tip(null);
  }

  const odds3OnBlur = () => {
    setFocusedItem(null)
    if ((politicsEvent.choose3 && !dealerConfig.odds3)) {
      setOdds3Tip("请设置赔率")
      throw new Error('请设置赔率');
    }
    setOdds3Tip(null);
    if ((politicsEvent.choose3 && dealerConfig.odds3 && parseFloat(dealerConfig.odds3) < 0.01)) {
      setOdds3Tip("请输入大于0.01倍的赔率")
      throw new Error('请输入大于0.01倍的赔率');
    }
    setOdds3Tip(null);

    if ((politicsEvent.choose3 && dealerConfig.odds3 && parseFloat(dealerConfig.odds3) > 100)) {
      setOdds3Tip("请输入小于100倍的赔率")
      throw new Error('请输入小于100倍的赔率');
    }
    setOdds3Tip(null);
  }


  //校验奖池
  const pricePoolOnBlur = () => {
    const odds1 = parseFloat(dealerConfig.odds1 ?? '0');
    const odds2 = parseFloat(dealerConfig.odds2 ?? '0');
    const pricePool = dealerConfig.prizePool ? parseFloat(dealerConfig.prizePool) : 0;
    //校验奖池
    if (!dealerConfig.prizePool) {
      setPricePoolTip("奖池不能为空")
      throw new Error('奖池不能为空');
    }
    setPricePoolTip(null);

    if (parseFloat(dealerConfig.prizePool) < 100) {
      setPricePoolTip("最小担保金额 100 USDT")
      throw new Error('最小担保金额 100 USDT');
    }
    setPricePoolTip(null);

    if (parseFloat(dealerConfig.prizePool) > 1000000) {
      setPricePoolTip("请输入100到1百万之间的奖池担保金额")
      throw new Error('请输入100到1百万之间的奖池担保金额');
    }

    //校验可能投注最小金额后 奖池是否赔得起
    if (odds1 > pricePool || odds2 > pricePool || (politicsEvent.choose3 && dealerConfig.odds3 && parseFloat(dealerConfig.odds3) > pricePool)) {
      setPricePoolTip("奖池不能小于最高赔率,避免无法赔付");
      throw new Error('奖池不能小于最高赔率,避免无法赔付')
    }
    setPricePoolTip(null);
  }

  const handleOddsChange = (key: keyof LotteryDealerAddReq, value: string) => {
    setDealerConfig(prev => ({ ...prev, [key]: value }))
    // 清除对应的提示（优化体验）
    if (key === 'odds1') setOdds1Tip(null);
    if (key === 'odds2') setOdds2Tip(null);
    if (key === 'odds3') setOdds3Tip(null);
  };

  const handlePricePoolChange = (value: string) => {
    setPricePoolTip(null);
    setDealerConfig(prev => ({ ...prev, prizePool: value }))
  }



  return (
    <>
      <div onClick={() => props.setOpenPopup(false)} className='dealer-header'>
        <span style={{ paddingRight: '5px', fontSize: '16px' }} ><LeftOutline fontSize={18} />返回 </span>
        <span style={{ color: '#1890ff', fontWeight: 'bold', fontSize: '16px', marginLeft: '10px' }}> 开盘坐庄设置 </span>

      </div>
      <div className="config-page">
        {/* 标题 */}
        <Card className="title-card">
          <div className="card-header">
            <TagOutline className="icon" />
            <span className="title">事件</span>
          </div>
          <div style={{ fontSize: '16px' }} className="content">
            {politicsEvent.title}
          </div>

          <div className="card-header">
            <InformationCircleOutline className="icon" />
            <span className="title">简介</span>
          </div>
          <div className="content">
            {politicsEvent.rule}
          </div>
        </Card>


        {/* 配置选项 */}
        <Card className="config-card">
          <div className="card-header">
            <SetOutline className="icon" />
            <span className="title">赔率设置</span>
          </div>
          <div className="config-list">


            {/* 配置选项1 */}
            {odds1Tip && <div className='dealer-tip'>{odds1Tip}</div>}
            <div
              className={`config-item ${focusedItem === politicsEvent.choose1 ? 'focused' : ''}`}
            >

              <div className="item-left">
                <Avatar
                  src={politicsEvent.icon1}
                  className="avatar"
                />
                <div className="item-info">
                  <div className="name">{politicsEvent.choose1}</div>
                  <div className="type">{politicsEvent.describe1}</div>
                </div>
              </div>
              <div className="odds-input-wrapper">

                <div style={{ display: 'flex', alignItems: 'center', marginBottom: 3 }}>
                  <span style={{ color: 'red', fontSize: '20px', marginRight: 4 }}>*</span>
                  <Input
                    className="odds-input"
                    value={dealerConfig.odds1}
                    onChange={(value) => handleOddsChange('odds1', value)}
                    onFocus={() => setFocusedItem(politicsEvent.choose1)}
                    onBlur={() => odds1OnBlur()}
                    placeholder="请输入赔率"
                  />
                </div>
              </div>

            </div>


            {/* 配置选项2 */}
            {odds2Tip && <div className='dealer-tip'>{odds2Tip}</div>}
            <div
              className={`config-item ${focusedItem === politicsEvent.icon2 ? 'focused' : ''}`}
            >

              <div className="item-left">
                <Avatar
                  src={politicsEvent.icon2}
                  className="avatar"
                />
                <div className="item-info">
                  <div className="name">{politicsEvent.choose2}</div>
                  <div className="type">{politicsEvent.describe2}</div>
                </div>
              </div>
              <div className="odds-input-wrapper">

                <div style={{ display: 'flex', alignItems: 'center', marginBottom: 3 }}>
                  <span style={{ color: 'red', fontSize: '20px', marginRight: 4 }}>*</span>
                  <Input
                    className="odds-input"
                    value={dealerConfig.odds2}
                    onChange={(value) => handleOddsChange('odds2', value)}
                    onFocus={() => setFocusedItem(politicsEvent.icon2)}
                    onBlur={() => odds2OnBlur()}
                    placeholder="请输入赔率"
                  />
                </div>

              </div>

            </div>


            {/* 配置选项3 */}
            {odds3Tip && <div className='dealer-tip'>{odds3Tip}</div>}
            {
              politicsEvent.choose3 &&

              <div
                className={`config-item ${focusedItem === politicsEvent.icon3 ? 'focused' : ''}`}
              >
                <div className="item-left">
                  <Avatar
                    src={politicsEvent.icon3}
                    className="avatar"
                  />
                  <div className="item-info">
                    <div className="name">{politicsEvent.choose3}</div>
                    <div className="type">{politicsEvent.describe3}</div>
                  </div>
                </div>
                <div className="odds-input-wrapper">

                  <div style={{ display: 'flex', alignItems: 'center', marginBottom: 3 }}>
                    <span style={{ color: 'red', fontSize: '20px', marginRight: 4 }}>*</span>
                    <Input
                      className="odds-input"
                      value={dealerConfig.odds3}
                      onChange={(value) => handleOddsChange('odds3', value)}
                      onFocus={() => setFocusedItem(politicsEvent.icon3)}
                      onBlur={() => odds3OnBlur()}
                      placeholder="请输入赔率"
                    />
                  </div>

                </div>

              </div>
            }
          </div>

          <div style={{ marginTop: '10px' }} className="card-header">
            <SetOutline className="icon" />
            <span className="title" style={{ fontSize: '15px' }}>奖池 同 担保金设置</span>
          </div>
          <div className="funds-content">
            <div className="current-balance">
              <span className="label">当前余额</span>
              <span className="amount">{playerInfo?.balance} <span style={{ color: 'gray', fontSize: '16px' }}>USDT</span></span>
            </div>
            <div className="min-deposit">
              <span className="label">最小担保金额 <span style={{ color: '#1890ff', fontWeight: 'bold' }}>100 </span>USDT</span>
              <div className="guarantee-deposit">
                <span style={{ color: '#056bcaff' }}>声明</span>: 担保金将作为奖池的结算资金,开奖结算后,剩余余额将全额退回您的资金账户
              </div>

              <div className="input-wrapper">
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <span style={{ color: 'red', marginRight: 4, fontSize: '20px' }}>*</span>
                  <Input
                    className="odds-input"
                    value={dealerConfig.prizePool}
                    onChange={(value) => handlePricePoolChange(value)}
                    //onFocus={() => setFocusedItem(item.id)}
                    onBlur={() => pricePoolOnBlur()}
                    placeholder="请输入奖池"
                  />
                  <div style={{ color: 'black', fontWeight: 'bold', marginLeft: '5px', fontSize: '15px' }}> USDT </div>

                </div>
              </div>
            </div>
          </div>
          {pricePoolTip && <div style={{ marginLeft: '20px', color: 'red', letterSpacing: '1px' }}>{pricePoolTip}</div>}


          <div className="time-content">
            <div className="time-item">
              <div className="time-label">
                <PayCircleOutline className="time-icon" />
                <span style={{ color: '#333', letterSpacing: '1px' }}>最小投注:</span><div className="time-value">1 USDT</div>
              </div>
            </div>

            <div className="time-item">
              <div className="time-label">
                <ClockCircleOutline className="time-icon" />
                <span style={{ color: '#333', letterSpacing: '1px' }}>截止下注:</span><div className="time-value">{politicsEvent.endTime}</div>
              </div>
            </div>

            <div className="time-item">
              <div className="time-label">
                <CalendarOutline className="time-icon" />
                <span style={{ color: '#333', letterSpacing: '1px' }}>开奖时间:</span>
                <div className="time-value">{politicsEvent.drawTime}</div>
              </div>
            </div>


            <div className="time-item">
              <div className="time-label">
                <FileOutline className="time-icon" />
                <span style={{ color: '#333', letterSpacing: '1px' }}>事件编号:</span>
                <div className="time-value"> {politicsEvent.id}</div>
              </div>
            </div>

          </div>
        </Card>



        {/* 开盘按钮 */}
        <div className="button-container">
          <Button
            onClick={() => addDealer()}
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