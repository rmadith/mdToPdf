"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Skeleton } from "@/components/ui/skeleton"
import type { PDFGenerationOptions, PDFResult } from "@/lib/markdown/types"
import { Download, FileCheck, FileText, Loader2, Check } from "lucide-react"
import { toast } from "sonner"
import { fadeIn, scaleInBounce, buttonHover } from "@/lib/animations"

interface PDFViewerProps {
  markdown: string
  html: string
  options?: Partial<PDFGenerationOptions>
  shouldGenerate?: boolean
}

export function PDFViewer({ markdown, html, options = {}, shouldGenerate = true }: PDFViewerProps) {
  const [pdfResult, setPdfResult] = useState<PDFResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [progress, setProgress] = useState(0)
  const [justGenerated, setJustGenerated] = useState(false)

  useEffect(() => {
    if (!shouldGenerate) return;
    
    let mounted = true

    const generatePDFPreview = async () => {
      if (!markdown.trim()) {
        setPdfResult(null)
        setProgress(0)
        return
      }

      setLoading(true)
      setError(null)
      setProgress(0)
      setJustGenerated(false)

      // Simulate progress
      const progressInterval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval)
            return prev
          }
          return prev + 10
        })
      }, 100)

      try {
        // Lazy load PDF generation
        const { generatePDF } = await import("@/lib/markdown")
        
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

        clearInterval(progressInterval)
        
        if (mounted) {
          setProgress(100)
          setPdfResult(result)
          setJustGenerated(true)
          setTimeout(() => setJustGenerated(false), 2000)
        }
      } catch (err) {
        console.error("Error generating PDF:", err)
        clearInterval(progressInterval)
        if (mounted) {
          setError("Failed to generate PDF preview")
          setProgress(0)
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
  }, [markdown, html, options.pageSize, options.stylePreset, options.title, shouldGenerate])

  const handleDownload = async () => {
    if (pdfResult) {
      const { downloadPDF } = await import("@/lib/markdown")
      const filename = options.title
        ? `${options.title.replace(/[^a-z0-9]/gi, "_")}.pdf`
        : "document.pdf"
      downloadPDF(pdfResult.blob, filename)
    }
  }

  return (
    <div className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#0b1020]/80 shadow-[0_10px_60px_-35px_rgba(15,23,42,0.9)] backdrop-blur">
      <div className="flex items-center justify-between border-b border-white/10 bg-white/[0.04] px-4 py-3">
        <span className="font-mono text-[11px] uppercase tracking-[0.35em] text-slate-400">
          PDF
        </span>
        <Button
          onClick={handleDownload}
          disabled={!pdfResult || loading}
          variant="ghost"
          size="sm"
          className="h-7 rounded-full border border-white/10 px-3 text-[11px] uppercase tracking-[0.3em] text-slate-300 transition-colors hover:border-white/30 hover:bg-white/10 hover:text-slate-100 disabled:opacity-30"
        >
          Download
        </Button>
      </div>
      
      <div className="relative flex-1 overflow-hidden bg-white/[0.02]">
        {error && (
          <div className="absolute inset-0 flex items-center justify-center p-8 text-center text-sm text-slate-400">
            <div>
              <p className="text-destructive">{error}</p>
              <p className="text-xs mt-2">Please check your markdown syntax</p>
            </div>
          </div>
        )}
        
        {loading && !pdfResult && !error && (
          <div className="absolute inset-0 flex items-center justify-center text-sm text-slate-400">
            <p>Generating PDF...</p>
          </div>
        )}
        
        {!loading && !pdfResult && !error && (
          <div className="absolute inset-0 flex items-center justify-center text-sm text-slate-500">
            <p>PDF preview</p>
          </div>
        )}
        
        {pdfResult && !error && (
          <iframe
            src={`${pdfResult.url}#toolbar=0&navpanes=0&scrollbar=0`}
            className="h-full w-full"
            title="PDF Preview"
          />
        )}
      </div>
    </div>
  )
}

