import React from 'react'
import { Document, Page, Text, View, Link, Image } from '@react-pdf/renderer'
import { getStylesForPreset, getPageSize, getDefaultMargins } from './styles'
import type { StylePresetExtended } from '../markdown/types'

interface PDFDocumentProps {
  html: string
  markdown: string
  pageSize?: 'A4' | 'Letter' | 'Legal'
  orientation?: 'portrait' | 'landscape'
  margins?: {
    top?: number
    right?: number
    bottom?: number
    left?: number
  }
  stylePreset?: StylePresetExtended
  metadata?: {
    title?: string
    author?: string
    subject?: string
  }
}

/**
 * Create a PDF document from HTML/Markdown
 * @param props - PDF document configuration
 * @returns React PDF Document component
 */
export function createPDFDocument(props: PDFDocumentProps) {
  const {
    markdown,
    pageSize = 'A4',
    orientation = 'portrait',
    margins,
    stylePreset = 'modern',
    metadata = {},
  } = props

  const styles = getStylesForPreset(stylePreset)
  const pageDimensions = getPageSize(pageSize)
  const defaultMargins = getDefaultMargins()
  
  const pageMargins = {
    ...defaultMargins,
    ...margins,
  }

  // Swap dimensions for landscape
  const dimensions = orientation === 'landscape'
    ? { width: pageDimensions.height, height: pageDimensions.width }
    : pageDimensions

  // Parse markdown into renderable elements
  const elements = parseMarkdownToElements(markdown, styles)

  return (
    <Document
      title={metadata.title}
      author={metadata.author}
      subject={metadata.subject}
    >
      <Page
        size={[dimensions.width, dimensions.height]}
        style={{
          ...styles.page,
          paddingTop: pageMargins.top,
          paddingRight: pageMargins.right,
          paddingBottom: pageMargins.bottom,
          paddingLeft: pageMargins.left,
        }}
      >
        {elements}
      </Page>
    </Document>
  )
}

/**
 * Parse markdown text into React PDF elements
 * @param markdown - Raw markdown text
 * @param styles - Style sheet
 * @returns Array of React PDF elements
 */
