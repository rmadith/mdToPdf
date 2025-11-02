# Embedding Guide

This guide explains how to embed the Markdown to PDF Converter into your own projects.

## Installation

If the package is published to npm:

```bash
npm install mdtopdf
```

For local development:

```bash
npm link ../path/to/mdtopdf
```

## Usage Modes

The library supports three usage modes:

1. **Headless API** - Pure functions for conversion
2. **React Components** - Pre-built UI components
3. **Custom Hooks** - Building blocks for custom UIs

## 1. Headless API Usage

Perfect for programmatic PDF generation without UI.

### Basic Conversion

```typescript
import { parseMarkdown, generatePDF, downloadPDF } from 'mdtopdf'

async function convertToPDF() {
  const markdown = '# My Document\n\nHello **world**!'
  
  // Step 1: Parse markdown to HTML
  const parsed = await parseMarkdown(markdown, {
    gfm: true,          // GitHub Flavored Markdown
    math: true,         // Math formulas with KaTeX
    syntaxHighlighting: true
  })
  
  // Step 2: Generate PDF
  const pdf = await generatePDF({
    html: parsed.html,
    markdown: markdown,
    stylePreset: 'modern',
    pageSize: 'A4',
    orientation: 'portrait',
    margins: {
      top: 40,
      right: 40,
      bottom: 40,
      left: 40
    },
    title: 'My Document',
    author: 'John Doe',
    subject: 'Generated PDF'
  })
  
  // Step 3: Download
  downloadPDF(pdf.blob, 'document.pdf')
  
  // Or get the URL for preview
  console.log(pdf.url) // blob:https://...
  console.log(pdf.size) // Size in bytes
}
```

### Validation

```typescript
import { validateMarkdown, validatePDFOptions } from 'mdtopdf'

// Validate markdown before parsing
const validation = validateMarkdown(markdown)
if (!validation.valid) {
  console.warn('Warnings:', validation.warnings)
}

// Validate PDF options
const pdfValidation = validatePDFOptions({
  html: parsed.html,
  markdown,
  stylePreset: 'modern'
})
if (!pdfValidation.valid) {
  console.error('Errors:', pdfValidation.errors)
}
```

### Estimation

```typescript
import { 
  estimateProcessingTime,
  estimatePDFSize 
} from 'mdtopdf'

// Estimate how long parsing will take
const parseTime = estimateProcessingTime(markdown)
console.log(`Estimated parse time: ${parseTime}ms`)

// Estimate PDF size before generating
const estimatedSize = estimatePDFSize(parsed.html)
console.log(`Estimated PDF size: ${estimatedSize} bytes`)
```

## 2. React Components Usage

Pre-built components for quick integration.

### Complete Editor

```typescript
import { MarkdownEditor } from 'mdtopdf/components'
import { useState } from 'react'

export default function MyApp() {
  const [markdown, setMarkdown] = useState('# Hello World')
  
  return (
    <MarkdownEditor
      value={markdown}
      onChange={setMarkdown}
      placeholder="Type markdown here..."
      disabled={false}
    />
  )
}
```

### Live Preview

```typescript
import { MarkdownPreview } from 'mdtopdf/components'

export function Preview() {
  return (
    <MarkdownPreview
      markdown="# Title\n\nContent here..."
      options={{
        gfm: true,
        math: true,
        syntaxHighlighting: true
      }}
    />
  )
}
```

### PDF Viewer

```typescript
import { PDFViewer } from 'mdtopdf/components'

export function PDFPanel() {
  const markdown = '# My Doc'
  const html = '<h1>My Doc</h1>'
  
  return (
    <PDFViewer
      markdown={markdown}
      html={html}
      options={{
        stylePreset: 'github',
        pageSize: 'A4',
        orientation: 'portrait',
        title: 'My Document'
      }}
    />
  )
}
```

### Toolbar

```typescript
import { Toolbar } from 'mdtopdf/components'
import { useState } from 'react'

export function MyToolbar() {
  const [stylePreset, setStylePreset] = useState('modern')
  const [pageSize, setPageSize] = useState('A4')
  
  return (
    <Toolbar
      stylePreset={stylePreset}
      onStylePresetChange={setStylePreset}
      pageSize={pageSize}
      onPageSizeChange={setPageSize}
      onClear={() => setMarkdown('')}
      onLoadTemplate={(key) => loadTemplate(key)}
    />
  )
}
```

### Complete Example

```typescript
'use client'

import { useState } from 'react'
import { 
  MarkdownEditor, 
  MarkdownPreview, 
  PDFViewer,
  Toolbar 
} from 'mdtopdf/components'

export default function ConverterPage() {
  const [markdown, setMarkdown] = useState('# Hello')
  const [html, setHtml] = useState('')
  const [preset, setPreset] = useState('modern')
  const [pageSize, setPageSize] = useState('A4')
  
  return (
    <div className="grid grid-cols-3 gap-4 h-screen p-4">
      <div>
        <Toolbar
          stylePreset={preset}
          onStylePresetChange={setPreset}
          pageSize={pageSize}
          onPageSizeChange={setPageSize}
          onClear={() => setMarkdown('')}
          onLoadTemplate={(key) => {}}
        />
        <MarkdownEditor 
          value={markdown} 
          onChange={setMarkdown} 
        />
      </div>
      
      <MarkdownPreview 
        markdown={markdown}
        options={{ gfm: true, math: true }}
      />
      
      <PDFViewer
        markdown={markdown}
        html={html}
        options={{ stylePreset: preset, pageSize }}
      />
    </div>
  )
}
```

