import React from 'react';
import '@/components/exposure/exposureinfo/ExposureInfo.less';
interface ExposureDetailProps {
  onClose?: () => void;
}
const ExposureDetail: React.FC<ExposureDetailProps> = ({ onClose }) => {
  return (
    <div className="detail-container">
      {/* 页面头部 */}
      <div className="detail-header">
        <div className="header-nav">
          <button className="back-btn" onClick={onClose}>← 返回列表</button>
          <div className="header-title">案件详情</div>
        </div>
      </div>

      <div className="detail-content">
        {/* 案件详情卡片 */}
        <div className="detail-card">
          <div className="case-title">
            跨境电信诈骗团伙案：涉案金额超千万，受害者众多
          </div>

          <div className="case-description">
            该犯罪团伙在东南亚多个国家设立诈骗窝点，专门针对国内老年人实施电信诈骗。团伙分工明确，组织严密，涉案金额超过千万元。多名受害者因此倾家荡产，部分老人甚至因此患上抑郁症。该团伙采用"公司化"运作模式，设有专门的话务组、技术组、财务组等部门，分工明确，层级分明。主要作案手法包括冒充公检法人员、银行工作人员、医保局工作人员等身份，通过电话、短信等方式对受害人实施诈骗。警方已掌握确凿证据，正在全力追捕在逃人员。
          </div>

          {/* 案件基本信息 - 融入到描述区域 */}
          <div className="case-meta">
            <div className="meta-row">
              <span className="meta-icon">📍</span>
              <span className="meta-text">作案地点：柬埔寨、缅甸、菲律宾等东南亚国家</span>
            </div>
            <div className="meta-row">
              <span className="meta-icon">📅</span>
              <span className="meta-text">举报时间：2024年12月15日</span>
            </div>
            <div className="meta-row">
              <span className="meta-icon">👁️</span>
              <span className="meta-text">浏览次数：15,234</span>
            </div>
            <div className="meta-row">
              <span className="meta-icon">👁️</span>
              <span className="meta-text">张三声音：234</span>
            </div>
            <div className="meta-row">
              <span className="meta-icon">👁️</span>
              <span className="meta-text">李四声音：15,234</span>
            </div>
            <div className="meta-row">
              <span className="meta-icon">👁️</span>
              <span className="meta-text">王五声音：15,234</span>
            </div>
            <div className="meta-row">
              <span className="meta-icon">👁️</span>
              <span className="meta-text">老赵声音：15,234</span>
            </div>
            <div className="meta-row">
              <span className="meta-icon">👁️</span>
              <span className="meta-text">刘能声音：15,234</span>
            </div>
            <div className="meta-row">
              <span className="meta-icon">👁️</span>
              <span className="meta-text">张海声音：15,234</span>
            </div>
          </div>

          {/* 涉案人员 - 6个人员示例 */}
          <div className="suspects-title">涉及人员信息</div>
          <div className="suspects-detail-grid six">
            <div className="suspect-detail-card">
              <img src="https://picsum.photos/200/200?random=101" alt="张某某" className="suspect-detail-photo" />
            </div>
            <div className="suspect-detail-card">
              <img src="https://picsum.photos/200/200?random=102" alt="李某某" className="suspect-detail-photo" />
            </div>
            <div className="suspect-detail-card">
              <img src="https://picsum.photos/200/200?random=103" alt="王某某" className="suspect-detail-photo" />
            </div>
            <div className="suspect-detail-card">
              <img src="https://picsum.photos/200/200?random=104" alt="陈某某" className="suspect-detail-photo" />
            </div>
            <div className="suspect-detail-card">
              <img src="https://picsum.photos/200/200?random=105" alt="刘某某" className="suspect-detail-photo" />
            </div>
            <div className="suspect-detail-card">
              <img src="https://picsum.photos/200/200?random=106" alt="赵某某" className="suspect-detail-photo" />
            </div>
          </div>
        </div>

        {/* 底部统计信息 */}
        <div className="detail-footer">
          ⚠️ 以上信息来源于网络举报，如有错误请及时联系我们更正。如发现相关人员请立即报警，切勿私自接触。
        </div>
      </div>
    </div>
  );
};

export default ExposureDetail;