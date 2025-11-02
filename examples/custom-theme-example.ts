/**
 * Example: Using Custom Themes with Markdown to PDF Converter
 * 
 * This example demonstrates how to create, manage, and use custom themes
 * for PDF generation in the Markdown to PDF Converter.
 */

import {
  parseMarkdown,
  generatePDF,
  downloadPDF,
  ThemeManager,
  DEFAULT_THEME_TEMPLATE,
  type CustomTheme,
} from '../src/lib'

// Example 1: Creating a Custom Theme
// =====================================

async function createCustomTheme() {
  // Create a custom theme with your brand colors
  const brandTheme: Omit<CustomTheme, 'createdAt' | 'updatedAt'> = {
    id: ThemeManager.generateThemeId(),
    name: 'Corporate Brand',
    description: 'Company branded theme with corporate colors',
    colors: {
      pageBackground: '#ffffff',
      textColor: '#1a1a1a',
      heading1Color: '#003d82', // Brand blue
      heading2Color: '#0066cc',
      heading3Color: '#3399ff',
      heading4Color: '#66b3ff',
      linkColor: '#003d82',
      codeBackground: '#f5f8fa',
      codeTextColor: '#d63384',
      codeBlockBackground: '#1e2937',
      codeBlockTextColor: '#e5e7eb',
      blockquoteBackground: '#f0f4f8',
      blockquoteTextColor: '#4a5568',
      blockquoteBorderColor: '#0066cc',
      tableBorderColor: '#cbd5e0',
      tableHeaderBackground: '#edf2f7',
      horizontalRuleColor: '#cbd5e0',
    },
    typography: {
      fontFamily: 'Helvetica',
      fontSize: 11,
      lineHeight: 1.6,
      heading1Size: 26,
      heading2Size: 22,
      heading3Size: 18,
      heading4Size: 15,
      heading5Size: 13,
      heading6Size: 11,
      codeFontFamily: 'Courier',
      codeFontSize: 10,
      codeBlockFontSize: 9,
    },
    spacing: {
      heading1MarginTop: 28,
      heading1MarginBottom: 14,
      heading2MarginTop: 22,
      heading2MarginBottom: 12,
      heading3MarginTop: 18,
      heading3MarginBottom: 10,
      paragraphMarginBottom: 12,
      listMarginBottom: 12,
      listMarginLeft: 24,
      blockquoteMarginLeft: 24,
      blockquotePaddingLeft: 16,
      codeBlockPadding: 12,
    },
  }

  // Save the theme (client-side only, stored in localStorage)
  const savedTheme = ThemeManager.saveTheme(brandTheme)
  console.log('Theme saved:', savedTheme.id)
  
  return savedTheme
}

// Example 2: Generating PDF with Custom Theme
// =============================================

async function generatePDFWithCustomTheme(themeId: string) {
  const markdown = `
# Company Report

## Executive Summary

This report demonstrates our new **branded PDF template** using custom themes.

### Key Features

- Professional appearance
- Consistent branding
- Easy to maintain
- Fully customizable

### Code Example

\`\`\`typescript
const customTheme = ThemeManager.getTheme('my-theme-id')
const pdf = await generatePDF({
  markdown,
  stylePreset: customTheme.id,
})
\`\`\`

> This is a blockquote with our brand colors. It stands out while maintaining readability.

---

For more information, visit [our website](https://example.com).
`

  // Parse the markdown
  const parsed = await parseMarkdown(markdown, {
    gfm: true,
    math: true,
    syntaxHighlighting: true,
  })

  // Generate PDF with custom theme
  const pdf = await generatePDF({
    html: parsed.html,
    markdown,
    stylePreset: themeId, // Use custom theme ID
    pageSize: 'A4',
    orientation: 'portrait',
    margins: {
      top: 50,
      right: 50,
      bottom: 50,
      left: 50,
    },
    title: 'Company Report',
    author: 'Your Company',
    subject: 'Quarterly Report',
  })

  // Download the PDF
  downloadPDF(pdf.blob, 'company-report.pdf')
  
  console.log('PDF generated successfully!')
  console.log('Size:', (pdf.size / 1024).toFixed(2), 'KB')
  
  return pdf
}

// Example 3: Managing Multiple Themes
// =====================================

