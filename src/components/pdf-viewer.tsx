"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { generatePDF, downloadPDF } from "@/lib/markdown"
import type { PDFGenerationOptions, PDFResult } from "@/lib/markdown/types"

interface PDFViewerProps {
  markdown: string
  html: string
  options?: Partial<PDFGenerationOptions>
}

export function PDFViewer({ markdown, html, options = {} }: PDFViewerProps) {
  const [pdfResult, setPdfResult] = useState<PDFResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true

    const generatePDFPreview = async () => {
      if (!markdown.trim()) {
        setPdfResult(null)
        return
      }

      setLoading(true)
      setError(null)

      try {
        const result = await generatePDF({
          html,
          markdown,
          pageSize: options.pageSize || "A4",
          orientation: options.orientation || "portrait",
          margins: options.margins,
          stylePreset: options.stylePreset || "modern",
          title: options.title,
          author: options.author,
          subject: options.subject,
        })

        if (mounted) {
          setPdfResult(result)
        }
      } catch (err) {
        console.error("Error generating PDF:", err)
        if (mounted) {
          setError("Failed to generate PDF preview")
        }
      } finally {
        if (mounted) {
          setLoading(false)
        }
      }
    }

    // Debounce PDF generation
    const timeoutId = setTimeout(() => {
      generatePDFPreview()
    }, 500)

    return () => {
      mounted = false
      clearTimeout(timeoutId)
      // Clean up blob URL
      if (pdfResult?.url) {
        URL.revokeObjectURL(pdfResult.url)
      }
    }
  }, [markdown, html, JSON.stringify(options)])

  const handleDownload = () => {
    if (pdfResult) {
      const filename = options.title
        ? `${options.title.replace(/[^a-z0-9]/gi, "_")}.pdf`
        : "document.pdf"
      downloadPDF(pdfResult.blob, filename)
    }
  }

  return (
    <Card className="h-full flex flex-col">
      <div className="p-4 border-b">
        <div className="flex items-center justify-between">
          <div>
            <Label>PDF Preview</Label>
            {loading && (
              <span className="ml-2 text-sm text-muted-foreground">
                Generating...
              </span>
            )}
            {pdfResult && (
              <span className="ml-2 text-sm text-muted-foreground">
                {(pdfResult.size / 1024).toFixed(1)} KB
              </span>
            )}
          </div>
          <Button
            onClick={handleDownload}
            disabled={!pdfResult || loading}
            size="sm"
          >
            Download PDF
          </Button>
        </div>
      </div>
      <div className="flex-1 overflow-auto bg-gray-100">
        {error && (
          <div className="flex items-center justify-center h-full">
            <p className="text-red-600">{error}</p>
          </div>
        )}
        {loading && !pdfResult && (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
              <p className="text-muted-foreground">Generating PDF...</p>
            </div>
          </div>
        )}
        {!loading && !pdfResult && !error && (
          <div className="flex items-center justify-center h-full">
            <p className="text-muted-foreground">
              PDF preview will appear here...
            </p>
          </div>
        )}
        {pdfResult && (
          <iframe
            src={pdfResult.url}
            className="w-full h-full"
            title="PDF Preview"
          />
        )}
      </div>
    </Card>
  )
}

