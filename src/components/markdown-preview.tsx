"use client"

import React from "react"
import { Loader2 } from "lucide-react"

interface MarkdownPreviewProps {
  html: string
  loading?: boolean
}

export const MarkdownPreview = React.memo(function MarkdownPreview({ html, loading = false }: MarkdownPreviewProps) {
  return (
    <div className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#0b1020]/80 shadow-[0_10px_60px_-35px_rgba(15,23,42,0.9)] backdrop-blur transition-all duration-300 hover:shadow-[0_10px_60px_-25px_rgba(56,189,248,0.2)]">
      <div className="border-b border-white/10 bg-white/[0.04] px-4 py-3 transition-colors group-hover:bg-white/[0.06]">
        <span className="font-mono text-[11px] uppercase tracking-[0.35em] text-slate-400 transition-colors group-hover:text-slate-300">
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
          <div className="flex h-full items-center justify-center px-8 text-center">
            <div className="space-y-3 text-slate-500">
              <div className="flex items-center justify-center gap-2 text-xs font-mono uppercase tracking-[0.25em]">
                <div className="h-px w-8 bg-gradient-to-r from-transparent to-slate-600" />
                <span>Live preview</span>
                <div className="h-px w-8 bg-gradient-to-l from-transparent to-slate-600" />
              </div>
              <p className="text-[11px] leading-relaxed">
                Your formatted markdown appears here as you type
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
})

