import React, { useState, useRef, useEffect } from 'react';

// 表情数据分类
interface EmojiCategory {
  name: string;
  icon: string;
  emojis: string[];
}

interface EmojiCategories {
  [key: string]: EmojiCategory;
}

const emojiCategories: EmojiCategories = {
  faces: {
    name: '表情',
    icon: '😊',
    emojis: [
      '😀', '😃', '😄', '😁', '😆', '😅',
      '🤣', '😂', '🙂', '🙃', '😉', '😊',
      '😇', '🥰', '😍', '🤩', '😘', '😗',
      '😚', '😙', '😋', '😛', '😜', '🤪',
      '😝', '🤑', '🤗', '🤭', '🤫', '🤔',
      '🤐', '🤨', '😐', '😑', '😶', '😏',
      '😒', '🙄', '😬', '🤥', '😔', '😪',
      '🤤', '😴', '😷', '🤒', '🤕', '🤢',
      '🤮', '🤧', '🥵', '🥶', '🥴', '😵',
      '🤯', '🤠', '🥳', '😎', '🤓', '🧐',
      '😕', '😟', '🙁', '☹️'
    ]
  },
  gestures: {
    name: '手势',
    icon: '👍',
    emojis: [
      '👍', '👎', '👌', '🤌', '🤏', '✌️', '🤞', '🤟',
      '🤘', '🤙', '👈', '👉', '👆', '👇', '☝️', '👋',
      '🤚', '🖐️', '✋', '🖖', '👏', '🙌', '🤲', '🤝',
      '🙏', '✍️', '💅', '🤳', '💪', '🦾', '🦿', '👂'
    ]
  },
  hearts: {
    name: '爱心',
    icon: '❤️',
    emojis: [
      '❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍',
      '🤎', '💔', '❣️', '💕', '💞', '💓', '💗', '💖',
      '💘', '💝', '💟', '♥️', '💋', '💌', '💒', '💑',
      '💏', '👪', '💍', '💐', '🌹', '🌺', '🌻', '🌷'
    ]
  },
  symbols: {
    name: '符号',
    icon: '⭐',
    emojis: [
      '⭐', '🌟', '✨', '💫', '☄️', '🌙', '🌞', '🌝',
      '☀️', '☁️', '⛅', '⛈️', '🌤️', '🌦️', '🌧️', '❄️',
      '⚡', '🔥', '💥', '💯', '💢', '💦', '💨', '🌈',
      '✅', '❌', '⭕', '❎', '✔️', '✖️', '➕', '➖',
      '➗', '✏️', '📝', '💰', '💴', '💵', '💶', '💷'
    ]
  },
  animals: {
    name: '动物',
    icon: '🐶',
    emojis: [
      '🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼',
      '🐨', '🐯', '🦁', '🐮', '🐷', '🐽', '🐸', '🐵',
      '🙈', '🙉', '🙊', '🐒', '🐔', '🐧', '🐦', '🐤',
      '🐣', '🐥', '🦆', '🦅', '🦉', '🦇', '🐺', '🐗',
      '🐴', '🦄', '🐝', '🐛', '🦋', '🐌', '🐞', '🐜'
    ]
  },
  food: {
    name: '食物',
    icon: '🍎',
    emojis: [
      '🍎', '🍐', '🍊', '🍋', '🍌', '🍉', '🍇', '🍓',
      '🫐', '🍈', '🍒', '🍑', '🥭', '🍍', '🥥', '🥝',
      '🍅', '🍆', '🥑', '🥦', '🥬', '🥒', '🌶️', '🫑',
      '🥕', '🧄', '🧅', '🥔', '🍠', '🌽', '🥖', '🍞',
      '🥨', '🥯', '🧀', '🥚', '🍳', '🧈', '🥞', '🧇',
      '🥓', '🥩', '🍗', '🍖', '🌭', '🍔', '🍟', '🍕'
    ]
  },
  ascii: {
    name: '字符表情',
    icon: ':)',
    emojis: [
      '(^_^)', '(>_<)', '(T_T)', '(¬_¬)', '(￣_￣)',
      '(◕‿◕)', '(｡◕‿◕｡)', '(◔◡◔)', '(◉‿◉)',
      '(ಠ_ಠ)', '(⌐■_■)', '¯\\_(ツ)_/¯'
    ]
  },
  unicode: {
    name: '彩色符号',
    icon: '★',
    emojis: [
      '⚫', '⚪', '🔴', '🔵', '🟢', '🟡', '🟠', '🟣',
      '⬛', '⬜', '◼️', '◻️', '◾', '◽', '🔶', '🔷',
      '🔸', '🔹', '🔺', '🔻', '💠', '🔘', '🔳', '🔲',
      '♠️', '♥️', '♦️', '♣️', '☆', '★', '☉', '♨',
      '↗️', '↘️', '↙️', '↖️', '↕️', '↔️', '↪️', '↩️',
      '⬆️', '⬇️', '⬅️', '➡️', '🔄', '🔃', '🔂', '🔁'
    ]
  }
};

// 组件 Props 类型定义
interface MobileEmojiPickerProps {
  isVisible: boolean;
  onClose: () => void;
  onEmojiSelect: (emoji: string) => void;
  triggerRef: React.RefObject<HTMLButtonElement>;
}

