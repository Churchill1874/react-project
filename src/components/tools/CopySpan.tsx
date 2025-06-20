import { Toast } from 'antd-mobile';
import { FileOutline } from 'antd-mobile-icons';

const CopySpan = ({ text }: { text: string }) => {
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      Toast.show({
        content: '已复制',
        duration: 1000,
      });
    } catch {
      Toast.show({
        content: '复制失败',
        icon: 'fail',
      });
    }
  };

  return (
    <span
      onClick={handleCopy}
      style={{
        cursor: 'pointer',
        color: '#1677ff',
        display: 'inline-flex',
        alignItems: 'center',
        gap: '3px',
      }}
    >
      <span style={{ marginLeft: '5px' }}>{text}</span>

      <FileOutline />
    </span>
  );
};

export default CopySpan;
