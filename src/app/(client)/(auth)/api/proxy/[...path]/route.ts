import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_URL!;

async function handler(req: NextRequest, props: { params: Promise<{ path: string[] }> }) {
  const params = await props.params;
  const url = `${BACKEND_URL}/${params.path.join('/')}`;

  const res = await fetch(url, {
    method: req.method,
    headers: {
      cookie: req.headers.get('cookie') || '',
      'content-type': 'application/json',
    },
    body: req.method === 'GET' ? undefined : await req.text(),
    credentials: 'include',
  });

  const data = await res.text();
  const response = new NextResponse(data, { status: res.status });

  const setCookie = res.headers.get('set-cookie');
  if (setCookie) response.headers.set('set-cookie', setCookie);

  return response;
}

export const GET = handler;
export const POST = handler;
export const PUT = handler;
export const DELETE = handler;
