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
  const [autoConvert, setAutoConvert] = useState(true)
  const [manualTrigger, setManualTrigger] = useState(0)

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

  const handleConvert = useCallback(() => {
    setManualTrigger(prev => prev + 1)
  }, [])

  // Determine if PDF should be generated
  const shouldGeneratePDF = useMemo(() => {
    if (typeof window === 'undefined') return false
    if (!autoConvert) return manualTrigger > 0
    return activeTab === "pdf" || window.innerWidth >= 1024
  }, [activeTab, autoConvert, manualTrigger])

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-background">
      <header className="border-b">
        <div className="mx-auto flex w-full items-center justify-between px-6 py-3">
          <h1 className="font-mono text-sm font-medium">
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
              autoConvert={autoConvert}
              onAutoConvertChange={setAutoConvert}
              onConvert={handleConvert}
            />
            <div className="h-4 w-px bg-border" />
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-hidden">
        <div className="mx-auto h-full w-full px-6 py-4">
          <div className="relative h-full overflow-hidden rounded-xl border">
            <div className="relative hidden h-full gap-4 p-4 lg:grid lg:grid-cols-2">
              <Suspense fallback={<LoadingSkeleton />}>
                {mounted && <MarkdownEditor value={markdown} onChange={setMarkdown} />}
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

            <div className="relative h-full p-4 lg:hidden">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="flex h-full flex-col">
                <TabsList className="grid w-full grid-cols-2 border-b bg-transparent p-0">
                  <TabsTrigger
                    value="editor"
                    className="rounded-none border-b-2 border-transparent px-4 py-3 text-xs font-medium data-[state=active]:border-cyan-500"
                  >
                    Editor
                  </TabsTrigger>
                  <TabsTrigger
                    value="pdf"
                    className="rounded-none border-b-2 border-transparent px-4 py-3 text-xs font-medium data-[state=active]:border-cyan-500"
                  >
                    PDF
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="editor" className="mt-4 flex-1">
                  <Suspense fallback={<LoadingSkeleton />}>
                    {mounted && <MarkdownEditor value={markdown} onChange={setMarkdown} />}
                  </Suspense>
                </TabsContent>
                <TabsContent value="pdf" className="mt-4 flex-1">
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

      <footer className="border-t">
        <div className="mx-auto flex w-full items-center justify-center px-6 py-2">
          <span className="text-xs text-muted-foreground">
            Next.js · Tailwind · @react-pdf
          </span>
        </div>
      </footer>
    </div>
  )
}

