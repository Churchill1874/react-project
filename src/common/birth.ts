export const getBirthRange = (birthStr: string): string => {
  if (!birthStr) return '未知';
  const match = birthStr.match(/(\d{4})/);
  if (!match) return '未知';

  const yearStr = match[1];
  const decade = yearStr.slice(2, 3) + '0';
  //return `${decade}后`;
  return decade + '后';
};
