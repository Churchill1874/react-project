// 定义一个枚举映射
const enumMap = {
  柬埔寨: '#3b83f6b5',
  迪拜: '#f68356ce',
  菲律宾: '#3bd7f6c0',
  印度: '#fbaa29c8',
  泰国: '#2cc564cc',
  亚美尼亚: '#2cc564cc',

  缅甸: '#535352ff',
  老挝: '#094553c5',
  马来: '#20f720d1',
  格鲁吉亚: '#3b54f6bb',
  日本: '#f63bf6b5',
  韩国: '#f63bf6b5',
};

// 工具类方法，用于获取枚举值的字符串描述
export const colorEnum = value => {
  return enumMap[value] || 'Unknown';
};
