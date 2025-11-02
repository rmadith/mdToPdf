/**
 * Mermaid diagram renderer for PDF generation
 */

interface MermaidDiagram {
  id: string
  code: string
  svg: string
}

/**
 * Extract and render all mermaid diagrams from markdown
 * @param markdown - Raw markdown string
 * @returns Array of rendered mermaid diagrams with their IDs
 */
export async function extractAndRenderMermaidDiagrams(
  markdown: string
): Promise<Map<string, string>> {
  if (typeof window === 'undefined') {
    return new Map()
  }

  const diagrams = new Map<string, string>()
  
  try {
    const mermaid = (await import('mermaid')).default
    
    // Initialize mermaid if not already done
    mermaid.initialize({
      startOnLoad: false,
      theme: 'neutral',
      themeVariables: {
        primaryColor: '#e8f4f8',
        primaryTextColor: '#1a1a1a',
        primaryBorderColor: '#2c5282',
        lineColor: '#2c5282',
        secondaryColor: '#f7fafc',
        tertiaryColor: '#fff',
        background: '#ffffff',
        mainBkg: '#ffffff',
        secondBkg: '#f7fafc',
        textColor: '#1a1a1a',
        fontSize: '18px',
        fontFamily: 'Arial, sans-serif',
      },
      securityLevel: 'loose',
      fontFamily: 'Arial, sans-serif',
      flowchart: {
        padding: 20,
        nodeSpacing: 80,
        rankSpacing: 80,
      },
      sequence: {
        diagramMarginX: 50,
        diagramMarginY: 30,
        actorMargin: 80,
        width: 180,
        height: 65,
        boxMargin: 15,
        boxTextMargin: 10,
        noteMargin: 15,
        messageMargin: 50,
      },
    })

    // Find all mermaid code blocks
    const mermaidRegex = /```mermaid\n([\s\S]*?)```/g
    let match
    let index = 0

    while ((match = mermaidRegex.exec(markdown)) !== null) {
      const code = match[1].trim()
      const id = `mermaid-pdf-${Date.now()}-${index}`
      
      try {
        const { svg } = await mermaid.render(id, code)
        diagrams.set(match[0], svg)
        index++
      } catch (error) {
        console.error('Failed to render mermaid diagram:', error)
        // Keep the code block as-is on error
      }
    }
  } catch (error) {
    console.error('Failed to load mermaid:', error)
  }

  return diagrams
}

/**
 * Replace mermaid code blocks in markdown with placeholders
 * @param markdown - Raw markdown string
 * @param diagrams - Map of rendered diagrams
 * @returns Markdown with placeholders
 */
export function replaceMermaidWithPlaceholders(
  markdown: string,
  diagrams: Map<string, string>
): string {
  let result = markdown
  let index = 0
  
  for (const [codeBlock] of diagrams) {
    result = result.replace(codeBlock, `[MERMAID_DIAGRAM_${index}]`)
    index++
  }
  
  return result
}

/**
 * Convert SVG string to PNG data URI for PDF embedding
 * @param svg - SVG string
 * @returns Promise that resolves to PNG data URI
 */
export async function svgToPngDataUri(svg: string): Promise<string> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined') {
      reject(new Error('Canvas not available in server environment'))
      return
    }

    try {
      // Create a temporary div to parse SVG dimensions
      const div = document.createElement('div')
      div.innerHTML = svg
      const svgElement = div.querySelector('svg')
      
      if (!svgElement) {
        reject(new Error('Invalid SVG'))
        return
      }

      // Get or set dimensions
      let width = parseInt(svgElement.getAttribute('width') || '800', 10)
      let height = parseInt(svgElement.getAttribute('height') || '600', 10)
      
      // Ensure reasonable minimum size
      if (width < 400) width = 600
      if (height < 300) height = 400
      
      // Ensure viewBox is set
      if (!svgElement.getAttribute('viewBox')) {
        svgElement.setAttribute('viewBox', `0 0 ${width} ${height}`)
      }
      
      // Set explicit dimensions on SVG for better rendering
      svgElement.setAttribute('width', width.toString())
      svgElement.setAttribute('height', height.toString())

      // Encode SVG to data URI directly (avoid CORS issues)
      const svgString = new XMLSerializer().serializeToString(svgElement)
      const encodedSvg = btoa(unescape(encodeURIComponent(svgString)))
      const svgDataUri = `data:image/svg+xml;base64,${encodedSvg}`

      // Create image
      const img = new Image()
      img.width = width
      img.height = height

      img.onload = () => {
        // Create canvas with 3x scale for high quality
        const scale = 3
        const canvas = document.createElement('canvas')
        canvas.width = width * scale
        canvas.height = height * scale
        
        const ctx = canvas.getContext('2d')
        if (!ctx) {
          reject(new Error('Could not get canvas context'))
          return
        }

        // Fill white background
        ctx.fillStyle = 'white'
        ctx.fillRect(0, 0, canvas.width, canvas.height)
        
        // Draw image scaled
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
        
        // Convert to PNG data URI
        try {
          const pngDataUri = canvas.toDataURL('image/png')
          resolve(pngDataUri)
        } catch (error) {
          reject(new Error('Failed to convert canvas to data URL'))
        }
      }

      img.onerror = () => {
        reject(new Error('Failed to load SVG image'))
      }

      img.src = svgDataUri
    } catch (error) {
      reject(error)
    }
  })
}

/**
 * Get mermaid diagrams as PNG data URIs
 * @param diagrams - Map of rendered diagrams
 * @returns Promise that resolves to array of PNG data URIs
 */
export async function getMermaidDataUris(diagrams: Map<string, string>): Promise<string[]> {
  const uris: string[] = []
  
  for (const [, svg] of diagrams) {
    try {
      const pngUri = await svgToPngDataUri(svg)
      uris.push(pngUri)
    } catch (error) {
      console.error('Failed to convert SVG to PNG:', error)
      // Skip this diagram on error
    }
  }
  
  return uris
}

