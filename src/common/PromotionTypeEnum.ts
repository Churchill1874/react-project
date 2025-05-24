// 定义一个枚举映射
const enumMap = {
  1: '商品',
  2: '生活',
  3: '商业',
};

// 工具类方法，用于获取枚举值的字符串描述
export const PromotionTypeEnum = value => {
  return enumMap[value] || 'Unknown';
};