function manageThemes() {
  // Get all custom themes
  const allThemes = ThemeManager.getCustomThemes()
  console.log('Total custom themes:', allThemes.length)

  // Find a specific theme
  const myTheme = allThemes.find(t => t.name === 'Corporate Brand')
  
  if (myTheme) {
    console.log('Found theme:', myTheme.name)
    
    // Duplicate the theme for variations
    const darkVariant = ThemeManager.duplicateTheme(
      myTheme.id,
      'Corporate Brand (Dark)'
    )
    
    if (darkVariant) {
      // Modify the duplicated theme
      darkVariant.colors.pageBackground = '#1a1a1a'
      darkVariant.colors.textColor = '#e5e7eb'
      ThemeManager.saveTheme(darkVariant)
      console.log('Created dark variant:', darkVariant.id)
    }
  }
}

// Example 4: Import/Export Themes
// =================================

function exportThemes() {
  // Export all themes as JSON
  const themesJson = ThemeManager.exportThemes()
  
  // In browser environment:
  // Create a downloadable file
  const blob = new Blob([themesJson], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = 'company-themes.json'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
  
  console.log('Themes exported successfully!')
}

function importThemes(jsonString: string) {
  try {
    // Import themes from JSON
    const importedIds = ThemeManager.importThemes(jsonString, false)
    console.log('Imported themes:', importedIds)
    
    // Use overwrite = true to replace existing themes with same IDs
    // const importedIds = ThemeManager.importThemes(jsonString, true)
    
    return importedIds
  } catch (error) {
    console.error('Failed to import themes:', error)
    return []
  }
}

// Example 5: Theme Validation
// ============================

function validateCustomTheme(theme: any) {
  const validation = ThemeManager.validateTheme(theme)
  
  if (validation.valid) {
    console.log('Theme is valid!')
    return true
  } else {
    console.error('Theme validation failed:', validation.error)
    return false
  }
}

// Example 6: Using Default Template as Starting Point
// ====================================================

function createThemeFromTemplate() {
  // Start with the default template
  const customTheme = {
    ...DEFAULT_THEME_TEMPLATE,
    id: ThemeManager.generateThemeId(),
    name: 'My Custom Theme',
    description: 'Based on the default template',
  }
  
  // Customize specific properties
  customTheme.colors.heading1Color = '#ff0000'
  customTheme.colors.heading2Color = '#cc0000'
  customTheme.typography.heading1Size = 30
  
  // Save the theme
  const saved = ThemeManager.saveTheme(customTheme)
  console.log('Theme created from template:', saved.id)
  
  return saved
}

// Example 7: Complete Workflow
// ==============================

async function completeWorkflow() {
  console.log('Starting custom theme workflow...')
  
  // Step 1: Create a custom theme
  const theme = await createCustomTheme()
  
  // Step 2: Generate PDF with the theme
  await generatePDFWithCustomTheme(theme.id)
  
  // Step 3: Manage themes
  manageThemes()
  
  // Step 4: Export themes for backup/sharing
  exportThemes()
  
  console.log('Workflow completed!')
}

// Export functions for use in your application
export {
  createCustomTheme,
  generatePDFWithCustomTheme,
  manageThemes,
  exportThemes,
  importThemes,
  validateCustomTheme,
  createThemeFromTemplate,
  completeWorkflow,
}

// Example usage in a React component:
// ====================================

/*
import { useState } from 'react'
import { ThemeManager, generatePDF, parseMarkdown } from 'mdtopdf'
import { ThemeEditorDialog } from 'mdtopdf/components'

function MyComponent() {
  const [themes, setThemes] = useState([])
  const [isEditorOpen, setIsEditorOpen] = useState(false)
  
  useEffect(() => {
    // Load themes on mount
    setThemes(ThemeManager.getCustomThemes())
  }, [])
  
  const handleCreateTheme = () => {
    setIsEditorOpen(true)
  }
  
  const handleThemeSaved = (theme) => {
    setThemes(ThemeManager.getCustomThemes())
    // Generate PDF with the new theme
    generatePDFWithCustomTheme(theme.id)
  }
  
  return (
    <div>
      <button onClick={handleCreateTheme}>
        Create Custom Theme
      </button>
      
      <ThemeEditorDialog
        open={isEditorOpen}
        onOpenChange={setIsEditorOpen}
        onSave={handleThemeSaved}
      />
      
      <div>
        {themes.map(theme => (
          <div key={theme.id}>
            <h3>{theme.name}</h3>
            <p>{theme.description}</p>
            <button onClick={() => generatePDFWithCustomTheme(theme.id)}>
              Generate PDF
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
*/

