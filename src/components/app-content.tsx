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
          <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-4">
            <h1 className="font-mono text-sm font-medium tracking-tight text-slate-100">
              markdown → pdf
            </h1>
            <div className="flex items-center gap-6">
              <Toolbar
                stylePreset={stylePreset}
                onStylePresetChange={(preset) => setStylePreset(preset)}
                pageSize={pageSize}
                onPageSizeChange={(size) => setPageSize(size)}
                onClear={handleClear}
                onLoadTemplate={handleLoadTemplate}
              />
              <div className="h-4 w-px bg-white/10" />
              <ThemeToggle />
            </div>
          </div>
        </header>

        <main className="flex-1 py-8">
          <div className="mx-auto w-full max-w-7xl px-6">
            <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02]">
              <div className="relative hidden h-[calc(100vh-140px)] gap-4 p-4 lg:grid lg:grid-cols-3">
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

              <div className="relative p-4 lg:hidden">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="flex flex-col">
                  <TabsList className="grid w-full grid-cols-3 border-b border-white/10 bg-transparent p-0">
                    <TabsTrigger
                      value="editor"
                      className="rounded-none border-b-2 border-transparent px-4 py-3 text-xs font-medium text-slate-400 data-[state=active]:border-cyan-400 data-[state=active]:text-slate-100"
                    >
                      Editor
                    </TabsTrigger>
                    <TabsTrigger
                      value="preview"
                      className="rounded-none border-b-2 border-transparent px-4 py-3 text-xs font-medium text-slate-400 data-[state=active]:border-cyan-400 data-[state=active]:text-slate-100"
                    >
                      Preview
                    </TabsTrigger>
                    <TabsTrigger
                      value="pdf"
                      className="rounded-none border-b-2 border-transparent px-4 py-3 text-xs font-medium text-slate-400 data-[state=active]:border-cyan-400 data-[state=active]:text-slate-100"
                    >
                      PDF
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent value="editor" className="mt-4 min-h-[500px]">
                    <Suspense fallback={<LoadingSkeleton />}>
                      {mounted && <MarkdownEditor value={markdown} onChange={setMarkdown} />}
                    </Suspense>
                  </TabsContent>
                  <TabsContent value="preview" className="mt-4 min-h-[500px]">
                    <Suspense fallback={<LoadingSkeleton />}>
                      {mounted && <MarkdownPreview html={parsedHtml} loading={parsing} />}
                    </Suspense>
                  </TabsContent>
                  <TabsContent value="pdf" className="mt-4 min-h-[500px]">
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

        <footer className="border-t border-white/10">
          <div className="mx-auto flex w-full max-w-7xl items-center justify-center px-6 py-3">
            <span className="text-xs text-slate-500">
              Next.js · Tailwind · @react-pdf
            </span>
          </div>
        </footer>
      </div>
    </div>
  )
}

