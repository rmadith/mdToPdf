// Type definitions for custom PDF themes

export interface ThemeColors {
  /** Page background color */
  pageBackground: string
  /** Primary text color */
  textColor: string
  /** Heading 1 color */
  heading1Color?: string
  /** Heading 2 color */
  heading2Color?: string
  /** Heading 3 color */
  heading3Color?: string
  /** Heading 4 color */
  heading4Color?: string
  /** Link color */
  linkColor: string
  /** Code background color */
  codeBackground: string
  /** Code text color */
  codeTextColor?: string
  /** Code block background color */
  codeBlockBackground: string
  /** Code block text color */
  codeBlockTextColor?: string
  /** Blockquote background color */
  blockquoteBackground?: string
  /** Blockquote text color */
  blockquoteTextColor?: string
  /** Blockquote border color */
  blockquoteBorderColor: string
  /** Table border color */
  tableBorderColor: string
  /** Table header background color */
  tableHeaderBackground: string
  /** Horizontal rule color */
  horizontalRuleColor: string
}

export interface ThemeTypography {
  /** Base font family */
  fontFamily: string
  /** Base font size in points */
  fontSize: number
  /** Base line height */
  lineHeight: number
  /** Heading 1 font size */
  heading1Size: number
  /** Heading 2 font size */
  heading2Size: number
  /** Heading 3 font size */
  heading3Size: number
  /** Heading 4 font size */
  heading4Size: number
  /** Heading 5 font size */
  heading5Size: number
  /** Heading 6 font size */
  heading6Size: number
  /** Code font family */
  codeFontFamily: string
  /** Code font size */
  codeFontSize: number
  /** Code block font size */
  codeBlockFontSize: number
}

export interface ThemeSpacing {
  /** Heading 1 margin top */
  heading1MarginTop: number
  /** Heading 1 margin bottom */
  heading1MarginBottom: number
  /** Heading 2 margin top */
  heading2MarginTop: number
  /** Heading 2 margin bottom */
  heading2MarginBottom: number
  /** Heading 3 margin top */
  heading3MarginTop: number
  /** Heading 3 margin bottom */
  heading3MarginBottom: number
  /** Paragraph margin bottom */
  paragraphMarginBottom: number
  /** List margin bottom */
  listMarginBottom: number
  /** List margin left */
  listMarginLeft: number
  /** Blockquote margin left */
  blockquoteMarginLeft: number
  /** Blockquote padding left */
  blockquotePaddingLeft: number
  /** Code block padding */
  codeBlockPadding: number
}

export interface CustomTheme {
  /** Unique theme ID */
  id: string
  /** Theme name */
  name: string
  /** Theme description */
  description?: string
  /** Theme colors */
  colors: ThemeColors
  /** Typography settings */
  typography: ThemeTypography
  /** Spacing settings */
  spacing: ThemeSpacing
  /** Whether this is a built-in theme */
  isBuiltIn?: boolean
  /** Creation timestamp */
  createdAt?: number
  /** Last modified timestamp */
  updatedAt?: number
}

export type StylePresetExtended = 'github' | 'academic' | 'modern' | 'minimal' | string

/**
 * Default theme template for creating new themes
 */
export const DEFAULT_THEME_TEMPLATE: Omit<CustomTheme, 'id' | 'createdAt' | 'updatedAt'> = {
  name: 'New Theme',
  description: 'A custom theme',
  colors: {
    pageBackground: '#ffffff',
    textColor: '#1a1a1a',
    heading1Color: '#2563eb',
    heading2Color: '#3b82f6',
    heading3Color: '#60a5fa',
    heading4Color: '#93c5fd',
    linkColor: '#2563eb',
    codeBackground: '#f1f5f9',
    codeTextColor: '#e11d48',
    codeBlockBackground: '#1e293b',
    codeBlockTextColor: '#e2e8f0',
    blockquoteBackground: '#eff6ff',
    blockquoteTextColor: '#1e40af',
    blockquoteBorderColor: '#3b82f6',
    tableBorderColor: '#ddd',
    tableHeaderBackground: '#f5f5f5',
    horizontalRuleColor: '#ddd',
  },
  typography: {
    fontFamily: 'Helvetica',
    fontSize: 11,
    lineHeight: 1.6,
    heading1Size: 24,
    heading2Size: 20,
    heading3Size: 16,
    heading4Size: 14,
    heading5Size: 12,
    heading6Size: 11,
    codeFontFamily: 'Courier',
    codeFontSize: 10,
    codeBlockFontSize: 9,
  },
  spacing: {
    heading1MarginTop: 24,
    heading1MarginBottom: 12,
    heading2MarginTop: 20,
    heading2MarginBottom: 10,
    heading3MarginTop: 16,
    heading3MarginBottom: 8,
    paragraphMarginBottom: 10,
    listMarginBottom: 10,
    listMarginLeft: 20,
    blockquoteMarginLeft: 20,
    blockquotePaddingLeft: 15,
    codeBlockPadding: 10,
  },
}

