/**
 * Centralized Frappe API Client
 * Handles CSRF tokens automatically for cross-origin requests
 */

interface TokenInfo {
  token: string;
  timestamp: number;
}

class FrappeAPIClient {
  private tokens = new Map<string, TokenInfo>();
  private readonly TOKEN_EXPIRY = 30 * 60 * 1000; // 30 minutes

  /**
   * Get CSRF token for a specific domain
   * Caches tokens per domain and refreshes when expired
   * Works for both guest and authenticated users
   */
  private async getCSRFToken(baseUrl: string): Promise<string> {
    const cached = this.tokens.get(baseUrl);
    const now = Date.now();

    // Return cached token if still valid
    if (cached && (now - cached.timestamp) < this.TOKEN_EXPIRY) {
      return cached.token;
    }

    // Fetch new token by loading the base page
    // This works for guest users as Frappe embeds the CSRF token in the HTML
    try {
      const response = await fetch(`${baseUrl}`, {
        method: 'GET',
        credentials: 'include', // Send cookies
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch page for CSRF token: ${response.status}`);
      }

      // Parse the HTML to extract the CSRF token
      const html = await response.text();
      const tokenMatch = html.match(/csrf_token\s*=\s*["']([^"']+)["']/);

      if (!tokenMatch || !tokenMatch[1]) {
        throw new Error('CSRF token not found in page HTML');
      }

      const token = tokenMatch[1];

      // Cache the token
      this.tokens.set(baseUrl, {
        token,
        timestamp: now
      });

      return token;
    } catch (error) {
      console.error('[FrappeAPIClient] Failed to get CSRF token:', error);
      throw error;
    }
  }

  /**
   * Make an API call with automatic CSRF token handling
   *
   * @param url - Full API URL
   * @param options - Fetch options (method, body, headers, etc.)
   * @returns Fetch response
   */
  async call(url: string, options: RequestInit = {}): Promise<Response> {
    const baseUrl = new URL(url).origin;

    try {
      // Get CSRF token for this domain
      const csrfToken = await this.getCSRFToken(baseUrl);

      // Make the request with CSRF token and credentials
      const response = await fetch(url, {
        ...options,
        credentials: 'include', // Always send cookies
        headers: {
          'Content-Type': 'application/json',
          'X-Frappe-CSRF-Token': csrfToken,
          ...options.headers, // Allow overriding headers
        },
      });

      // If unauthorized, token might be expired - clear cache and retry once
      if (response.status === 403 || response.status === 401) {
        console.warn('[FrappeAPIClient] Auth error, refreshing token...');
        this.tokens.delete(baseUrl);

        // Retry once with fresh token
        const newToken = await this.getCSRFToken(baseUrl);
        return fetch(url, {
          ...options,
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
            'X-Frappe-CSRF-Token': newToken,
            ...options.headers,
          },
        });
      }

      return response;
    } catch (error) {
      console.error('[FrappeAPIClient] Request failed:', error);
      throw error;
    }
  }

  /**
   * Clear cached tokens (useful for logout)
   */
  clearTokens(): void {
    this.tokens.clear();
  }

  /**
   * Clear token for specific domain
   */
  clearToken(baseUrl: string): void {
    this.tokens.delete(baseUrl);
  }
}

// Export singleton instance
export const frappeAPI = new FrappeAPIClient();
