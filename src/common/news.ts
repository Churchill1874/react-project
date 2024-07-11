// 定义一个枚举映射
export const enumMap = {
    1: {name:'新闻',color:'red'},
    2: {name:'体育',color:'navy'},
    3: {name:'娱乐',color:'orange'},
    4: {name:'军事',color:'maroon'},
    5: {name:'科技',color:'purple'},
    6: {name:'社会',color:'blue'},
    7: {name:'网友',color:'lime'}
  };
  
  // 工具类方法，用于获取枚举值的字符串描述
  export const newsEnum = (value) => {
    return enumMap[value] || 'Unknown';
  };
  