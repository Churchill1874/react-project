// 定义一个枚举映射
export const enumMap = {
    1: {name:'热门',color:'red'},
    2: {name:'新闻',color:'red'},
    3: {name:'体育',color:'navy'},
    4: {name:'娱乐',color:'orange'},
    5: {name:'军事',color:'maroon'},
    6: {name:'科技',color:'purple'},
    7: {name:'育儿',color:'lime'},
    8: {name:'女性',color:'pink'}
  };
  
  // 工具类方法，用于获取枚举值的字符串描述
  export const newsEnum = (value) => {
    return enumMap[value] || 'Unknown';
  };
  