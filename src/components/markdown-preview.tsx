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
  return (
    <Card className="h-full flex flex-col border-0 shadow-none">
      <div className="px-4 py-3 border-b">
        <Label className="text-sm font-medium">Preview</Label>
      </div>
      
      <div className="flex-1 p-6 overflow-auto">
        {html ? (
          <div
            className="prose prose-sm max-w-none dark:prose-invert"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        ) : (
          <div className="flex items-center justify-center h-full text-center text-muted-foreground text-sm">
            <p>Preview appears here</p>
          </div>
        )}
      </div>
    </Card>
  )
})

