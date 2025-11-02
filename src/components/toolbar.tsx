"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import type { StylePreset } from "@/lib/markdown/types"
import { staggerContainer, staggerItem, buttonHoverSubtle } from "@/lib/animations"
import { Palette, FileType, FileText, Trash2 } from "lucide-react"

interface ToolbarProps {
  stylePreset: StylePreset
  onStylePresetChange: (preset: StylePreset) => void
  pageSize: "A4" | "Letter" | "Legal"
  onPageSizeChange: (size: "A4" | "Letter" | "Legal") => void
  onClear: () => void
  onLoadTemplate: (template: string) => void
}

const TEMPLATES = {
  basic: `# Welcome to Markdown to PDF

This is a simple markdown document that demonstrates the converter.

## Features

- **Bold text** and *italic text*
- Lists (ordered and unordered)
- Code blocks with syntax highlighting
- Tables and more!

## Getting Started

Start typing in the editor to see your content rendered as a beautiful PDF.

\`\`\`javascript
function hello() {
  console.log("Hello, World!");
}
\`\`\`

> This is a blockquote. You can use it to highlight important information.

---

Happy writing! 📝`,
  
  resume: `# John Doe

**Software Engineer** | john.doe@email.com | +1 (555) 123-4567

## Summary

Experienced software engineer with 5+ years of expertise in full-stack development.

## Experience

### Senior Software Engineer | Tech Corp
*2020 - Present*

- Led development of microservices architecture
- Improved system performance by 40%
- Mentored junior developers

### Software Engineer | StartupCo
*2018 - 2020*

- Built RESTful APIs using Node.js
- Implemented CI/CD pipelines

## Skills

- **Languages**: JavaScript, TypeScript, Python
- **Frameworks**: React, Next.js, Express
- **Tools**: Git, Docker, AWS

## Education

**Bachelor of Science in Computer Science**
University of Technology | 2014 - 2018`,

  technical: `# Technical Documentation

## Overview

This document provides technical specifications and implementation details.

## Architecture

\`\`\`
┌─────────────┐
│   Client    │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│     API     │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  Database   │
└─────────────┘
\`\`\`

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET    | /api/users | Get all users |
| POST   | /api/users | Create user |
| PUT    | /api/users/:id | Update user |
| DELETE | /api/users/:id | Delete user |

## Code Example

\`\`\`typescript
interface User {
  id: string
  name: string
  email: string
}

async function getUser(id: string): Promise<User> {
  const response = await fetch(\`/api/users/\${id}\`)
  return response.json()
}
\`\`\`

## Configuration

Set the following environment variables:

- \`DATABASE_URL\`: PostgreSQL connection string
- \`API_KEY\`: API authentication key
- \`PORT\`: Server port (default: 3000)`
}

export function Toolbar({
  stylePreset,
  onStylePresetChange,
  pageSize,
  onPageSizeChange,
  onClear,
  onLoadTemplate,
}: ToolbarProps) {
  return (
    <TooltipProvider>
      <motion.div
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
      >
        <Card className="p-4 shadow-soft hover-lift">
          <div className="flex flex-wrap gap-4 items-end">
            <motion.div 
              variants={staggerItem}
              className="flex-1 min-w-[200px]"
            >
              <Label htmlFor="style-preset" className="mb-2 block flex items-center gap-2 text-sm font-medium">
                <Palette className="w-4 h-4 text-primary" />
                Style Preset
              </Label>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div>
                    <Select value={stylePreset} onValueChange={onStylePresetChange}>
                      <SelectTrigger id="style-preset" className="transition-fast hover:border-primary/50">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="modern">Modern</SelectItem>
                        <SelectItem value="github">GitHub</SelectItem>
                        <SelectItem value="academic">Academic</SelectItem>
                        <SelectItem value="minimal">Minimal</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Choose the visual style for your PDF</p>
                </TooltipContent>
              </Tooltip>
            </motion.div>

            <motion.div 
              variants={staggerItem}
              className="flex-1 min-w-[150px]"
            >
              <Label htmlFor="page-size" className="mb-2 block flex items-center gap-2 text-sm font-medium">
                <FileType className="w-4 h-4 text-primary" />
                Page Size
              </Label>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div>
                    <Select value={pageSize} onValueChange={onPageSizeChange}>
                      <SelectTrigger id="page-size" className="transition-fast hover:border-primary/50">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="A4">A4 (210 × 297mm)</SelectItem>
                        <SelectItem value="Letter">Letter (8.5 × 11")</SelectItem>
                        <SelectItem value="Legal">Legal (8.5 × 14")</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Select the page size for your PDF</p>
                </TooltipContent>
              </Tooltip>
            </motion.div>

            <motion.div 
              variants={staggerItem}
              className="flex-1 min-w-[200px]"
            >
              <Label htmlFor="template" className="mb-2 block flex items-center gap-2 text-sm font-medium">
                <FileText className="w-4 h-4 text-primary" />
                Load Template
              </Label>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div>
                    <Select onValueChange={onLoadTemplate}>
                      <SelectTrigger id="template" className="transition-fast hover:border-primary/50">
                        <SelectValue placeholder="Select template..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="basic">📝 Basic Example</SelectItem>
                        <SelectItem value="resume">💼 Resume</SelectItem>
                        <SelectItem value="technical">⚙️ Technical Doc</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Start with a pre-made template</p>
                </TooltipContent>
              </Tooltip>
            </motion.div>

            <motion.div
              variants={staggerItem}
            >
              <Tooltip>
                <TooltipTrigger asChild>
                  <motion.div
                    initial="rest"
                    whileHover="hover"
                    whileTap="tap"
                    variants={buttonHoverSubtle}
                  >
                    <Button 
                      variant="outline" 
                      onClick={onClear}
                      className="gap-2 transition-fast hover:bg-destructive/10 hover:text-destructive hover:border-destructive/50"
                    >
                      <Trash2 className="w-4 h-4" />
                      Clear
                    </Button>
                  </motion.div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Clear all content from the editor</p>
                </TooltipContent>
              </Tooltip>
            </motion.div>
          </div>
        </Card>
      </motion.div>
    </TooltipProvider>
  )
}

export { TEMPLATES }

