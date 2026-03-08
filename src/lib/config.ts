/**
 * API Configuration
 * Centralized configuration for API endpoints and base URLs
 *
 * Environment Setup:
 * Set NEXT_PUBLIC_FRAPPE_URL in your .env.local file:
 * - Production: https://senamarketing.senaerp.com
 * - Local: http://localhost:8000
 */

// Get API base URL from environment variable or use production as fallback
const BASE_URL = process.env.NEXT_PUBLIC_FRAPPE_URL || 'https://senamarketing.senaerp.com';

export const API_CONFIG = {
  BASE_URL,
  IS_DEV: BASE_URL.includes('localhost'),
  ENDPOINTS: {
    GET_PUBLISHED_BLOGS: '/api/method/senaerp_platform.api.website_blog.get_published_blogs',
    GET_BLOG_BY_ID: '/api/method/senaerp_platform.api.website_blog.get_blog_by_id',
    GET_BLOG_COUNT: '/api/method/senaerp_platform.api.website_blog.get_blog_count',
    SUBMIT_WAITLIST: '/api/method/senaerp_platform.api.waitlist.submit_waitlist',
    GET_ACTIVE_OPENINGS: '/api/method/senaerp_platform.api.opening.get_active_openings',
    GET_PUBLISHED_ENVIRONMENTS: '/api/method/senaerp_platform.api.website_environment.get_published_environments',
    GET_ENVIRONMENT_BY_ID: '/api/method/senaerp_platform.api.website_environment.get_environment_by_id',
    GET_ENVIRONMENT_COUNT: '/api/method/senaerp_platform.api.website_environment.get_environment_count',
    GOOGLE_SSO_LOGIN: '/api/method/senaerp_platform.api.sso.google_login',
    VALIDATE_SSO_TOKEN: '/api/method/senaerp_platform.api.sso.validate_sso_token',
    LOGIN: '/api/method/senaerp_platform.api.user_auth.login',
    GET_PLATFORM_USER: '/api/method/senaerp_platform.api.user_auth.get_platform_user',
    GO_TO_SITE: '/api/method/senaerp_platform.api.user_auth.go_to_site',
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

// Centralized Frappe API Client - guest API calls without credentials
class FrappeAPIClient {
  async call(url: string, options: RequestInit = {}): Promise<Response> {
    try {
      return await fetch(url, {
        ...options,
        credentials: 'omit',
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      });
    } catch (error) {
      console.error('[FrappeAPIClient] Request failed:', error);
      throw error;
    }
  }
}

export const frappeAPI = new FrappeAPIClient();
