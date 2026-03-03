import { NextRequest } from 'next/server';

const DEFAULT_FRAPPE_BASE_URL = 'https://senamarketing.senaerp.com';
const FRAPPE_BASE_URL = (
  process.env.FRAPPE_URL ||
  process.env.NEXT_PUBLIC_FRAPPE_URL ||
  DEFAULT_FRAPPE_BASE_URL
).replace(/\/$/, '');

export const dynamic = 'force-dynamic';

type RouteContext = {
  params: Promise<{ path: string[] }>;
};

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

  const targetUrl = buildTargetUrl(path, request.url);
  const method = request.method.toUpperCase();
  const upstream = await fetch(targetUrl, {
    method,
    headers: {
      'content-type': request.headers.get('content-type') || 'application/json',
    },
    body: method === 'GET' || method === 'HEAD' ? undefined : await request.arrayBuffer(),
    cache: 'no-store',
  });

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

export async function PUT(request: NextRequest, context: RouteContext): Promise<Response> {
  return proxyToFrappe(request, context);
}

export async function PATCH(request: NextRequest, context: RouteContext): Promise<Response> {
  return proxyToFrappe(request, context);
}

export async function DELETE(request: NextRequest, context: RouteContext): Promise<Response> {
  return proxyToFrappe(request, context);
}
