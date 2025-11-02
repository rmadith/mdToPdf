/**
 * Emoji Handler for PDF Generation
 * 
 * PDF standard fonts don't support emoji characters.
 * This utility removes or replaces emojis before PDF generation.
 */

/**
 * Remove emoji characters from text
 * @param text - Text containing emojis
 * @returns Text with emojis removed
 */
export function removeEmojis(text: string): string {
  // Remove emoji characters using Unicode ranges, preserving line structure
  return text.replace(/[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F000}-\u{1F02F}\u{1F0A0}-\u{1F0FF}\u{1F100}-\u{1F64F}\u{1F680}-\u{1F6FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{2300}-\u{23FF}\u{2B50}\u{2B55}\u{231A}\u{231B}\u{23E9}-\u{23EC}\u{23F0}\u{23F3}\u{25FD}\u{25FE}\u{2614}\u{2615}\u{2648}-\u{2653}\u{267F}\u{2693}\u{26A1}\u{26AA}\u{26AB}\u{26BD}\u{26BE}\u{26C4}\u{26C5}\u{26CE}\u{26D4}\u{26EA}\u{26F2}\u{26F3}\u{26F5}\u{26FA}\u{26FD}\u{2705}\u{270A}\u{270B}\u{2728}\u{274C}\u{274E}\u{2753}-\u{2755}\u{2757}\u{2795}-\u{2797}\u{27B0}\u{27BF}\u{2B1B}\u{2B1C}\u{2B50}\u{2B55}]/gu, '')
}

/**
 * Replace common emojis with text equivalents
 * @param text - Text containing emojis
 * @returns Text with emojis replaced by text
 */
export function replaceEmojisWithText(text: string): string {
  const emojiMap: Record<string, string> = {
    '✨': '[*]',
    '🎨': '[Art]',
    '📄': '[Doc]',
    '🧮': '[Math]',
    '💻': '[Code]',
    '📊': '[Chart]',
    '🔗': '[Link]',
    '⚡': '[Fast]',
    '🚀': '[Rocket]',
    '📝': '[Note]',
    '💡': '[Idea]',
    '🎯': '[Target]',
    '📚': '[Books]',
    '🌟': '[Star]',
    '🔥': '[Fire]',
    '✅': '[x]',
    '❌': '[ ]',
    '⚠️': '[!]',
    '📌': '[Pin]',
    '🏆': '[Trophy]',
    '💪': '[Strong]',
    '👍': '[+]',
    '👎': '[-]',
    '❤️': '[Heart]',
    '💚': '[Heart]',
    '💙': '[Heart]',
    '🎉': '[Celebration]',
    '🎊': '[Party]',
    '🔔': '[Bell]',
    '📢': '[Announce]',
    '📣': '[Megaphone]',
  }

  let result = text
  for (const [emoji, replacement] of Object.entries(emojiMap)) {
    result = result.replaceAll(emoji, replacement)
  }
  
  // Remove any remaining emojis not in the map
  return removeEmojis(result)
}

/**
 * Check if text contains emojis
 * @param text - Text to check
 * @returns True if text contains emojis
 */
export function containsEmojis(text: string): boolean {
  const emojiRegex = /[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/u
  return emojiRegex.test(text)
}

/**
 * Prepare markdown for PDF generation by handling emojis
 * @param markdown - Original markdown text
 * @param mode - How to handle emojis: 'remove' or 'replace'
 * @returns Markdown with emojis handled
 */
export function prepareMarkdownForPDF(
  markdown: string,
  mode: 'remove' | 'replace' = 'remove'
): string {
  if (mode === 'replace') {
    return replaceEmojisWithText(markdown)
  }
  return removeEmojis(markdown)
}

