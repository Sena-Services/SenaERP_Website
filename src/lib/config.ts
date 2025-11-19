/**
 * API Configuration
 * Centralized configuration for API endpoints and base URLs
 *
 * Environment Setup:
 * Set NEXT_PUBLIC_API_BASE_URL in your .env.local file:
 * - Production: https://senamarketing.senaerp.com
 * - Local: http://sentrav0.1.localhost:8000
 */

// Get API base URL from environment variable or use production as fallback
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://senamarketing.senaerp.com';

export const API_CONFIG = {
  BASE_URL,
  IS_DEV: BASE_URL.includes('localhost'),
  ENDPOINTS: {
    GET_PUBLISHED_BLOGS: '/api/method/websitecms.api.website_blog.get_published_blogs',
    GET_BLOG_BY_ID: '/api/method/websitecms.api.website_blog.get_blog_by_id',
    GET_BLOG_COUNT: '/api/method/websitecms.api.website_blog.get_blog_count',
    SUBMIT_WAITLIST: '/api/method/websitecms.api.waitlist.submit_waitlist',
    GET_ACTIVE_OPENINGS: '/api/method/websitecms.api.opening.get_active_openings',
    GET_PUBLISHED_ENVIRONMENTS: '/api/method/websitecms.api.website_environment.get_published_environments',
    GET_ENVIRONMENT_BY_ID: '/api/method/websitecms.api.website_environment.get_environment_by_id',
    GET_ENVIRONMENT_COUNT: '/api/method/websitecms.api.website_environment.get_environment_count',
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

// Export the centralized API client
export { frappeAPI } from './frappe-api-client';
