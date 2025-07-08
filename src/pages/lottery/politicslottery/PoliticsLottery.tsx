import { useState } from 'react';
import { Tabs } from 'antd-mobile'
import LotteryDealer from '@/pages/lottery/politicslottery/lotterydealer/LotteryDealer';
import PoliticsEvent from '@/pages/lottery/politicslottery/politicsevent/PoliticsEvent';
import '@/pages/lottery/politicslottery/PoliticsLottery.less'
import { FcCustomerSupport, FcSalesPerformance, FcSurvey } from "react-icons/fc";

const PoliticsLottery: React.FC = () => {
  const [tabKey, setTabKey] = useState<string>('dealder');

  const changeTabKey = (key: string) => {
    setTabKey(key)

    if (key === 'dealder') {
    }
    if (key === 'event') {
    }
  }


  return (
    <>
      <Tabs className="lottery-tabs" activeLineMode='fixed' activeKey={tabKey} onChange={(key) => { changeTabKey(key) }}>
        <Tabs.Tab title={<div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}><FcSalesPerformance fontSize={18} />  投注</div>} key='dealder'>
          <LotteryDealer />
        </Tabs.Tab>

        {/*         <Tabs.Tab title={<div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}><FcSurvey fontSize={18} />  注单 </div>} key='betOrder'>
        </Tabs.Tab> */}

        <Tabs.Tab title={<div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}><FcCustomerSupport fontSize={18} />  开盘</div>} key='politicsEvent'>
          <PoliticsEvent />
        </Tabs.Tab>
        {/* 
        <Tabs.Tab title={<div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}><FcCustomerSupport fontSize={18} />  我的开盘</div>} key='politicsEvent'>
          <PoliticsEvent />
        </Tabs.Tab> */}




      </Tabs>

    </>
  );
}

export default PoliticsLottery;