"use client"

import { useCallback, useState } from "react"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

interface MarkdownEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  disabled?: boolean
}

export function MarkdownEditor({
  value,
  onChange,
  placeholder = "Type your markdown here...",
  disabled = false,
}: MarkdownEditorProps) {
  const [isDragging, setIsDragging] = useState(false)

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
    <Card className="h-full flex flex-col">
      <div className="p-4 border-b">
        <div className="flex items-center justify-between mb-2">
          <Label htmlFor="markdown-editor">Markdown Editor</Label>
          <input
            type="file"
            accept=".md"
            onChange={handleFileUpload}
            className="hidden"
            id="file-upload"
          />
          <Button
            variant="outline"
            size="sm"
            onClick={() => document.getElementById("file-upload")?.click()}
          >
            Upload .md
          </Button>
        </div>
        <div className="flex gap-2 flex-wrap">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => insertFormatting("**", "**")}
            title="Bold"
          >
            <strong>B</strong>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => insertFormatting("*", "*")}
            title="Italic"
          >
            <em>I</em>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => insertFormatting("`", "`")}
            title="Code"
          >
            <code>{"</>"}</code>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => insertFormatting("# ", "")}
            title="Heading"
          >
            H1
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => insertFormatting("## ", "")}
            title="Heading 2"
          >
            H2
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => insertFormatting("[", "](url)")}
            title="Link"
          >
            🔗
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => insertFormatting("- ", "")}
            title="List"
          >
            •
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => insertFormatting("> ", "")}
            title="Quote"
          >
            "
          </Button>
        </div>
      </div>
      <div
        className={`flex-1 p-4 ${
          isDragging ? "bg-blue-50 border-2 border-blue-400 border-dashed" : ""
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        {isDragging ? (
          <div className="flex items-center justify-center h-full text-blue-600">
            Drop your .md file here
          </div>
        ) : (
          <Textarea
            id="markdown-editor"
            value={value}
            onChange={handleChange}
            placeholder={placeholder}
            disabled={disabled}
            className="w-full h-full min-h-[400px] font-mono resize-none border-0 focus-visible:ring-0"
          />
        )}
      </div>
    </Card>
  )
}

