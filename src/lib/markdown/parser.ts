import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import remarkRehype from 'remark-rehype'
import rehypeKatex from 'rehype-katex'
import rehypeStringify from 'rehype-stringify'
import rehypeRaw from 'rehype-raw'
import type { MarkdownOptions, ParsedMarkdown } from './types'

/**
 * Parse markdown string to HTML with extended features support
 * @param markdown - Raw markdown string
 * @param options - Parsing options
 * @returns Parsed markdown with HTML and metadata
 */
export async function parseMarkdown(
  markdown: string,
  options: MarkdownOptions = {}
): Promise<ParsedMarkdown> {
  const {
    gfm = true,
    math = true,
    syntaxHighlighting = true,
    sanitize = true,
  } = options

  try {
    // Build the unified processor pipeline
    let processor = unified().use(remarkParse) as any

    // Add GitHub Flavored Markdown support
    if (gfm) {
      processor = processor.use(remarkGfm)
    }

    // Add math support
    if (math) {
      processor = processor.use(remarkMath)
    }

    // Convert to rehype (HTML AST)
    processor = processor.use(remarkRehype, { 
      allowDangerousHtml: !sanitize 
    })

    // Add raw HTML support if not sanitizing
    if (!sanitize) {
      processor = processor.use(rehypeRaw)
    }

    // Add KaTeX for math rendering
    if (math) {
      processor = processor.use(rehypeKatex, {
        throwOnError: false,
        strict: false,
      })
    }

    // Convert to HTML string
    processor = processor.use(rehypeStringify)

    // Process the markdown
    const result = await processor.process(markdown)
    const html = String(result)

    // Extract metadata (simple implementation)
    const metadata = extractMetadata(markdown)

    return {
      html,
      metadata,
    }
  } catch (error) {
    console.error('Error parsing markdown:', error)
    throw new Error('Failed to parse markdown')
  }
}

/**
 * Extract metadata from markdown frontmatter or content
 * @param markdown - Raw markdown string
 * @returns Extracted metadata
 */
function extractMetadata(markdown: string): ParsedMarkdown['metadata'] {
  const metadata: ParsedMarkdown['metadata'] = {}

  // Extract title from first H1
  const titleMatch = markdown.match(/^#\s+(.+)$/m)
  if (titleMatch) {
    metadata.title = titleMatch[1].trim()
  }

  // Simple frontmatter extraction (YAML-like)
  const frontmatterMatch = markdown.match(/^---\n([\s\S]*?)\n---/)
  if (frontmatterMatch) {
    const frontmatter = frontmatterMatch[1]
    const titleFm = frontmatter.match(/^title:\s*(.+)$/m)
    const authorFm = frontmatter.match(/^author:\s*(.+)$/m)
    const descFm = frontmatter.match(/^description:\s*(.+)$/m)

    if (titleFm) metadata.title = titleFm[1].trim()
    if (authorFm) metadata.author = authorFm[1].trim()
    if (descFm) metadata.description = descFm[1].trim()
  }

  return metadata
}

/**
 * Validate markdown for common issues
 * @param markdown - Raw markdown string
 * @returns Validation result with any warnings
 */
export function validateMarkdown(markdown: string): {
  valid: boolean
  warnings: string[]
} {
  const warnings: string[] = []

  // Check for empty content
  if (!markdown.trim()) {
    warnings.push('Markdown content is empty')
  }

  // Check for unmatched brackets
  const openBrackets = (markdown.match(/\[/g) || []).length
  const closeBrackets = (markdown.match(/\]/g) || []).length
  if (openBrackets !== closeBrackets) {
    warnings.push('Unmatched square brackets detected')
  }

  // Check for unmatched parentheses
  const openParens = (markdown.match(/\(/g) || []).length
  const closeParens = (markdown.match(/\)/g) || []).length
  if (openParens !== closeParens) {
    warnings.push('Unmatched parentheses detected')
  }

  return {
    valid: warnings.length === 0,
    warnings,
  }
}

/**
 * Estimate processing time based on markdown length
 * @param markdown - Raw markdown string
 * @returns Estimated processing time in milliseconds
 */
export function estimateProcessingTime(markdown: string): number {
  const length = markdown.length
  // Rough estimate: 0.01ms per character
  return Math.max(50, length * 0.01)
}

