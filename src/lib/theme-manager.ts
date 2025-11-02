import type { CustomTheme } from './theme-types'

const THEME_STORAGE_KEY = 'mdtopdf_custom_themes'

/**
 * Theme Manager for handling custom theme storage and retrieval
 */
export class ThemeManager {
  /**
   * Get all custom themes from localStorage
   * @returns Array of custom themes
   */
  static getCustomThemes(): CustomTheme[] {
    if (typeof window === 'undefined') return []
    
    try {
      const stored = localStorage.getItem(THEME_STORAGE_KEY)
      if (!stored) return []
      
      const themes = JSON.parse(stored) as CustomTheme[]
      return themes.sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0))
    } catch (error) {
      console.error('Failed to load custom themes:', error)
      return []
    }
  }

  /**
   * Get a specific theme by ID
   * @param id - Theme ID
   * @returns Theme or null if not found
   */
  static getTheme(id: string): CustomTheme | null {
    const themes = this.getCustomThemes()
    return themes.find(theme => theme.id === id) || null
  }

  /**
   * Save a custom theme
   * @param theme - Theme to save
   * @returns Saved theme with timestamps
   */
  static saveTheme(theme: Omit<CustomTheme, 'createdAt' | 'updatedAt'>): CustomTheme {
    if (typeof window === 'undefined') {
      throw new Error('Cannot save themes on server side')
    }

    const themes = this.getCustomThemes()
    const now = Date.now()
    
    const existingIndex = themes.findIndex(t => t.id === theme.id)
    
    let savedTheme: CustomTheme
    
    if (existingIndex >= 0) {
      // Update existing theme
      savedTheme = {
        ...theme,
        createdAt: themes[existingIndex].createdAt || now,
        updatedAt: now,
      }
      themes[existingIndex] = savedTheme
    } else {
      // Create new theme
      savedTheme = {
        ...theme,
        createdAt: now,
        updatedAt: now,
      }
      themes.push(savedTheme)
    }
    
    try {
      localStorage.setItem(THEME_STORAGE_KEY, JSON.stringify(themes))
      return savedTheme
    } catch (error) {
      console.error('Failed to save theme:', error)
      throw new Error('Failed to save theme to localStorage')
    }
  }

  /**
   * Delete a custom theme
   * @param id - Theme ID to delete
   * @returns True if deleted, false if not found
   */
  static deleteTheme(id: string): boolean {
    if (typeof window === 'undefined') return false

    const themes = this.getCustomThemes()
    const filteredThemes = themes.filter(theme => theme.id !== id)
    
    if (filteredThemes.length === themes.length) {
      return false // Theme not found
    }
    
    try {
      localStorage.setItem(THEME_STORAGE_KEY, JSON.stringify(filteredThemes))
      return true
    } catch (error) {
      console.error('Failed to delete theme:', error)
      return false
    }
  }

  /**
   * Duplicate a theme
   * @param id - Theme ID to duplicate
   * @param newName - Name for the duplicated theme
   * @returns Duplicated theme or null if original not found
   */
  static duplicateTheme(id: string, newName?: string): CustomTheme | null {
    const theme = this.getTheme(id)
    if (!theme) return null
    
    const duplicatedTheme = {
      ...theme,
      id: `custom-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: newName || `${theme.name} (Copy)`,
      isBuiltIn: false,
    }
    
    return this.saveTheme(duplicatedTheme)
  }

  /**
   * Export themes as JSON
   * @param themeIds - Optional array of theme IDs to export. If not provided, exports all themes
   * @returns JSON string of themes
   */
  static exportThemes(themeIds?: string[]): string {
    const themes = this.getCustomThemes()
    const themesToExport = themeIds
      ? themes.filter(theme => themeIds.includes(theme.id))
      : themes
    
    return JSON.stringify(themesToExport, null, 2)
  }

  /**
   * Import themes from JSON
   * @param json - JSON string of themes
   * @param overwrite - Whether to overwrite existing themes with same IDs
   * @returns Array of imported theme IDs
   */
  static importThemes(json: string, overwrite = false): string[] {
    try {
      const importedThemes = JSON.parse(json) as CustomTheme[]
      
      if (!Array.isArray(importedThemes)) {
        throw new Error('Invalid theme format: expected array')
      }
      
      const themes = this.getCustomThemes()
      const importedIds: string[] = []
      
      importedThemes.forEach(theme => {
        const exists = themes.some(t => t.id === theme.id)
        
        if (!exists || overwrite) {
          this.saveTheme(theme)
          importedIds.push(theme.id)
        }
      })
      
      return importedIds
    } catch (error) {
      console.error('Failed to import themes:', error)
      throw new Error('Failed to import themes: invalid JSON format')
    }
  }

  /**
   * Clear all custom themes
   * @returns Number of themes cleared
   */
  static clearAllThemes(): number {
    if (typeof window === 'undefined') return 0

    const themes = this.getCustomThemes()
    const count = themes.length
    
    try {
      localStorage.removeItem(THEME_STORAGE_KEY)
      return count
    } catch (error) {
      console.error('Failed to clear themes:', error)
      return 0
    }
  }

  /**
   * Generate a unique theme ID
   * @returns Unique theme ID
   */
  static generateThemeId(): string {
    return `custom-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  }

  /**
   * Validate a theme object
   * @param theme - Theme to validate
   * @returns True if valid, error message if invalid
   */
  static validateTheme(theme: any): { valid: boolean; error?: string } {
    if (!theme || typeof theme !== 'object') {
      return { valid: false, error: 'Theme must be an object' }
    }

    if (!theme.id || typeof theme.id !== 'string') {
      return { valid: false, error: 'Theme must have a valid ID' }
    }

    if (!theme.name || typeof theme.name !== 'string') {
      return { valid: false, error: 'Theme must have a valid name' }
    }

    if (!theme.colors || typeof theme.colors !== 'object') {
      return { valid: false, error: 'Theme must have colors configuration' }
    }

    if (!theme.typography || typeof theme.typography !== 'object') {
      return { valid: false, error: 'Theme must have typography configuration' }
    }

    if (!theme.spacing || typeof theme.spacing !== 'object') {
      return { valid: false, error: 'Theme must have spacing configuration' }
    }

    return { valid: true }
  }
}

/**
 * Custom hook for managing themes (React)
 */
export function useThemeManager() {
  const getCustomThemes = () => ThemeManager.getCustomThemes()
  const getTheme = (id: string) => ThemeManager.getTheme(id)
  const saveTheme = (theme: Omit<CustomTheme, 'createdAt' | 'updatedAt'>) => 
    ThemeManager.saveTheme(theme)
  const deleteTheme = (id: string) => ThemeManager.deleteTheme(id)
  const duplicateTheme = (id: string, newName?: string) => 
    ThemeManager.duplicateTheme(id, newName)
  const exportThemes = (themeIds?: string[]) => ThemeManager.exportThemes(themeIds)
  const importThemes = (json: string, overwrite?: boolean) => 
    ThemeManager.importThemes(json, overwrite)

  return {
    getCustomThemes,
    getTheme,
    saveTheme,
    deleteTheme,
    duplicateTheme,
    exportThemes,
    importThemes,
  }
}

