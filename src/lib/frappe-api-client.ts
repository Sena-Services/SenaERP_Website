/**
 * Centralized Frappe API Client
 * Makes guest API calls without credentials to avoid CSRF requirements.
 * All landing page endpoints use allow_guest=True so no session is needed.
 */

class FrappeAPIClient {
  /**
   * Make a guest API call (no cookies, no CSRF token needed)
   */
  async call(url: string, options: RequestInit = {}): Promise<Response> {
    try {
      const response = await fetch(url, {
        ...options,
        credentials: 'omit',
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      });

      return response;
    } catch (error) {
      console.error('[FrappeAPIClient] Request failed:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const frappeAPI = new FrappeAPIClient();
