import { StyleSheet } from '@react-pdf/renderer'
import type { StylePreset } from '../markdown/types'
import type { CustomTheme, StylePresetExtended } from '../theme-types'
import { ThemeManager } from '../theme-manager'

// Base styles shared across all presets
const baseStyles = {
  page: {
    fontFamily: 'Helvetica',
    fontSize: 11,
    lineHeight: 1.6,
  },
  heading1: {
    fontSize: 24,
    fontWeight: 'bold' as const,
    marginBottom: 12,
    marginTop: 24,
  },
  heading2: {
    fontSize: 20,
    fontWeight: 'bold' as const,
    marginBottom: 10,
    marginTop: 20,
  },
  heading3: {
    fontSize: 16,
    fontWeight: 'bold' as const,
    marginBottom: 8,
    marginTop: 16,
  },
  heading4: {
    fontSize: 14,
    fontWeight: 'bold' as const,
    marginBottom: 6,
    marginTop: 12,
  },
  heading5: {
    fontSize: 12,
    fontWeight: 'bold' as const,
    marginBottom: 4,
    marginTop: 10,
  },
  heading6: {
    fontSize: 11,
    fontWeight: 'bold' as const,
    marginBottom: 4,
    marginTop: 8,
  },
  paragraph: {
    marginBottom: 10,
  },
  strong: {
    fontWeight: 'bold' as const,
  },
  emphasis: {
    fontStyle: 'italic' as const,
  },
  link: {
    color: '#0066cc',
    textDecoration: 'underline' as const,
  },
  list: {
    marginBottom: 10,
    marginLeft: 20,
  },
  listItem: {
    marginBottom: 4,
  },
  blockquote: {
    marginLeft: 20,
    marginRight: 20,
    marginBottom: 10,
    paddingLeft: 15,
    fontStyle: 'italic' as const,
  },
  code: {
    fontFamily: 'Courier',
    fontSize: 10,
    backgroundColor: '#f5f5f5',
    padding: 2,
  },
  codeBlock: {
    fontFamily: 'Courier',
    fontSize: 9,
    backgroundColor: '#f5f5f5',
    padding: 10,
    marginBottom: 10,
    borderRadius: 4,
  },
  mermaidDiagram: {
    marginBottom: 30,
    marginTop: 20,
    paddingVertical: 15,
    paddingHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 4,
    border: '1px solid #e2e8f0',
  },
  table: {
    marginBottom: 10,
  },
  tableRow: {
    flexDirection: 'row' as const,
  },
  tableCell: {
    border: '1px solid #ddd',
    padding: 8,
    flex: 1,
  },
  tableCellHeader: {
    backgroundColor: '#f5f5f5',
    fontWeight: 'bold' as const,
  },
  horizontalRule: {
    marginVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  image: {
    maxWidth: '100%',
    marginBottom: 10,
  },
}

// GitHub-style theme (clean, modern)
const githubStyles = StyleSheet.create({
  ...baseStyles,
  page: {
    ...baseStyles.page,
    backgroundColor: '#ffffff',
    color: '#24292f',
  },
  heading1: {
    ...baseStyles.heading1,
    borderBottomWidth: 1,
    borderBottomColor: '#d0d7de',
    paddingBottom: 8,
  },
  heading2: {
    ...baseStyles.heading2,
    borderBottomWidth: 1,
    borderBottomColor: '#d0d7de',
    paddingBottom: 6,
  },
  link: {
    ...baseStyles.link,
    color: '#0969da',
  },
  blockquote: {
    ...baseStyles.blockquote,
    borderLeftWidth: 4,
    borderLeftColor: '#d0d7de',
    color: '#656d76',
  },
  code: {
    ...baseStyles.code,
    backgroundColor: '#f6f8fa',
    borderRadius: 3,
    color: '#24292f',
  },
  codeBlock: {
    ...baseStyles.codeBlock,
    backgroundColor: '#f6f8fa',
    borderWidth: 1,
    borderColor: '#d0d7de',
  },
})

// Academic-style theme (formal, serif)
const academicStyles = StyleSheet.create({
  ...baseStyles,
  page: {
    ...baseStyles.page,
    fontFamily: 'Times-Roman',
    fontSize: 12,
    backgroundColor: '#ffffff',
    color: '#000000',
  },
  heading1: {
    ...baseStyles.heading1,
    fontFamily: 'Times-Bold',
    fontSize: 22,
    textAlign: 'center' as const,
    marginTop: 30,
    marginBottom: 20,
  },
  heading2: {
    ...baseStyles.heading2,
    fontFamily: 'Times-Bold',
    fontSize: 18,
  },
  heading3: {
    ...baseStyles.heading3,
    fontFamily: 'Times-Bold',
    fontSize: 16,
  },
  heading4: {
    ...baseStyles.heading4,
    fontFamily: 'Times-Bold',
    fontSize: 14,
  },
  strong: {
    ...baseStyles.strong,
    fontFamily: 'Times-Bold',
  },
  emphasis: {
    ...baseStyles.emphasis,
    fontFamily: 'Times-Italic',
  },
  link: {
    color: '#000080',
    textDecoration: 'underline' as const,
  },
  blockquote: {
    ...baseStyles.blockquote,
    fontFamily: 'Times-Italic',
    fontSize: 11,
    marginLeft: 30,
    marginRight: 30,
  },
  code: {
    ...baseStyles.code,
    fontFamily: 'Courier',
    fontSize: 10,
  },
  codeBlock: {
    ...baseStyles.codeBlock,
    fontFamily: 'Courier',
    fontSize: 9,
    borderWidth: 1,
    borderColor: '#000000',
  },
})

// Modern theme (bold, colorful)
const modernStyles = StyleSheet.create({
  ...baseStyles,
  page: {
    ...baseStyles.page,
    fontFamily: 'Helvetica',
    fontSize: 11,
    backgroundColor: '#ffffff',
    color: '#1a1a1a',
  },
  heading1: {
    ...baseStyles.heading1,
    fontSize: 28,
    color: '#2563eb',
    marginBottom: 16,
  },
  heading2: {
    ...baseStyles.heading2,
    fontSize: 22,
    color: '#3b82f6',
    marginBottom: 12,
  },
  heading3: {
    ...baseStyles.heading3,
    fontSize: 18,
    color: '#60a5fa',
  },
  heading4: {
    ...baseStyles.heading4,
    color: '#93c5fd',
  },
  link: {
    color: '#2563eb',
    textDecoration: 'underline' as const,
  },
  blockquote: {
    ...baseStyles.blockquote,
    borderLeftWidth: 4,
    borderLeftColor: '#3b82f6',
    backgroundColor: '#eff6ff',
    padding: 10,
    fontStyle: 'normal' as const,
    color: '#1e40af',
  },
  code: {
    ...baseStyles.code,
    backgroundColor: '#f1f5f9',
    color: '#e11d48',
    borderRadius: 3,
  },
  codeBlock: {
    ...baseStyles.codeBlock,
    backgroundColor: '#1e293b',
    color: '#e2e8f0',
    borderRadius: 6,
  },
})

// Minimal theme (clean, simple)
const minimalStyles = StyleSheet.create({
  ...baseStyles,
  page: {
    ...baseStyles.page,
    fontFamily: 'Helvetica',
    fontSize: 11,
    backgroundColor: '#ffffff',
    color: '#333333',
  },
  heading1: {
    ...baseStyles.heading1,
    fontSize: 24,
    marginBottom: 16,
    marginTop: 24,
  },
  heading2: {
    ...baseStyles.heading2,
    fontSize: 20,
    marginBottom: 12,
  },
  heading3: {
    ...baseStyles.heading3,
    fontSize: 16,
  },
  link: {
    color: '#000000',
    textDecoration: 'underline' as const,
  },
  blockquote: {
    ...baseStyles.blockquote,
    borderLeftWidth: 3,
    borderLeftColor: '#cccccc',
    fontStyle: 'normal' as const,
  },
  code: {
    ...baseStyles.code,
    backgroundColor: '#f0f0f0',
    borderRadius: 2,
  },
  codeBlock: {
    ...baseStyles.codeBlock,
    backgroundColor: '#f8f8f8',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
})

/**
 * Create custom styles from a theme configuration
 * @param theme - Custom theme configuration
 * @returns StyleSheet for the custom theme
 */
export function createCustomStyles(theme: CustomTheme) {
  return StyleSheet.create({
    page: {
      fontFamily: theme.typography.fontFamily,
      fontSize: theme.typography.fontSize,
      lineHeight: theme.typography.lineHeight,
      backgroundColor: theme.colors.pageBackground,
      color: theme.colors.textColor,
    },
    heading1: {
      fontSize: theme.typography.heading1Size,
      fontWeight: 'bold' as const,
      marginBottom: theme.spacing.heading1MarginBottom,
      marginTop: theme.spacing.heading1MarginTop,
      color: theme.colors.heading1Color || theme.colors.textColor,
    },
    heading2: {
      fontSize: theme.typography.heading2Size,
      fontWeight: 'bold' as const,
      marginBottom: theme.spacing.heading2MarginBottom,
      marginTop: theme.spacing.heading2MarginTop,
      color: theme.colors.heading2Color || theme.colors.textColor,
    },
    heading3: {
      fontSize: theme.typography.heading3Size,
      fontWeight: 'bold' as const,
      marginBottom: theme.spacing.heading3MarginBottom,
      marginTop: theme.spacing.heading3MarginTop,
      color: theme.colors.heading3Color || theme.colors.textColor,
    },
    heading4: {
      fontSize: theme.typography.heading4Size,
      fontWeight: 'bold' as const,
      marginBottom: 6,
      marginTop: 12,
      color: theme.colors.heading4Color || theme.colors.textColor,
    },
    heading5: {
      fontSize: theme.typography.heading5Size,
      fontWeight: 'bold' as const,
      marginBottom: 4,
      marginTop: 10,
    },
    heading6: {
      fontSize: theme.typography.heading6Size,
      fontWeight: 'bold' as const,
      marginBottom: 4,
      marginTop: 8,
    },
    paragraph: {
      marginBottom: theme.spacing.paragraphMarginBottom,
    },
    strong: {
      fontWeight: 'bold' as const,
    },
    emphasis: {
      fontStyle: 'italic' as const,
    },
    link: {
      color: theme.colors.linkColor,
      textDecoration: 'underline' as const,
    },
    list: {
      marginBottom: theme.spacing.listMarginBottom,
      marginLeft: theme.spacing.listMarginLeft,
    },
    listItem: {
      marginBottom: 4,
    },
    blockquote: {
      marginLeft: theme.spacing.blockquoteMarginLeft,
      marginRight: 20,
      marginBottom: 10,
      paddingLeft: theme.spacing.blockquotePaddingLeft,
      fontStyle: 'italic' as const,
      borderLeftWidth: 4,
      borderLeftColor: theme.colors.blockquoteBorderColor,
      backgroundColor: theme.colors.blockquoteBackground,
      color: theme.colors.blockquoteTextColor || theme.colors.textColor,
    },
    code: {
      fontFamily: theme.typography.codeFontFamily,
      fontSize: theme.typography.codeFontSize,
      backgroundColor: theme.colors.codeBackground,
      color: theme.colors.codeTextColor,
      padding: 2,
    },
    codeBlock: {
      fontFamily: theme.typography.codeFontFamily,
      fontSize: theme.typography.codeBlockFontSize,
      backgroundColor: theme.colors.codeBlockBackground,
      color: theme.colors.codeBlockTextColor,
      padding: theme.spacing.codeBlockPadding,
      marginBottom: 10,
      borderRadius: 4,
    },
    table: {
      marginBottom: 10,
    },
    tableRow: {
      flexDirection: 'row' as const,
    },
    tableCell: {
      border: `1px solid ${theme.colors.tableBorderColor}`,
      padding: 8,
      flex: 1,
    },
    tableCellHeader: {
      backgroundColor: theme.colors.tableHeaderBackground,
      fontWeight: 'bold' as const,
    },
    horizontalRule: {
      marginVertical: 15,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.horizontalRuleColor,
    },
    image: {
      maxWidth: '100%',
      marginBottom: 10,
    },
  })
}

/**
 * Get PDF styles for a specific preset (including custom themes)
 * @param preset - Style preset name or custom theme ID
 * @returns StyleSheet for the preset
 */
export function getStylesForPreset(preset: StylePresetExtended) {
  // Check if it's a built-in preset
  switch (preset) {
    case 'github':
      return githubStyles
    case 'academic':
      return academicStyles
    case 'modern':
      return modernStyles
    case 'minimal':
      return minimalStyles
  }

  // Check if it's a custom theme
  const customTheme = ThemeManager.getTheme(preset)
  if (customTheme) {
    return createCustomStyles(customTheme)
  }

  // Default to modern
  return modernStyles
}

/**
 * Get page size dimensions
 * @param size - Page size name
 * @returns Width and height in points
 */
export function getPageSize(size: 'A4' | 'Letter' | 'Legal') {
  switch (size) {
    case 'A4':
      return { width: 595, height: 842 } // 210mm x 297mm
    case 'Letter':
      return { width: 612, height: 792 } // 8.5" x 11"
    case 'Legal':
      return { width: 612, height: 1008 } // 8.5" x 14"
    default:
      return { width: 595, height: 842 }
  }
}

/**
 * Get default margins for a page
 * @returns Margin values in points
 */
export function getDefaultMargins() {
  return {
    top: 40,
    right: 40,
    bottom: 40,
    left: 40,
  }
}

// Export all style presets and utilities
export { githubStyles, academicStyles, modernStyles, minimalStyles }

