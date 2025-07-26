import React, { useState } from 'react';
import {
  Card,
  Tag,
  Button,
  Radio,
  Image,
  ProgressBar,
  Tabs,
  Collapse,
  DotLoading,
  PullToRefresh,
  InfiniteScroll,
  Avatar,
  Popup,
  Skeleton,
  Toast,
  Space,
  SpinLoading
} from 'antd-mobile';
import { RedoOutline, BillOutline, ReceiptOutline, CheckShieldOutline } from 'antd-mobile-icons';
import '@/pages/lottery/politicslottery/lotterydealer/LotteryDealer.less';
import { LotteryDealerReq, Request_LotteryDealerPage, LotteryDealerView } from '@/pages/lottery/politicslottery/lotterydealer/api'
import { levelEnum, colorEnum } from '@/common/LotteryEnum'
import dayjs from 'dayjs'
import avatars from '@/common/avatar';
import OtherPeople from '@/pages/otherpeople/otherpeople';
import { FcSurvey, FcFinePrint } from "react-icons/fc";
import { useNavigate } from 'react-router-dom';
import BetPopup from '@/pages/lottery/politicslottery/betorder/betpopup/BetPopup'

const ScrollContent = ({ hasMore }: { hasMore?: boolean }) => {
  return (
    <>
      {hasMore ? (
        <>
          <div className="dot-loading-custom" >
            <span >加载中</span>
            <DotLoading color='#fff' />
          </div>
        </>
      ) : (
        <span color='#fff'>--- 我是有底线的 ---</span>
      )}
    </>
  )
}

