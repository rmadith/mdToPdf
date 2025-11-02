"use client"

import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
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
  autoConvert: boolean
  onAutoConvertChange: (value: boolean) => void
  onConvert: () => void
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
  autoConvert,
  onAutoConvertChange,
  onConvert,
}: ToolbarProps) {
  return (
    <div className="flex items-center gap-4 text-xs">
      <Select value={stylePreset} onValueChange={onStylePresetChange}>
        <SelectTrigger className="h-8 w-[110px] border-border bg-transparent text-xs">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="modern">Modern</SelectItem>
          <SelectItem value="github">GitHub</SelectItem>
          <SelectItem value="academic">Academic</SelectItem>
          <SelectItem value="minimal">Minimal</SelectItem>
        </SelectContent>
      </Select>

      <Select value={pageSize} onValueChange={onPageSizeChange}>
        <SelectTrigger className="h-8 w-[80px] border-border bg-transparent text-xs">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="A4">A4</SelectItem>
          <SelectItem value="Letter">Letter</SelectItem>
          <SelectItem value="Legal">Legal</SelectItem>
        </SelectContent>
      </Select>

      <Select onValueChange={onLoadTemplate}>
        <SelectTrigger className="h-8 w-[110px] border-border bg-transparent text-xs">
          <SelectValue placeholder="Template" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="basic">Basic</SelectItem>
          <SelectItem value="resume">Resume</SelectItem>
          <SelectItem value="technical">Technical</SelectItem>
        </SelectContent>
      </Select>

      <div className="h-4 w-px bg-border" />

      <div className="flex items-center gap-2">
        <Switch
          id="auto-convert"
          checked={autoConvert}
          onCheckedChange={onAutoConvertChange}
          className="data-[state=checked]:bg-cyan-500"
        />
        <Label htmlFor="auto-convert" className="text-xs text-muted-foreground cursor-pointer">
          Auto
        </Label>
      </div>

      {!autoConvert && (
        <Button
          onClick={onConvert}
          size="sm"
          className="h-8 px-3 text-xs bg-cyan-500 text-white hover:bg-cyan-600"
        >
          Convert
        </Button>
      )}

      <div className="h-4 w-px bg-border" />

      <Button
        variant="ghost"
        size="sm"
        onClick={onClear}
        className="h-8 px-3 text-xs text-muted-foreground hover:text-red-500"
      >
        Clear
      </Button>
    </div>
  )
}

export { TEMPLATES }

