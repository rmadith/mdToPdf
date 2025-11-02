"use client"

import React, { useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Eye, Loader2 } from "lucide-react"
import { fadeIn } from "@/lib/animations"

interface MarkdownPreviewProps {
  html: string
  loading?: boolean
}

export const MarkdownPreview = React.memo(function MarkdownPreview({ html, loading = false }: MarkdownPreviewProps) {
  // Calculate reading time (avg 200 words per minute)
  const readingTime = useMemo(() => {
    if (!html) return 0
    const text = html.replace(/<[^>]*>/g, '')
    const words = text.trim().split(/\s+/).length
    return Math.ceil(words / 200)
  }, [html])

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={fadeIn}
      className="h-full"
    >
      <Card className="h-full flex flex-col shadow-soft hover-lift transition-smooth">
        <div className="p-4 border-b bg-muted/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4 text-primary" />
              <Label className="text-base font-semibold">Preview</Label>
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
                    <span className="text-xs text-muted-foreground">Updating...</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            <AnimatePresence mode="wait">
              {html && readingTime > 0 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                >
                  <Badge variant="secondary" className="text-xs">
                    📖 {readingTime} min read
                  </Badge>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
        
        <div className="flex-1 p-6 overflow-auto">
          <AnimatePresence mode="wait">
            {html ? (
              <motion.div
                key="content"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="prose prose-sm max-w-none dark:prose-invert prose-headings:scroll-mt-20"
                dangerouslySetInnerHTML={{ __html: html }}
              />
            ) : (
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
                  <Eye className="w-16 h-16 text-muted-foreground/30" />
                </motion.div>
                <div>
                  <p className="text-muted-foreground font-medium mb-1">
                    Start typing to see preview
                  </p>
                  <p className="text-xs text-muted-foreground/70">
                    Your markdown will be rendered here in real-time
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </Card>
    </motion.div>
  )
})

