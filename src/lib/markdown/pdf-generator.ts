import { pdf } from '@react-pdf/renderer'
import type { PDFGenerationOptions, PDFResult } from './types'
import { createPDFDocument } from '../pdf/document'
import { prepareMarkdownForPDF } from '../emoji-handler'
import { extractAndRenderMermaidDiagrams, getMermaidDataUris } from '../mermaid-renderer'

/**
 * Generate a PDF from parsed markdown HTML
 * @param options - PDF generation options
 * @returns PDF result with blob and URL
 */
export async function generatePDF(
  options: PDFGenerationOptions
): Promise<PDFResult> {
  try {
    const {
      html,
      markdown,
      pageSize = 'A4',
      orientation = 'portrait',
      margins,
      stylePreset = 'modern',
      title,
      author,
      subject,
    } = options

    // Clean markdown of emojis (PDF fonts don't support them)
    const cleanMarkdown = prepareMarkdownForPDF(markdown, 'remove')

    // Extract and render mermaid diagrams
    const mermaidDiagramMap = await extractAndRenderMermaidDiagrams(cleanMarkdown)
    const mermaidDataUris = await getMermaidDataUris(mermaidDiagramMap)

    // Create the PDF document component
    const document = createPDFDocument({
      html,
      markdown: cleanMarkdown,
      pageSize,
      orientation,
      margins,
      stylePreset,
      metadata: {
        title: title || 'Markdown Document',
        author: author || 'Markdown to PDF Converter',
        subject: subject || 'Generated from Markdown',
      },
      mermaidDiagrams: mermaidDataUris,
    })

    // Generate the PDF blob
    const pdfBlob = await pdf(document).toBlob()

    // Create URL for preview/download
    const url = URL.createObjectURL(pdfBlob)

    return {
      blob: pdfBlob,
      url,
      size: pdfBlob.size,
    }
  } catch (error) {
    console.error('Error generating PDF:', error)
    throw new Error('Failed to generate PDF')
  }
}

/**
 * Download a PDF blob with a given filename
 * @param blob - PDF blob
 * @param filename - Desired filename
 */
export function downloadPDF(blob: Blob, filename: string = 'document.pdf'): void {
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename.endsWith('.pdf') ? filename : `${filename}.pdf`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

/**
 * Estimate PDF size based on content
 * @param html - HTML content
 * @returns Estimated size in bytes
 */
export function estimatePDFSize(html: string): number {
  // Rough estimate: 2x the HTML size (accounting for fonts, styles, etc.)
  return html.length * 2
}

/**
 * Validate PDF generation options
 * @param options - PDF generation options
 * @returns Validation result
 */
export function validatePDFOptions(
  options: PDFGenerationOptions
): {
  valid: boolean
  errors: string[]
} {
  const errors: string[] = []

  if (!options.html && !options.markdown) {
    errors.push('Either HTML or markdown content is required')
  }

  if (options.margins) {
    const { top, right, bottom, left } = options.margins
    if (top !== undefined && (top < 0 || top > 200)) {
      errors.push('Top margin must be between 0 and 200')
    }
    if (right !== undefined && (right < 0 || right > 200)) {
      errors.push('Right margin must be between 0 and 200')
    }
    if (bottom !== undefined && (bottom < 0 || bottom > 200)) {
      errors.push('Bottom margin must be between 0 and 200')
    }
    if (left !== undefined && (left < 0 || left > 200)) {
      errors.push('Left margin must be between 0 and 200')
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  }
}