// 🔥 修复弹窗尺寸变化的表情选择器
const MobileEmojiPicker: React.FC<MobileEmojiPickerProps> = ({
  isVisible,
  onClose,
  onEmojiSelect,
  triggerRef
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('faces');
  const modalRef = useRef<HTMLDivElement>(null);

  // 移动端触摸事件处理 - 点击外部关闭
  useEffect(() => {
    if (!isVisible) return;

    const handleTouchOutside = (event: TouchEvent) => {
      const target = event.target as HTMLElement;

      if (modalRef.current &&
        !modalRef.current.contains(target) &&
        triggerRef.current &&
        !triggerRef.current.contains(target)) {
        onClose();
      }
    };

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;

      if (modalRef.current &&
        !modalRef.current.contains(target) &&
        triggerRef.current &&
        !triggerRef.current.contains(target)) {
        onClose();
      }
    };

    // 同时监听触摸和点击事件，兼容不同设备
    document.addEventListener('touchstart', handleTouchOutside, { passive: true });
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('touchstart', handleTouchOutside);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isVisible, onClose, triggerRef]);

  if (!isVisible) return null;

  // 移动端触摸反馈
  const handleEmojiClick = (emoji: string) => {
    onEmojiSelect(emoji);
  };

  return (
    <>
      {/* 移动端遮罩层 */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.3)',
          zIndex: 999,
          opacity: isVisible ? 1 : 0,
          transition: 'opacity 0.2s ease'
        }}
        onClick={onClose}
      />

      {/* 🔥 表情选择器主体 - 固定尺寸版本 */}
      <div
        ref={modalRef}
        style={{
          position: 'fixed',
          bottom: 'calc(env(safe-area-inset-bottom) + 70px)', // 70px 是留给输入框的空间；底部导航栏已改成右上角菜单按钮，不用再额外让位了
          left: '10px',
          right: '10px',
          maxWidth: '400px',
          height: '400px', // 🔥 固定总高度
          margin: '0 auto',
          backgroundColor: 'white',
          borderRadius: '16px',
          boxShadow: '0 12px 48px rgba(0, 0, 0, 0.25)',
          border: '1px solid rgba(0, 0, 0, 0.1)',
          zIndex: 1000,
          overflow: 'hidden',
          transform: isVisible ? 'translateY(0)' : 'translateY(100%)',
          transition: 'transform 0.3s ease-out',
          // 🔥 使用flex布局控制各部分高度
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        {/* 🔥 头部 - 固定高度 */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '10px 20px',
          borderBottom: '1px solid #f0f0f0',
          backgroundColor: '#fafafa',
          flexShrink: 0, // 🔥 不允许压缩
          height: '60px' // 🔥 固定高度
        }}>
          <span style={{
            fontSize: '16px',
            fontWeight: '600',
            color: '#333'
          }}>
            选择表情
          </span>
          <button
            onClick={onClose}
            style={{
              border: 'none',
              background: 'none',
              fontSize: '24px',
              cursor: 'pointer',
              color: '#999',
              padding: '4px',
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '50%',
              WebkitTapHighlightColor: 'transparent',
              touchAction: 'manipulation'
            }}
          >
            ×
          </button>
        </div>

        {/* 🔥 分类标签 - 固定高度 */}
        <div style={{
          display: 'flex',
          borderBottom: '1px solid #f0f0f0',
          backgroundColor: '#fafafa',
          overflowX: 'auto',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          WebkitOverflowScrolling: 'touch',
          flexShrink: 0, // 🔥 不允许压缩
          height: '70px' // 🔥 固定高度
        }}>
          {Object.entries(emojiCategories).map(([key, category]) => (
            <button
              key={key}
              onClick={() => setActiveCategory(key)}
              style={{
                padding: '12px 14px',
                border: 'none',
                backgroundColor: activeCategory === key ? '#667eea' : 'transparent',
                color: activeCategory === key ? 'white' : '#666',
                cursor: 'pointer',
                fontSize: '14px',
                minWidth: '60px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '4px',
                transition: 'all 0.2s ease',
                whiteSpace: 'nowrap',
                flexShrink: 0,
                borderRadius: '8px',
                margin: '6px 3px',
                WebkitTapHighlightColor: 'transparent',
                touchAction: 'manipulation'
              }}
            >
              <span style={{ fontSize: '18px' }}>{category.icon}</span>
              <span style={{ fontSize: '10px' }}>{category.name}</span>
            </button>
          ))}
        </div>

        {/* 🔥 表情网格 - 固定高度，可滚动 */}
        <div style={{
          padding: '16px',
          height: '220px', // 🔥 固定高度替代maxHeight
          overflowY: 'auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(6, 1fr)',
          gap: '8px',
          WebkitOverflowScrolling: 'touch',
          alignContent: 'start', // 🔥 内容从顶部开始排列
          flex: 1 // 🔥 占据剩余空间
        }}>
          {emojiCategories[activeCategory].emojis.map((emoji, index) => (
            <button
              key={index}
              onClick={() => handleEmojiClick(emoji)}
              style={{
                padding: '12px 6px',
                border: 'none',
                backgroundColor: 'transparent',
                fontSize: activeCategory === 'ascii' ? '13px' : '20px',
                cursor: 'pointer',
                borderRadius: '8px',
                transition: 'all 0.2s ease',
                aspectRatio: '1',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: activeCategory === 'ascii' ? 'monospace' : 'inherit',
                minHeight: '44px',
                WebkitTapHighlightColor: 'rgba(102, 126, 234, 0.2)',
                touchAction: 'manipulation'
              }}
              onTouchStart={(e) => {
                const target = e.currentTarget;
                target.style.backgroundColor = '#f0f0f0';
                target.style.transform = 'scale(1.1)';
              }}
              onTouchEnd={(e) => {
                const target = e.currentTarget;
                setTimeout(() => {
                  target.style.backgroundColor = 'transparent';
                  target.style.transform = 'scale(1)';
                }, 150);
              }}
            >
              {emoji}
            </button>
          ))}
        </div>


      </div>
    </>
  );
};

export default MobileEmojiPicker;