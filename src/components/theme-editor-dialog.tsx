"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ThemeManager } from "@/lib/theme-manager"
import { DEFAULT_THEME_TEMPLATE } from "@/lib/theme-types"
import type { CustomTheme } from "@/lib/theme-types"

interface ThemeEditorDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  themeToEdit?: CustomTheme | null
  onSave?: (theme: CustomTheme) => void
}

export function ThemeEditorDialog({
  open,
  onOpenChange,
  themeToEdit,
  onSave,
}: ThemeEditorDialogProps) {
  const [theme, setTheme] = useState<Omit<CustomTheme, 'createdAt' | 'updatedAt'>>(() => ({
    ...DEFAULT_THEME_TEMPLATE,
    id: ThemeManager.generateThemeId(),
  }))

  useEffect(() => {
    if (themeToEdit) {
      setTheme(themeToEdit)
    } else {
      setTheme({
        ...DEFAULT_THEME_TEMPLATE,
        id: ThemeManager.generateThemeId(),
      })
    }
  }, [themeToEdit, open])

  const handleSave = () => {
    try {
      const savedTheme = ThemeManager.saveTheme(theme)
      onSave?.(savedTheme)
      onOpenChange(false)
    } catch (error) {
      console.error('Failed to save theme:', error)
    }
  }

  const updateTheme = (path: string, value: any) => {
    setTheme(prev => {
      const keys = path.split('.')
      const updated = { ...prev }
      let current: any = updated
      
      for (let i = 0; i < keys.length - 1; i++) {
        current[keys[i]] = { ...current[keys[i]] }
        current = current[keys[i]]
      }
      
      current[keys[keys.length - 1]] = value
      return updated
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {themeToEdit ? 'Edit Theme' : 'Create Custom Theme'}
          </DialogTitle>
          <DialogDescription>
            Customize colors, typography, and spacing for your PDF theme
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Basic Info */}
          <div className="space-y-2">
            <Label htmlFor="theme-name">Theme Name</Label>
            <input
              id="theme-name"
              type="text"
              value={theme.name}
              onChange={(e) => updateTheme('name', e.target.value)}
              className="w-full px-3 py-2 border rounded-md bg-background"
              placeholder="My Custom Theme"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="theme-description">Description (optional)</Label>
            <input
              id="theme-description"
              type="text"
              value={theme.description || ''}
              onChange={(e) => updateTheme('description', e.target.value)}
              className="w-full px-3 py-2 border rounded-md bg-background"
              placeholder="A beautiful theme for..."
            />
          </div>

          <Tabs defaultValue="colors" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="colors">Colors</TabsTrigger>
              <TabsTrigger value="typography">Typography</TabsTrigger>
              <TabsTrigger value="spacing">Spacing</TabsTrigger>
            </TabsList>

            {/* Colors Tab */}
            <TabsContent value="colors" className="space-y-3 mt-4">
              <div className="grid grid-cols-2 gap-3">
                <ColorInput
                  label="Page Background"
                  value={theme.colors.pageBackground}
                  onChange={(v) => updateTheme('colors.pageBackground', v)}
                />
                <ColorInput
                  label="Text Color"
                  value={theme.colors.textColor}
                  onChange={(v) => updateTheme('colors.textColor', v)}
                />
                <ColorInput
                  label="Heading 1 Color"
                  value={theme.colors.heading1Color || ''}
                  onChange={(v) => updateTheme('colors.heading1Color', v)}
                />
                <ColorInput
                  label="Heading 2 Color"
                  value={theme.colors.heading2Color || ''}
                  onChange={(v) => updateTheme('colors.heading2Color', v)}
                />
                <ColorInput
                  label="Link Color"
                  value={theme.colors.linkColor}
                  onChange={(v) => updateTheme('colors.linkColor', v)}
                />
                <ColorInput
                  label="Code Background"
                  value={theme.colors.codeBackground}
                  onChange={(v) => updateTheme('colors.codeBackground', v)}
                />
                <ColorInput
                  label="Code Block Background"
                  value={theme.colors.codeBlockBackground}
                  onChange={(v) => updateTheme('colors.codeBlockBackground', v)}
                />
                <ColorInput
                  label="Blockquote Border"
                  value={theme.colors.blockquoteBorderColor}
                  onChange={(v) => updateTheme('colors.blockquoteBorderColor', v)}
                />
              </div>
            </TabsContent>

            {/* Typography Tab */}
            <TabsContent value="typography" className="space-y-3 mt-4">
              <div className="grid grid-cols-2 gap-3">
                <SelectInput
                  label="Font Family"
                  value={theme.typography.fontFamily}
                  onChange={(v) => updateTheme('typography.fontFamily', v)}
                  options={[
                    { value: 'Helvetica', label: 'Helvetica (Sans-serif)' },
                    { value: 'Times-Roman', label: 'Times Roman (Serif)' },
                    { value: 'Courier', label: 'Courier (Monospace)' },
                  ]}
                />
                <NumberInput
                  label="Font Size (pt)"
                  value={theme.typography.fontSize}
                  onChange={(v) => updateTheme('typography.fontSize', v)}
                  min={8}
                  max={24}
                />
                <NumberInput
                  label="Line Height"
                  value={theme.typography.lineHeight}
                  onChange={(v) => updateTheme('typography.lineHeight', v)}
                  min={1}
                  max={3}
                  step={0.1}
                />
                <NumberInput
                  label="H1 Size (pt)"
                  value={theme.typography.heading1Size}
                  onChange={(v) => updateTheme('typography.heading1Size', v)}
                  min={12}
                  max={48}
                />
                <NumberInput
                  label="H2 Size (pt)"
                  value={theme.typography.heading2Size}
                  onChange={(v) => updateTheme('typography.heading2Size', v)}
                  min={12}
                  max={36}
                />
                <NumberInput
                  label="H3 Size (pt)"
                  value={theme.typography.heading3Size}
                  onChange={(v) => updateTheme('typography.heading3Size', v)}
                  min={10}
                  max={28}
                />
                <SelectInput
                  label="Code Font Family"
                  value={theme.typography.codeFontFamily}
                  onChange={(v) => updateTheme('typography.codeFontFamily', v)}
                  options={[
                    { value: 'Courier', label: 'Courier (Monospace)' },
                    { value: 'Helvetica', label: 'Helvetica (Sans-serif)' },
                    { value: 'Times-Roman', label: 'Times Roman (Serif)' },
                  ]}
                />
                <NumberInput
                  label="Code Font Size (pt)"
                  value={theme.typography.codeFontSize}
                  onChange={(v) => updateTheme('typography.codeFontSize', v)}
                  min={6}
                  max={16}
                />
              </div>
            </TabsContent>

            {/* Spacing Tab */}
            <TabsContent value="spacing" className="space-y-3 mt-4">
              <div className="grid grid-cols-2 gap-3">
                <NumberInput
                  label="H1 Margin Top (pt)"
                  value={theme.spacing.heading1MarginTop}
                  onChange={(v) => updateTheme('spacing.heading1MarginTop', v)}
                  min={0}
                  max={50}
                />
                <NumberInput
                  label="H1 Margin Bottom (pt)"
                  value={theme.spacing.heading1MarginBottom}
                  onChange={(v) => updateTheme('spacing.heading1MarginBottom', v)}
                  min={0}
                  max={50}
                />
                <NumberInput
                  label="H2 Margin Top (pt)"
                  value={theme.spacing.heading2MarginTop}
                  onChange={(v) => updateTheme('spacing.heading2MarginTop', v)}
                  min={0}
                  max={40}
                />
                <NumberInput
                  label="H2 Margin Bottom (pt)"
                  value={theme.spacing.heading2MarginBottom}
                  onChange={(v) => updateTheme('spacing.heading2MarginBottom', v)}
                  min={0}
                  max={40}
                />
                <NumberInput
                  label="Paragraph Margin Bottom (pt)"
                  value={theme.spacing.paragraphMarginBottom}
                  onChange={(v) => updateTheme('spacing.paragraphMarginBottom', v)}
                  min={0}
                  max={30}
                />
                <NumberInput
                  label="List Margin Left (pt)"
                  value={theme.spacing.listMarginLeft}
                  onChange={(v) => updateTheme('spacing.listMarginLeft', v)}
                  min={0}
                  max={50}
                />
                <NumberInput
                  label="Blockquote Margin Left (pt)"
                  value={theme.spacing.blockquoteMarginLeft}
                  onChange={(v) => updateTheme('spacing.blockquoteMarginLeft', v)}
                  min={0}
                  max={50}
                />
                <NumberInput
                  label="Code Block Padding (pt)"
                  value={theme.spacing.codeBlockPadding}
                  onChange={(v) => updateTheme('spacing.codeBlockPadding', v)}
                  min={0}
                  max={30}
                />
              </div>
            </TabsContent>
          </Tabs>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} className="bg-cyan-500 hover:bg-cyan-600">
            {themeToEdit ? 'Save Changes' : 'Create Theme'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// Helper Components
function ColorInput({ label, value, onChange }: { 
  label: string
  value: string
  onChange: (value: string) => void 
}) {
  return (
    <div className="space-y-1">
      <Label className="text-xs">{label}</Label>
      <div className="flex gap-2">
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-9 w-12 rounded border cursor-pointer"
        />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 px-2 py-1 text-xs border rounded-md bg-background"
          placeholder="#000000"
        />
      </div>
    </div>
  )
}

function NumberInput({ 
  label, 
  value, 
  onChange,
  min = 0,
  max = 100,
  step = 1,
}: { 
  label: string
  value: number
  onChange: (value: number) => void
  min?: number
  max?: number
  step?: number
}) {
  return (
    <div className="space-y-1">
      <Label className="text-xs">{label}</Label>
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
        min={min}
        max={max}
        step={step}
        className="w-full px-2 py-1 text-xs border rounded-md bg-background"
      />
    </div>
  )
}

function TextInput({ 
  label, 
  value, 
  onChange,
  placeholder,
}: { 
  label: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
}) {
  return (
    <div className="space-y-1">
      <Label className="text-xs">{label}</Label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-2 py-1 text-xs border rounded-md bg-background"
      />
    </div>
  )
}

function SelectInput({
  label,
  value,
  onChange,
  options,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  options: { value: string; label: string }[]
}) {
  return (
    <div className="space-y-1">
      <Label className="text-xs">{label}</Label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-2 py-1 text-xs border rounded-md bg-background cursor-pointer"
      >
        {options.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  )
}

