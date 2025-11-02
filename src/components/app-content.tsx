"use client"

import Link from "next/link"
import { useState, useEffect, useMemo, useCallback, lazy, Suspense } from "react"
import { Toolbar, TEMPLATES } from "@/components/toolbar"
import { ThemeToggle } from "@/components/theme-toggle"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import type { StylePreset } from "@/lib/markdown/types"
import { preloadCriticalChunks } from "@/lib/dynamic-loader"
import { loadMarkdown, saveMarkdown, clearMarkdown } from "@/lib/storage-manager"

// Lazy load heavy components
const MarkdownEditor = lazy(() => import("@/components/markdown-editor").then(m => ({ default: m.MarkdownEditor })))
const MarkdownPreview = lazy(() => import("@/components/markdown-preview").then(m => ({ default: m.MarkdownPreview })))
const PDFViewer = lazy(() => import("@/components/pdf-viewer").then(m => ({ default: m.PDFViewer })))

const INITIAL_MARKDOWN = `# Welcome to Markdown to PDF Converter

Transform your **Markdown** documents into beautifully formatted PDFs instantly!

## Features

- ✨ **Real-time Preview** - See your changes as you type
- 🎨 **Multiple Themes** - Choose from GitHub, Academic, Modern, or Minimal styles
- 📄 **Professional PDFs** - Export publication-ready documents
- 🧮 **Math Support** - Write formulas with LaTeX syntax
- 💻 **Code Highlighting** - Beautiful syntax highlighting for code blocks
- 📊 **Tables & More** - Full GFM (GitHub Flavored Markdown) support

## Getting Started

1. Start typing in the **Editor** panel
2. See the **Preview** update in real-time
3. View the **PDF** preview in the third panel
4. Click **Download PDF** when ready

## Example Code

\`\`\`javascript
function greet(name) {
  console.log(\`Hello, \${name}!\`)
}

greet("World")
\`\`\`

## Math Example

Inline math: $E = mc^2$

Block math:

$$
\\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}
$$

## Quote

> "The best way to predict the future is to invent it."
> — Alan Kay

---

**Ready to create your document?** Start editing above! 📝
`

function LoadingSkeleton() {
  return (
    <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]">
      <div className="border-b border-white/10 bg-white/[0.05] px-4 py-3">
        <div className="h-3 w-16 rounded-full bg-white/10" />
      </div>
      <div className="flex-1 space-y-4 px-6 py-6">
        <div className="h-3 w-3/4 rounded-full bg-white/10" />
        <div className="h-3 w-full rounded-full bg-white/10" />
        <div className="h-3 w-5/6 rounded-full bg-white/10" />
        <div className="h-3 w-2/3 rounded-full bg-white/10" />
      </div>
    </div>
  )
}

