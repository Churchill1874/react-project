import { Toast } from 'antd-mobile';
import { FileOutline } from 'antd-mobile-icons';

const CopySpan = ({ text }: { text: string }) => {
  const handleCopy = async () => {
    // 优先用现代 API
    if (navigator.clipboard && window.isSecureContext) {
      try {
        await navigator.clipboard.writeText(text);
        Toast.show({ content: '已复制', duration: 1000 });
        return;
      } catch {
        // 失败了走下面的兜底
      }
    }

    // 兜底：兼容 iOS Safari / 微信 WebView / 旧版 Android
    try {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.cssText = 'position:fixed;top:-9999px;left:-9999px;opacity:0;';
      document.body.appendChild(textarea);
      textarea.focus();
      textarea.select();
      // iOS 需要特殊处理
      textarea.setSelectionRange(0, textarea.value.length);
      const success = document.execCommand('copy');
      document.body.removeChild(textarea);
      if (success) {
        Toast.show({ content: '已复制', duration: 1000 });
      } else {
        throw new Error('execCommand failed');
      }
    } catch {
      Toast.show({ content: '复制失败', icon: 'fail' });
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