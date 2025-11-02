// Type definitions for markdown processing and PDF generation

export interface MarkdownOptions {
  /** Enable GitHub Flavored Markdown (tables, strikethrough, etc.) */
  gfm?: boolean
  /** Enable mathematical formulas with KaTeX */
  math?: boolean
  /** Enable syntax highlighting for code blocks */
  syntaxHighlighting?: boolean
  /** Enable Mermaid diagrams */
  diagrams?: boolean
  /** Sanitize HTML content */
  sanitize?: boolean
}

export interface PDFConfig {
  /** Page size (default: A4) */
  pageSize?: 'A4' | 'Letter' | 'Legal'
  /** Page orientation */
  orientation?: 'portrait' | 'landscape'
  /** Page margins in points (default: 40) */
  margins?: {
    top?: number
    right?: number
    bottom?: number
    left?: number
  }
  /** Style preset (can be built-in or custom theme ID) */
  stylePreset?: StylePresetExtended
  /** Document title */
  title?: string
  /** Document author */
  author?: string
  /** Document subject */
  subject?: string
}

export type StylePreset = 'github' | 'academic' | 'modern' | 'minimal'
export type StylePresetExtended = StylePreset | string

export interface ParsedMarkdown {
  /** HTML string of parsed markdown */
  html: string
  /** AST (Abstract Syntax Tree) of the markdown */
  ast?: any
  /** Metadata extracted from the markdown */
  metadata?: {
    title?: string
    description?: string
    author?: string
  }
}

export interface PDFGenerationOptions extends PDFConfig {
  /** Parsed markdown HTML */
  html: string
  /** Original markdown text */
  markdown: string
  /** Additional CSS styles */
  customStyles?: string
}

export interface PDFResult {
  /** PDF blob */
  blob: Blob
  /** PDF URL for preview/download */
  url: string
  /** PDF size in bytes */
  size: number
}

