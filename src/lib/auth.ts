/**
 * Authentication utilities for senaerp_website
 * Handles platform token auth (localStorage-based) and user management
 */

/**
 * Validates that a redirect URL is a safe origin before navigating.
 * Accepts https:// on senaerp.com / *.senaerp.com, and localhost variants for dev.
 */
export function isSafeRedirectUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    if (parsed.protocol === 'https:') {
      return (
        parsed.hostname === 'senaerp.com' ||
        parsed.hostname.endsWith('.senaerp.com')
      );
    }
    // Allow localhost / *.localhost for local dev
    if (parsed.protocol === 'http:') {
      return (
        parsed.hostname === 'localhost' ||
        parsed.hostname.endsWith('.localhost')
      );
    }
    return false;
  } catch {
    return false;
  }
}

import { getApiUrl, API_CONFIG, frappeAPI } from './config';

const PLATFORM_TOKEN_KEY = 'sena_platform_token';

export interface PlatformUser {
  email: string;
  full_name: string;
  company_name: string;
  site_url: string;
}

export interface PlatformAuthState {
  authenticated: boolean;
  user: PlatformUser | null;
}

/** Store platform token in localStorage */
export function storePlatformToken(token: string): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(PLATFORM_TOKEN_KEY, token);
  }
}

/** Get platform token from localStorage */
export function getPlatformToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(PLATFORM_TOKEN_KEY);
}

/** Remove platform token from localStorage */
export function clearPlatformToken(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(PLATFORM_TOKEN_KEY);
  }
}

/** Verify platform token against the backend and return user info */
export async function verifyPlatformToken(): Promise<PlatformAuthState> {
  const token = getPlatformToken();
  if (!token) return { authenticated: false, user: null };

  try {
    const resp = await frappeAPI.call(getApiUrl(API_CONFIG.ENDPOINTS.GET_PLATFORM_USER), {
      method: 'POST',
      body: JSON.stringify({ platform_token: token }),
    });
    const data = await resp.json();
    const result = data.message;

    if (result?.success && result?.user) {
      return {
        authenticated: true,
        user: {
          email: result.user.email,
          full_name: result.user.full_name || '',
          company_name: result.user.company_name || '',
          site_url: result.user.site_url || '',
        },
      };
    }

    // Token invalid — clear it
    clearPlatformToken();
    return { authenticated: false, user: null };
  } catch {
    return { authenticated: false, user: null };
  }
}

/** Generate a login token for the user's tenant site (for "Go to Site") */
export async function goToSite(): Promise<{ site_url: string; token: string } | null> {
  const platformToken = getPlatformToken();
  if (!platformToken) return null;

  try {
    const resp = await frappeAPI.call(getApiUrl(API_CONFIG.ENDPOINTS.GO_TO_SITE), {
      method: 'POST',
      body: JSON.stringify({ platform_token: platformToken }),
    });
    const data = await resp.json();
    const result = data.message;

    if (result?.success && result?.site_url && result?.token) {
      return { site_url: result.site_url, token: result.token };
    }
    return null;
  } catch {
    return null;
  }
}
