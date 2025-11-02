# Contributing to Markdown to PDF Converter

Thank you for your interest in contributing! This document provides guidelines and instructions for contributing to the project.

## Code of Conduct

This project follows a Code of Conduct that all contributors are expected to uphold. Please be respectful and constructive in all interactions.

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- Git for version control
- A code editor (VS Code recommended)

### Setup Development Environment

```bash
# Fork and clone the repository
git clone https://github.com/your-username/mdtopdf.git
cd mdtopdf

# Install dependencies
npm install

# Start development server
npm run dev

# Open http://localhost:3000
```

## Git Workflow

We follow a standard Git workflow with feature branches:

### 1. Create a Branch

Always create a new branch for your work:

```bash
git checkout -b feature/your-feature-name
```

Branch naming conventions:
- `feature/` - New features
- `fix/` - Bug fixes
- `docs/` - Documentation updates
- `perf/` - Performance improvements
- `refactor/` - Code refactoring
- `test/` - Test additions or updates

### 2. Make Changes

- Write clean, readable code
- Follow the existing code style
- Add comments for complex logic
- Update documentation if needed

### 3. Commit Changes

Use conventional commit messages:

```bash
git commit -m "feat: add mermaid diagram support"
git commit -m "fix: resolve PDF generation issue"
git commit -m "docs: update API documentation"
```

Commit types:
- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation
- `style:` - Formatting, no code change
- `refactor:` - Code refactoring
- `perf:` - Performance improvement
- `test:` - Adding or updating tests
- `chore:` - Maintenance tasks

### 4. Push and Create PR

```bash
git push origin feature/your-feature-name
```

Then create a Pull Request on GitHub with:
- Clear title describing the change
- Description of what and why
- Link to related issues
- Screenshots (if UI changes)

## Code Style Guidelines

### TypeScript

- Use TypeScript strict mode
- Define explicit types for function parameters and return values
- Avoid `any` - use `unknown` if type is truly unknown
- Use interfaces for object shapes
- Use const assertions where appropriate

```typescript
// Good
interface User {
  name: string
  email: string
}

function getUser(id: string): Promise<User> {
  // ...
}

// Bad
function getUser(id): any {
  // ...
}
```

### React Components

- Use functional components with hooks
- Follow the component structure pattern
- Use `"use client"` directive only when needed
- Prefer server components by default

```typescript
"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"

interface MyComponentProps {
  initialValue: string
  onChange?: (value: string) => void
}

export function MyComponent({ initialValue, onChange }: MyComponentProps) {
  const [value, setValue] = useState(initialValue)
  
  return <Button onClick={() => setValue("new")}>Click</Button>
}
```

### File Naming

- Use kebab-case for files: `markdown-editor.tsx`
- Component files should match their export
- Use `.tsx` for JSX, `.ts` for pure TypeScript

### Import Order

```typescript
// 1. React and Next.js
import { useState } from "react"
import Link from "next/link"

// 2. Third-party libraries
import { Button } from "@/components/ui/button"

// 3. Local imports
import { parseMarkdown } from "@/lib/markdown"
import type { MarkdownOptions } from "@/lib/markdown/types"

// 4. Styles (if any)
import "./styles.css"
```

## Testing

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run with coverage
npm test -- --coverage
```

### Writing Tests

- Write tests for new features
- Test edge cases and error conditions
- Use descriptive test names
- Keep tests focused and isolated

```typescript
describe("parseMarkdown", () => {
  it("should parse basic markdown", async () => {
    const result = await parseMarkdown("# Hello")
    expect(result.html).toContain("<h1>")
  })

  it("should handle empty input", async () => {
    const result = await parseMarkdown("")
    expect(result.html).toBe("")
  })
})
```

## Performance Considerations

- Use `useMemo` and `useCallback` for expensive computations
- Implement debouncing for real-time updates
- Lazy load heavy dependencies
- Keep bundle size minimal
- Avoid unnecessary re-renders

See [PERFORMANCE.md](./PERFORMANCE.md) for detailed guidelines.

## Documentation

- Update README.md for user-facing changes
- Add JSDoc comments to public APIs
- Update type definitions
- Include code examples
- Document breaking changes

```typescript
/**
 * Parse markdown string to HTML with extended features
 * @param markdown - Raw markdown string
 * @param options - Parsing options
 * @returns Parsed markdown with HTML and metadata
 * @example
 * ```typescript
 * const result = await parseMarkdown("# Hello", { gfm: true })
 * console.log(result.html)
 * ```
 */
export async function parseMarkdown(
  markdown: string,
  options?: MarkdownOptions
): Promise<ParsedMarkdown>
```

## Debugging

### Chrome DevTools

1. Open DevTools (F12)
2. Use Sources tab for breakpoints
3. Use Console for logging
4. Use React DevTools for component inspection

### Performance Profiling

```bash
# Build with bundle analyzer
npm run analyze

# Check Lighthouse score
# DevTools > Lighthouse > Performance
```

## Common Issues

### Issue: TypeScript errors

```bash
# Regenerate types
npm run build

# Check TypeScript
npx tsc --noEmit
```

### Issue: Linting errors

```bash
# Run linter
npm run lint

# Auto-fix issues
npm run lint --fix
```

### Issue: Outdated dependencies

```bash
# Check for updates
npm outdated

# Update carefully
npm update
```

## Review Process

All PRs go through review before merging:

1. **Automated Checks**: Linting, tests, build
2. **Code Review**: At least one approval required
3. **Testing**: Manual testing of changes
4. **Documentation**: Verify docs are updated
5. **Merge**: Squash and merge to main

## Release Process

Maintainers handle releases:

1. Update version in package.json
2. Update CHANGELOG.md
3. Create git tag
4. Deploy to production
5. Create GitHub release

## Getting Help

- Check existing issues and discussions
- Ask questions in GitHub Discussions
- Join our community chat (if available)
- Read the documentation thoroughly

## Recognition

Contributors are recognized in:
- README.md contributors section
- Git history
- Release notes

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing to Markdown to PDF Converter! 🎉

