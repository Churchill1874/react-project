import { useEffect, useState } from 'react';
import { Image, Button, Divider, Skeleton, Popup } from 'antd-mobile';
import { ClockCircleOutline, CalendarOutline, ExclamationCircleOutline, HandPayCircleOutline } from 'antd-mobile-icons';
import '@/pages/lottery/politicslottery/politicsevent/PoliticsEvent.less';
import { PoliticsLotteryType, Request_PoliticsLotteryList } from '@/pages/lottery/politicslottery/politicsevent/api';
import dayjs from 'dayjs'
import DealearConfig from '@/pages/lottery/politicslottery/politicsevent/dealerconfig/DealerConfig';


const PoliticsEvent: React.FC = () => {
  const [politicsLotteryList, setPoliticsLotteryList] = useState<PoliticsLotteryType[]>([])
  const [loading, setLoading] = useState<boolean>(false);
  const [id, setId] = useState<number>();
  const [openPopup, setOpenPopup] = useState<boolean>(false)

  const Req_PoliticsLotteryList = async () => {
    if (loading) {
      return;
    }
    setLoading(true)

    const resp = (await Request_PoliticsLotteryList({ pageNum: 1, pageSize: 20, type: 1 })).data;

    setLoading(false);

    console.log('list:', JSON.stringify(resp.records))
    setPoliticsLotteryList(resp.records)
  }

  const openDealerConfig = (id: any) => {
    setOpenPopup(true)
    setId(id)
  }

  useEffect(() => {
    Req_PoliticsLotteryList();
  }, [])


  return (

    <>
      {
        !loading && (
          politicsLotteryList.map((politicsLottery, _index) => {
            if (politicsLottery.choose3) {
              return (
                <div className="cards-container" key={politicsLottery.id}>

                  {/* ====== 欧洲杯（三个选项）====== */}
                  <div className="prediction-card">
                    <div className="card-title">{politicsLottery.title}</div>
                    <div className="card-subtitle">
                      {politicsLottery.rule}
                    </div>

                    <div className="options-row options-three">
                      <div className="option-item">
                        <Image src={politicsLottery.icon1} width={60} height={60} fit="cover" style={{ borderRadius: '50%' }} />
                        <div className="option-label">{politicsLottery.choose1}</div>
                      </div>
                      <div className="option-item">
                        <Image src={politicsLottery.icon2} width={60} height={60} fit="cover" style={{ borderRadius: '50%' }} />
                        <div className="option-label">{politicsLottery.choose2}</div>
                      </div>
                      <div className="option-item">
                        <Image src={politicsLottery.icon3} width={60} height={60} fit="cover" style={{ borderRadius: '50%' }} />
                        <div className="option-label">{politicsLottery.choose3}</div>
                      </div>
                    </div>

                    <div className="info-card">
                      <div className="info-item">
                        <ClockCircleOutline style={{ color: 'gray' }} className="info-icon" />
                        截止下注：{dayjs(politicsLottery.endTime).format("YYYY-MM-DD")}
                      </div>
                      <div className="info-item">
                        <CalendarOutline style={{ color: 'gray' }} className="info-icon" />
                        开奖时间：{dayjs(politicsLottery.drawTime).format("YYYY-MM-DD")}
                      </div>
                      <div className="info-item">
                        <HandPayCircleOutline style={{ color: 'gray' }} className="info-icon" />

                        最小奖池担保金：<span style={{ color: '#1890ff', fontWeight: 'bold', marginRight: '3px' }}> 100 </span>  USDT
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

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
                      <Button color="primary" block className="card-button" onClick={() => openDealerConfig(politicsLottery.id)}>
                        开设盘口
                      </Button>

                    </div>

                  </div>
                </div>
              );
            }

            if (!politicsLottery.choose3) {
              return (
                <div className="cards-container" key={politicsLottery.id}>

                  {/* ====== 台湾领导人选举（两个选项）====== */}
                  <div className="prediction-card">
                    <div className="card-title">{politicsLottery.title}</div>
                    <div className="card-subtitle">
                      {politicsLottery.rule}
                    </div>

                    <div className="options-row options-two">
                      <div className="option-item">
                        <Image src={politicsLottery.icon1} width={60} height={60} fit="cover" style={{ borderRadius: '50%' }} />
                        <div className="option-label">{politicsLottery.describe1}</div>
                      </div>
                      <div className="option-item">
                        <Image src={politicsLottery.icon2} width={60} height={60} fit="cover" style={{ borderRadius: '50%' }} />
                        <div className="option-label">{politicsLottery.describe2}</div>
                      </div>
                    </div>

                    <div className="info-card">
                      <div className="info-item">
                        <ClockCircleOutline style={{ color: 'gray' }} className="info-icon" />
                        截止下注：{politicsLottery.endTime}
                      </div>
                      <div className="info-item">
                        <CalendarOutline style={{ color: 'gray' }} className="info-icon" />
                        开奖时间：{politicsLottery.drawTime}
                      </div>
                      <div className="info-item">
                        <HandPayCircleOutline style={{ color: 'gray' }} className="info-icon" />
                        最小担保金：<span style={{ color: '#1890ff', fontWeight: 'bold', marginRight: '3px' }}> 100 </span> USDT
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


                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
                      <Button color="primary" block className="card-button" onClick={() => openDealerConfig(politicsLottery.id)}>
                        开设盘口
                      </Button>

                    </div>
                  </div>
                </div>
              );
            }

            return null;
          })
        )
      }
      {
        loading && (
          <>
            <Skeleton.Title animated />
            <Skeleton.Paragraph lineCount={8} animated />
          </>
        )
      }

      <Popup className='politics-event-popup' bodyStyle={{ display: 'flex', flexDirection: 'column', overflowY: 'auto', width: '100%', height: '100%' }}
        position='right'
        closeOnMaskClick
        visible={openPopup}
        onClose={() => { setOpenPopup(false) }}>
        <DealearConfig setOpenPopup={setOpenPopup} id={id} />
      </Popup>
    </>


  );
};

export default PoliticsEvent;
