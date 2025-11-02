"use client"

import { useEffect, useState, useMemo } from "react"
import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { parseMarkdown } from "@/lib/markdown"
import type { MarkdownOptions } from "@/lib/markdown/types"

interface MarkdownPreviewProps {
  markdown: string
  options?: MarkdownOptions
}

export function MarkdownPreview({ markdown, options = {} }: MarkdownPreviewProps) {
  const [html, setHtml] = useState<string>("")
  const [loading, setLoading] = useState(false)

  // Memoize options to prevent unnecessary re-renders
  const memoizedOptions = useMemo(() => options, [JSON.stringify(options)])

  useEffect(() => {
    let mounted = true

    const parseContent = async () => {
      if (!markdown.trim()) {
        setHtml("")
        return
      }

      setLoading(true)
      try {
        const result = await parseMarkdown(markdown, memoizedOptions)
        if (mounted) {
          setHtml(result.html)
        }
      } catch (error) {
        console.error("Error parsing markdown:", error)
        if (mounted) {
          setHtml("<p>Error parsing markdown</p>")
        }
      } finally {
        if (mounted) {
          setLoading(false)
        }
      }
    }

    // Debounce parsing
    const timeoutId = setTimeout(() => {
      parseContent()
    }, 300)

    return () => {
      mounted = false
      clearTimeout(timeoutId)
    }
  }, [markdown, memoizedOptions])

  return (
    <Card className="h-full flex flex-col">
      <div className="p-4 border-b">
        <Label>Preview</Label>
        {loading && (
          <span className="ml-2 text-sm text-muted-foreground">Updating...</span>
        )}
      </div>
      <div className="flex-1 p-6 overflow-auto">
        {html ? (
          <div
            className="prose prose-sm max-w-none dark:prose-invert"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        ) : (
          <p className="text-muted-foreground text-sm">
            Start typing to see preview...
          </p>
        )}
      </div>
    </Card>
  )
}

