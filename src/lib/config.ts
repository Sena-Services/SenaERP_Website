/**
 * API Configuration
 * Centralized configuration for API endpoints and base URLs
 *
 * Environment Setup:
 * - Production (default): https://senamarketing.senaerp.com/
 * - Development: Set isDev = true to use http://senatest2.localhost:8000
 */

// Toggle this to switch between dev and production
// Set to true for local development, false for production (default: false)
const isDev = process.env.NEXT_PUBLIC_IS_DEV === 'true' || false;

// Environment-specific URLs
const PRODUCTION_URL = 'https://senamarketing.senaerp.com';
const DEVELOPMENT_URL = 'http://senatest2.localhost:8000';

export const API_CONFIG = {
  // Use production URL by default
  BASE_URL: isDev ? DEVELOPMENT_URL : PRODUCTION_URL,
  IS_DEV: isDev,
  ENDPOINTS: {
    GET_PUBLISHED_BLOGS: '/api/method/websitecms.api.website_blog.get_published_blogs',
    GET_BLOG_BY_ID: '/api/method/websitecms.api.website_blog.get_blog_by_id',
    GET_BLOG_COUNT: '/api/method/websitecms.api.website_blog.get_blog_count',
    SUBMIT_WAITLIST: '/api/method/websitecms.api.waitlist.submit_waitlist',
    GET_ACTIVE_OPENINGS: '/api/method/websitecms.api.opening.get_active_openings',
  }
} as const;

/**
 * Get full API URL by combining base URL with endpoint
 */
export function getApiUrl(endpoint: string): string {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
}

/**
 * Get full file URL from Frappe file path
 * Handles both absolute URLs and relative Frappe file paths
 */
export function getFileUrl(filePath?: string | null): string | undefined {
  if (!filePath) return undefined;

  // If already a full URL, return as is
  if (filePath.startsWith('http://') || filePath.startsWith('https://')) {
    return filePath;
  }

  // Otherwise, prepend the base URL
  return `${API_CONFIG.BASE_URL}${filePath}`;
}
