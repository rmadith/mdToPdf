/**
 * Utility functions for dynamically loading heavy dependencies
 */

let katexCSSLoaded = false;
let mermaidInitialized = false;

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
 * Initialize and render mermaid diagrams
 */
export async function initializeMermaid(): Promise<void> {
  if (typeof window === 'undefined') return;
  
  try {
    const mermaid = (await import('mermaid')).default;
    
    if (!mermaidInitialized) {
      mermaid.initialize({
        startOnLoad: false,
        theme: 'dark',
        themeVariables: {
          primaryColor: '#22d3ee',
          primaryTextColor: '#fff',
          primaryBorderColor: '#0891b2',
          lineColor: '#06b6d4',
          secondaryColor: '#06b6d4',
          tertiaryColor: '#164e63',
          background: '#0b1020',
          mainBkg: '#0f172a',
          secondBkg: '#1e293b',
          textColor: '#e2e8f0',
          fontSize: '14px',
        },
        securityLevel: 'loose',
        fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
      });
      mermaidInitialized = true;
    }
    
    // Find all mermaid code blocks
    const mermaidElements = document.querySelectorAll('code.language-mermaid, pre.language-mermaid code');
    
    for (let i = 0; i < mermaidElements.length; i++) {
      const element = mermaidElements[i] as HTMLElement;
      const code = element.textContent || '';
      const id = `mermaid-${Date.now()}-${i}`;
      
      try {
        const { svg } = await mermaid.render(id, code);
        
        // Replace the code block with the rendered SVG
        const wrapper = document.createElement('div');
        wrapper.className = 'mermaid-diagram';
        wrapper.innerHTML = svg;
        
        const pre = element.closest('pre');
        if (pre && pre.parentNode) {
          pre.parentNode.replaceChild(wrapper, pre);
        } else if (element.parentNode) {
          element.parentNode.replaceChild(wrapper, element);
        }
      } catch (error) {
        console.error('Mermaid rendering error:', error);
        // Keep the original code block on error
      }
    }
  } catch (error) {
    console.error('Failed to initialize mermaid:', error);
  }
}

/**
 * Check if markdown contains math syntax
 */
export function containsMath(markdown: string): boolean {
  return /\$\$[\s\S]*?\$\$|\$[^\$]+\$/.test(markdown);
}

/**
 * Check if markdown contains mermaid diagrams
 */
export function containsMermaid(markdown: string): boolean {
  return /```mermaid[\s\S]*?```/.test(markdown);
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

