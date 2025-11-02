# Markdown to PDF Converter

Transform your Markdown documents into beautifully formatted PDFs with extended features support. A modern, fast, and free web application built with Next.js and React.

![Version](https://img.shields.io/badge/version-0.1.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![Next.js](https://img.shields.io/badge/Next.js-16.0-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)

## ✨ Features

- **Real-time Preview** - See your markdown rendered as you type
- **Multiple Style Presets** - GitHub, Academic, Modern, and Minimal themes
- **🎨 Custom Themes** - Create, edit, and manage your own PDF themes
  - Visual theme editor with live preview
  - Control colors, typography, and spacing
  - Import/Export themes as JSON
  - localStorage persistence
- **Extended Markdown Support**
  - 🧮 Math formulas with LaTeX (KaTeX)
  - 💻 Syntax highlighting for code blocks  
  - 📊 Tables and GitHub Flavored Markdown
  - 🔀 Mermaid diagrams (flowcharts, sequence diagrams, etc.)
  - 🔗 Links, images, and blockquotes
- **Professional PDFs** - Export publication-ready documents
- **Dark Mode** - Full dark mode support with system preference detection
- **Responsive Design** - Works great on desktop, tablet, and mobile
- **Embeddable** - Use as components in your own projects
- **Zero Configuration** - Works out of the box
- **Free & Open Source** - No limits, no subscriptions

## 🚀 Quick Start

### Online Version

Visit [your-app-url.vercel.app](https://your-app-url.vercel.app) to use the app immediately - no installation required!

### Local Development

```bash
# Clone the repository
git clone https://github.com/yourusername/mdtopdf.git
cd mdtopdf

# Install dependencies
npm install

# Run the development server
npm run dev

# Open http://localhost:3000
```

## 📖 Usage

### As a Web Application

1. **Type or paste** your markdown in the editor
2. **See live preview** of the rendered content
3. **Choose or create a theme** using the theme selector
4. **View PDF preview** in real-time
5. **Download PDF** when ready

### Custom Themes

Create your own custom PDF themes:

1. Click the **➕** button next to the theme selector
2. Customize colors, typography, and spacing in the theme editor
3. Save and use your theme for PDF generation
4. Export themes as JSON to share with your team

See the [Custom Themes Guide](docs/CUSTOM_THEMES.md) for detailed documentation.

### As an Embeddable Module

#### Using the Conversion Functions

```typescript
import { parseMarkdown, generatePDF, downloadPDF } from 'mdtopdf'

async function convertMarkdownToPDF(markdown: string) {
  // Parse markdown
  const parsed = await parseMarkdown(markdown, {
    gfm: true,
    math: true,
    syntaxHighlighting: true
  })

  // Generate PDF
  const pdf = await generatePDF({
    html: parsed.html,
    markdown,
    stylePreset: 'modern',
    pageSize: 'A4',
    title: 'My Document'
  })

  // Download
  downloadPDF(pdf.blob, 'my-document.pdf')
}
```

#### Using React Components

```typescript
import { MarkdownEditor, PDFViewer } from 'mdtopdf/components'
import { useState } from 'react'

export default function MyApp() {
  const [markdown, setMarkdown] = useState('# Hello World')
  const [html, setHtml] = useState('')

  return (
    <div>
      <MarkdownEditor value={markdown} onChange={setMarkdown} />
      <PDFViewer 
        markdown={markdown} 
        html={html}
        options={{ stylePreset: 'github' }}
      />
    </div>
  )
}
```

#### Using Custom Hooks

```typescript
import { useMarkdownParser, usePDFGenerator } from 'mdtopdf/hooks'

function MyComponent() {
  const markdown = '# My Document\n\nHello **world**!'
  
  const { result, loading } = useMarkdownParser(markdown, {
    gfm: true,
    math: true
  })

  const { result: pdf } = usePDFGenerator(
    markdown,
    result?.html || '',
    { stylePreset: 'modern' }
  )

  return (
    <div>
      {loading ? 'Parsing...' : 'Ready!'}
      {pdf && <a href={pdf.url} download>Download PDF</a>}
    </div>
  )
}
```

## 🎨 Style Presets

### GitHub
Clean and familiar GitHub-style formatting with subtle borders and code highlighting.

### Academic
Professional serif fonts (Times New Roman) suitable for academic papers and formal documents.

### Modern
Bold and colorful with contemporary design elements, perfect for presentations and modern documents.

### Minimal
Simple and clean with minimal styling, focusing on content readability.

## 📄 Supported Markdown Features

### Basic Syntax
- Headings (H1-H6)
- Bold and italic text
- Lists (ordered and unordered)
- Links and images
- Blockquotes
- Horizontal rules
- Inline code and code blocks

### Extended Syntax
- Tables
- Task lists
- Strikethrough
- Footnotes
- Definition lists

### Advanced Features
- **Math formulas**: Inline `$E = mc^2$` and block math:
  ```
  $$
  \frac{-b \pm \sqrt{b^2 - 4ac}}{2a}
  $$
  ```
- **Syntax highlighting**: Automatic detection for 100+ programming languages
- **HTML support**: Embed HTML when needed (can be sanitized)

## 🏗️ Project Structure

```
mdtopdf/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── layout.tsx         # Root layout
│   │   └── page.tsx           # Main converter page
│   ├── components/            # React components
│   │   ├── ui/               # shadcn/ui components
│   │   ├── markdown-editor.tsx
│   │   ├── markdown-preview.tsx
│   │   ├── pdf-viewer.tsx
│   │   └── toolbar.tsx
│   ├── lib/                   # Core library
│   │   ├── markdown/         # Markdown processing
│   │   ├── pdf/              # PDF styling
│   │   └── theme-manager.ts  # Custom theme system
│   └── hooks/                # Custom React hooks
├── docs/                      # Documentation
│   ├── CONTRIBUTING.md       # Contribution guidelines
│   ├── CUSTOM_THEMES.md      # Custom themes guide
│   ├── DEPLOYMENT.md         # Deployment instructions
│   ├── EMBEDDING.md          # Embedding/integration guide
│   ├── EXAMPLES.md           # Code examples
│   └── PERFORMANCE.md        # Performance optimization
└── README.md                 # This file
```

## 🛠️ Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) with App Router
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/)
- **Markdown Processing**: [unified](https://unifiedjs.com/) ecosystem
  - remark-parse, remark-gfm, remark-math
  - rehype-katex, rehype-prism-plus
- **PDF Generation**: [@react-pdf/renderer](https://react-pdf.org/)
- **Math Rendering**: [KaTeX](https://katex.org/)
- **Theme Management**: [next-themes](https://github.com/pacocoursey/next-themes)

## ⚡ Performance

This application is optimized for maximum performance:

- **Bundle Size**: < 200KB gzipped
- **First Contentful Paint**: < 1.2s
- **Time to Interactive**: < 2.5s
- **Lighthouse Score**: 95+

See [docs/PERFORMANCE.md](./docs/PERFORMANCE.md) for detailed performance metrics and optimization guide.

## 🤝 Contributing

Contributions are welcome! Please read [docs/CONTRIBUTING.md](./docs/CONTRIBUTING.md) for guidelines.

### Development Workflow

1. Create a feature branch: `git checkout -b feature/my-feature`
2. Make your changes
3. Test thoroughly
4. Commit with conventional commits: `feat: add new feature`
5. Push and create a pull request

### Code Style

- Use TypeScript strict mode
- Follow ESLint and Prettier configurations
- Write descriptive commit messages
- Add tests for new features

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - The React framework
- [shadcn/ui](https://ui.shadcn.com/) - Beautiful UI components
- [unified](https://unifiedjs.com/) - Markdown processing
- [@react-pdf/renderer](https://react-pdf.org/) - PDF generation
- [KaTeX](https://katex.org/) - Math rendering

## 🐛 Bug Reports

Found a bug? Please open an issue on [GitHub Issues](https://github.com/yourusername/mdtopdf/issues).

## 💡 Feature Requests

Have an idea? We'd love to hear it! Open a feature request on [GitHub Issues](https://github.com/yourusername/mdtopdf/issues).

## 📮 Contact

- GitHub: [@yourusername](https://github.com/yourusername)
- Email: your.email@example.com

## 📚 Documentation

- **[Getting Started](./README.md)** - This file
- **[Custom Themes Guide](./docs/CUSTOM_THEMES.md)** - Create and manage custom PDF themes
- **[Embedding Guide](./docs/EMBEDDING.md)** - Use as a library in your projects
- **[Code Examples](./docs/EXAMPLES.md)** - Practical examples and use cases
- **[Performance Guide](./docs/PERFORMANCE.md)** - Optimization tips and metrics
- **[Contributing](./docs/CONTRIBUTING.md)** - How to contribute
- **[Deployment](./docs/DEPLOYMENT.md)** - Deploy to production

## 🗺️ Roadmap

- [x] Custom PDF themes with visual editor
- [x] Math formula support with KaTeX
- [x] Syntax highlighting for code blocks
- [x] Export/import theme system
- [x] Mermaid diagram support
- [ ] Web Workers for markdown parsing
- [ ] PDF watermark support
- [ ] Batch conversion
- [ ] Browser extension

---

Made with ❤️ by the open source community
