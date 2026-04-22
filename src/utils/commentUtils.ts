export function highlightReply(inputString) {
  const regex = /^回复\s+.*?\s*: /;
  const match = inputString.match(regex);

  if (match) {
    const cleanedMatch = match[0].replace(/^回复\s+/, '');
    const highlightedPart = ` 回复 <span style=" color: #007ef2;">${cleanedMatch} </span>`;
    const restOfString = inputString.slice(match[0].length);
    return `${highlightedPart}${restOfString}`;
  }

  return inputString;
}


// 单图场景用这个（头像、logo等）
export function getImgUrl(url?: string): string {
  if (!url) return '';
  if (url === '1') return '/assets/logo/logo1.jpg';
  if (url.startsWith('/assets/logo/')) return url;
  if (url.startsWith('http')) return url;
  return url;
}

// 多图场景用这个（新闻配图等）
export function getImgUrls(url?: string): string[] {
  console.log('getImgUrls called:', url);  // 加这行

  if (!url) return [];
  return url.split('||').map(u => getImgUrl(u.trim())).filter(Boolean);
}