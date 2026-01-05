// utils/latexFormatter.ts
export const formatLatex = (text: string): string => {
  if (!text) return text;
  
  // Remove unnecessary escape characters
  let formatted = text
    .replace(/\\\(/g, '$')
    .replace(/\\\)/g, '$')
    .replace(/\\\[/g, '$$')
    .replace(/\\\]/g, '$$');
  
  // Ensure math mode is properly closed
  const dollarCount = (formatted.match(/\$/g) || []).length;
  if (dollarCount % 2 !== 0) {
    // Add missing closing dollar sign
    formatted += '$';
  }
  
  return formatted;
};