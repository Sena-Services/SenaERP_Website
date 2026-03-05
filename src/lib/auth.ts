/**
 * Authentication utilities for senaerp_website
 * Handles platform token auth (localStorage-based) and user management
 */

import { getApiUrl, API_CONFIG, frappeAPI } from './config';

const PLATFORM_TOKEN_KEY = 'sena_platform_token';

export interface User {
  email: string;
  first_name: string;
  last_name: string;
  full_name: string;
  user_image?: string;
}

export interface PlatformUser {
  email: string;
  full_name: string;
  company_name: string;
  site_url: string;
}

export interface AuthResponse {
  authenticated: boolean;
  user?: User;
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

/**
 * Check if the user is currently authenticated
 * Calls the Frappe backend to verify session
 */
export async function checkAuth(): Promise<AuthResponse> {
  try {
    const frappeUrl = process.env.NEXT_PUBLIC_FRAPPE_URL || 'http://localhost:8000';

    // Skip auth check if explicitly disabled via env variable
    if (process.env.NEXT_PUBLIC_SKIP_AUTH_CHECK === 'true') {
      return { authenticated: false };
    }

    // Temporarily suppress console errors for expected 403s and network errors
    const originalError = console.error;
    let response: Response;

    try {
      // Suppress console.error during fetch to hide browser's automatic 403 logging
      console.error = () => {};

      response = await fetch(
        `${frappeUrl}/api/method/senaerp_platform.api.user_auth.get_current_user`,
        {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    } finally {
      // Restore console.error
      console.error = originalError;
    }

    // 403 Forbidden is expected when user is not authenticated - handle silently
    if (!response.ok) {
      if (response.status === 403) {
        // User is not authenticated - this is normal, don't log as error
        return { authenticated: false };
      }
      // For other errors, log them
      console.warn(`[Auth] Auth check returned ${response.status}`);
      return { authenticated: false };
    }

    const data = await response.json();


    // Format 1: data.message.success with data.message.user (Frappe format)
    if (data.message?.success && data.message?.user) {
      return {
        authenticated: true,
        user: data.message.user,
      };
    }

    // Format 2: data.message.authenticated with data.message.user
    if (data.message?.authenticated && data.message?.user) {
      return {
        authenticated: true,
        user: data.message.user,
      };
    }

    // Format 3: data.message is the user object itself
    if (data.message && typeof data.message === 'object' && data.message.email) {
      return {
        authenticated: true,
        user: {
          email: data.message.email || data.message.user || '',
          first_name: data.message.first_name || '',
          last_name: data.message.last_name || '',
          full_name: data.message.full_name || data.message.name || '',
          user_image: data.message.user_image,
        },
      };
    }

    // Format 4: top-level authenticated field
    if (data.authenticated && data.user) {
      return {
        authenticated: true,
        user: data.user,
      };
    }

    return { authenticated: false };
  } catch (error) {
    console.error('[Auth] Auth check failed with error:', error);
    return { authenticated: false };
  }
}

/**
 * Logout the current user — clears both session and platform token
 */
export async function logout(): Promise<boolean> {
  clearPlatformToken();
  try {
    const frappeUrl = process.env.NEXT_PUBLIC_FRAPPE_URL || 'http://localhost:8000';
    const response = await fetch(
      `${frappeUrl}/api/method/senaerp_platform.api.user_auth.logout`,
      {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    return response.ok;
  } catch (error) {
    console.error('Logout failed:', error);
    return false;
  }
}

/**
 * Get user initials from name
 */
export function getUserInitials(user: User): string {
  const firstName = user.first_name || '';
  const lastName = user.last_name || '';

  if (firstName && lastName) {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  }

  if (firstName) {
    return firstName.substring(0, 2).toUpperCase();
  }

  if (user.email) {
    return user.email.substring(0, 2).toUpperCase();
  }

  return 'U';
}
