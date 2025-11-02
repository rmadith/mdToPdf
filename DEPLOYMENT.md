# Deployment Guide

This guide explains how to deploy the Markdown to PDF Converter to Vercel.

## Prerequisites

- GitHub account
- Vercel account (free tier is sufficient)
- Git repository pushed to GitHub

## Automated Deployment (Recommended)

### 1. Push to GitHub

```bash
# Create a GitHub repository first, then:
git remote add origin https://github.com/yourusername/mdtopdf.git
git branch -M main
git push -u origin main
```

### 2. Deploy to Vercel

#### Option A: Vercel Dashboard

1. Go to [vercel.com](https://vercel.com)
2. Click "Add New Project"
3. Import your GitHub repository
4. Configure:
   - **Framework Preset**: Next.js
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`
   - **Install Command**: `npm install`
5. Click "Deploy"

#### Option B: Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy
vercel

# Deploy to production
vercel --prod
```

### 3. Configure Domain (Optional)

1. Go to your project settings in Vercel
2. Navigate to "Domains"
3. Add your custom domain
4. Update DNS records as instructed

## Manual Deployment

### Build Locally

```bash
# Install dependencies
npm install

# Build for production
npm run build

# Test production build
npm start
```

### Environment Variables

No environment variables are required for basic operation. If you add features that need them:

1. In Vercel Dashboard:
   - Go to Project Settings
   - Navigate to "Environment Variables"
   - Add your variables

2. Via CLI:
```bash
vercel env add VARIABLE_NAME
```

## Performance Optimization

### Vercel Configuration

The `vercel.json` file includes:
- Security headers
- Region configuration
- Build settings

### Edge Functions (Future)

For even better performance, consider Edge Functions:

```typescript
// app/api/convert/route.ts
export const runtime = 'edge'

export async function POST(request: Request) {
  // Your conversion logic
}
```

## Monitoring

### Vercel Analytics

Enable Vercel Analytics:

```bash
npm install @vercel/analytics
```

```typescript
// app/layout.tsx
import { Analytics } from '@vercel/analytics/react'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
```

### Speed Insights

```bash
npm install @vercel/speed-insights
```

```typescript
import { SpeedInsights } from '@vercel/speed-insights/next'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <SpeedInsights />
      </body>
    </html>
  )
}
```

## CI/CD Pipeline

Vercel automatically:
- Builds on every push to main
- Creates preview deployments for PRs
- Runs checks before deploying

### GitHub Actions (Optional)

Create `.github/workflows/ci.yml`:

```yaml
name: CI

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  build:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Lint
      run: npm run lint
    
    - name: Build
      run: npm run build
    
    - name: Test
      run: npm test
```

## Troubleshooting

### Build Failures

**Issue**: Build fails with memory error
```bash
# Solution: Increase Node memory
NODE_OPTIONS="--max-old-space-size=4096" npm run build
```

**Issue**: TypeScript errors
```bash
# Check for errors locally
npm run build
npx tsc --noEmit
```

**Issue**: Missing dependencies
```bash
# Clean install
rm -rf node_modules package-lock.json
npm install
```

### Runtime Issues

**Issue**: PDF generation fails
- Check browser compatibility
- Verify all dependencies are installed
- Check Vercel function timeout (default: 10s)

**Issue**: Slow performance
- Enable compression in `next.config.ts`
- Optimize images
- Check bundle size with `npm run analyze`

### Deployment Issues

**Issue**: "Deployment failed"
- Check Vercel logs
- Verify build succeeds locally
- Check for missing environment variables

**Issue**: "Function too large"
- Reduce bundle size
- Use dynamic imports
- Split into multiple API routes

## Post-Deployment Checklist

- [ ] Verify site loads correctly
- [ ] Test markdown conversion
- [ ] Test PDF generation
- [ ] Test PDF download
- [ ] Check mobile responsiveness
- [ ] Test dark mode
- [ ] Verify all templates work
- [ ] Run Lighthouse audit (target: 95+)
- [ ] Test on different browsers
- [ ] Check error handling
- [ ] Monitor initial traffic
- [ ] Set up alerts (optional)

## Rollback

If deployment fails:

```bash
# Via CLI
vercel rollback

# Via Dashboard
# Go to Deployments > Select previous version > Promote to Production
```

## Custom Domain Setup

### 1. Add Domain to Vercel

```bash
vercel domains add yourdomain.com
```

### 2. Configure DNS

Add these records to your DNS provider:

```
Type    Name    Value
A       @       76.76.21.21
CNAME   www     cname.vercel-dns.com
```

### 3. Wait for Propagation

DNS changes can take up to 48 hours to propagate globally.

### 4. Verify

```bash
dig yourdomain.com
```

## SSL Certificate

Vercel automatically provisions SSL certificates via Let's Encrypt.

## Scaling

Vercel automatically scales based on traffic. For high-traffic applications:

1. **Upgrade Plan**: Consider Pro or Enterprise
2. **Enable Caching**: Use appropriate cache headers
3. **CDN**: Vercel Edge Network distributes content globally
4. **Optimize**: Follow performance best practices

## Cost Estimation

### Hobby Plan (Free)
- 100GB bandwidth/month
- Unlimited deployments
- Serverless function execution
- Good for personal projects

### Pro Plan ($20/month)
- 1TB bandwidth
- Advanced analytics
- Password protection
- Team collaboration

### Enterprise
- Custom limits
- SLA guarantees
- Dedicated support
- Advanced security

## Backup Strategy

### Code Backup
- GitHub repository (primary)
- Local clones (secondary)

### Database Backup (if applicable)
- Automated Vercel database backups
- Manual exports periodically

## Security

### Best Practices
1. Keep dependencies updated
2. Enable security headers (already in vercel.json)
3. Use environment variables for secrets
4. Monitor security alerts
5. Regular security audits

### Content Security Policy (Optional)

Add to `next.config.ts`:

```typescript
{
  headers: [
    {
      source: '/:path*',
      headers: [
        {
          key: 'Content-Security-Policy',
          value: "default-src 'self'; script-src 'self' 'unsafe-eval'; style-src 'self' 'unsafe-inline';"
        }
      ]
    }
  ]
}
```

## Support

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [GitHub Issues](https://github.com/yourusername/mdtopdf/issues)

---

**Ready to deploy?**

```bash
vercel --prod
```

Your app will be live in seconds! 🚀

