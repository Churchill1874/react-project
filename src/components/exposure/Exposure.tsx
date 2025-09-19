import { useState } from 'react';
import '@/components/exposure/Exposure.less';
import { Popup } from 'antd-mobile';
import ExposureInfo from '@/components/exposure/exposureinfo/ExposureInfo';

const ExposureList: React.FC = () => {
  const [visibleCloseRight, setVisibleCloseRight] = useState(false)


  return (


    <>
      <div className="exposure-list-container">
        {/*         <div className="exposure-header">
          <div className="header-subtitle">🚨 希望大家即使人在境外, 仍能保证基本权益不被迫害</div>
        </div> */}

        <div className="exposure-list">
          {/* 置顶案件 */}
          <div className="exposure-item" onClick={() => setVisibleCloseRight(true)}>

            <div className="item-content">
              <div className="exposure-title">
                <span className="top-badge">置 顶</span>跨境电信诈骗团伙案：涉案金额超千万，受害者众多
              </div>
              {/*             <div className="exposure-description">
              该犯罪团伙在东南亚多个国家设立诈骗窝点，专门针对国内老年人实施电信诈骗。团伙分工明确，组织严密，涉案金额超过千万元。多名受害者因此倾家荡产，部分老人甚至因此患上抑郁症。警方已掌握确凿证据，正在全力追捕...
            </div> */}

              {/* 涉案人员 */}
              <div className="suspects-grid" >
                <div className="suspect-card">
                  <img src="https://picsum.photos/150/150?random=101" alt="张某某" className="suspect-photo" />
                </div>
                <div className="suspect-card">
                  <img src="https://picsum.photos/150/150?random=102" alt="李某某" className="suspect-photo" />
                </div>
                <div className="suspect-card">
                  <img src="https://picsum.photos/150/150?random=103" alt="王某某" className="suspect-photo" />
                </div>
                <div className="suspect-card">
                  <img src="https://picsum.photos/150/150?random=104" alt="陈某某" className="suspect-photo" />
                </div>
                <div className="suspect-card">
                  <img src="https://picsum.photos/150/150?random=105" alt="刘某某" className="suspect-photo" />
                </div>
                <div className="suspect-card">
                  <img src="https://picsum.photos/150/150?random=106" alt="赵某某" className="suspect-photo" />
                </div>
              </div>
            </div>

            <div className="item-footer">
              <div className="report-date">举报时间: 2024-12-15</div>
              <div className="view-count">浏览: 15,234</div>
            </div>
          </div>

          {/* 普通案件1 */}
          <div className="exposure-item">
            <div className="item-content">
              <div className="exposure-title">
                强迫劳动案：限制人身自由，多次殴打虐待受害者
              </div>
              {/*             <div className="exposure-description">
              在缅甸某园区内强迫多名中国公民从事网络诈骗活动，不服从者遭到殴打和虐待，已有多人受害。该案件涉及人身拘禁、强迫劳动等多项罪名，手段极其残忍...
            </div> */}

              <div className="suspects-grid">
                <div className="suspect-card">
                  <img src="https://picsum.photos/150/150?random=201" alt="吴某某" className="suspect-photo" />
                </div>
                <div className="suspect-card">
                  <img src="https://picsum.photos/150/150?random=202" alt="周某某" className="suspect-photo" />
                </div>
                <div className="suspect-card">
                  <img src="https://picsum.photos/150/150?random=203" alt="郑某某" className="suspect-photo" />
                </div>
              </div>
            </div>

            <div className="item-footer">
              <div className="report-date">举报时间: 2024-12-10</div>
              <div className="view-count">浏览: 8,921</div>
            </div>
          </div>

          {/* 普通案件2 */}
          <div className="exposure-item">

            <div className="item-content">
              <div className="exposure-title">
                人口拐卖案：协助转移受害人员到东南亚地区
              </div>
              {/*             <div className="exposure-description">
              协助犯罪团伙拐卖人口到东南亚地区，负责中转和转移工作，导致多名受害者失联。主要负责接应和转移环节，在泰国设有中转站点...
            </div> */}

              <div className="suspects-grid">
                <div className="suspect-card">
                  <img src="https://picsum.photos/150/150?random=301" alt="孙某某" className="suspect-photo" />
                </div>
                <div className="suspect-card">
                  <img src="https://picsum.photos/150/150?random=302" alt="马某某" className="suspect-photo" />
                </div>
              </div>
            </div>

            <div className="item-footer">
              <div className="report-date">举报时间: 2024-12-08</div>
              <div className="view-count">浏览: 5,672</div>
            </div>
          </div>

          {/* 普通案件3 - 单个嫌疑人 */}
          <div className="exposure-item">
            <div className="item-content">
              <div className="exposure-title">
                网络技术支持案：为诈骗团伙提供技术服务
              </div>
              {/*             <div className="exposure-description">
              在菲律宾某诈骗团伙中担任技术人员，负责维护诈骗网站和软件系统，协助团伙实施网络诈骗。虽然不直接参与诈骗行为，但为团伙提供了重要的技术保障...
            </div> */}

              <div className="suspects-grid">
                <div className="suspect-card">
                  <img src="https://picsum.photos/150/150?random=401" alt="田某某" className="suspect-photo" />
                </div>
              </div>
            </div>

            <div className="item-footer">
              <div className="report-date">举报时间: 2024-12-05</div>
              <div className="view-count">浏览: 3,456</div>
            </div>
          </div>
        </div>

        <div className="list-footer">
          <div className="warning-text">
            ⚠️ 以上信息来源于网络举报，如有错误请及时联系我们更正
          </div>
        </div>
      </div>

      <Popup className='news-record-popup' bodyStyle={{ display: 'flex', flexDirection: 'column', overflowY: 'auto', width: '100%' }}
        position='right'
        closeOnSwipe={true}
        closeOnMaskClick
        visible={visibleCloseRight}
        onClose={() => { setVisibleCloseRight(false) }}
      >
        <ExposureInfo onClose={() => { setVisibleCloseRight(false) }} />

      </Popup>



    </>
  );
};

export default ExposureList;