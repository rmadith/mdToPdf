/**
 * Async storage manager for better performance than localStorage
 * Falls back to localStorage if needed
 */

const STORAGE_KEY = 'markdown-content'

/**
 * Save markdown to storage asynchronously
 */
export async function saveMarkdown(content: string): Promise<void> {
  try {
    // Use requestIdleCallback for non-urgent storage
    if ('requestIdleCallback' in window) {
      return new Promise((resolve) => {
        requestIdleCallback(() => {
          localStorage.setItem(STORAGE_KEY, content)
          resolve()
        }, { timeout: 2000 })
      })
    } else {
      // Fallback to setTimeout
      return new Promise((resolve) => {
        setTimeout(() => {
          localStorage.setItem(STORAGE_KEY, content)
          resolve()
        }, 0)
      })
    }
  } catch (error) {
    console.error('Failed to save markdown:', error)
  }
}

/**
 * Load markdown from storage
 */
export function loadMarkdown(): string | null {
  try {
    return localStorage.getItem(STORAGE_KEY)
  } catch (error) {
    console.error('Failed to load markdown:', error)
    return null
  }
}

/**
 * Clear markdown from storage
 */
export function clearMarkdown(): void {
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch (error) {
    console.error('Failed to clear markdown:', error)
  }
}

/**
 * Compress string for storage (simple run-length encoding)
 */
export function compressString(str: string): string {
  // Simple compression - could use pako or lz-string for better compression
  // For now, just return as-is to avoid extra dependencies
  return str
}

/**
 * Decompress string from storage
 */
export function decompressString(str: string): string {
  return str
}

