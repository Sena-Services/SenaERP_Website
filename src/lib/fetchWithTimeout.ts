/**
 * Fetch wrapper with configurable timeout via AbortController.
 * Defaults to 15 seconds.
 */
export async function fetchWithTimeout(
  input: RequestInfo | URL,
  init?: RequestInit & { timeout?: number }
): Promise<Response> {
  const { timeout = 15000, ...options } = init || {};
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  try {
    const response = await fetch(input, { ...options, signal: controller.signal });
    return response;
  } finally {
    clearTimeout(id);
  }
}
