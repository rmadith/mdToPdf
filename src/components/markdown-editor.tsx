"use client"

import React, { useCallback, useState, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { 
  Upload, 
  Bold, 
  Italic, 
  Code, 
  Link2, 
  List, 
  Quote,
  Heading1,
  Heading2,
  FileDown,
  Copy,
  Check
} from "lucide-react"
import { toast } from "sonner"
import { fadeIn, scaleIn, buttonHoverSubtle } from "@/lib/animations"

interface MarkdownEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  disabled?: boolean
}

export const MarkdownEditor = React.memo(function MarkdownEditor({
  value,
  onChange,
  placeholder = "Type your markdown here...",
  disabled = false,
}: MarkdownEditorProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [copied, setCopied] = useState(false)

  // Calculate word and character count
  const stats = useMemo(() => {
    const words = value.trim() ? value.trim().split(/\s+/).length : 0
    const characters = value.length
    const lines = value.split('\n').length
    return { words, characters, lines }
  }, [value])

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      onChange(e.target.value)
    },
    [onChange]
  )

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragging(false)

      const files = Array.from(e.dataTransfer.files)
      const mdFile = files.find((file) => file.name.endsWith(".md"))

      if (mdFile) {
        const reader = new FileReader()
        reader.onload = (event) => {
          const content = event.target?.result as string
          onChange(content)
        }
        reader.readAsText(mdFile)
      }
    },
    [onChange]
  )

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback(() => {
    setIsDragging(false)
  }, [])

  const handleFileUpload = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (file && file.name.endsWith(".md")) {
        const reader = new FileReader()
        reader.onload = (event) => {
          const content = event.target?.result as string
          onChange(content)
        }
        reader.readAsText(file)
      }
    },
    [onChange]
  )

  const insertFormatting = useCallback(
    (prefix: string, suffix: string = "") => {
      const textarea = document.querySelector("textarea")
      if (!textarea) return

      const start = textarea.selectionStart
      const end = textarea.selectionEnd
      const selectedText = value.substring(start, end)
      const newText =
        value.substring(0, start) +
        prefix +
        selectedText +
        suffix +
        value.substring(end)

      onChange(newText)

      // Restore selection
      setTimeout(() => {
        textarea.focus()
        textarea.setSelectionRange(
          start + prefix.length,
          end + prefix.length
        )
      }, 0)
    },
    [value, onChange]
  )

  return (
    <Card className="h-full flex flex-col border-0 shadow-none">
      <div className="px-4 py-3 border-b flex items-center justify-between">
        <Label htmlFor="markdown-editor" className="text-sm font-medium">Editor</Label>
        <div className="flex gap-1">
          <input
            type="file"
            accept=".md"
            onChange={handleFileUpload}
            className="hidden"
            id="file-upload"
          />
          <Button
            variant="ghost"
            size="sm"
            onClick={() => document.getElementById("file-upload")?.click()}
            className="h-7 px-2 text-xs"
          >
            Upload
          </Button>
        </div>
      </div>
      
      <div
        className={`flex-1 p-0 ${isDragging ? "bg-muted/50" : ""}`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        {isDragging ? (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            Drop your .md file here
          </div>
        ) : (
          <Textarea
            id="markdown-editor"
            value={value}
            onChange={handleChange}
            placeholder={placeholder}
            disabled={disabled}
            className="w-full h-full min-h-[400px] font-mono text-sm resize-none border-0 focus-visible:ring-0 rounded-none"
          />
        )}
      </div>
    </Card>
  )
})

