import { useState, useEffect } from 'react'
import { parseMarkdown } from '@/lib/markdown'
import type { MarkdownOptions, ParsedMarkdown } from '@/lib/markdown/types'
import { useDebounce } from './use-debounce'

interface UseMarkdownParserOptions extends MarkdownOptions {
  /** Debounce delay in milliseconds (default: 300) */
  debounceDelay?: number
}

interface UseMarkdownParserResult {
  /** Parsed markdown result */
  result: ParsedMarkdown | null
  /** Whether parsing is in progress */
  loading: boolean
  /** Any error that occurred during parsing */
  error: Error | null
}

/**
 * Custom hook to parse markdown with automatic debouncing
 * @param markdown - Raw markdown string
 * @param options - Parsing options
 * @returns Parsing result with loading and error states
 */
export function useMarkdownParser(
  markdown: string,
  options: UseMarkdownParserOptions = {}
): UseMarkdownParserResult {
  const { debounceDelay = 300, ...markdownOptions } = options
  const debouncedMarkdown = useDebounce(markdown, debounceDelay)
  
  const [result, setResult] = useState<ParsedMarkdown | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    let mounted = true

    const parse = async () => {
      if (!debouncedMarkdown.trim()) {
        setResult(null)
        setLoading(false)
        return
      }

      setLoading(true)
      setError(null)

      try {
        const parsed = await parseMarkdown(debouncedMarkdown, markdownOptions)
        if (mounted) {
          setResult(parsed)
        }
      } catch (err) {
        if (mounted) {
          setError(err instanceof Error ? err : new Error('Failed to parse markdown'))
        }
      } finally {
        if (mounted) {
          setLoading(false)
        }
      }
    }

    parse()

    return () => {
      mounted = false
    }
  }, [debouncedMarkdown, JSON.stringify(markdownOptions)])

  return { result, loading, error }
}

