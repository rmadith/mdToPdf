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
      try {
        const { downloadPDF } = await import("@/lib/markdown")
        const filename = options.title
          ? `${options.title.replace(/[^a-z0-9]/gi, "_")}.pdf`
          : "document.pdf"
        downloadPDF(pdfResult.blob, filename)
        toast.success("PDF Downloaded", {
          description: `${filename} has been saved`,
        })
      } catch (err) {
        toast.error("Download failed", {
          description: "Could not download the PDF file",
        })
      }
    }
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={fadeIn}
      className="h-full"
    >
      <Card className="h-full flex flex-col shadow-soft hover-lift transition-smooth">
        <div className="p-4 border-b bg-muted/30">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-primary" />
              <Label className="text-base font-semibold">PDF Preview</Label>
              
              <AnimatePresence mode="wait">
                {loading && (
                  <motion.div
                    key="loading"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    className="flex items-center gap-1"
                  >
                    <Loader2 className="w-3 h-3 animate-spin text-primary" />
                    <span className="text-xs text-muted-foreground">Generating...</span>
                  </motion.div>
                )}
                
                {justGenerated && !loading && (
                  <motion.div
                    key="success"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="flex items-center gap-1"
                  >
                    <Check className="w-3 h-3 text-green-500" />
                    <span className="text-xs text-green-600 dark:text-green-400 font-medium">Ready!</span>
                  </motion.div>
                )}
                
                {pdfResult && !loading && !justGenerated && (
                  <motion.span
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-xs text-muted-foreground"
                  >
                    {(pdfResult.size / 1024).toFixed(1)} KB
                  </motion.span>
                )}
              </AnimatePresence>
            </div>
            
            <motion.div
              initial="rest"
              whileHover="hover"
              whileTap="tap"
              variants={buttonHover}
            >
              <Button
                onClick={handleDownload}
                disabled={!pdfResult || loading}
                size="sm"
                className="gap-2 transition-smooth"
              >
                <Download className="w-4 h-4" />
                Download PDF
              </Button>
            </motion.div>
          </div>
          
          {/* Progress bar */}
          <AnimatePresence>
            {loading && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
              >
                <Progress value={progress} className="h-1" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
        <div className="flex-1 overflow-auto bg-muted/10">
          <AnimatePresence mode="wait">
            {error && (
              <motion.div
                key="error"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="flex items-center justify-center h-full p-8"
              >
                <div className="text-center">
                  <div className="text-destructive text-4xl mb-4">⚠️</div>
                  <p className="text-destructive font-medium">{error}</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Please try again or check your markdown syntax
                  </p>
                </div>
              </motion.div>
            )}
            
            {loading && !pdfResult && !error && (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center justify-center h-full"
              >
                <div className="text-center space-y-4">
                  <Skeleton className="h-[500px] w-[350px] mx-auto animate-shimmer" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-[250px] mx-auto" />
                    <Skeleton className="h-4 w-[200px] mx-auto" />
                  </div>
                </div>
              </motion.div>
            )}
            
            {!loading && !pdfResult && !error && (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center h-full text-center gap-4"
              >
                <motion.div
                  animate={{ 
                    scale: [1, 1.05, 1],
                    opacity: [0.5, 0.8, 0.5],
                  }}
                  transition={{ 
                    duration: 2,
                    repeat: Infinity,
                  }}
                >
                  <FileCheck className="w-16 h-16 text-muted-foreground/30" />
                </motion.div>
                <div>
                  <p className="text-muted-foreground font-medium mb-1">
                    PDF preview will appear here
                  </p>
                  <p className="text-xs text-muted-foreground/70">
                    Start typing in the editor to generate your PDF
                  </p>
                </div>
              </motion.div>
            )}
            
            {pdfResult && !error && (
              <motion.iframe
                key="pdf"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                src={pdfResult.url}
                className="w-full h-full"
                title="PDF Preview"
              />
            )}
          </AnimatePresence>
        </div>
      </Card>
    </motion.div>
  )
}