export default function AppContent() {
  const [markdown, setMarkdown] = useState<string>("")
  const [parsedHtml, setParsedHtml] = useState<string>("")
  const [parsing, setParsing] = useState(false)
  const [stylePreset, setStylePreset] = useState<StylePreset>("modern")
  const [pageSize, setPageSize] = useState<"A4" | "Letter" | "Legal">("A4")
  const [activeTab, setActiveTab] = useState<string>("editor")
  const [mounted, setMounted] = useState(false)

  // Load saved markdown from storage after hydration
  useEffect(() => {
    setMounted(true)
    const saved = loadMarkdown()
    if (saved) {
      setMarkdown(saved)
    } else {
      setMarkdown(INITIAL_MARKDOWN)
    }
    
    // Preload critical chunks after a brief delay
    requestIdleCallback(() => {
      preloadCriticalChunks()
    }, { timeout: 1000 })
  }, [])

  // Save markdown to storage on change (debounced, async)
  useEffect(() => {
    if (!markdown || !mounted) return

    const timeoutId = setTimeout(() => {
      saveMarkdown(markdown)
    }, 1000)

    return () => clearTimeout(timeoutId)
  }, [markdown, mounted])

  // Parse markdown to HTML (single source of truth)
  useEffect(() => {
    if (!mounted) return
    
    let isMounted = true

    const parseMarkdown = async () => {
      if (!markdown.trim()) {
        setParsedHtml("")
        return
      }

      setParsing(true)
      try {
        const { parseMarkdown: parse } = await import("@/lib/markdown")
        const result = await parse(markdown, {
          gfm: true,
          math: true,
          syntaxHighlighting: true,
        })
        if (isMounted) {
          setParsedHtml(result.html)
        }
      } catch (error) {
        console.error("Error parsing markdown:", error)
      } finally {
        if (isMounted) {
          setParsing(false)
        }
      }
    }

    const timeoutId = setTimeout(() => {
      parseMarkdown()
    }, 300)

    return () => {
      isMounted = false
      clearTimeout(timeoutId)
    }
  }, [markdown, mounted])

  const handleClear = useCallback(() => {
    if (confirm("Are you sure you want to clear all content?")) {
      setMarkdown("")
      clearMarkdown()
    }
  }, [])

  const handleLoadTemplate = useCallback((templateKey: string) => {
    const template = TEMPLATES[templateKey as keyof typeof TEMPLATES]
    if (template) {
      setMarkdown(template)
    }
  }, [])

  const pdfOptions = useMemo(
    () => ({
      pageSize,
      stylePreset,
      title: "Markdown Document",
    }),
    [pageSize, stylePreset]
  )

  // Determine if PDF should be generated (only when visible)
  const shouldGeneratePDF = useMemo(() => {
    if (typeof window === 'undefined') return false
    return activeTab === "pdf" || window.innerWidth >= 1024
  }, [activeTab])

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#05060f] text-slate-100">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(56,189,248,0.18),transparent_55%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(10,12,26,0.9),rgba(5,6,18,1))]" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[length:64px_64px] opacity-5" />

      <div className="relative z-10 flex min-h-screen flex-col">
        <header className="border-b border-white/10">
          <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-6 py-12 lg:flex-row lg:items-start lg:justify-between">
            <div className="space-y-7">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-1 text-[11px] uppercase tracking-[0.35em] text-slate-400">
                <span>Sandboxed</span>
                <span className="text-cyan-300">workspace</span>
              </div>

              <div className="space-y-4">
                <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
                  Markdown to PDF, without the noise.
                </h1>
                <p className="max-w-2xl text-sm leading-relaxed text-slate-400 sm:text-base">
                  Compose in Markdown, review rich semantic HTML, and ship pixel-perfect PDFs from a focused, developer-grade environment inspired by the Cloudflare Sandbox aesthetic.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <Button
                  type="button"
                  onClick={() => handleLoadTemplate("technical")}
                  className="rounded-full border border-cyan-400/40 bg-cyan-500/10 px-6 py-2 text-[11px] font-semibold uppercase tracking-[0.3em] text-cyan-200 shadow-[0_10px_40px_-30px_rgba(56,189,248,0.6)] transition hover:border-cyan-300/60 hover:bg-cyan-500/20"
                >
                  Load technical template
                </Button>
                <Button
                  type="button"
                  onClick={() => handleLoadTemplate("resume")}
                  variant="ghost"
                  className="rounded-full border border-white/10 bg-white/[0.05] px-5 py-2 text-[11px] uppercase tracking-[0.3em] text-slate-300 transition hover:border-white/30 hover:bg-white/10 hover:text-slate-100"
                >
                  Load resume template
                </Button>
                <Button
                  asChild
                  variant="ghost"
                  className="rounded-full border border-white/10 bg-white/[0.04] px-5 py-2 text-[11px] uppercase tracking-[0.3em] text-slate-300 transition hover:border-white/30 hover:bg-white/10 hover:text-slate-100"
                >
                  <Link href="https://developers.cloudflare.com/sandbox/" target="_blank" rel="noreferrer">
                    Read sandbox docs ↗
                  </Link>
                </Button>
              </div>

              <div className="flex flex-wrap gap-3 text-[11px] font-mono uppercase tracking-[0.35em] text-slate-500">
                <span className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-1 text-cyan-200">Real-time preview</span>
                <span className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-1 text-slate-300">Math & diagrams</span>
                <span className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-1 text-slate-300">@react-pdf renderer</span>
              </div>
            </div>

            <div className="flex w-full max-w-xs flex-col items-end gap-6">
              <ThemeToggle />
              <div className="w-full rounded-3xl border border-white/10 bg-white/[0.04] p-5 text-xs text-slate-300">
                <p className="font-mono text-[11px] uppercase tracking-[0.35em] text-slate-500">
                  Workspace status
                </p>
                <div className="mt-4 space-y-3">
                  <div className="flex items-center justify-between font-mono text-[11px] uppercase tracking-[0.3em]">
                    <span>Autosave</span>
                    <span className="text-cyan-300">Enabled</span>
                  </div>
                  <div className="flex items-center justify-between font-mono text-[11px] uppercase tracking-[0.3em]">
                    <span>Local cache</span>
                    <span className="text-slate-200">Active</span>
                  </div>
                  <div className="flex items-center justify-between font-mono text-[11px] uppercase tracking-[0.3em]">
                    <span>PDF builds</span>
                    <span className="text-slate-200">Live</span>
                  </div>
                </div>
                <p className="mt-5 text-[11px] leading-relaxed text-slate-500">
                  Drafts persist in local storage. Switch presets or templates without losing your progress.
                </p>
              </div>
            </div>
          </div>
        </header>

        <div className="border-b border-white/10 bg-white/[0.02]">
          <div className="mx-auto w-full max-w-6xl px-6 py-5">
            <Toolbar
              stylePreset={stylePreset}
              onStylePresetChange={(preset) => setStylePreset(preset)}
              pageSize={pageSize}
              onPageSizeChange={(size) => setPageSize(size)}
              onClear={handleClear}
              onLoadTemplate={handleLoadTemplate}
            />
          </div>
        </div>

        <main className="flex-1 py-12">
          <div className="mx-auto w-full max-w-6xl px-6">
            <div className="relative overflow-hidden rounded-[32px] border border-white/10 bg-white/[0.02] shadow-[0_40px_120px_-80px_rgba(56,189,248,0.35)]">
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(56,189,248,0.12),transparent_55%)]" />
              <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[length:72px_72px] opacity-5" />

              <div className="relative hidden min-h-[520px] gap-6 p-6 lg:grid lg:grid-cols-3 lg:p-10">
                <Suspense fallback={<LoadingSkeleton />}>
                  {mounted && <MarkdownEditor value={markdown} onChange={setMarkdown} />}
                </Suspense>
                <Suspense fallback={<LoadingSkeleton />}>
                  {mounted && <MarkdownPreview html={parsedHtml} loading={parsing} />}
                </Suspense>
                <Suspense fallback={<LoadingSkeleton />}>
                  {mounted && (
                    <PDFViewer
                      markdown={markdown}
                      html={parsedHtml}
                      options={pdfOptions}
                      shouldGenerate={shouldGeneratePDF}
                    />
                  )}
                </Suspense>
              </div>

              <div className="relative lg:hidden">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="flex flex-col">
                  <TabsList className="grid w-full grid-cols-3 rounded-full border border-white/10 bg-white/[0.05] p-1">
                    <TabsTrigger
                      value="editor"
                      className="rounded-full px-3 py-2 text-[11px] uppercase tracking-[0.25em] text-slate-400 data-[state=active]:bg-cyan-500/15 data-[state=active]:text-slate-100"
                    >
                      Editor
                    </TabsTrigger>
                    <TabsTrigger
                      value="preview"
                      className="rounded-full px-3 py-2 text-[11px] uppercase tracking-[0.25em] text-slate-400 data-[state=active]:bg-cyan-500/15 data-[state=active]:text-slate-100"
                    >
                      Preview
                    </TabsTrigger>
                    <TabsTrigger
                      value="pdf"
                      className="rounded-full px-3 py-2 text-[11px] uppercase tracking-[0.25em] text-slate-400 data-[state=active]:bg-cyan-500/15 data-[state=active]:text-slate-100"
                    >
                      PDF
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent value="editor" className="mt-6 min-h-[420px]">
                    <Suspense fallback={<LoadingSkeleton />}>
                      {mounted && <MarkdownEditor value={markdown} onChange={setMarkdown} />}
                    </Suspense>
                  </TabsContent>
                  <TabsContent value="preview" className="mt-6 min-h-[420px]">
                    <Suspense fallback={<LoadingSkeleton />}>
                      {mounted && <MarkdownPreview html={parsedHtml} loading={parsing} />}
                    </Suspense>
                  </TabsContent>
                  <TabsContent value="pdf" className="mt-6 min-h-[420px]">
                    <Suspense fallback={<LoadingSkeleton />}>
                      {mounted && activeTab === "pdf" && (
                        <PDFViewer
                          markdown={markdown}
                          html={parsedHtml}
                          options={pdfOptions}
                          shouldGenerate
                        />
                      )}
                    </Suspense>
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </div>
        </main>

        <footer className="border-t border-white/10 bg-white/[0.02]">
          <div className="mx-auto flex w-full max-w-6xl flex-col gap-2 px-6 py-6 text-[11px] font-mono uppercase tracking-[0.28em] text-slate-500 sm:flex-row sm:items-center sm:justify-between">
            <span>Built with Next.js · Tailwind · @react-pdf</span>
            <span className="text-cyan-300">Inspired by Cloudflare Sandbox</span>
          </div>
        </footer>
      </div>
    </div>
  )
}

