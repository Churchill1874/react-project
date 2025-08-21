import { useState } from 'react';
import { Tabs } from 'antd-mobile'
import LotteryDealer from '@/pages/lottery/politicslottery/lotterydealer/LotteryDealer';
import PoliticsEvent from '@/pages/lottery/politicslottery/politicsevent/PoliticsEvent';
import '@/pages/lottery/politicslottery/PoliticsLottery.less'
import { FcSalesPerformance } from "react-icons/fc";

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
        <Tabs.Tab title={<div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}><FcSalesPerformance fontSize={16} />  投注</div>} key='dealder'>
          <LotteryDealer />
        </Tabs.Tab>

        <Tabs.Tab title={<div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}><span style={{ fontSize: '13px' }}>👨‍💼</span>开盘</div>} key='politicsEvent'>
          <PoliticsEvent />
        </Tabs.Tab>





      </Tabs>

    </>
  );
}

export default PoliticsLottery;