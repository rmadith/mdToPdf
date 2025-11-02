# Custom Themes Guide

The Markdown to PDF Converter now supports fully customizable PDF themes! You can create, edit, and manage custom themes with complete control over colors, typography, and spacing.

## Table of Contents

- [Features](#features)
- [Using the UI](#using-the-ui)
- [Programmatic Usage](#programmatic-usage)
- [Theme Structure](#theme-structure)
- [API Reference](#api-reference)
- [Examples](#examples)

## Features

✨ **Visual Theme Editor** - Create and edit themes with an intuitive dialog interface  
💾 **localStorage Persistence** - Themes are automatically saved to your browser  
📦 **Import/Export** - Share themes as JSON files  
🎨 **Complete Customization** - Control colors, typography, and spacing  
🔄 **Duplicate Themes** - Clone existing themes as starting points  
📚 **NPM Package Support** - Use themes programmatically in your own applications

## Using the UI

### Creating a New Theme

1. Click the **➕ Plus button** next to the theme selector in the toolbar
2. The Theme Editor dialog will open
3. Configure your theme:
   - **Basic Info**: Set name and description
   - **Colors Tab**: Customize all colors (page background, text, headings, code, etc.)
   - **Typography Tab**: Configure fonts, sizes, and line heights
   - **Spacing Tab**: Adjust margins and padding
4. Click **Create Theme** to save

### Editing a Theme

1. Select a custom theme from the theme selector
2. Click the **✏️ Edit button** that appears
3. Modify any settings
4. Click **Save Changes**

### Deleting a Theme

1. Select the custom theme you want to delete
2. Click the **🗑️ Delete button**
3. Confirm the deletion

## Programmatic Usage

### Installation

The theme system is included in the main package:

```bash
npm install mdtopdf
```

### Basic Theme Management

```typescript
import { ThemeManager, DEFAULT_THEME_TEMPLATE } from 'mdtopdf'

// Create a custom theme
const customTheme = {
  ...DEFAULT_THEME_TEMPLATE,
  id: ThemeManager.generateThemeId(),
  name: 'My Corporate Theme',
  description: 'Company branded theme',
  colors: {
    ...DEFAULT_THEME_TEMPLATE.colors,
    pageBackground: '#ffffff',
    textColor: '#333333',
    heading1Color: '#1e40af',
    heading2Color: '#3b82f6',
    linkColor: '#2563eb',
  }
}

// Save the theme (client-side only)
const savedTheme = ThemeManager.saveTheme(customTheme)

// Get all custom themes
const allThemes = ThemeManager.getCustomThemes()

// Get a specific theme
const theme = ThemeManager.getTheme('theme-id')

// Delete a theme
ThemeManager.deleteTheme('theme-id')

// Duplicate a theme
const duplicated = ThemeManager.duplicateTheme('theme-id', 'New Name')
```

### Using Custom Themes in PDF Generation

```typescript
import { parseMarkdown, generatePDF, ThemeManager } from 'mdtopdf'

const markdown = `
# My Document

This is a document with a custom theme.
`

// Parse markdown
const parsed = await parseMarkdown(markdown, {
  gfm: true,
  math: true,
  syntaxHighlighting: true,
})

// Generate PDF with custom theme
const pdf = await generatePDF({
  html: parsed.html,
  markdown,
  stylePreset: 'custom-theme-id', // Use custom theme ID
  pageSize: 'A4',
  orientation: 'portrait',
})

// Download the PDF
downloadPDF(pdf.blob, 'document.pdf')
```

### Import/Export Themes

```typescript
import { ThemeManager } from 'mdtopdf'

// Export all themes as JSON
const themesJson = ThemeManager.exportThemes()
console.log(themesJson)

// Export specific themes
const selectedThemesJson = ThemeManager.exportThemes(['theme-id-1', 'theme-id-2'])

// Import themes from JSON
const importedIds = ThemeManager.importThemes(themesJson, false)
console.log('Imported themes:', importedIds)

// Import with overwrite
const overwrittenIds = ThemeManager.importThemes(themesJson, true)
```

### React Hook

```typescript
import { useThemeManager } from 'mdtopdf'

function MyComponent() {
  const {
    getCustomThemes,
    getTheme,
    saveTheme,
    deleteTheme,
    duplicateTheme,
    exportThemes,
    importThemes,
  } = useThemeManager()

  const themes = getCustomThemes()
  
  // ... use the functions
}
```

## Theme Structure

A custom theme consists of three main sections:

### Colors

```typescript
interface ThemeColors {
  pageBackground: string          // Page background color
  textColor: string               // Primary text color
  heading1Color?: string          // H1 color (optional, defaults to textColor)
  heading2Color?: string          // H2 color (optional)
  heading3Color?: string          // H3 color (optional)
  heading4Color?: string          // H4 color (optional)
  linkColor: string               // Hyperlink color
  codeBackground: string          // Inline code background
  codeTextColor?: string          // Inline code text color
  codeBlockBackground: string     // Code block background
  codeBlockTextColor?: string     // Code block text color
  blockquoteBackground?: string   // Blockquote background
  blockquoteTextColor?: string    // Blockquote text color
  blockquoteBorderColor: string   // Blockquote left border
  tableBorderColor: string        // Table border color
  tableHeaderBackground: string   // Table header background
  horizontalRuleColor: string     // Horizontal rule color
}
```

### Typography

```typescript
interface ThemeTypography {
  fontFamily: string        // Base font (Helvetica, Times-Roman, Courier)
  fontSize: number          // Base font size in points (8-24)
  lineHeight: number        // Base line height (1-3)
  heading1Size: number      // H1 size in points (12-48)
  heading2Size: number      // H2 size in points (12-36)
  heading3Size: number      // H3 size in points (10-28)
  heading4Size: number      // H4 size in points
  heading5Size: number      // H5 size in points
  heading6Size: number      // H6 size in points
  codeFontFamily: string    // Code font family
  codeFontSize: number      // Code font size (6-16)
  codeBlockFontSize: number // Code block font size
}
```

### Spacing

```typescript
interface ThemeSpacing {
  heading1MarginTop: number        // H1 top margin in points (0-50)
  heading1MarginBottom: number     // H1 bottom margin (0-50)
  heading2MarginTop: number        // H2 top margin (0-40)
  heading2MarginBottom: number     // H2 bottom margin (0-40)
  heading3MarginTop: number        // H3 top margin (0-40)
  heading3MarginBottom: number     // H3 bottom margin (0-40)
  paragraphMarginBottom: number    // Paragraph bottom margin (0-30)
  listMarginBottom: number         // List bottom margin (0-30)
  listMarginLeft: number           // List left margin (0-50)
  blockquoteMarginLeft: number     // Blockquote left margin (0-50)
  blockquotePaddingLeft: number    // Blockquote left padding (0-30)
  codeBlockPadding: number         // Code block padding (0-30)
}
```

## API Reference

### ThemeManager

#### Static Methods

- `getCustomThemes(): CustomTheme[]` - Get all saved themes
- `getTheme(id: string): CustomTheme | null` - Get a specific theme
- `saveTheme(theme): CustomTheme` - Save or update a theme
- `deleteTheme(id: string): boolean` - Delete a theme
- `duplicateTheme(id: string, newName?: string): CustomTheme | null` - Duplicate a theme
- `exportThemes(themeIds?: string[]): string` - Export themes as JSON
- `importThemes(json: string, overwrite?: boolean): string[]` - Import themes from JSON
- `clearAllThemes(): number` - Clear all themes
- `generateThemeId(): string` - Generate a unique theme ID
- `validateTheme(theme: any): { valid: boolean; error?: string }` - Validate a theme

### useThemeManager Hook

Returns an object with the same methods as ThemeManager for use in React components.

### Component Exports

```typescript
import { ThemeEditorDialog } from 'mdtopdf/components'

<ThemeEditorDialog
  open={isOpen}
  onOpenChange={setIsOpen}
  themeToEdit={theme || null}
  onSave={(savedTheme) => console.log('Theme saved:', savedTheme)}
/>
```

## Examples

### Example 1: Academic Theme

```typescript
const academicTheme = {
  id: ThemeManager.generateThemeId(),
  name: 'Academic Paper',
  description: 'Formal academic paper style',
  colors: {
    pageBackground: '#ffffff',
    textColor: '#000000',
    linkColor: '#000080',
    codeBackground: '#f5f5f5',
    codeBlockBackground: '#f0f0f0',
    blockquoteBorderColor: '#666666',
    tableBorderColor: '#000000',
    tableHeaderBackground: '#e0e0e0',
    horizontalRuleColor: '#000000',
  },
  typography: {
    fontFamily: 'Times-Roman',
    fontSize: 12,
    lineHeight: 2,
    heading1Size: 22,
    heading2Size: 18,
    heading3Size: 16,
    heading4Size: 14,
    heading5Size: 12,
    heading6Size: 12,
    codeFontFamily: 'Courier',
    codeFontSize: 10,
    codeBlockFontSize: 9,
  },
  spacing: {
    heading1MarginTop: 30,
    heading1MarginBottom: 20,
    heading2MarginTop: 24,
    heading2MarginBottom: 16,
    heading3MarginTop: 18,
    heading3MarginBottom: 12,
    paragraphMarginBottom: 12,
    listMarginBottom: 12,
    listMarginLeft: 30,
    blockquoteMarginLeft: 30,
    blockquotePaddingLeft: 15,
    codeBlockPadding: 12,
  },
}

ThemeManager.saveTheme(academicTheme)
```

### Example 2: Dark Theme

```typescript
const darkTheme = {
  id: ThemeManager.generateThemeId(),
  name: 'Dark Mode',
  description: 'High contrast dark theme',
  colors: {
    pageBackground: '#1a1a1a',
    textColor: '#e0e0e0',
    heading1Color: '#60a5fa',
    heading2Color: '#93c5fd',
    heading3Color: '#bfdbfe',
    linkColor: '#3b82f6',
    codeBackground: '#2d2d2d',
    codeTextColor: '#f87171',
    codeBlockBackground: '#0f172a',
    codeBlockTextColor: '#e2e8f0',
    blockquoteBackground: '#1e293b',
    blockquoteTextColor: '#cbd5e1',
    blockquoteBorderColor: '#3b82f6',
    tableBorderColor: '#374151',
    tableHeaderBackground: '#1f2937',
    horizontalRuleColor: '#374151',
  },
  typography: {
    fontFamily: 'Helvetica',
    fontSize: 11,
    lineHeight: 1.6,
    heading1Size: 24,
    heading2Size: 20,
    heading3Size: 16,
    heading4Size: 14,
    heading5Size: 12,
    heading6Size: 11,
    codeFontFamily: 'Courier',
    codeFontSize: 10,
    codeBlockFontSize: 9,
  },
  spacing: {
    heading1MarginTop: 24,
    heading1MarginBottom: 12,
    heading2MarginTop: 20,
    heading2MarginBottom: 10,
    heading3MarginTop: 16,
    heading3MarginBottom: 8,
    paragraphMarginBottom: 10,
    listMarginBottom: 10,
    listMarginLeft: 20,
    blockquoteMarginLeft: 20,
    blockquotePaddingLeft: 15,
    codeBlockPadding: 10,
  },
}

ThemeManager.saveTheme(darkTheme)
```

### Example 3: Exporting Themes for Distribution

```typescript
// Export all themes to share with team
const themesJson = ThemeManager.exportThemes()

// Save to file (in a Node.js environment)
import fs from 'fs'
fs.writeFileSync('company-themes.json', themesJson)

// Or download in browser
const blob = new Blob([themesJson], { type: 'application/json' })
const url = URL.createObjectURL(blob)
const a = document.createElement('a')
a.href = url
a.download = 'themes.json'
a.click()
URL.revokeObjectURL(url)

// Later, import the themes
const importedThemes = fs.readFileSync('company-themes.json', 'utf-8')
ThemeManager.importThemes(importedThemes)
```

## Font Support

PDF fonts are limited to standard PDF base fonts. Available options:

- **Helvetica** - Sans-serif font (default)
- **Times-Roman** - Serif font for formal documents
- **Courier** - Monospace font for code

**Note**: Bold and italic styles are applied automatically by the PDF renderer. Do not use font variants like "Helvetica-Bold" or "Times-Italic" as font family names - use the base font name and let the renderer apply styles.

## Tips for Creating Themes

1. **Start with a template** - Duplicate an existing theme or use DEFAULT_THEME_TEMPLATE
2. **Test thoroughly** - Generate sample PDFs with various markdown features
3. **Consider readability** - Ensure sufficient contrast between text and background
4. **Mind the spacing** - Proper margins improve document flow
5. **Use consistent colors** - Create a cohesive color palette
6. **Export for backup** - Save your themes as JSON files

## Troubleshooting

### Themes not saving

- Check browser localStorage is enabled
- Verify you're not in incognito/private mode
- Check browser console for errors

### Theme not applying

- Ensure the theme ID is correct
- Verify the theme exists in localStorage
- Check for validation errors

### Import fails

- Verify JSON format is valid
- Ensure theme objects have required fields
- Check for duplicate IDs if not using overwrite

## Contributing

Want to share your custom themes? Consider:

1. Creating a theme pack JSON file
2. Submitting it to the repository
3. Adding examples to this documentation

## License

The custom theme system is part of the Markdown to PDF Converter and follows the same MIT license.

