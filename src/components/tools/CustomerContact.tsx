import CopySpan from "@/components/tools/CopySpan";
import { TravelOutline } from 'antd-mobile-icons'
const CustomerContact = ({ text }: { text: string }) => {


  return (
    <>
      <span style={{
        display: 'inline-flex',
        alignItems: 'center',        // 垂直居中
        justifyContent: 'center',    // 水平居中
        height: '32px',              // 设置高度，才能垂直居中有效
        padding: '0 12px',           // 左右内边距
        //backgroundColor: '#f5f5f5',  // 示例背景色
        borderRadius: '4px',         // 圆角
        cursor: 'pointer',
      }}>
        <TravelOutline fontSize={22} style={{ marginRight: '3px' }} /> tg:
        <CopySpan text={text} />
      </span>
    </>

  );
}

export default CustomerContact;