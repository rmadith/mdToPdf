import { useState, useEffect } from 'react'
import { generatePDF } from '@/lib/markdown'
import type { PDFGenerationOptions, PDFResult } from '@/lib/markdown/types'
import { useDebounce } from './use-debounce'

interface UsePDFGeneratorOptions extends PDFGenerationOptions {
  /** Debounce delay in milliseconds (default: 500) */
  debounceDelay?: number
}

interface UsePDFGeneratorResult {
  /** Generated PDF result */
  result: PDFResult | null
  /** Whether PDF generation is in progress */
  loading: boolean
  /** Any error that occurred during generation */
  error: Error | null
  /** Function to manually trigger regeneration */
  regenerate: () => Promise<void>
}

/**
 * Custom hook to generate PDFs from markdown with automatic debouncing
 * @param markdown - Raw markdown string
 * @param html - Parsed HTML string
 * @param options - PDF generation options
 * @returns PDF generation result with loading and error states
 */
export function usePDFGenerator(
  markdown: string,
  html: string,
  options: Omit<UsePDFGeneratorOptions, 'markdown' | 'html'> = {}
): UsePDFGeneratorResult {
  const { debounceDelay = 500, ...pdfOptions } = options
  const debouncedMarkdown = useDebounce(markdown, debounceDelay)
  const debouncedHtml = useDebounce(html, debounceDelay)
  
  const [result, setResult] = useState<PDFResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const generate = async (md: string, h: string) => {
    if (!md.trim() || !h.trim()) {
      setResult(null)
      setLoading(false)
      return
    }

    setLoading(true)
    setError(null)

    try {
      const pdf = await generatePDF({
        markdown: md,
        html: h,
        ...pdfOptions,
      })
      setResult(pdf)
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to generate PDF'))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    generate(debouncedMarkdown, debouncedHtml)
    
    // Cleanup blob URL on unmount
    return () => {
      if (result?.url) {
        URL.revokeObjectURL(result.url)
      }
    }
  }, [debouncedMarkdown, debouncedHtml, JSON.stringify(pdfOptions)])

  const regenerate = async () => {
    await generate(markdown, html)
  }

  return { result, loading, error, regenerate }
}