## 3. Custom Hooks Usage

Building blocks for custom implementations.

### useMarkdownParser

```typescript
import { useMarkdownParser } from 'mdtopdf/hooks'

function MyComponent() {
  const markdown = '# Hello **World**'
  
  const { result, loading, error } = useMarkdownParser(markdown, {
    gfm: true,
    math: true,
    debounceDelay: 300 // Optional, default 300ms
  })
  
  if (loading) return <div>Parsing...</div>
  if (error) return <div>Error: {error.message}</div>
  
  return (
    <div dangerouslySetInnerHTML={{ __html: result?.html || '' }} />
  )
}
```

### usePDFGenerator

```typescript
import { usePDFGenerator } from 'mdtopdf/hooks'

function PDFDownloader() {
  const markdown = '# Document'
  const html = '<h1>Document</h1>'
  
  const { result, loading, error, regenerate } = usePDFGenerator(
    markdown,
    html,
    {
      stylePreset: 'github',
      pageSize: 'A4',
      debounceDelay: 500 // Optional, default 500ms
    }
  )
  
  return (
    <div>
      {loading && <span>Generating PDF...</span>}
      {error && <span>Error: {error.message}</span>}
      {result && (
        <>
          <a href={result.url} download>
            Download PDF ({(result.size / 1024).toFixed(1)} KB)
          </a>
          <button onClick={regenerate}>Regenerate</button>
        </>
      )}
    </div>
  )
}
```

### useDebounce

```typescript
import { useDebounce } from 'mdtopdf/hooks'
import { useState, useEffect } from 'react'

function SearchComponent() {
  const [searchTerm, setSearchTerm] = useState('')
  const debouncedSearch = useDebounce(searchTerm, 500)
  
  useEffect(() => {
    // This only runs after user stops typing for 500ms
    if (debouncedSearch) {
      performSearch(debouncedSearch)
    }
  }, [debouncedSearch])
  
  return (
    <input 
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
    />
  )
}
```

## Styling

### Using Tailwind

The components use Tailwind CSS. Ensure your project has:

```javascript
// tailwind.config.js
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './node_modules/mdtopdf/**/*.{js,ts,jsx,tsx}' // Add this
  ],
  // ...rest of config
}
```

### Custom Styles

Override component styles:

```css
/* Override editor styles */
.markdown-editor textarea {
  font-family: 'Fira Code', monospace;
  font-size: 14px;
}

/* Override preview styles */
.markdown-preview {
  background: #f9fafb;
}
```

## TypeScript Support

Full TypeScript support with exported types:

```typescript
import type {
  MarkdownOptions,
  PDFConfig,
  StylePreset,
  ParsedMarkdown,
  PDFGenerationOptions,
  PDFResult
} from 'mdtopdf'

const options: MarkdownOptions = {
  gfm: true,
  math: true,
  syntaxHighlighting: true,
  sanitize: true
}

const pdfConfig: PDFConfig = {
  pageSize: 'A4',
  orientation: 'portrait',
  margins: { top: 40, right: 40, bottom: 40, left: 40 },
  stylePreset: 'modern',
  title: 'My Document'
}
```

## Next.js Integration

### App Router (Recommended)

```typescript
// app/converter/page.tsx
'use client'

import { useState } from 'react'
import { MarkdownEditor, PDFViewer } from 'mdtopdf/components'

export default function ConverterPage() {
  const [markdown, setMarkdown] = useState('')
  // ... rest of component
}
```

### Pages Router

```typescript
// pages/converter.tsx
import { useState } from 'react'
import { MarkdownEditor } from 'mdtopdf/components'

export default function ConverterPage() {
  const [markdown, setMarkdown] = useState('')
  // ... rest of component
}
```

## Performance Tips

1. **Debouncing**: Use built-in debouncing in hooks
2. **Memoization**: Wrap with `useMemo` for expensive operations
3. **Code Splitting**: Dynamic import for heavy features

```typescript
// Lazy load PDF generation
const generatePDF = async () => {
  const { generatePDF: gen } = await import('mdtopdf')
  return await gen(options)
}
```

## Error Handling

```typescript
try {
  const parsed = await parseMarkdown(markdown)
  const pdf = await generatePDF({ ...parsed, markdown })
  downloadPDF(pdf.blob, 'doc.pdf')
} catch (error) {
  if (error instanceof Error) {
    console.error('Conversion failed:', error.message)
    // Show user-friendly error
  }
}
```

## Browser Compatibility

- Chrome/Edge: Full support
- Firefox: Full support
- Safari: Full support (iOS 12+)
- IE: Not supported

## Examples

See the `examples/` directory for complete working examples:

- Next.js App Router example
- React standalone example
- Headless Node.js example

## Support

- Documentation: [README.md](../README.md)
- Issues: [GitHub Issues](https://github.com/yourusername/mdtopdf/issues)
- Discussions: [GitHub Discussions](https://github.com/yourusername/mdtopdf/discussions)

