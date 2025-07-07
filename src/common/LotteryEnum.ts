// 定义一个枚举映射
const enumMap = {
  0: '待开奖',
  1: '已开奖',
  2: '已取消',
};

// 工具类方法，用于获取枚举值的字符串描述
export const levelEnum = value => {
  return enumMap[value] || 'Unknown';
};

const colorMap = {
  0: 'primary',
  1: 'success',
  2: 'warning',
};

export const colorEnum = value => {
  return colorMap[value] || 'Unknown';
};
