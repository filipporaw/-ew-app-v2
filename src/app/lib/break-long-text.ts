/**
 * Breaks long text (like URLs) into an array of smaller chunks.
 * This is needed because @react-pdf/renderer doesn't support word-break CSS.
 * 
 * @param text - The text to break
 * @param maxChunkLength - Maximum length before breaking
 * @returns Array of text chunks
 */
export const breakLongTextToChunks = (text: string, maxChunkLength: number = 35): string[] => {
  if (!text) return [text];
  if (text.length <= maxChunkLength) return [text];
  
  const chunks: string[] = [];
  const breakPoints = ['/', '.', '-', '_', '?', '&', '=', '#', '@', ':'];
  let currentChunk = '';
  
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    currentChunk += char;
    
    // Check if we should break after this character
    const isBreakPoint = breakPoints.includes(char);
    const isLongEnough = currentChunk.length >= maxChunkLength;
    const hasMoreChars = i < text.length - 1;
    
    if (hasMoreChars && (isBreakPoint || isLongEnough)) {
      chunks.push(currentChunk);
      currentChunk = '';
    }
  }
  
  // Don't forget the last chunk
  if (currentChunk) {
    chunks.push(currentChunk);
  }
  
  return chunks;
};

/**
 * Checks if a string looks like a URL or is very long
 */
export const shouldBreakText = (text: string): boolean => {
  if (!text) return false;
  const isUrl = /^(https?:\/\/|www\.|[a-zA-Z0-9-]+\.[a-zA-Z]{2,})/.test(text);
  return isUrl || text.length > 40;
};

/**
 * For simple string replacement - truncates very long text
 */
export const processTextForPDF = (text: string): string => {
  if (!text) return text;
  // For very long URLs, show truncated version
  if (text.length > 50) {
    return text.substring(0, 47) + '...';
  }
  return text;
};
