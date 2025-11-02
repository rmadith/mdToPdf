# Performance Optimization Guide

This document outlines the performance optimizations implemented in the Markdown to PDF Converter and how to measure and maintain them.

## Performance Targets

Based on the project requirements, we aim for the following metrics:

### Core Web Vitals
- **Largest Contentful Paint (LCP)**: < 2.5s
- **First Input Delay (FID)**: < 100ms
- **Cumulative Layout Shift (CLS)**: < 0.1

### Additional Metrics
- **First Contentful Paint (FCP)**: < 1.2s
- **Time to Interactive (TTI)**: < 2.5s
- **Total Bundle Size**: < 200KB gzipped
- **Markdown Parse Time**: < 100ms for 10KB file
- **PDF Generation Time**: < 500ms for standard document
- **Memory Usage**: < 50MB for typical session

### Lighthouse Score
- **Target**: 95+ performance score

## Implemented Optimizations

### 1. Code Splitting & Lazy Loading

```typescript
// Heavy dependencies are dynamically imported
const { parseMarkdown } = await import("@/lib/markdown")
```

Heavy libraries like KaTeX, Prism, and React PDF are loaded only when needed.

### 2. React Optimizations

- **Memoization**: `useMemo` and `useCallback` for expensive computations
- **React.memo**: Prevents unnecessary component re-renders
- **Debouncing**: 300ms for preview, 500ms for PDF generation

### 3. Next.js Optimizations

- **SWC Minification**: Faster JavaScript minification
- **Font Optimization**: Using `next/font` for Google Fonts
- **Image Optimization**: AVIF and WebP formats with automatic sizing
- **Package Import Optimization**: Experimental feature for better tree-shaking

### 4. Bundle Optimizations

- **Console Removal**: Production builds remove console statements
- **Compression**: Gzip enabled
- **Tree Shaking**: Unused code is eliminated

### 5. Rendering Optimizations

- **Server Components**: Used by default where possible
- **Client Components**: Only when needed for interactivity
- **Streaming**: React 18 Suspense for faster initial render

## Measuring Performance

### 1. Bundle Analysis

Run bundle analyzer to visualize bundle size:

```bash
npm run analyze
```

This generates an interactive visualization of your bundle composition.

### 2. Lighthouse Testing

Using Chrome DevTools:
1. Open the site in Chrome
2. Press F12 to open DevTools
3. Navigate to "Lighthouse" tab
4. Select "Performance" category
5. Click "Analyze page load"

Target: 95+ score

### 3. Chrome Performance Profiler

To identify slow renders:
1. Open Chrome DevTools (F12)
2. Go to "Performance" tab
3. Click record button
4. Interact with the app
5. Stop recording
6. Analyze the flame graph for bottlenecks

### 4. React DevTools Profiler

To optimize React renders:
1. Install React DevTools extension
2. Go to "Profiler" tab
3. Click record
4. Interact with components
5. Analyze render times and frequencies

### 5. Network Analysis

Check bundle sizes:
1. Open DevTools Network tab
2. Reload page
3. Check "Transferred" column for gzipped sizes
4. Ensure initial JS bundle < 200KB

### 6. Coverage Tool

Find unused code:
1. Open DevTools
2. Press Cmd+Shift+P (Mac) or Ctrl+Shift+P (Windows)
3. Type "Coverage"
4. Click "Start instrumenting coverage"
5. Interact with the app
6. Check for red bars (unused code)
7. Target: >80% code usage

### 7. Memory Profiler

Check for memory leaks:
1. Open DevTools Memory tab
2. Take heap snapshot
3. Interact with app for several minutes
4. Take another snapshot
5. Compare snapshots
6. Look for unexpected growth

## Performance Checklist

Before deploying:

- [ ] Run `npm run analyze` and verify bundle sizes
- [ ] Run Lighthouse and achieve 95+ score
- [ ] Test on slow 3G connection (DevTools Network throttling)
- [ ] Check Core Web Vitals in production
- [ ] Verify no memory leaks with long sessions
- [ ] Test with large markdown files (>50KB)
- [ ] Ensure responsive on mobile devices
- [ ] Verify no console errors/warnings

## Common Performance Issues

### Issue: Large Initial Bundle
**Solution**: Use dynamic imports for heavy dependencies

### Issue: Slow Markdown Parsing
**Solution**: Implement Web Workers for parsing (future enhancement)

### Issue: PDF Generation Lag
**Solution**: Increase debounce delay or add loading states

### Issue: Memory Leaks
**Solution**: Clean up blob URLs, event listeners, and timers

### Issue: Layout Shifts
**Solution**: Reserve space for dynamic content, use CSS aspect ratios

## Monitoring in Production

### Vercel Analytics
If deployed on Vercel, enable Analytics to track:
- Real User Monitoring (RUM)
- Core Web Vitals
- Performance insights

### Web Vitals Library
The app can be instrumented with `web-vitals`:

```typescript
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals'

getCLS(console.log)
getFID(console.log)
getFCP(console.log)
getLCP(console.log)
getTTFB(console.log)
```

## Future Optimizations

1. **Web Workers**: Offload markdown parsing to worker thread
2. **Virtual Scrolling**: For very long documents
3. **IndexedDB**: Cache parsed documents
4. **Service Worker**: Offline functionality
5. **Streaming PDF**: Generate PDF in chunks
6. **WebAssembly**: For intensive parsing operations

## Resources

- [Chrome DevTools Performance](https://developer.chrome.com/docs/devtools/performance/)
- [Next.js Performance](https://nextjs.org/docs/advanced-features/measuring-performance)
- [Web.dev Performance](https://web.dev/performance/)
- [React Performance](https://react.dev/learn/render-and-commit)

