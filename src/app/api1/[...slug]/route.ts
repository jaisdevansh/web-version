import { NextRequest } from 'next/server';

async function handler(req: NextRequest) {
  // Extract the original path minus /api1
  const path = req.nextUrl.pathname.replace(/^\/api1/, '');
  const search = req.nextUrl.search;
  
  // Use local backend so we can test new endpoints like AI Chat
  const targetUrl = `http://localhost:3001/api/v1${path}${search}`;

  const headers = new Headers(req.headers);
  // Remove headers that often cause WAF/CORS blocks on proxies
  headers.delete('host');
  headers.delete('origin');
  headers.delete('referer');
  
  const init: RequestInit = {
    method: req.method,
    headers,
    redirect: 'manual',
    cache: 'no-store',
  };

  if (req.method !== 'GET' && req.method !== 'HEAD') {
    init.body = await req.arrayBuffer();
  }

  try {
    const response = await fetch(targetUrl, init);
    const resHeaders = new Headers(response.headers);
    
    // Next.js fetch automatically decompresses the body, so we must remove these headers
    resHeaders.delete('content-encoding');
    resHeaders.delete('content-length');
    
    // Inject CORS headers so localhost:3000 doesn't get blocked
    resHeaders.set('Access-Control-Allow-Origin', '*');
    resHeaders.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
    resHeaders.set('Access-Control-Allow-Headers', '*');
    
    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: resHeaders,
    });
  } catch (err: any) {
    console.error('Proxy error:', err);
    return new Response(JSON.stringify({ error: 'Proxy failed', details: err.message }), { 
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  }
}

export { 
  handler as GET, 
  handler as POST, 
  handler as PUT, 
  handler as DELETE, 
  handler as PATCH, 
  handler as OPTIONS 
};
