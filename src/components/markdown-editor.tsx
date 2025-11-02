"use client"

import React, { useCallback, useState, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { 
  Upload, 
  Bold, 
  Italic, 
  Code, 
  Link2, 
  List, 
  Quote,
  Heading1,
  Heading2,
  FileDown,
  Copy,
  Check
} from "lucide-react"
import { toast } from "sonner"
import { fadeIn, scaleIn, buttonHoverSubtle } from "@/lib/animations"

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
  const [copied, setCopied] = useState(false)

  // Calculate word and character count
  const stats = useMemo(() => {
    const words = value.trim() ? value.trim().split(/\s+/).length : 0
    const characters = value.length
    const lines = value.split('\n').length
    return { words, characters, lines }
  }, [value])

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
          toast.success("File uploaded", {
            description: `${file.name} loaded successfully`,
          })
        }
        reader.readAsText(file)
      } else if (file) {
        toast.error("Invalid file type", {
          description: "Please upload a .md file",
        })
      }
    },
    [onChange]
  )

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(value)
      setCopied(true)
      toast.success("Copied to clipboard", {
        description: "Markdown content copied successfully",
      })
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      toast.error("Failed to copy", {
        description: "Could not copy content to clipboard",
      })
    }
  }, [value])

  const handleDownloadMd = useCallback(() => {
    const blob = new Blob([value], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'document.md'
    a.click()
    URL.revokeObjectURL(url)
    toast.success("Downloaded", {
      description: "Markdown file downloaded successfully",
    })
  }, [value])

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
    <TooltipProvider>
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeIn}
        className="h-full"
      >
        <Card className="h-full flex flex-col shadow-soft hover-lift transition-smooth">
          <div className="p-4 border-b bg-muted/30">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Label htmlFor="markdown-editor" className="text-base font-semibold">Markdown Editor</Label>
                <AnimatePresence mode="wait">
                  {stats.words > 0 && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="flex gap-2"
                    >
                      <Badge variant="secondary" className="text-xs">
                        {stats.words} words
                      </Badge>
                      <Badge variant="secondary" className="text-xs">
                        {stats.characters} chars
                      </Badge>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              
              <div className="flex gap-2">
                <input
                  type="file"
                  accept=".md"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="file-upload"
                />
                
                <Tooltip>
                  <TooltipTrigger asChild>
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => document.getElementById("file-upload")?.click()}
                        className="gap-2"
                      >
                        <Upload className="w-4 h-4" />
                        Upload
                      </Button>
                    </motion.div>
                  </TooltipTrigger>
                  <TooltipContent>Upload a .md file</TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleDownloadMd}
                        disabled={!value}
                        className="gap-2"
                      >
                        <FileDown className="w-4 h-4" />
                      </Button>
                    </motion.div>
                  </TooltipTrigger>
                  <TooltipContent>Download as .md</TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleCopy}
                        disabled={!value}
                        className="gap-2"
                      >
                        <AnimatePresence mode="wait">
                          {copied ? (
                            <motion.div
                              key="check"
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              exit={{ scale: 0 }}
                            >
                              <Check className="w-4 h-4 text-green-500" />
                            </motion.div>
                          ) : (
                            <motion.div key="copy">
                              <Copy className="w-4 h-4" />
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </Button>
                    </motion.div>
                  </TooltipTrigger>
                  <TooltipContent>Copy to clipboard</TooltipContent>
                </Tooltip>
              </div>
            </div>
            
            {/* Formatting toolbar */}
            <div className="flex gap-1 flex-wrap">
              <Tooltip>
                <TooltipTrigger asChild>
                  <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => insertFormatting("**", "**")}
                      className="h-8 w-8 p-0"
                    >
                      <Bold className="w-4 h-4" />
                    </Button>
                  </motion.div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Bold <Badge variant="outline" className="ml-1">Cmd+B</Badge></p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => insertFormatting("*", "*")}
                      className="h-8 w-8 p-0"
                    >
                      <Italic className="w-4 h-4" />
                    </Button>
                  </motion.div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Italic <Badge variant="outline" className="ml-1">Cmd+I</Badge></p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => insertFormatting("`", "`")}
                      className="h-8 w-8 p-0"
                    >
                      <Code className="w-4 h-4" />
                    </Button>
                  </motion.div>
                </TooltipTrigger>
                <TooltipContent>Inline code</TooltipContent>
              </Tooltip>

              <div className="w-px h-8 bg-border mx-1" />

              <Tooltip>
                <TooltipTrigger asChild>
                  <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => insertFormatting("# ", "")}
                      className="h-8 w-8 p-0"
                    >
                      <Heading1 className="w-4 h-4" />
                    </Button>
                  </motion.div>
                </TooltipTrigger>
                <TooltipContent>Heading 1</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => insertFormatting("## ", "")}
                      className="h-8 w-8 p-0"
                    >
                      <Heading2 className="w-4 h-4" />
                    </Button>
                  </motion.div>
                </TooltipTrigger>
                <TooltipContent>Heading 2</TooltipContent>
              </Tooltip>

              <div className="w-px h-8 bg-border mx-1" />

              <Tooltip>
                <TooltipTrigger asChild>
                  <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => insertFormatting("[", "](url)")}
                      className="h-8 w-8 p-0"
                    >
                      <Link2 className="w-4 h-4" />
                    </Button>
                  </motion.div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Link <Badge variant="outline" className="ml-1">Cmd+K</Badge></p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => insertFormatting("- ", "")}
                      className="h-8 w-8 p-0"
                    >
                      <List className="w-4 h-4" />
                    </Button>
                  </motion.div>
                </TooltipTrigger>
                <TooltipContent>List</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => insertFormatting("> ", "")}
                      className="h-8 w-8 p-0"
                    >
                      <Quote className="w-4 h-4" />
                    </Button>
                  </motion.div>
                </TooltipTrigger>
                <TooltipContent>Quote</TooltipContent>
              </Tooltip>
            </div>
          </div>
          <motion.div
            className={`flex-1 p-4 transition-smooth ${
              isDragging ? "bg-primary/10 dark:bg-primary/20 border-2 border-primary border-dashed rounded-lg" : ""
            }`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            animate={isDragging ? { scale: 0.98 } : { scale: 1 }}
          >
            <AnimatePresence mode="wait">
              {isDragging ? (
                <motion.div
                  key="drag"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="flex flex-col items-center justify-center h-full text-primary gap-4"
                >
                  <motion.div
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  >
                    <Upload className="w-12 h-12" />
                  </motion.div>
                  <p className="text-lg font-medium">Drop your .md file here</p>
                </motion.div>
              ) : (
                <Textarea
                  key="textarea"
                  id="markdown-editor"
                  value={value}
                  onChange={handleChange}
                  placeholder={placeholder}
                  disabled={disabled}
                  className="w-full h-full min-h-[400px] font-mono resize-none border-0 focus-visible:ring-0 bg-transparent"
                />
              )}
            </AnimatePresence>
          </motion.div>
        </Card>
      </motion.div>
    </TooltipProvider>
  )
})

