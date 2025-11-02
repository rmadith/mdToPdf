"use client"

import { useState, useEffect, useMemo } from "react"
import { MarkdownEditor } from "@/components/markdown-editor"
import { MarkdownPreview } from "@/components/markdown-preview"
import { PDFViewer } from "@/components/pdf-viewer"
import { Toolbar, TEMPLATES } from "@/components/toolbar"
import { ThemeToggle } from "@/components/theme-toggle"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { StylePreset } from "@/lib/markdown/types"

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

export default function Home() {
  const [markdown, setMarkdown] = useState<string>("")
  const [parsedHtml, setParsedHtml] = useState<string>("")
  const [stylePreset, setStylePreset] = useState<StylePreset>("modern")
  const [pageSize, setPageSize] = useState<"A4" | "Letter" | "Legal">("A4")

  // Load saved markdown from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("markdown-content")
    if (saved) {
      setMarkdown(saved)
    } else {
      setMarkdown(INITIAL_MARKDOWN)
    }
  }, [])

  // Save markdown to localStorage on change (debounced)
  useEffect(() => {
    if (!markdown) return

    const timeoutId = setTimeout(() => {
      localStorage.setItem("markdown-content", markdown)
    }, 1000)

    return () => clearTimeout(timeoutId)
  }, [markdown])

  // Parse markdown to HTML for PDF generation
  useEffect(() => {
    let mounted = true

    const parseMarkdown = async () => {
      if (!markdown.trim()) {
        setParsedHtml("")
        return
      }

      try {
        const { parseMarkdown: parse } = await import("@/lib/markdown")
        const result = await parse(markdown, {
          gfm: true,
          math: true,
          syntaxHighlighting: true,
        })
        if (mounted) {
          setParsedHtml(result.html)
        }
      } catch (error) {
        console.error("Error parsing markdown:", error)
      }
    }

    const timeoutId = setTimeout(() => {
      parseMarkdown()
    }, 300)

    return () => {
      mounted = false
      clearTimeout(timeoutId)
    }
  }, [markdown])

  const handleClear = () => {
    if (confirm("Are you sure you want to clear all content?")) {
      setMarkdown("")
      localStorage.removeItem("markdown-content")
    }
  }

  const handleLoadTemplate = (templateKey: string) => {
    const template = TEMPLATES[templateKey as keyof typeof TEMPLATES]
    if (template) {
      setMarkdown(template)
    }
  }

  const pdfOptions = useMemo(
    () => ({
      pageSize,
      stylePreset,
      title: "Markdown Document",
    }),
    [pageSize, stylePreset]
  )

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Markdown to PDF Converter</h1>
              <p className="text-sm text-muted-foreground">
                Create beautiful PDFs from Markdown with extended features support
              </p>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Toolbar */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
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
      <main className="flex-1 container mx-auto px-4 py-6">
        {/* Desktop Layout: 3 equal panels */}
        <div className="hidden lg:grid lg:grid-cols-3 gap-4 h-[calc(100vh-250px)]">
          <div className="overflow-hidden">
            <MarkdownEditor value={markdown} onChange={setMarkdown} />
          </div>
          <div className="overflow-hidden">
            <MarkdownPreview
              markdown={markdown}
              options={{
                gfm: true,
                math: true,
                syntaxHighlighting: true,
              }}
            />
          </div>
          <div className="overflow-hidden">
            <PDFViewer
              markdown={markdown}
              html={parsedHtml}
              options={pdfOptions}
            />
          </div>
        </div>

        {/* Mobile/Tablet Layout: Tabs */}
        <div className="lg:hidden h-[calc(100vh-250px)]">
          <Tabs defaultValue="editor" className="h-full flex flex-col">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="editor">Editor</TabsTrigger>
              <TabsTrigger value="preview">Preview</TabsTrigger>
              <TabsTrigger value="pdf">PDF</TabsTrigger>
            </TabsList>
            <TabsContent value="editor" className="flex-1 mt-4">
              <MarkdownEditor value={markdown} onChange={setMarkdown} />
            </TabsContent>
            <TabsContent value="preview" className="flex-1 mt-4">
              <MarkdownPreview
                markdown={markdown}
                options={{
                  gfm: true,
                  math: true,
                  syntaxHighlighting: true,
                }}
              />
            </TabsContent>
            <TabsContent value="pdf" className="flex-1 mt-4">
              <PDFViewer
                markdown={markdown}
                html={parsedHtml}
                options={pdfOptions}
              />
            </TabsContent>
          </Tabs>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t bg-card py-4">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>
            Built with Next.js, React PDF, and shadcn/ui | Open Source |{" "}
            <a
              href="https://github.com"
              className="underline hover:text-foreground"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub
            </a>
          </p>
        </div>
      </footer>
    </div>
  )
}
