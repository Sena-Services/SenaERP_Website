# API Configuration Guide

## Overview

The application now supports both **development** and **production** environments with **production as the default**.

## Configuration Files

### 1. `src/lib/config.ts`
Central configuration file that manages API endpoints and base URLs.

**Default Behavior**: Uses production URL (`https://senamarketing.senaerp.com`)

### 2. `.env.local` (Local Development)
For local development, the `.env.local` file enables development mode:

```env
NEXT_PUBLIC_IS_DEV=true
```

This file is **git-ignored** and should only exist on your local machine.

### 3. `.env.example` (Template)
Template file showing available environment variables. This file **is committed** to git.

## Environment URLs

| Environment | URL | When Used |
|------------|-----|-----------|
| **Production** (default) | `https://senamarketing.senaerp.com` | Always, unless dev mode is enabled |
| **Development** | `http://senatest2.localhost:8000` | Only when `NEXT_PUBLIC_IS_DEV=true` |

## Usage

### For Local Development

1. Create `.env.local` file in the project root:
   ```bash
   cp .env.example .env.local
   ```

2. Set development mode:
   ```env
   NEXT_PUBLIC_IS_DEV=true
   ```

3. Restart your Next.js dev server:
   ```bash
   npm run dev
   ```

The app will now use `http://senatest2.localhost:8000` for API calls.

### For Production/Deployment

**No configuration needed!** The app uses production URL by default.

Simply:
- Don't create a `.env.local` file, OR
- Set `NEXT_PUBLIC_IS_DEV=false` in your environment variables, OR
- Leave `NEXT_PUBLIC_IS_DEV` unset

## API Endpoints

All endpoints are centralized in `API_CONFIG.ENDPOINTS`:

```typescript
{
  GET_PUBLISHED_BLOGS: '/api/method/websitecms.api.website_blog.get_published_blogs',
  GET_BLOG_BY_ID: '/api/method/websitecms.api.website_blog.get_blog_by_id',
  GET_BLOG_COUNT: '/api/method/websitecms.api.website_blog.get_blog_count',
  SUBMIT_WAITLIST: '/api/method/websitecms.api.waitlist.submit_waitlist',
  GET_ACTIVE_OPENINGS: '/api/method/websitecms.api.opening.get_active_openings',
}
```

## Helper Functions

### `getApiUrl(endpoint: string)`
Combines base URL with endpoint path.

```typescript
import { getApiUrl, API_CONFIG } from '@/lib/config';

const url = getApiUrl(API_CONFIG.ENDPOINTS.GET_PUBLISHED_BLOGS);
// Dev: http://senatest2.localhost:8000/api/method/websitecms.api.website_blog.get_published_blogs
// Prod: https://senamarketing.senaerp.com/api/method/websitecms.api.website_blog.get_published_blogs
```

### `getFileUrl(filePath?: string | null)`
Converts Frappe file paths to full URLs.

```typescript
import { getFileUrl } from '@/lib/config';

const imageUrl = getFileUrl('/files/blog1.mp4');
// Dev: http://senatest2.localhost:8000/files/blog1.mp4
// Prod: https://senamarketing.senaerp.com/files/blog1.mp4
```

## Components Using This Config

- `src/components/BlogSection.tsx` - Blog posts display
- `src/components/EarlyAccessModal.tsx` - Waitlist form submission
- `src/components/CareersSection.tsx` - Job openings display

## Verifying Current Environment

You can check which environment is active:

```typescript
import { API_CONFIG } from '@/lib/config';

console.log('Current API Base URL:', API_CONFIG.BASE_URL);
console.log('Is Development Mode:', API_CONFIG.IS_DEV);
```

## Image Configuration

`next.config.ts` is configured to allow images from both environments:

```typescript
{
  protocol: 'https',
  hostname: 'senamarketing.senaerp.com',  // Production
},
{
  protocol: 'http',
  hostname: 'senatest2.localhost',        // Development
  port: '8000',
}
```

## Best Practices

1. ✅ **Never commit `.env.local`** - It's git-ignored for a reason
2. ✅ **Commit `.env.example`** - Keep it updated as a template
3. ✅ **Production is default** - No config needed for deployment
4. ✅ **Use environment variables** - Don't hardcode URLs in components
5. ✅ **Test in both environments** - Verify before deploying

## Troubleshooting

### APIs return 404 errors
- Check that `NEXT_PUBLIC_IS_DEV` is set correctly
- Verify the backend server is running (dev or prod)
- Clear Next.js cache: `rm -rf .next`

### Environment variable not working
- Environment variables must start with `NEXT_PUBLIC_` for client-side access
- Restart the dev server after changing `.env.local`
- Check for typos in variable names

### Images not loading
- Verify the hostname is in `next.config.ts` remote patterns
- Check that the file path is correct
- Ensure the backend server has the file
