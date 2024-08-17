// 定义一个枚举映射
export const enumMap = {
    1: {name:'热门新闻',color:'rgb(192, 2, 2)'},
    2: {name:'体育动态',color:'rgb(56, 56, 253)'},
    3: {name:'娱乐八卦',color:'orange'},
    4: {name:'军事领域',color:'green'},
    5: {name:'科技相关',color:'purple'},
    6: {name:'社会百态',color:'blue'},//暂时没有
    7: {name:'网友发布',color:'lime'}
  };
  
  // 工具类方法，用于获取枚举值的字符串描述
  export const newsEnum = (value) => {
    return enumMap[value] || 'Unknown';
  };
  