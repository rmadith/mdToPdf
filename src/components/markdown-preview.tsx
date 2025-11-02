"use client"

import React from "react"
import { Loader2 } from "lucide-react"

interface MarkdownPreviewProps {
  html: string
  loading?: boolean
}

export const MarkdownPreview = React.memo(function MarkdownPreview({ html, loading = false }: MarkdownPreviewProps) {
  return (
    <div className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#0b1020]/80 shadow-[0_10px_60px_-35px_rgba(15,23,42,0.9)] backdrop-blur">
      <div className="border-b border-white/10 bg-white/[0.04] px-4 py-3">
        <span className="font-mono text-[11px] uppercase tracking-[0.35em] text-slate-400">
          Preview
        </span>
      </div>

      <div className="relative flex-1 overflow-auto px-6 py-6">
        {loading ? (
          <div className="flex h-full items-center justify-center">
            <Loader2 className="h-5 w-5 animate-spin text-slate-400" />
          </div>
        ) : html ? (
          <div
            className="prose prose-sm max-w-none text-slate-200 dark:prose-invert prose-headings:text-slate-100 prose-strong:text-slate-100 prose-code:text-cyan-200 prose-pre:bg-[#070b17] prose-pre:text-slate-100 prose-pre:border prose-pre:border-white/10 prose-blockquote:border-l-cyan-400/50"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        ) : (
          <div className="flex h-full items-center justify-center text-center text-sm text-slate-500">
            <p>Preview appears here</p>
          </div>
        )}
      </div>
    </div>
  )
})

