/**
 * Utility functions for dynamically loading heavy dependencies
 */

let katexCSSLoaded = false;

/**
 * Dynamically load KaTeX CSS only when needed
 */
export function loadKatexCSS(): void {
  if (katexCSSLoaded) return;
  
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = 'https://cdn.jsdelivr.net/npm/katex@0.16.25/dist/katex.min.css';
  link.crossOrigin = 'anonymous';
  document.head.appendChild(link);
  
  katexCSSLoaded = true;
}

/**
 * Check if markdown contains math syntax
 */
export function containsMath(markdown: string): boolean {
  return /\$\$[\s\S]*?\$\$|\$[^\$]+\$/.test(markdown);
}

/**
 * Check if markdown contains code blocks
 */
export function containsCodeBlocks(markdown: string): boolean {
  return /```[\s\S]*?```/.test(markdown);
}

/**
 * Preload critical chunks during idle time
 */
export function preloadCriticalChunks(): void {
  // This will be called after initial render to preload commonly used features
  if (typeof window !== 'undefined') {
    // Preload markdown parser during idle time
    if ('requestIdleCallback' in window) {
      requestIdleCallback(() => {
        import('@/lib/markdown').catch(() => {});
      }, { timeout: 2000 });
    } else {
      setTimeout(() => {
        import('@/lib/markdown').catch(() => {});
      }, 1000);
    }
  }
}

