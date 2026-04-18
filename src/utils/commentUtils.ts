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


export function getImgUrl(url?: string) {
  if (!url) return '';

  if ('/assets/logo/logo1.jpg' === url) {
    return url;
  }
  if ('/assets/logo/logo2.jpg' === url) {
    return url;
  }
  if ('/assets/logo/logo3.jpg' === url) {
    return url;
  }
  if ('1' === url) {
    return '/assets/logo/logo1.jpg';
  }

  if (url.startsWith('http')) {
    return url;
  }

  return `http://192.168.188.199:8009${url}`;
}