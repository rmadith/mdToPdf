# AI Agent Instructions for Markdown to PDF Converter

## Project Context
You are working on a modern web application that converts Markdown documents to beautifully formatted PDFs. The app supports extended Markdown features including mathematical formulas (LaTeX), diagrams (Mermaid), syntax-highlighted code blocks, tables, and more.

## Your Role
As an AI coding assistant, you should:
1. **Write production-ready code** that follows the project's standards
2. **Optimize for performance** - this is a critical requirement
3. **Use existing patterns** established in the codebase
4. **Follow the tech stack** - don't introduce unnecessary dependencies
5. **Maintain type safety** - leverage TypeScript's type system
6. **Think about UX** - make the interface intuitive and responsive

## Key Technical Decisions

### Why These Technologies?
- **Next.js App Router**: Modern React framework with excellent performance
- **shadcn/ui**: High-quality, customizable components that don't bloat the bundle
- **@react-pdf/renderer**: Declarative PDF generation with React components
- **unified/remark/rehype**: Flexible, extensible Markdown processing pipeline

### Performance is Critical
This app must be **fast and lightweight**. When writing code:
- Use dynamic imports for heavy libraries (mermaid, katex)
- Implement debouncing for real-time previews
- Consider using Web Workers for parsing
- Memoize expensive computations
- Minimize client-side JavaScript
- Target bundle size < 200KB gzipped

## Common Tasks

### Adding a New UI Component
1. Check if shadcn/ui has the component: `npx shadcn@latest add [component]`
2. If custom component needed, create in `src/components/`
3. Follow the established naming and structure patterns
4. Make it responsive and accessible
5. Use Tailwind for styling

### Adding Markdown Features
1. Find appropriate remark/rehype plugin
2. Add to `src/lib/markdown/parser.ts` pipeline
3. Update PDF renderer to handle the new syntax
4. Test with sample markdown
5. Document the feature

### Optimizing Performance
1. Use React DevTools Profiler to find slow renders
2. Apply memoization where needed
3. Use dynamic imports for code splitting
4. Run Lighthouse and aim for 95+ score
5. Check bundle size with `npm run build`

## Code Patterns to Follow

### Async Operations
```typescript
"use client"

import { useState, useTransition } from "react"

export function Component() {
  const [isPending, startTransition] = useTransition()
  const [data, setData] = useState(null)

  const handleAction = () => {
    startTransition(async () => {
      const result = await expensiveOperation()
      setData(result)
    })
  }

  return <div>{isPending ? "Loading..." : data}</div>
}
```

### Performance Optimization
```typescript
import { memo, useMemo, useCallback } from "react"

export const ExpensiveComponent = memo(({ data }: Props) => {
  const processedData = useMemo(() => {
    return heavyComputation(data)
  }, [data])

  const handleClick = useCallback(() => {
    // handle click
  }, [])

  return <div onClick={handleClick}>{processedData}</div>
})

ExpensiveComponent.displayName = "ExpensiveComponent"
```

### Dynamic Imports
```typescript
import dynamic from "next/dynamic"

const HeavyComponent = dynamic(() => import("@/components/heavy"), {
  loading: () => <div>Loading...</div>,
  ssr: false
})
```

## What NOT to Do
- ❌ Don't add dependencies without checking bundle size impact
- ❌ Don't use `any` type - be explicit with types
- ❌ Don't create client components unnecessarily
- ❌ Don't ignore performance implications
- ❌ Don't skip error handling
- ❌ Don't hardcode values that should be configurable
- ❌ Don't create inline styles - use Tailwind
- ❌ Don't forget accessibility (ARIA labels, keyboard nav)

## Git Commit Guidelines
When making commits, use conventional commit format:

```
feat: add mermaid diagram support to PDF renderer

- Added rehype-mermaid plugin to markdown pipeline
- Updated PDF styles to handle diagram elements
- Added tests for common diagram types

Closes #123
```

## Testing Checklist
Before considering a feature complete:
- ✅ Works with empty/minimal input
- ✅ Handles large documents (>100KB)
- ✅ Responsive on mobile/tablet
- ✅ No console errors or warnings
- ✅ Types are correct (no `any`)
- ✅ Performance is acceptable (use DevTools)
- ✅ Accessible (keyboard navigation, screen readers)
- ✅ Works in Chrome, Firefox, Safari

## Performance Benchmarks
Target these metrics (measure with Chrome DevTools):
- **First Contentful Paint**: < 1.2s
- **Time to Interactive**: < 2.5s
- **Largest Contentful Paint**: < 2.5s
- **Cumulative Layout Shift**: < 0.1
- **Lighthouse Score**: 95+
- **Bundle Size**: < 200KB gzipped
- **Markdown Parse Time**: < 100ms for 10KB file

## Decision-Making Framework
When faced with implementation choices:
1. **Performance first**: Choose the faster, lighter option
2. **User experience second**: Make it intuitive and smooth
3. **Maintainability third**: Keep code clean and documented
4. **Features last**: Don't add unnecessary complexity

## Example User Flows

### Basic Usage
1. User pastes/types Markdown in editor
2. Preview updates in real-time (debounced)
3. PDF preview shows formatted output
4. User clicks "Download PDF"
5. PDF downloads with professional formatting

### Advanced Usage
1. User uploads .md file
2. User selects style preset (GitHub/Academic/Modern)
3. User adjusts PDF settings (margins, page size)
4. User exports PDF with custom configuration

## Integration Points
The library should be usable as:
1. **Standalone web app** (primary use case)
2. **Embeddable component** (for other Next.js apps)
3. **Headless API** (just the conversion functions)

Export structure:
```typescript
// From lib/index.ts
export { parseMarkdown, generatePDF } from './markdown'
export { MarkdownEditor, PDFViewer } from '../components'
export type { MarkdownOptions, PDFConfig } from './types'
```

## Remember
- This is a production application, not a prototype
- Performance is a feature, not an afterthought
- Users expect professional PDF output
- The app should work offline after initial load
- Bundle size directly impacts user experience
- Type safety prevents bugs in production

## Questions to Ask
When implementing new features, consider:
- Does this increase bundle size? By how much?
- Can this be code-split or lazy loaded?
- Is there a lighter alternative?
- Does this work on mobile?
- Is this accessible?
- Does this follow the established patterns?
- Have I tested edge cases?

