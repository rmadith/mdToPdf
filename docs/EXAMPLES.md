# Code Examples

This document provides practical examples for common use cases.

## Table of Contents

- [Basic Usage](#basic-usage)
- [Advanced Markdown](#advanced-markdown)
- [Custom Styling](#custom-styling)
- [Batch Processing](#batch-processing)
- [Integration Examples](#integration-examples)

## Basic Usage

### Convert Simple Markdown

```typescript
import { parseMarkdown, generatePDF, downloadPDF } from 'mdtopdf'

async function simpleConversion() {
  const markdown = `
# My Document

This is a simple document with **bold** and *italic* text.

## Features
- Easy to use
- Fast conversion
- Beautiful output
  `
  
  const parsed = await parseMarkdown(markdown)
  const pdf = await generatePDF({
    html: parsed.html,
    markdown,
    stylePreset: 'modern'
  })
  
  downloadPDF(pdf.blob, 'simple-document.pdf')
}
```

### With Error Handling

```typescript
async function safeConversion(markdown: string) {
  try {
    // Validate first
    const validation = validateMarkdown(markdown)
    if (!validation.valid) {
      console.warn('Validation warnings:', validation.warnings)
    }
    
    const parsed = await parseMarkdown(markdown, {
      gfm: true,
      math: true,
      sanitize: true
    })
    
    const pdf = await generatePDF({
      html: parsed.html,
      markdown,
      stylePreset: 'github',
      title: 'My Document'
    })
    
    return pdf
  } catch (error) {
    console.error('Conversion failed:', error)
    throw new Error('Failed to convert markdown to PDF')
  }
}
```

## Advanced Markdown

### Math Formulas

```typescript
const mathDocument = `
# Mathematical Equations

## Inline Math
The famous equation $E = mc^2$ demonstrates mass-energy equivalence.

## Block Math
The quadratic formula:

$$
x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}
$$

## Matrix
$$
\\begin{bmatrix}
1 & 2 & 3 \\\\
4 & 5 & 6 \\\\
7 & 8 & 9
\\end{bmatrix}
$$
`

const parsed = await parseMarkdown(mathDocument, { math: true })
```

### Code with Syntax Highlighting

```typescript
const codeDocument = `
# Code Examples

## JavaScript
\`\`\`javascript
function fibonacci(n) {
  if (n <= 1) return n
  return fibonacci(n - 1) + fibonacci(n - 2)
}
\`\`\`

## Python
\`\`\`python
def factorial(n):
    if n == 0:
        return 1
    return n * factorial(n - 1)
\`\`\`

## SQL
\`\`\`sql
SELECT users.name, COUNT(orders.id) as order_count
FROM users
LEFT JOIN orders ON users.id = orders.user_id
GROUP BY users.name
HAVING order_count > 5;
\`\`\`
`

const parsed = await parseMarkdown(codeDocument, { 
  syntaxHighlighting: true 
})
```

### Tables and Lists

```typescript
const tableDocument = `
# Data Table

| Feature | Free | Pro | Enterprise |
|---------|------|-----|-----------|
| Users | 1 | 10 | Unlimited |
| Storage | 1GB | 100GB | 1TB |
| Support | Email | Priority | 24/7 |

## Task List
- [x] Design interface
- [x] Implement backend
- [ ] Write tests
- [ ] Deploy to production

## Nested Lists
1. First item
   - Sub item A
   - Sub item B
     - Nested item
2. Second item
   1. Ordered sub item
   2. Another ordered item
`

const parsed = await parseMarkdown(tableDocument, { gfm: true })
```

## Custom Styling

### Custom Margins

```typescript
const pdf = await generatePDF({
  html: parsed.html,
  markdown,
  stylePreset: 'academic',
  margins: {
    top: 60,    // Larger top margin for binding
    right: 40,
    bottom: 40,
    left: 60    // Larger left margin
  }
})
```

### Landscape Orientation

```typescript
const pdf = await generatePDF({
  html: parsed.html,
  markdown,
  pageSize: 'Letter',
  orientation: 'landscape',  // Great for wide tables
  stylePreset: 'minimal'
})
```

### All Style Presets

```typescript
const presets = ['github', 'academic', 'modern', 'minimal']

for (const preset of presets) {
  const pdf = await generatePDF({
    html: parsed.html,
    markdown,
    stylePreset: preset as StylePreset
  })
  
  downloadPDF(pdf.blob, `document-${preset}.pdf`)
}
```

## Batch Processing

### Convert Multiple Files

```typescript
async function convertMultipleFiles(files: File[]) {
  const results = await Promise.all(
    files.map(async (file) => {
      const markdown = await file.text()
      const parsed = await parseMarkdown(markdown)
      const pdf = await generatePDF({
        html: parsed.html,
        markdown,
        title: file.name.replace('.md', ''),
        stylePreset: 'github'
      })
      
      return {
        filename: file.name,
        pdf: pdf.blob,
        size: pdf.size
      }
    })
  )
  
  return results
}
```

### Progress Tracking

```typescript
async function convertWithProgress(
  files: File[],
  onProgress: (percent: number) => void
) {
  const total = files.length
  let completed = 0
  
  const results = []
  
  for (const file of files) {
    const markdown = await file.text()
    const parsed = await parseMarkdown(markdown)
    const pdf = await generatePDF({
      html: parsed.html,
      markdown
    })
    
    results.push(pdf)
    completed++
    onProgress((completed / total) * 100)
  }
  
  return results
}

// Usage
await convertWithProgress(files, (percent) => {
  console.log(`Progress: ${percent.toFixed(0)}%`)
})
```

## Integration Examples

### React Hook Form Integration

```typescript
import { useForm } from 'react-hook-form'
import { generatePDF } from 'mdtopdf'

function DocumentForm() {
  const { register, handleSubmit } = useForm()
  
  const onSubmit = async (data) => {
    const markdown = data.content
    const parsed = await parseMarkdown(markdown)
    const pdf = await generatePDF({
      html: parsed.html,
      markdown,
      title: data.title,
      author: data.author
    })
    
    downloadPDF(pdf.blob, `${data.title}.pdf`)
  }
  
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('title')} placeholder="Title" />
      <input {...register('author')} placeholder="Author" />
      <textarea {...register('content')} placeholder="Markdown" />
      <button type="submit">Generate PDF</button>
    </form>
  )
}
```

### Next.js API Route

```typescript
// app/api/convert/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { parseMarkdown, generatePDF } from 'mdtopdf'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { markdown, stylePreset = 'modern' } = body
    
    const parsed = await parseMarkdown(markdown)
    const pdf = await generatePDF({
      html: parsed.html,
      markdown,
      stylePreset
    })
    
    return new NextResponse(pdf.blob, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="document.pdf"'
      }
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Conversion failed' },
      { status: 500 }
    )
  }
}
```

### Express.js Endpoint

```typescript
import express from 'express'
import { parseMarkdown, generatePDF } from 'mdtopdf'

