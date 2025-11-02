/**
 * Markdown to PDF Converter - Main Library Export
 * 
 * This module can be used in three ways:
 * 1. As a standalone web application
 * 2. As React components embedded in other Next.js apps
 * 3. As headless conversion functions for programmatic use
 */

// Core conversion functions
export {
  parseMarkdown,
  validateMarkdown,
  estimateProcessingTime,
  generatePDF,
  downloadPDF,
  estimatePDFSize,
  validatePDFOptions,
} from './markdown'

// Emoji handling utilities
export {
  removeEmojis,
  replaceEmojisWithText,
  containsEmojis,
  prepareMarkdownForPDF,
} from './emoji-handler'

// PDF styling utilities
export {
  getStylesForPreset,
  getPageSize,
  getDefaultMargins,
  githubStyles,
  academicStyles,
  modernStyles,
  minimalStyles,
  createCustomStyles,
} from './pdf'

// Theme management utilities
export {
  ThemeManager,
  useThemeManager,
} from './theme-manager'

export {
  DEFAULT_THEME_TEMPLATE,
} from './theme-types'

// Type definitions
export type {
  MarkdownOptions,
  PDFConfig,
  StylePreset,
  StylePresetExtended,
  ParsedMarkdown,
  PDFGenerationOptions,
  PDFResult,
} from './markdown/types'

export type {
  CustomTheme,
  ThemeColors,
  ThemeTypography,
  ThemeSpacing,
} from './theme-types'

/**
 * Example usage as a headless conversion:
 * 
 * ```typescript
 * import { parseMarkdown, generatePDF, ThemeManager, DEFAULT_THEME_TEMPLATE } from '@/lib'
 * 
 * // Basic PDF generation
 * const markdown = '# Hello World\n\nThis is **bold** text.'
 * const parsed = await parseMarkdown(markdown, { gfm: true, math: true })
 * const pdf = await generatePDF({
 *   html: parsed.html,
 *   markdown,
 *   stylePreset: 'modern',
 *   pageSize: 'A4'
 * })
 * 
 * // Download the PDF
 * downloadPDF(pdf.blob, 'my-document.pdf')
 * 
 * // Custom theme usage
 * const customTheme = {
 *   ...DEFAULT_THEME_TEMPLATE,
 *   id: ThemeManager.generateThemeId(),
 *   name: 'My Custom Theme',
 *   colors: {
 *     ...DEFAULT_THEME_TEMPLATE.colors,
 *     pageBackground: '#ffffff',
 *     textColor: '#000000',
 *   }
 * }
 * 
 * // Save the theme (client-side only)
 * const savedTheme = ThemeManager.saveTheme(customTheme)
 * 
 * // Use the custom theme
 * const pdfWithCustomTheme = await generatePDF({
 *   html: parsed.html,
 *   markdown,
 *   stylePreset: savedTheme.id, // Use custom theme ID
 *   pageSize: 'A4'
 * })
 * 
 * // Export themes as JSON
 * const themesJson = ThemeManager.exportThemes()
 * 
 * // Import themes from JSON
 * const importedIds = ThemeManager.importThemes(themesJson)
 * ```
 */

