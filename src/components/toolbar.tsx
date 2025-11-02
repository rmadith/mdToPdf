"use client"

import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { StylePreset } from "@/lib/markdown/types"

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
    <div className="flex flex-wrap items-center gap-3 text-xs">
      <div className="flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-[11px] uppercase tracking-[0.28em] text-slate-400">
        <span className="font-mono text-[10px] tracking-[0.4em] text-slate-500">
          Style
        </span>
        <Select value={stylePreset} onValueChange={onStylePresetChange}>
          <SelectTrigger
            id="style-preset"
            className="h-7 w-[120px] border-none bg-transparent px-0 text-sm font-medium tracking-normal text-slate-100 focus-visible:ring-0 focus-visible:ring-offset-0 data-[placeholder]:text-slate-500"
          >
            <SelectValue placeholder="Modern" />
          </SelectTrigger>
          <SelectContent className="border-white/10 bg-[#0b1020] text-slate-100">
            <SelectItem value="modern">Modern</SelectItem>
            <SelectItem value="github">GitHub</SelectItem>
            <SelectItem value="academic">Academic</SelectItem>
            <SelectItem value="minimal">Minimal</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-[11px] uppercase tracking-[0.28em] text-slate-400">
        <span className="font-mono text-[10px] tracking-[0.4em] text-slate-500">
          Size
        </span>
        <Select value={pageSize} onValueChange={onPageSizeChange}>
          <SelectTrigger
            id="page-size"
            className="h-7 w-[100px] border-none bg-transparent px-0 text-sm font-medium tracking-normal text-slate-100 focus-visible:ring-0 focus-visible:ring-offset-0 data-[placeholder]:text-slate-500"
          >
            <SelectValue placeholder="A4" />
          </SelectTrigger>
          <SelectContent className="border-white/10 bg-[#0b1020] text-slate-100">
            <SelectItem value="A4">A4</SelectItem>
            <SelectItem value="Letter">Letter</SelectItem>
            <SelectItem value="Legal">Legal</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-[11px] uppercase tracking-[0.28em] text-slate-400">
        <span className="font-mono text-[10px] tracking-[0.4em] text-slate-500">
          Template
        </span>
        <Select onValueChange={onLoadTemplate}>
          <SelectTrigger
            id="template"
            className="h-7 w-[140px] border-none bg-transparent px-0 text-sm font-medium tracking-normal text-slate-100 focus-visible:ring-0 focus-visible:ring-offset-0 data-[placeholder]:text-slate-500"
          >
            <SelectValue placeholder="None" />
          </SelectTrigger>
          <SelectContent className="border-white/10 bg-[#0b1020] text-slate-100">
            <SelectItem value="basic">Basic</SelectItem>
            <SelectItem value="resume">Resume</SelectItem>
            <SelectItem value="technical">Technical</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Button
        variant="ghost"
        size="sm"
        onClick={onClear}
        className="h-9 rounded-full border border-white/10 bg-white/5 px-4 text-[11px] uppercase tracking-[0.3em] text-slate-400 transition-colors hover:border-white/30 hover:bg-white/10 hover:text-slate-100"
      >
        Clear
      </Button>
    </div>
  )
}

export { TEMPLATES }

