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
