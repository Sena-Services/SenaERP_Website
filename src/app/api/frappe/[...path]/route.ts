import { NextRequest } from 'next/server';

const FRAPPE_BASE_URL = (
  process.env.FRAPPE_URL ||
  process.env.NEXT_PUBLIC_FRAPPE_URL ||
  ''
).replace(/\/$/, '');

if (!FRAPPE_BASE_URL) {
  throw new Error(
    'Neither FRAPPE_URL nor NEXT_PUBLIC_FRAPPE_URL environment variable is set. ' +
    'Add one to your .env.local file (e.g., NEXT_PUBLIC_FRAPPE_URL=http://localhost:8000)'
  );
}

export const dynamic = 'force-dynamic';

type RouteContext = {
  params: Promise<{ path: string[] }>;
};

// Allowed API methods per endpoint. Endpoints not listed here are blocked.
const ALLOWED_ENDPOINTS: Record<string, ('GET' | 'POST')[]> = {
  'api/method/senaerp_platform.api.user_auth.login': ['POST'],
  'api/method/senaerp_platform.api.user_auth.register': ['POST'],
  'api/method/senaerp_platform.api.user_auth.get_platform_user': ['POST'],
  'api/method/senaerp_platform.api.user_auth.go_to_site': ['POST'],
  'api/method/senaerp_platform.api.sso.google_login': ['GET', 'POST'],
  'api/method/senaerp_platform.api.sso.validate_sso_token': ['POST'],
  'api/method/senaerp_platform.api.invites.validate_invite': ['POST'],
  'api/method/senaerp_platform.api.invites.accept_invite': ['POST'],
  'api/method/senaerp_platform.api.invites.signup_for_invite': ['POST'],
  'api/method/senaerp_platform.api.waitlist.submit_waitlist': ['POST'],
  'api/method/senaerp_platform.api.waitlist.verify_email': ['POST'],
  'api/method/senaerp_platform.api.waitlist.resend_verification': ['POST'],
  'api/method/senaerp_platform.api.website_blog.get_published_blogs': ['GET', 'POST'],
  'api/method/senaerp_platform.api.website_blog.get_blog_by_id': ['GET', 'POST'],
};

// Simple in-memory rate limiter: 60 requests per minute per IP
const RATE_LIMIT = 60;
const RATE_WINDOW_MS = 60_000;
const rateBuckets = new Map<string, { count: number; resetAt: number }>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const bucket = rateBuckets.get(ip);

  if (!bucket || now >= bucket.resetAt) {
    rateBuckets.set(ip, { count: 1, resetAt: now + RATE_WINDOW_MS });
    return false;
  }

  bucket.count++;
  return bucket.count > RATE_LIMIT;
}

// Periodically clean up expired buckets to avoid memory leaks
setInterval(() => {
  const now = Date.now();
  for (const [ip, bucket] of rateBuckets) {
    if (now >= bucket.resetAt) rateBuckets.delete(ip);
  }
}, RATE_WINDOW_MS);

function getClientIp(request: NextRequest): string {
  return (
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') ||
    'unknown'
  );
}

function buildTargetUrl(pathSegments: string[], requestUrl: string): string {
  const request = new URL(requestUrl);
  const path = pathSegments.join('/');
  const query = request.search;
  return `${FRAPPE_BASE_URL}/${path}${query}`;
}

async function proxyToFrappe(request: NextRequest, context: RouteContext): Promise<Response> {
  const { path } = await context.params;

  if (!path?.length) {
    return Response.json({ message: 'Missing Frappe path' }, { status: 400 });
  }

  // Rate limiting
  const clientIp = getClientIp(request);
  if (isRateLimited(clientIp)) {
    return Response.json({ message: 'Too many requests' }, { status: 429 });
  }

  // Path allowlist check
  const requestedPath = path.join('/');
  const allowedMethods = ALLOWED_ENDPOINTS[requestedPath];
  if (!allowedMethods) {
    return Response.json({ message: 'Forbidden' }, { status: 403 });
  }

  // Method check
  const method = request.method.toUpperCase() as 'GET' | 'POST';
  if (!allowedMethods.includes(method)) {
    return Response.json({ message: 'Method not allowed' }, { status: 405 });
  }

  const targetUrl = buildTargetUrl(path, request.url);
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 30000);
  let upstream: globalThis.Response;
  try {
    upstream = await fetch(targetUrl, {
      method,
      headers: {
        'content-type': request.headers.get('content-type') || 'application/json',
      },
      body: method === 'GET' ? undefined : await request.arrayBuffer(),
      cache: 'no-store',
      signal: controller.signal,
    });
  } catch (err) {
    clearTimeout(timeoutId);
    if (err instanceof DOMException && err.name === 'AbortError') {
      return Response.json({ message: 'Upstream request timed out' }, { status: 504 });
    }
    throw err;
  }
  clearTimeout(timeoutId);

  return new Response(await upstream.arrayBuffer(), {
    status: upstream.status,
    headers: {
      'content-type': upstream.headers.get('content-type') || 'application/json',
    },
  });
}

export async function GET(request: NextRequest, context: RouteContext): Promise<Response> {
  return proxyToFrappe(request, context);
}

export async function POST(request: NextRequest, context: RouteContext): Promise<Response> {
  return proxyToFrappe(request, context);
}