function parseMarkdownToElements(markdown: string, styles: any): React.ReactNode[] {
  const elements: React.ReactNode[] = []
  const lines = markdown.split('\n')
  let inCodeBlock = false
  let codeBlockContent: string[] = []
  let inList = false
  let listItems: string[] = []
  let currentParagraph: string[] = []

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]

    // Handle code blocks
    if (line.trim().startsWith('```')) {
      if (inCodeBlock) {
        // End code block
        elements.push(
          <View key={`code-${i}`} style={styles.codeBlock}>
            <Text>{codeBlockContent.join('\n')}</Text>
          </View>
        )
        codeBlockContent = []
        inCodeBlock = false
      } else {
        // Start code block
        flushParagraph()
        inCodeBlock = true
      }
      continue
    }

    if (inCodeBlock) {
      codeBlockContent.push(line)
      continue
    }

    // Handle headings
    const h1Match = line.match(/^#\s+(.+)$/)
    if (h1Match) {
      flushParagraph()
      elements.push(
        <Text key={`h1-${i}`} style={styles.heading1}>
          {h1Match[1]}
        </Text>
      )
      continue
    }

    const h2Match = line.match(/^##\s+(.+)$/)
    if (h2Match) {
      flushParagraph()
      elements.push(
        <Text key={`h2-${i}`} style={styles.heading2}>
          {h2Match[1]}
        </Text>
      )
      continue
    }

    const h3Match = line.match(/^###\s+(.+)$/)
    if (h3Match) {
      flushParagraph()
      elements.push(
        <Text key={`h3-${i}`} style={styles.heading3}>
          {h3Match[1]}
        </Text>
      )
      continue
    }

    const h4Match = line.match(/^####\s+(.+)$/)
    if (h4Match) {
      flushParagraph()
      elements.push(
        <Text key={`h4-${i}`} style={styles.heading4}>
          {h4Match[1]}
        </Text>
      )
      continue
    }

    const h5Match = line.match(/^#####\s+(.+)$/)
    if (h5Match) {
      flushParagraph()
      elements.push(
        <Text key={`h5-${i}`} style={styles.heading5}>
          {h5Match[1]}
        </Text>
      )
      continue
    }

    const h6Match = line.match(/^######\s+(.+)$/)
    if (h6Match) {
      flushParagraph()
      elements.push(
        <Text key={`h6-${i}`} style={styles.heading6}>
          {h6Match[1]}
        </Text>
      )
      continue
    }

    // Handle horizontal rules
    if (line.trim() === '---' || line.trim() === '***' || line.trim() === '___') {
      flushParagraph()
      elements.push(<View key={`hr-${i}`} style={styles.horizontalRule} />)
      continue
    }

    // Handle blockquotes
    if (line.trim().startsWith('>')) {
      flushParagraph()
      const quoteText = line.replace(/^>\s*/, '')
      elements.push(
        <View key={`quote-${i}`} style={styles.blockquote}>
          <Text>{quoteText}</Text>
        </View>
      )
      continue
    }

    // Handle lists
    const listMatch = line.match(/^[\s]*[-*+]\s+(.+)$/)
    const orderedListMatch = line.match(/^[\s]*\d+\.\s+(.+)$/)
    
    if (listMatch || orderedListMatch) {
      if (!inList) {
        flushParagraph()
        inList = true
      }
      const itemText = (listMatch || orderedListMatch)![1]
      listItems.push(itemText)
      continue
    } else if (inList && line.trim() === '') {
      // End of list
      flushList()
      inList = false
      continue
    }

    // Handle empty lines
    if (line.trim() === '') {
      flushParagraph()
      flushList()
      continue
    }

    // Regular paragraph text
    currentParagraph.push(line)
  }

  // Flush any remaining content
  flushParagraph()
  flushList()

  return elements

  function flushParagraph() {
    if (currentParagraph.length > 0) {
      const text = currentParagraph.join(' ')
      const formattedText = parseInlineFormatting(text, styles)
      elements.push(
        <Text key={`p-${elements.length}`} style={styles.paragraph}>
          {formattedText}
        </Text>
      )
      currentParagraph = []
    }
  }

  function flushList() {
    if (listItems.length > 0) {
      elements.push(
        <View key={`list-${elements.length}`} style={styles.list}>
          {listItems.map((item, idx) => (
            <Text key={idx} style={styles.listItem}>
              • {parseInlineFormatting(item, styles)}
            </Text>
          ))}
        </View>
      )
      listItems = []
    }
    inList = false
  }
}

/**
 * Parse inline formatting (bold, italic, code, links)
 * @param text - Text with inline markdown
 * @param styles - Style sheet
 * @returns Formatted text elements
 */
function parseInlineFormatting(text: string, styles: any): React.ReactNode {
  // This is a simplified implementation
  // In production, you'd want a more robust parser
  
  // Handle links [text](url)
  const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g
  const parts: React.ReactNode[] = []
  let lastIndex = 0
  let match

  while ((match = linkRegex.exec(text)) !== null) {
    // Add text before link
    if (match.index > lastIndex) {
      const beforeText = text.substring(lastIndex, match.index)
      parts.push(formatText(beforeText, styles))
    }

    // Add link
    parts.push(
      <Link key={`link-${match.index}`} src={match[2]} style={styles.link}>
        {match[1]}
      </Link>
    )

    lastIndex = match.index + match[0].length
  }

  // Add remaining text
  if (lastIndex < text.length) {
    parts.push(formatText(text.substring(lastIndex), styles))
  }

  return parts.length > 0 ? parts : formatText(text, styles)
}

/**
 * Format text with bold, italic, and inline code
 * @param text - Text to format
 * @param styles - Style sheet
 * @returns Formatted text
 */
function formatText(text: string, styles: any): string {
  // For now, return plain text
  // In production, you'd parse **bold**, *italic*, `code`, etc.
  return text
    .replace(/\*\*(.+?)\*\*/g, '$1')  // Bold
    .replace(/\*(.+?)\*/g, '$1')      // Italic
    .replace(/`(.+?)`/g, '$1')        // Code
}

