export function highlightReply(inputString) {
    const regex = /^回复\s+.*?\s*: /;
    const match = inputString.match(regex);
  
    if (match) {
      const highlightedPart = `<span style=" color: #007ef2;">${match[0]} </span>`;
      const restOfString = inputString.slice(match[0].length);
      return `${highlightedPart}${restOfString}`;
    }
  
    return inputString;
  }
  