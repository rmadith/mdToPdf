"use client"

import React, { useCallback, useId, useState } from "react"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"

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
  const fileInputId = useId()

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      onChange(e.target.value)
    },
    [onChange]
  )

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
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

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
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

  return (
    <div className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#0b1020]/80 shadow-[0_10px_60px_-35px_rgba(15,23,42,0.9)] backdrop-blur transition-all duration-300 hover:shadow-[0_10px_60px_-25px_rgba(56,189,248,0.2)]">
      <div className="flex items-center justify-between border-b border-white/10 bg-white/[0.04] px-4 py-3 transition-colors group-hover:bg-white/[0.06]">
        <span className="font-mono text-[11px] uppercase tracking-[0.35em] text-slate-400 transition-colors group-hover:text-slate-300">
          Editor
        </span>
        <div className="flex items-center gap-2 opacity-70 transition-opacity group-hover:opacity-100">
          <input
            id={fileInputId}
            type="file"
            accept=".md"
            onChange={handleFileUpload}
            className="hidden"
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => document.getElementById(fileInputId)?.click()}
            className="h-7 rounded-full border border-white/10 px-3 text-[11px] uppercase tracking-[0.3em] text-slate-300 transition-all duration-200 hover:scale-105 hover:border-cyan-400/40 hover:bg-cyan-500/10 hover:text-cyan-200 hover:shadow-[0_0_20px_-5px_rgba(56,189,248,0.5)]"
          >
            Upload .md
          </Button>
        </div>
      </div>

      <div
        className="relative flex-1"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        {isDragging && (
          <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center rounded-xl border-2 border-dashed border-cyan-400/60 bg-cyan-500/10 text-sm font-medium text-cyan-200 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 animate-pulse rounded-full bg-cyan-400" />
              Drop your markdown file to import
              <div className="h-2 w-2 animate-pulse rounded-full bg-cyan-400" />
            </div>
          </div>
        )}

        {!value && (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center px-8 text-center">
            <div className="space-y-3 text-slate-500">
              <div className="flex items-center justify-center gap-2 text-xs font-mono uppercase tracking-[0.25em]">
                <div className="h-px w-8 bg-gradient-to-r from-transparent to-slate-600" />
                <span>Start typing</span>
                <div className="h-px w-8 bg-gradient-to-l from-transparent to-slate-600" />
              </div>
              <p className="text-[11px] leading-relaxed">
                Write markdown, see it rendered in real-time, export as PDF
              </p>
            </div>
          </div>
        )}

        <Textarea
          id="markdown-editor"
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          disabled={disabled}
          className="h-full min-h-[400px] w-full resize-none border-0 bg-transparent px-6 py-5 font-mono text-sm leading-relaxed text-slate-100 placeholder:text-slate-600 focus-visible:ring-0 focus-visible:ring-offset-0"
        />
      </div>
    </div>
  )
})

