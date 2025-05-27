// 定义一个枚举映射
const enumMap = {
  1: '国内新闻',
  2: '东南亚新闻',
  3: '国际政治新闻',
  4: '社会',
  5: '推广',
  6: '话题',
};

// 工具类方法，用于获取枚举值的字符串描述
export const NewsTypeEnum = value => {
  return enumMap[value] || 'Unknown';
};
