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

// PDF styling utilities
export {
  getStylesForPreset,
  getPageSize,
  getDefaultMargins,
  githubStyles,
  academicStyles,
  modernStyles,
  minimalStyles,
} from './pdf'

// Type definitions
export type {
  MarkdownOptions,
  PDFConfig,
  StylePreset,
  ParsedMarkdown,
  PDFGenerationOptions,
  PDFResult,
} from './markdown/types'

/**
 * Example usage as a headless conversion:
 * 
 * ```typescript
 * import { parseMarkdown, generatePDF } from '@/lib'
 * 
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
 * ```
 */

