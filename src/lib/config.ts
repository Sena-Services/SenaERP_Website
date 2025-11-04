/**
 * API Configuration
 * Centralized configuration for API endpoints and base URLs
 */

export const API_CONFIG = {
  BASE_URL: 'http://senatest2.localhost:8000',
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
