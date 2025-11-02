"use client"

import { useState, useEffect, useMemo, useCallback, lazy, Suspense } from "react"
import { motion } from "framer-motion"
import { Toolbar, TEMPLATES } from "@/components/toolbar"
import { ThemeToggle } from "@/components/theme-toggle"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import type { StylePreset } from "@/lib/markdown/types"
import { preloadCriticalChunks } from "@/lib/dynamic-loader"
import { loadMarkdown, saveMarkdown, clearMarkdown } from "@/lib/storage-manager"
import { fadeInDown, staggerContainer, staggerItem } from "@/lib/animations"
import { toast } from "sonner"
import { FileText, Sparkles } from "lucide-react"

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

// Loading skeleton component
function LoadingSkeleton() {
  return (
    <Card className="h-full flex flex-col animate-pulse">
      <div className="p-4 border-b">
        <div className="h-5 bg-muted rounded w-24"></div>
      </div>
      <div className="flex-1 p-6 space-y-4">
        <div className="h-4 bg-muted rounded w-3/4"></div>
        <div className="h-4 bg-muted rounded w-full"></div>
        <div className="h-4 bg-muted rounded w-5/6"></div>
      </div>
    </Card>
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
    <div className="min-h-screen flex flex-col bg-background">
      {/* Minimal header */}
      <header className="border-b">
        <div className="container mx-auto px-6 py-5">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold tracking-tight">
              markdown → pdf
            </h1>
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Toolbar */}
      <div className="border-b bg-muted/20">
        <div className="container mx-auto px-6 py-4">
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

      {/* Main Content - Desktop: 3 panels, Mobile: Tabs */}
      <main className="flex-1 container mx-auto px-6 py-8">
        {/* Desktop Layout: 3 equal panels */}
        <div className="hidden lg:grid lg:grid-cols-3 gap-6 h-[calc(100vh-210px)]">
          <div className="overflow-hidden">
            <Suspense fallback={<LoadingSkeleton />}>
              {mounted && <MarkdownEditor value={markdown} onChange={setMarkdown} />}
            </Suspense>
          </div>
          <div className="overflow-hidden">
            <Suspense fallback={<LoadingSkeleton />}>
              {mounted && <MarkdownPreview html={parsedHtml} loading={parsing} />}
            </Suspense>
          </div>
          <div className="overflow-hidden">
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
        </div>

        {/* Mobile/Tablet Layout: Tabs */}
        <div className="lg:hidden h-[calc(100vh-250px)]">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="editor">Editor</TabsTrigger>
              <TabsTrigger value="preview">Preview</TabsTrigger>
              <TabsTrigger value="pdf">PDF</TabsTrigger>
            </TabsList>
            <TabsContent value="editor" className="flex-1 mt-4">
              <Suspense fallback={<LoadingSkeleton />}>
                {mounted && <MarkdownEditor value={markdown} onChange={setMarkdown} />}
              </Suspense>
            </TabsContent>
            <TabsContent value="preview" className="flex-1 mt-4">
              <Suspense fallback={<LoadingSkeleton />}>
                {mounted && <MarkdownPreview html={parsedHtml} loading={parsing} />}
              </Suspense>
            </TabsContent>
            <TabsContent value="pdf" className="flex-1 mt-4">
              <Suspense fallback={<LoadingSkeleton />}>
                {mounted && activeTab === "pdf" && (
                  <PDFViewer
                    markdown={markdown}
                    html={parsedHtml}
                    options={pdfOptions}
                    shouldGenerate={true}
                  />
                )}
              </Suspense>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}