interface BetPopupType {
  odds: number;
  choose: string;
  icon: string;
  dealerId: string;
  chooseNumber: number;
}
const LotteryDealer: React.FC = () => {
  const [selectedOptions, setSelectedOptions] = useState<Record<string, BetPopupType>>({});
  const [selected, setSelected] = useState<Record<string, string>>({});
  const [filter, setFilter] = useState<string>('all');
  const [otherInfoCloseRight, setOtherInfoCloseRight] = useState(false)
  const [otherPlayerId, setOtherPlayerId] = useState<string>()
  const [loading, setLoading] = useState<boolean>(false);
  const [politicsLotteryList, setPoliticsLotteryList] = useState<LotteryDealerView[]>([]);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [lotteryPageNum, setLotteryPageNum] = useState<number>(1);
  const navigate = useNavigate();
  const [visiable, setVisiable] = useState<boolean>(false);
  const [betPopup, setBetPopup] = useState<BetPopupType>();


  //获取api东南亚新闻数据
  const politicsLotteryPageRequest = async (isReset: boolean) => {
    if (loading) {
      return;
    }

    setLoading(true);

    let status;
    if (filter === 'all') {
      status = null;
    }
    if (filter === 'pending') {
      status === 0;
    }
    if (filter === 'settled') {
      status === 1;
    }

    const pageNum = isReset ? 1 : lotteryPageNum;
    const param: LotteryDealerReq = { pageNum: pageNum, pageSize: 20, type: 1, status: status };
    const list: LotteryDealerView[] = (await Request_LotteryDealerPage(param)).data.records || [];


    //循环便利
    if (list.length > 0) {
      if (isReset) {
        setLotteryPageNum(() => 2);
        setPoliticsLotteryList(list);
        setHasMore(true);
      } else {
        if (JSON.stringify(list) !== JSON.stringify(politicsLotteryList)) {
          setLotteryPageNum(prev => (prev + 1))
          setPoliticsLotteryList([...politicsLotteryList, ...list])
          setHasMore(true)
        } else {
          setHasMore(false)
        }
      }
    } else {
      setHasMore(false)
    }
    setLoading(false);
  }


  const handleRefresh = () => {
    console.log('刷新数据');
    setPoliticsLotteryList([])
    politicsLotteryPageRequest(true)
  };

  const handleOptionClick = (
    dealerId: string,
    optionValue: string,
    chooseNumber: number,
    icon: string,
    choose: string,
    odds: number
  ) => {
    // 设置选中状态
    setSelected({ ...selected, [dealerId]: optionValue });

    // 存储该卡片的投注信息
    setSelectedOptions({
      ...selectedOptions,
      [dealerId]: {
        dealerId,
        chooseNumber,
        icon,
        choose,
        odds
      }
    });
  };

  const openBetPopup = (dealerId: string) => {
    // 检查该卡片是否有选择
    if (!selected[dealerId]) {
      Toast.show({ content: '请先选择投注内容' });
      return;
    }

    // 获取该卡片的选择信息
    const selectedOption = selectedOptions[dealerId];
    if (!selectedOption) {
      Toast.show({ content: '请先选择投注内容' });
      return;
    }

    // 设置弹窗数据并显示
    setBetPopup(selectedOption);
    setVisiable(true)
  }

  return (
    <>
      <div className="filter-header">
        <div className="header-top">
          <span className="title">🔥热门竞猜 <span className="updated">{dayjs(new Date).format("YYYY-MM-DD ")}</span></span>
          <span style={{ display: 'flex', alignItems: 'center', color: 'white' }}>
            <Button
              onClick={() => navigate('/betOrder')}
              color='success'
              style={{
                'fontSize': '14px',
                '--background-color': 'white',
                //'--border-color': '#4f46e5',
                //'--text-color': '#1890ff',
                '--text-color': 'black',
                '--border-color': 'gray',
                boxShadow: '1px 1px 1px rgba(1, 1, 1, 0.5)',
                fontWeight: '600',
                letterSpacing: '1px'
              }}
              size='mini'
              fill='solid'>

              注单
            </Button>
            <FcSurvey fontSize={30} />
          </span>
        </div>
        <div className="filter-row">
          <div className="tabs-wrapper-bg">
            <Tabs
              activeKey={filter}
              onChange={setFilter}
              className="tabs-inside"
              stretch={false}
              style={{ '--active-line-height': '0px' } as React.CSSProperties}
            >
              <Tabs.Tab title="全部" key="all" />
              <Tabs.Tab title="未开奖" key="pending" />
              <Tabs.Tab title="已开奖" key="settled" />

            </Tabs>
          </div>
          <div className="refresh-icon" onClick={handleRefresh}>
            {
              !loading &&
              <RedoOutline />
            }
            {
              loading &&
              <>
                <Space direction='horizontal' wrap block style={{ '--gap': '16px' }}>
                  <SpinLoading color='currentColor' />
                </Space>
              </>

            }

          </div>
        </div>
      </div>

      <div className="lottery-page">
        <PullToRefresh onRefresh={() => politicsLotteryPageRequest(true)} >
          {(!politicsLotteryList || politicsLotteryList.length === 0) && loading &&
            (
              <>
                <Skeleton.Title animated />
                <Skeleton.Paragraph lineCount={8} animated />
              </>
            )
          }


          {politicsLotteryList?.map((lottery, index) => {
            return (
              <React.Fragment key={'fragment' + lottery.dealerId}>
                {

                  !lottery.choose3 && (
                    <Card className="lottery-card" key={'card2' + lottery.dealerId}>
                      <div className="lottery-header">
                        <div className="lottery-title">{lottery.title}</div>
                        <Tag style={{ padding: '3px 6px' }} color={colorEnum(lottery.status)} className="lottery-tag">
                          {levelEnum(lottery.status)}
                        </Tag>
                      </div>

                      <div className="lottery-creator">
                        <div className="creator-left">
                          <div className="creator-icon" onClick={() => { setOtherPlayerId(lottery.playerId); setOtherInfoCloseRight(true) }}>
                            <div className="crown-icon">
                              <Avatar style={{ width: '30px', height: '30px' }} src={avatars[lottery.playerAvatar]} />
                            </div>
                          </div>
                          <div className="creator-info">
                            <div>
                              <span className="creator-name"> {lottery.playerName}</span>
                              <span className="creator-level">LV.{lottery.playerLevel}</span>
                            </div>
                            <div className="creator-id">ID: {lottery.playerAccount}</div>
                          </div>
                        </div>
                        <div className="creator-verify">
                          <span style={{ display: 'flex', alignItems: 'center', gap: '3px', fontSize: '12px' }}><CheckShieldOutline fontSize={14} /> 已付奖池</span>
                        </div>
                      </div>

                      <div className="lottery-stats">
                        <div className="deadline">
                          <div className="deadline-text">
                            <div style={{ display: 'flex', alignItems: 'center', fontSize: '14px' }}>
                              盘口ID: {lottery.dealerId}
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', fontSize: '14px' }} onClick={() => { navigate(`/betOrder/${lottery.dealerId}`) }}>
                              投注数量: {lottery.betCount ?? 0} 笔<FcFinePrint size={16} style={{ marginLeft: '5px' }} /> 查看
                            </div>
                          </div>
                        </div>


                        <div className="fund">
                          <span style={{ color: 'black' }}>
                            <span > <BillOutline fontSize={15} /> 奖池：</span>
                            <span> {lottery.prizePool} U</span>
                          </span>
                          <span className="remain">
                            <span><ReceiptOutline fontSize={15} /> 剩余：</span>
                            <span> {lottery.remainingPrizePool} U</span>
                          </span>
                        </div>
                      </div>

                      <Radio.Group value={selected[lottery.dealerId]} onChange={(val) => { setSelected({ ...selected, [lottery.dealerId]: val as string }) }}>
                        <div className="options-wrap horizontal">
                          <div className={`option-item ${selected[lottery.dealerId] === 'option-1' ? 'selected' : ''}`}
                            onClick={() => handleOptionClick(lottery.dealerId, 'option-1', 1, lottery.icon1, lottery.choose1, lottery.odds1)}

                          >

                            <div className="option-top-line">
                              <Radio value="option-1" className="option-radio" />
                              <div className="option-titles">
                                <div className="option-label">{lottery.describe1}</div>
                                <div className="option-sub">{lottery.choose1}</div>
                              </div>
                            </div>
                            <div className="option-img">
                              <Image src={lottery.icon1} fit="cover" width="100%" height="100%" />
                            </div>
                            <div className="option-odds">{lottery.odds1} x</div>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                              <span className="option-support">总额:{lottery.bet1Amount}U</span>
                              <span className="option-support">比例:{lottery.rate1}%</span>
                            </div>


                          </div>
                          <div className="vs-divider"> VS </div>
                          <div className={`option-item ${selected[lottery.dealerId] === 'option-2' ? 'selected' : ''}`}
                            onClick={() => handleOptionClick(lottery.dealerId, 'option-2', 2, lottery.icon2, lottery.choose2, lottery.odds2)}
                          >

                            <div className="option-top-line">
                              <Radio value="option-2" className="option-radio" />
                              <div className="option-titles">
                                <div className="option-label">{lottery.describe2}</div>
                                <div className="option-sub">{lottery.choose2}</div>
                              </div>
                            </div>
                            <div className="option-img">
                              <Image src={lottery.icon2} fit="cover" width="100%" height='100%' />
                            </div>
                            <div className="option-odds">{lottery.odds2} x</div>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                              <span className="option-support">总额:{lottery.bet2Amount}U</span>
                              <span className="option-support">比例:{lottery.rate2}%</span>
                            </div>
                          </div>
                        </div>
                      </Radio.Group>

                      <Collapse accordion>
                        <Collapse.Panel style={{ fontSize: '14px', marginBottom: '5px' }} key={'panel' + lottery.dealerId} title='📋点击查看规则'>
                          <div style={{ fontSize: '0.9rem', marginBottom: '3px' }}>{lottery.rule}</div>
                          <div style={{ fontSize: '0.8rem' }}>投注截止: {dayjs(lottery.endTime).format("YYYY-MM-DD HH:mm")} </div>
                          <div style={{ fontSize: '0.8rem' }}>开奖时间: {dayjs(lottery.drawTime).format("YYYY-MM-DD HH:mm")}</div>
                          <div style={{ fontSize: '0.8rem' }}>开盘时间: {dayjs(lottery.createTime).format("YYYY-MM-DD HH:mm")}</div>
                        </Collapse.Panel>
                      </Collapse>

                      <Button onClick={() => openBetPopup(lottery.dealerId)} color="primary" block shape="rounded" size="large" className="lottery-button">
                        立即投注
                      </Button>
                    </Card>
                  )
                }

                {
                  lottery.choose3 &&
                  (<Card className="lottery-card" key={'card3' + lottery.dealerId}>
                    <div className="lottery-header">
                      <div className="lottery-title">{lottery.title}</div>

                      <Tag style={{ padding: '3px 6px' }} color={colorEnum(lottery.status)} className="lottery-tag">
                        {levelEnum(lottery.status)}
                      </Tag>
                    </div>
                    <div className="lottery-creator">
                      <div className="creator-left">
                        <div className="creator-icon" onClick={() => { setOtherPlayerId(lottery.playerId); setOtherInfoCloseRight(true) }}>
                          <div className="crown-icon">
                            <Avatar style={{ width: '30px', height: '30px' }} src={avatars[lottery.playerAvatar]} />
                          </div>
                        </div>
                        <div className="creator-info">
                          <div>
                            <span className="creator-name"> {lottery.playerName}</span>
                            <span className="creator-level">LV.{lottery.playerLevel}</span>
                          </div>
                          <div className="creator-id">ID: {lottery.playerAccount}</div>
                        </div>
                      </div>
                      <div className="creator-verify">
                        <span style={{ display: 'flex', alignItems: 'center', gap: '3px', fontSize: '12px' }}><CheckShieldOutline fontSize={14} />  已付奖池</span>
                      </div>
                    </div>

                    <div className="lottery-stats">
                      <div className="deadline">
                        <div className="deadline-text">
                          <div style={{ display: 'flex', alignItems: 'center', fontSize: '14px' }}>
                            盘口ID: {lottery.dealerId}
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', fontSize: '14px' }} onClick={() => { navigate(`/betOrder/${lottery.dealerId}`) }}>
                            投注数量: {lottery.betCount ?? 0} 笔 <FcFinePrint size={16} style={{ marginLeft: '5px' }} fontSize={20} /> 查看
                          </div>

                        </div>
                      </div>
                      <div className="fund">
                        <span style={{ color: 'black' }}>
                          <span><BillOutline fontSize={15} /> 奖池：</span>
                          <span>{lottery.prizePool} U</span>
                        </span>
                        <span className="remain">
                          <span><ReceiptOutline fontSize={15} /> 剩余：</span>
                          <span>{lottery.remainingPrizePool} U</span>
                        </span>
                      </div>
                    </div>

                    <Radio.Group value={selected[lottery.dealerId]} onChange={(val) => { setSelected({ ...selected, [lottery.dealerId]: val as string }); }}>
                      <div className="options-wrap vertical">
                        <div className={`option-row ${selected[lottery.dealerId] === 'option-1' ? 'selected' : ''}`}

                          onClick={() => handleOptionClick(
                            lottery.dealerId,
                            'option-1',
                            1,
                            lottery.icon1,
                            lottery.choose1,
                            lottery.odds1
                          )}
                        >

                          <Radio value="option-1" className="option-radio" />
                          <div className="row-content">
                            <div className="row-image">
                              <Image src={lottery.icon1} fit="cover" width={56} height={56} />
                            </div>
                            <div className="row-text">
                              <div className="label-line">
                                <span className="option-label">{lottery.describe1}</span>
                                <span className="option-odds">{lottery.odds1} x</span>
                              </div>
                              <div className="sub-line">
                                <span className="option-sub">{lottery.choose1}</span>
                                <span className="option-support">总额:{lottery.bet1Amount}U</span>
                                <span className="option-support">比例:{lottery.rate1}%</span>
                              </div>
                              <ProgressBar percent={lottery.rate1} className="progress-bar" />
                            </div>
                          </div>
                        </div>

                        <div className={`option-row ${selected[lottery.dealerId] === 'option-2' ? 'selected' : ''}`}

                          onClick={() => handleOptionClick(
                            lottery.dealerId,
                            'option-2',
                            2,
                            lottery.icon2,
                            lottery.choose2,
                            lottery.odds2
                          )}
                        >

                          <Radio value="option-2" className="option-radio" />
                          <div className="row-content">
                            <div className="row-image">
                              <Image src={lottery.icon2}
                                fit="cover" width={56} height={56} />
                            </div>
                            <div className="row-text">
                              <div className="label-line">
                                <span className="option-label">{lottery.describe2}</span>
                                <span className="option-odds">{lottery.odds2} x</span>
                              </div>
                              <div className="sub-line">
                                <span className="option-sub">{lottery.choose2}</span>
                                <span className="option-support">总额:{lottery.bet2Amount}U</span>
                                <span className="option-support">比例:{lottery.rate2}%</span>
                              </div>
                              <ProgressBar percent={lottery.rate2} className="progress-bar" />
                            </div>
                          </div>
                        </div>

                        <div className={`option-row ${selected[lottery.dealerId] === 'option-3' ? 'selected' : ''}`}

                          onClick={() => handleOptionClick(
                            lottery.dealerId,
                            'option-3',
                            3,
                            lottery.icon3,
                            lottery.choose3,
                            lottery.odds3
                          )}
                        >

                          <Radio value="option-3" className="option-radio" />
                          <div className="row-content">
                            <div className="row-image">
                              <Image src={lottery.icon3} fit="cover" width={56} height={56} />
                            </div>
                            <div className="row-text">
                              <div className="label-line">
                                <span className="option-label">{lottery.describe3}</span>
                                <span className="option-odds">{lottery.odds3} x</span>
                              </div>
                              <div className="sub-line">
                                <span className="option-sub">{lottery.choose3}</span>
                                <span className="option-support">总额:{lottery.bet3Amount}U</span>
                                <span className="option-support">比例:{lottery.rate3}%</span>
                              </div>
                              <ProgressBar percent={lottery.rate3} className="progress-bar" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </Radio.Group>

                    <Collapse accordion>
                      <Collapse.Panel style={{ fontSize: '14px', marginBottom: '5px' }} key={'panel' + lottery.dealerId} title='📋点击查看规则'>
                        <div style={{ fontSize: '0.9rem', marginBottom: '3px' }}>{lottery.rule}</div>
                        <div style={{ fontSize: '0.8rem' }}>投注截止: {dayjs(lottery.endTime).format("YYYY-MM-DD HH:mm")}</div>
                        <div style={{ fontSize: '0.8rem' }}>开奖时间: {dayjs(lottery.drawTime).format("YYYY-MM-DD HH:mm")}</div>
                        <div style={{ fontSize: '0.8rem' }}>开盘时间:  {dayjs(lottery.createTime).format("YYYY-MM-DD HH:mm")}</div>
                      </Collapse.Panel>
                    </Collapse>

                    <Button onClick={() => openBetPopup(lottery.dealerId)} color="primary" block shape="rounded" size="large" className="lottery-button">
                      立即投注
                    </Button>
                  </Card>)
                }
              </React.Fragment>
            )
          })
          }

        </PullToRefresh>
      </div>

      <InfiniteScroll loadMore={() => politicsLotteryPageRequest(false)} hasMore={hasMore}>
        <ScrollContent hasMore={hasMore} />
      </InfiniteScroll>

      <Popup className='news-record-popup' bodyStyle={{ display: 'flex', flexDirection: 'column', overflowY: 'auto', width: '100%', height: '100%' }}
        position='right'
        closeOnMaskClick
        visible={otherInfoCloseRight}
        onClose={() => { setOtherInfoCloseRight(false) }}>
        <OtherPeople setVisibleCloseRight={setOtherInfoCloseRight} otherPlayerId={otherPlayerId} />
      </Popup>

      {visiable &&
        <BetPopup
          visiable={visiable}
          onClose={() => setVisiable(false)}
          refresh={() => politicsLotteryPageRequest(true)}
          dealerId={betPopup?.dealerId}
          chooseNumber={betPopup?.chooseNumber}
          icon={betPopup?.icon}
          title={betPopup?.choose}
          odds={betPopup?.odds ?? 0}
        />}
    </>
  );
};

export default LotteryDealer;
