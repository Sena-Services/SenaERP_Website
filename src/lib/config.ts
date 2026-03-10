/**
 * API Configuration
 * Centralized configuration for API endpoints and base URLs
 *
 * Environment Setup:
 * Set NEXT_PUBLIC_FRAPPE_URL in your .env.local file:
 * - Production: https://senamarketing.senaerp.com
 * - Local: http://localhost:8000
 */

// Get API base URL from environment variable — must be set in .env.local
const BASE_URL = process.env.NEXT_PUBLIC_FRAPPE_URL;

if (!BASE_URL) {
  throw new Error(
    'NEXT_PUBLIC_FRAPPE_URL environment variable is not set. ' +
    'Add it to your .env.local file (e.g., NEXT_PUBLIC_FRAPPE_URL=http://localhost:8000)'
  );
}

export const API_CONFIG = {
  BASE_URL,
  ENDPOINTS: {
    GET_PUBLISHED_BLOGS: '/api/method/senaerp_platform.api.website_blog.get_published_blogs',
    GET_BLOG_BY_ID: '/api/method/senaerp_platform.api.website_blog.get_blog_by_id',
    SUBMIT_WAITLIST: '/api/method/senaerp_platform.api.waitlist.submit_waitlist',
    GOOGLE_SSO_LOGIN: '/api/method/senaerp_platform.api.sso.google_login',
    VALIDATE_SSO_TOKEN: '/api/method/senaerp_platform.api.sso.validate_sso_token',
    LOGIN: '/api/method/senaerp_platform.api.user_auth.login',
    GET_PLATFORM_USER: '/api/method/senaerp_platform.api.user_auth.get_platform_user',
    GO_TO_SITE: '/api/method/senaerp_platform.api.user_auth.go_to_site',
    REGISTER: '/api/method/senaerp_platform.api.user_auth.register',
    VALIDATE_INVITE: '/api/method/senaerp_platform.api.invites.validate_invite',
    ACCEPT_INVITE: '/api/method/senaerp_platform.api.invites.accept_invite',
    SIGNUP_FOR_INVITE: '/api/method/senaerp_platform.api.invites.signup_for_invite',
    VERIFY_EMAIL: '/api/method/senaerp_platform.api.waitlist.verify_email',
    RESEND_VERIFICATION: '/api/method/senaerp_platform.api.waitlist.resend_verification',
    GET_ACTIVE_OPENINGS: '/api/method/senaerp_platform.api.careers.get_active_openings',
    // Billing
    GET_BILLING_OVERVIEW: '/api/method/senaerp_platform.api.billing.get_billing_overview',
    GET_CREDIT_STATUS: '/api/method/senaerp_platform.api.billing.get_credit_status',
    REFRESH_CREDIT_STATUS: '/api/method/senaerp_platform.api.billing.refresh_credit_status',
    GET_CREDIT_HISTORY: '/api/method/senaerp_platform.api.billing.get_credit_history',
  }
} as const;

/**
 * Get full API URL by combining base URL with endpoint
 */
export function getApiUrl(endpoint: string): string {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
}

// Centralized Frappe API Client - guest API calls without credentials
import { fetchWithTimeout } from './fetchWithTimeout';

class FrappeAPIClient {
  async call(url: string, options: RequestInit & { timeout?: number } = {}): Promise<Response> {
    const { timeout, ...rest } = options;
    const resp = await fetchWithTimeout(url, {
      ...rest,
      credentials: 'omit',
      headers: {
        'Content-Type': 'application/json',
        ...rest.headers,
      },
      timeout,
    });
    if (!resp.ok) {
      throw new Error(`API request failed: ${resp.status} ${resp.statusText}`);
    }
    return resp;
  }
}

export const frappeAPI = new FrappeAPIClient();