const app = express()
app.use(express.json())

app.post('/api/convert', async (req, res) => {
  try {
    const { markdown, stylePreset = 'modern' } = req.body
    
    const parsed = await parseMarkdown(markdown)
    const pdf = await generatePDF({
      html: parsed.html,
      markdown,
      stylePreset
    })
    
    // Convert blob to buffer for Express
    const buffer = Buffer.from(await pdf.blob.arrayBuffer())
    
    res.setHeader('Content-Type', 'application/pdf')
    res.setHeader('Content-Disposition', 'attachment; filename="document.pdf"')
    res.send(buffer)
  } catch (error) {
    res.status(500).json({ error: 'Conversion failed' })
  }
})

app.listen(3000)
```

### Zustand State Management

```typescript
import { create } from 'zustand'
import { parseMarkdown, generatePDF } from 'mdtopdf'

interface DocumentStore {
  markdown: string
  html: string
  pdf: Blob | null
  loading: boolean
  setMarkdown: (markdown: string) => void
  convertToPDF: () => Promise<void>
}

export const useDocumentStore = create<DocumentStore>((set, get) => ({
  markdown: '',
  html: '',
  pdf: null,
  loading: false,
  
  setMarkdown: (markdown) => set({ markdown }),
  
  convertToPDF: async () => {
    set({ loading: true })
    try {
      const { markdown } = get()
      const parsed = await parseMarkdown(markdown)
      const pdf = await generatePDF({
        html: parsed.html,
        markdown
      })
      
      set({ html: parsed.html, pdf: pdf.blob })
    } finally {
      set({ loading: false })
    }
  }
}))
```

### File Upload with Progress

```typescript
function FileUploader() {
  const [progress, setProgress] = useState(0)
  
  const handleFiles = async (files: FileList) => {
    const mdFiles = Array.from(files).filter(f => f.name.endsWith('.md'))
    
    for (let i = 0; i < mdFiles.length; i++) {
      const file = mdFiles[i]
      const markdown = await file.text()
      
      const parsed = await parseMarkdown(markdown)
      const pdf = await generatePDF({
        html: parsed.html,
        markdown,
        title: file.name.replace('.md', '')
      })
      
      downloadPDF(pdf.blob, file.name.replace('.md', '.pdf'))
      
      setProgress(((i + 1) / mdFiles.length) * 100)
    }
  }
  
  return (
    <div>
      <input 
        type="file" 
        multiple 
        accept=".md"
        onChange={(e) => e.target.files && handleFiles(e.target.files)}
      />
      {progress > 0 && <progress value={progress} max={100} />}
    </div>
  )
}
```

## Testing Examples

### Jest Test

```typescript
import { parseMarkdown, generatePDF } from 'mdtopdf'

describe('Markdown to PDF Conversion', () => {
  it('should parse basic markdown', async () => {
    const markdown = '# Hello World'
    const result = await parseMarkdown(markdown)
    
    expect(result.html).toContain('<h1>')
    expect(result.html).toContain('Hello World')
  })
  
  it('should generate PDF', async () => {
    const markdown = '# Test'
    const parsed = await parseMarkdown(markdown)
    const pdf = await generatePDF({
      html: parsed.html,
      markdown
    })
    
    expect(pdf.blob).toBeInstanceOf(Blob)
    expect(pdf.size).toBeGreaterThan(0)
  })
})
```

### React Testing Library

```typescript
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MarkdownEditor } from 'mdtopdf/components'

test('editor updates on input', async () => {
  const handleChange = jest.fn()
  
  render(<MarkdownEditor value="" onChange={handleChange} />)
  
  const textarea = screen.getByRole('textbox')
  await userEvent.type(textarea, '# Hello')
  
  await waitFor(() => {
    expect(handleChange).toHaveBeenCalled()
  })
})
```

---

For more examples, check the source code and tests in the repository.

