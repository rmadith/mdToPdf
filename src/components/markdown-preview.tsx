"use client"

import React from "react"
import { Loader2 } from "lucide-react"

interface MarkdownPreviewProps {
  html: string
  loading?: boolean
}

export const MarkdownPreview = React.memo(function MarkdownPreview({ html, loading = false }: MarkdownPreviewProps) {
  return (
    <div className="group relative flex h-full flex-col overflow-hidden rounded-xl border border-white/10 bg-[#0b1020]/60 backdrop-blur">
      <div className="border-b border-white/10 px-4 py-2.5">
        <span className="text-xs font-medium text-slate-500">
          Preview
        </span>
      </div>

      <div className="relative flex-1 overflow-auto px-6 py-6">
        {loading ? (
          <div className="flex h-full items-center justify-center">
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="h-5 w-5 animate-spin text-cyan-400" />
              <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-slate-500">Rendering</span>
            </div>
          </div>
        ) : html ? (
          <div
            className="prose prose-sm max-w-none animate-in fade-in duration-300 text-slate-200 dark:prose-invert prose-headings:text-slate-100 prose-headings:transition-colors prose-strong:text-slate-100 prose-code:text-cyan-200 prose-code:bg-cyan-500/10 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:font-mono prose-code:text-xs prose-pre:bg-[#070b17] prose-pre:text-slate-100 prose-pre:border prose-pre:border-white/10 prose-pre:shadow-inner prose-blockquote:border-l-cyan-400/50 prose-blockquote:bg-cyan-500/5 prose-blockquote:py-0.5 prose-a:text-cyan-300 prose-a:no-underline prose-a:transition-colors hover:prose-a:text-cyan-200"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <p className="text-xs text-slate-600">Preview</p>
          </div>
        )}
      </div>
    </div>
  )
})

