/**
 * Authentication utilities for sentra-landing
 * Handles checking authentication state and user management
 */

export interface User {
  email: string;
  first_name: string;
  last_name: string;
  full_name: string;
  user_image?: string;
}

export interface AuthResponse {
  authenticated: boolean;
  user?: User;
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
        `${frappeUrl}/api/method/websitecms.api.user_auth.get_current_user`,
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
 * Logout the current user
 */
export async function logout(): Promise<boolean> {
  try {
    const frappeUrl = process.env.NEXT_PUBLIC_FRAPPE_URL || 'http://localhost:8000';
    const response = await fetch(
      `${frappeUrl}/api/method/websitecms.api.user_auth.logout`,
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
